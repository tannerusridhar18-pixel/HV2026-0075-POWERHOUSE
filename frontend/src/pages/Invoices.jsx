import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  FileText,
  Printer,
  Eye,
} from "lucide-react";
import Modal from "../components/Modal";
import { customerAPI, invoiceAPI, orderAPI } from "../services/api";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.response?.data ||
    fallback
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function printInvoice(invoice) {
  if (!invoice) {
    return;
  }

  const customer = invoice.customer || {};
  const order = invoice.order || {};
  const items = Array.isArray(order.items) ? order.items : [];

  const rows = items.length
    ? items
        .map(
          (item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${escapeHtml(item.product?.name || "Product")}</td>
              <td>${Number(item.quantity || 0)}</td>
              <td>${formatCurrency(item.unitPrice)}</td>
              <td>${formatCurrency(item.lineTotal)}</td>
            </tr>
          `
        )
        .join("")
    : `
        <tr>
          <td colspan="5">No order items</td>
        </tr>
      `;

  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=700"
  );

  if (!printWindow) {
    alert("Please allow pop-ups to print the invoice.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${escapeHtml(
          invoice.invoiceNumber || "Invoice"
        )}</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 40px;
            color: #222;
            background: white;
          }

          .invoice {
            max-width: 800px;
            margin: 0 auto;
          }

          .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #222;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }

          .title {
            font-size: 30px;
            font-weight: bold;
          }

          .invoice-number {
            font-size: 18px;
            font-weight: bold;
          }

          .details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }

          .section-title {
            font-weight: bold;
            margin-bottom: 8px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th,
          td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
          }

          th {
            background: #f5f5f5;
          }

          .summary {
            margin-top: 25px;
            margin-left: auto;
            width: 300px;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 7px 0;
          }

          .grand-total {
            border-top: 2px solid #222;
            font-size: 18px;
            font-weight: bold;
            padding-top: 12px;
          }

          .footer {
            margin-top: 60px;
            text-align: center;
            color: #666;
          }

          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>

      <body>
        <div class="invoice">
          <div class="header">
            <div class="title">INVOICE</div>

            <div>
              <div class="invoice-number">
                ${escapeHtml(invoice.invoiceNumber || "—")}
              </div>

              <div>
                Date:
                ${escapeHtml(invoice.invoiceDate || "—")}
              </div>
            </div>
          </div>

          <div class="details">
            <div>
              <div class="section-title">Bill To</div>

              <div>${escapeHtml(customer.name || "—")}</div>
              <div>${escapeHtml(customer.phone || "")}</div>
              <div>${escapeHtml(customer.email || "")}</div>
              <div>${escapeHtml(customer.gstin || "")}</div>
            </div>

            <div>
              <div class="section-title">Order</div>
              <div>${escapeHtml(order.orderNumber || "Manual Invoice")}</div>
              <div>Status: ${escapeHtml(invoice.status || "—")}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              ${rows}
            </tbody>
          </table>

          <div class="summary">
            ${
              order.subtotal != null
                ? `
                  <div class="summary-row">
                    <span>Subtotal</span>
                    <strong>${formatCurrency(order.subtotal)}</strong>
                  </div>

                  <div class="summary-row">
                    <span>Tax</span>
                    <strong>${formatCurrency(order.tax)}</strong>
                  </div>
                `
                : ""
            }

            <div class="summary-row grand-total">
              <span>Total</span>
              <strong>${formatCurrency(invoice.amount)}</strong>
            </div>
          </div>

          <div class="footer">
            Thank you for your business.
          </div>
        </div>

        <script>
          window.onload = function () {
            window.print();
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [show, setShow] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    customerId: "",
    orderId: "",
    amount: "",
    status: "GENERATED",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [invoiceResponse, customerResponse, orderResponse] =
        await Promise.all([
          invoiceAPI.getAll(),
          customerAPI.getAll(),
          orderAPI.getAll(),
        ]);

      setInvoices(
        Array.isArray(invoiceResponse.data)
          ? invoiceResponse.data
          : []
      );

      setCustomers(
        Array.isArray(customerResponse.data)
          ? customerResponse.data
          : []
      );

      setOrders(
        Array.isArray(orderResponse.data)
          ? orderResponse.data
          : []
      );
    } catch (error) {
      setError(getErrorMessage(error, "Unable to load invoices."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({
      customerId: "",
      orderId: "",
      amount: "",
      status: "GENERATED",
    });
  };

  const closeCreateModal = () => {
    if (creating) return;

    resetForm();
    setShow(false);
  };

  const selectedOrder = useMemo(
    () =>
      orders.find(
        (order) => Number(order.id) === Number(form.orderId)
      ),
    [orders, form.orderId]
  );

  const availableOrders = useMemo(() => {
    return orders.filter((order) => {
      const alreadyInvoiced = invoices.some(
        (invoice) =>
          invoice.order?.id &&
          Number(invoice.order.id) === Number(order.id)
      );

      return !alreadyInvoiced;
    });
  }, [orders, invoices]);

  const createInvoice = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.customerId) {
      setError("Please select a customer.");
      return;
    }

    if (form.orderId && selectedOrder) {
      if (
        Number(selectedOrder.customer?.id) !==
        Number(form.customerId)
      ) {
        setError(
          "The selected customer does not belong to the selected order."
        );
        return;
      }
    }

    if (!form.orderId) {
      if (!form.amount || Number(form.amount) <= 0) {
        setError("Please enter a valid invoice amount.");
        return;
      }
    }

    setCreating(true);

    try {
      const payload = {
        customerId: Number(form.customerId),
        orderId: form.orderId ? Number(form.orderId) : null,
        amount: form.orderId ? null : Number(form.amount),
        status: form.status,
      };

      await invoiceAPI.create(payload);

      setSuccess("Invoice created successfully.");

      closeCreateModal();

      await loadData();
    } catch (error) {
      setError(getErrorMessage(error, "Unable to create invoice."));
    } finally {
      setCreating(false);
    }
  };

  const viewInvoice = async (invoice) => {
    setError("");
    setLoadingInvoice(true);

    try {
      const response = await invoiceAPI.getById(invoice.id);
      setSelectedInvoice(response.data);
    } catch (error) {
      setError(getErrorMessage(error, "Unable to load invoice."));
    } finally {
      setLoadingInvoice(false);
    }
  };

  const filteredInvoices = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return invoices;
    }

    return invoices.filter((invoice) => {
      const invoiceNumber = String(
        invoice.invoiceNumber || ""
      ).toLowerCase();

      const customerName = String(
        invoice.customer?.name || ""
      ).toLowerCase();

      return (
        invoiceNumber.includes(searchValue) ||
        customerName.includes(searchValue)
      );
    });
  }, [invoices, search]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Invoices</h1>
          <p>Generate and manage business invoices</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            setError("");
            setSuccess("");
            resetForm();
            setShow(true);
          }}
        >
          <Plus size={16} />
          Create Invoice
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {success && <div className="success-message">{success}</div>}

      <div className="module-card">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={17} />

            <input
              placeholder="Search invoices..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="record-count">
            {filteredInvoices.length} Invoices
          </div>

          <button
            className="icon-btn"
            onClick={loadData}
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw
              size={17}
              className={loading ? "spin" : ""}
            />
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Order</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <strong>
                      {invoice.invoiceNumber || `#${invoice.id}`}
                    </strong>
                  </td>

                  <td>{invoice.customer?.name || "—"}</td>

                  <td>{invoice.order?.orderNumber || "Manual"}</td>

                  <td>{invoice.invoiceDate || "—"}</td>

                  <td>{formatCurrency(invoice.amount)}</td>

                  <td>
                    <span
                      className={`status ${
                        String(invoice.status || "").toLowerCase()
                      }`}
                    >
                      {invoice.status || "GENERATED"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="icon-btn"
                      title="View invoice"
                      onClick={() => viewInvoice(invoice)}
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      className="icon-btn"
                      title="Print / Save PDF"
                      onClick={async () => {
                        try {
                          const response =
                            await invoiceAPI.getById(invoice.id);

                          printInvoice(response.data);
                        } catch (error) {
                          setError(
                            getErrorMessage(
                              error,
                              "Unable to generate invoice."
                            )
                          );
                        }
                      }}
                    >
                      <Printer size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && !filteredInvoices.length && (
          <div className="empty-state">
            <FileText size={35} />
            <h3>No invoices found</h3>
            <p>Create your first invoice.</p>
          </div>
        )}
      </div>

      {show && (
        <Modal
          title="Create Invoice"
          onClose={closeCreateModal}
        >
          <form onSubmit={createInvoice}>
            <div className="form-group">
              <label>Customer *</label>

              <select
                required
                value={form.customerId}
                onChange={(event) =>
                  setForm({
                    ...form,
                    customerId: event.target.value,
                    orderId: "",
                    amount: "",
                  })
                }
              >
                <option value="">Select customer</option>

                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Order</label>

              <select
                value={form.orderId}
                onChange={(event) =>
                  setForm({
                    ...form,
                    orderId: event.target.value,
                    amount: "",
                  })
                }
              >
                <option value="">Manual Invoice</option>

                {availableOrders
                  .filter(
                    (order) =>
                      !form.customerId ||
                      Number(order.customer?.id) ===
                        Number(form.customerId)
                  )
                  .map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.orderNumber} —{" "}
                      {formatCurrency(order.total)}
                    </option>
                  ))}
              </select>
            </div>

            {form.orderId && selectedOrder ? (
              <div className="form-group">
                <label>Order Amount</label>

                <input
                  type="text"
                  value={formatCurrency(selectedOrder.total)}
                  readOnly
                />
              </div>
            ) : (
              <div className="form-group">
                <label>Amount *</label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={form.amount}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      amount: event.target.value,
                    })
                  }
                />
              </div>
            )}

            <div className="form-group">
              <label>Status</label>

              <select
                value={form.status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.value,
                  })
                }
              >
                <option value="GENERATED">GENERATED</option>
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={closeCreateModal}
                disabled={creating}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Invoice"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {selectedInvoice && (
        <Modal
          title={
            selectedInvoice.invoiceNumber || "Invoice Details"
          }
          onClose={() => setSelectedInvoice(null)}
        >
          <div className="invoice-preview">
            <div>
              <strong>Customer</strong>
              <p>
                {selectedInvoice.customer?.name || "—"}
              </p>
            </div>

            <div>
              <strong>Invoice Date</strong>
              <p>{selectedInvoice.invoiceDate || "—"}</p>
            </div>

            <div>
              <strong>Order</strong>
              <p>
                {selectedInvoice.order?.orderNumber || "Manual Invoice"}
              </p>
            </div>

            <div>
              <strong>Status</strong>
              <p>{selectedInvoice.status || "—"}</p>
            </div>

            <div>
              <strong>Amount</strong>
              <p>{formatCurrency(selectedInvoice.amount)}</p>
            </div>

            <button
              className="primary-btn"
              onClick={() => printInvoice(selectedInvoice)}
            >
              <Printer size={16} />
              Print / Save PDF
            </button>
          </div>
        </Modal>
      )}

      {loadingInvoice && (
        <div className="loading-message">
          Loading invoice...
        </div>
      )}
    </div>
  );
}