import { useEffect, useState } from "react";
import { Search, Plus, MoreVertical, Users } from "lucide-react";
import Modal from "../components/Modal";
import { customerAPI } from "../services/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showActions, setShowActions] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [error, setError] = useState("");

  const emptyForm = {
    name: "",
    phone: "",
    email: "",
    gstin: "",
  };

  const [form, setForm] = useState(emptyForm);

  // Load customers
  const load = async () => {
    try {
      setError("");

      const { data } = await customerAPI.getAll();

      setCustomers(data);
    } catch (e) {
      console.error("Unable to load customers:", e);

      setError(
        e.response?.data?.error ||
          "Unable to load customers."
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Add customer
  const addCustomer = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await customerAPI.create(form);

      setForm(emptyForm);
      setShowModal(false);

      await load();
    } catch (e) {
      console.error("Unable to save customer:", e);

      setError(
        e.response?.data?.error ||
          "Unable to save customer."
      );
    }
  };

  // Delete customer
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await customerAPI.delete(id);

      setCustomers((prevCustomers) =>
        prevCustomers.filter(
          (customer) => customer.id !== id
        )
      );

      setShowActions(null);
    } catch (e) {
      console.error("Failed to delete customer:", e);

      setError(
        e.response?.data?.error ||
          "Failed to delete customer."
      );
    }
  };

  // Open edit modal
  const openEditModal = (customer) => {
    setSelectedCustomer(customer);

    setForm({
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      gstin: customer.gstin || "",
    });

    setShowActions(null);
    setShowEditModal(true);
    setError("");
  };

  // Update customer
  const updateCustomer = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedCustomer) {
      return;
    }

    try {
      const { data } = await customerAPI.update(
        selectedCustomer.id,
        form
      );

      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === selectedCustomer.id
            ? data
            : customer
        )
      );

      setForm(emptyForm);
      setSelectedCustomer(null);
      setShowEditModal(false);
    } catch (e) {
      console.error("Unable to update customer:", e);

      setError(
        e.response?.data?.error ||
          "Unable to update customer."
      );
    }
  };

  const closeAddModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setError("");
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedCustomer(null);
    setForm(emptyForm);
    setError("");
  };

  // Search
  const filtered = customers.filter(
    (customer) =>
      (customer.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (customer.phone || "").includes(search)
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>
            Manage your customers and business relationships
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            setForm(emptyForm);
            setShowModal(true);
            setError("");
          }}
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Customers Card */}
      <div className="module-card">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={17} />

            <input
              placeholder="Search customers..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="record-count">
            {filtered.length} Customers
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Email</th>
                <th>GSTIN</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="table-person">
                      <div className="customer-avatar">
                        {(customer.name || "?").charAt(0)}
                      </div>

                      <strong>
                        {customer.name}
                      </strong>
                    </div>
                  </td>

                  <td>{customer.phone}</td>

                  <td>
                    {customer.email || "—"}
                  </td>

                  <td>
                    <span className="gst-badge">
                      {customer.gstin || "—"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div
                      className="actions-wrapper"
                      style={{
                        position: "relative",
                      }}
                    >
                      <button
                        className="icon-btn"
                        onClick={() =>
                          setShowActions(
                            showActions === customer.id
                              ? null
                              : customer.id
                          )
                        }
                      >
                        <MoreVertical size={17} />
                      </button>

                      {showActions === customer.id && (
                        <div
                          className="actions-menu"
                          style={{
                            position: "absolute",
                            right: 0,
                            top: "100%",
                            zIndex: 20,
                            background: "white",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "6px",
                            minWidth: "110px",
                            boxShadow:
                              "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(customer)
                            }
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "8px 10px",
                              border: "none",
                              background: "transparent",
                              textAlign: "left",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(customer.id)
                            }
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "8px 10px",
                              border: "none",
                              background: "transparent",
                              textAlign: "left",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!filtered.length && (
          <div className="empty-state">
            <Users size={35} />

            <h3>No customers found</h3>

            <p>
              Add your first customer.
            </p>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <Modal
          title="Add New Customer"
          onClose={closeAddModal}
        >
          <form onSubmit={addCustomer}>
            <div className="form-group">
              <label>Customer Name *</label>

              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone *</label>

                <input
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>GSTIN</label>

              <input
                value={form.gstin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gstin: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={closeAddModal}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
              >
                Save Customer
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <Modal
          title="Edit Customer"
          onClose={closeEditModal}
        >
          <form onSubmit={updateCustomer}>
            <div className="form-group">
              <label>Customer Name *</label>

              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone *</label>

                <input
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>GSTIN</label>

              <input
                value={form.gstin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gstin: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={closeEditModal}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
              >
                Update Customer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}