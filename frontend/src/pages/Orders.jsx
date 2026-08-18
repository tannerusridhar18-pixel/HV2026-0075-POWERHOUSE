import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, ShoppingCart, Search, RefreshCw } from "lucide-react";
import { customerAPI, productAPI, orderAPI } from "../services/api";

const TAX_RATE = 0.18;

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

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [showBuilder, setShowBuilder] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [ordersResponse, customersResponse, productsResponse] =
        await Promise.all([
          orderAPI.getAll(),
          customerAPI.getAll(),
          productAPI.getAll(),
        ]);

      setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
      setCustomers(
        Array.isArray(customersResponse.data) ? customersResponse.data : []
      );
      setProducts(
        Array.isArray(productsResponse.data) ? productsResponse.data : []
      );
    } catch (error) {
      setError(getErrorMessage(error, "Unable to load orders."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity),
        0
      ),
    [items]
  );

  const tax = useMemo(
    () => Number((subtotal * TAX_RATE).toFixed(2)),
    [subtotal]
  );

  const total = useMemo(
    () => Number((subtotal + tax).toFixed(2)),
    [subtotal, tax]
  );

  const resetBuilder = () => {
    setCustomerId("");
    setSelectedProduct("");
    setQuantity(1);
    setItems([]);
    setError("");
    setSuccess("");
  };

  const closeBuilder = () => {
    if (creating) return;

    resetBuilder();
    setShowBuilder(false);
  };

  const addItem = () => {
    setError("");
    setSuccess("");

    const product = products.find(
      (item) => Number(item.id) === Number(selectedProduct)
    );

    const requestedQuantity = Number(quantity);

    if (!product) {
      setError("Please select a product.");
      return;
    }

    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    const existingItem = items.find(
      (item) => Number(item.id) === Number(product.id)
    );

    const existingQuantity = existingItem
      ? Number(existingItem.quantity)
      : 0;

    const newQuantity = existingQuantity + requestedQuantity;

    if (newQuantity > Number(product.stock || 0)) {
      setError(
        `Only ${product.stock} units of ${product.name} are available.`
      );
      return;
    }

    if (existingItem) {
      setItems(
        items.map((item) =>
          Number(item.id) === Number(product.id)
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          ...product,
          quantity: requestedQuantity,
        },
      ]);
    }

    setSelectedProduct("");
    setQuantity(1);
  };

  const removeItem = (productId) => {
    setItems(
      items.filter((item) => Number(item.id) !== Number(productId))
    );
  };

  const createOrder = async () => {
    setError("");
    setSuccess("");

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }

    if (!items.length) {
      setError("Please add at least one product.");
      return;
    }

    for (const item of items) {
      const currentProduct = products.find(
        (product) => Number(product.id) === Number(item.id)
      );

      if (!currentProduct) {
        setError(`Product "${item.name}" is no longer available.`);
        return;
      }

      if (Number(item.quantity) > Number(currentProduct.stock || 0)) {
        setError(
          `Insufficient stock for ${item.name}. Available stock: ${currentProduct.stock}.`
        );
        return;
      }
    }

    setCreating(true);

    try {
      await orderAPI.create({
        customerId: Number(customerId),
        items: items.map((item) => ({
          productId: Number(item.id),
          quantity: Number(item.quantity),
        })),
      });

      setSuccess("Order created successfully.");

      resetBuilder();
      setShowBuilder(false);

      await loadData();
    } catch (error) {
      setError(getErrorMessage(error, "Unable to create order."));
    } finally {
      setCreating(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return orders;
    }

    return orders.filter((order) => {
      const orderNumber = String(order.orderNumber || "").toLowerCase();
      const customerName = String(
        order.customer?.name || ""
      ).toLowerCase();

      return (
        orderNumber.includes(searchValue) ||
        customerName.includes(searchValue)
      );
    });
  }, [orders, search]);

  const selectedProductData = products.find(
    (product) => Number(product.id) === Number(selectedProduct)
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Create and manage customer orders</p>
        </div>

        {!showBuilder && (
          <button
            className="primary-btn"
            onClick={() => {
              setError("");
              setSuccess("");
              setShowBuilder(true);
            }}
          >
            <Plus size={16} />
            Create Order
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {success && <div className="success-message">{success}</div>}

      {!showBuilder ? (
        <div className="module-card">
          <div className="table-toolbar">
            <div className="table-search">
              <Search size={17} />

              <input
                placeholder="Search orders..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="record-count">
              {filteredOrders.length} Orders
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
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.orderNumber || `#${order.id}`}</strong>
                    </td>

                    <td>{order.customer?.name || "—"}</td>

                    <td>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString(
                            "en-IN"
                          )
                        : "—"}
                    </td>

                    <td>{order.items?.length || 0}</td>

                    <td>{formatCurrency(order.total)}</td>

                    <td>
                      <span
                        className={`status ${
                          String(order.status || "").toLowerCase()
                        }`}
                      >
                        {order.status || "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && !filteredOrders.length && (
            <div className="empty-state">
              <ShoppingCart size={35} />
              <h3>No orders found</h3>
              <p>Create your first customer order.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="order-builder">
          <div className="builder-header">
            <div>
              <h2>Create New Order</h2>
              <p>
                Select a customer, add products and create the order.
              </p>
            </div>

            <button
              className="secondary-btn"
              onClick={closeBuilder}
              disabled={creating}
            >
              Cancel
            </button>
          </div>

          <div className="form-group">
            <label>Customer *</label>

            <select
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
            >
              <option value="">Select customer</option>

              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="add-item-row">
            <div className="form-group">
              <label>Product *</label>

              <select
                value={selectedProduct}
                onChange={(event) =>
                  setSelectedProduct(event.target.value)
                }
              >
                <option value="">Select product</option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                    disabled={Number(product.stock || 0) <= 0}
                  >
                    {product.name} — {formatCurrency(product.price)} — Stock:{" "}
                    {product.stock}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group quantity-input">
              <label>Quantity *</label>

              <input
                type="number"
                min="1"
                max={selectedProductData?.stock || undefined}
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </div>

            <button
              className="add-item-btn"
              type="button"
              onClick={addItem}
            >
              <Plus size={17} />
              Add
            </button>
          </div>

          <div className="order-items">
            {!items.length ? (
              <div className="empty-order">
                <ShoppingCart size={32} />
                <p>No products added to this order.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>

                      <td>{item.quantity}</td>

                      <td>{formatCurrency(item.price)}</td>

                      <td>
                        {formatCurrency(
                          Number(item.price) * Number(item.quantity)
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bill-summary">
            <div>
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>

            <div>
              <span>Tax (18%)</span>
              <strong>{formatCurrency(tax)}</strong>
            </div>

            <div className="bill-total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>

          <button
            className="primary-btn"
            onClick={createOrder}
            disabled={creating}
          >
            {creating ? "Creating Order..." : "Create Order"}
          </button>
        </div>
      )}
    </div>
  );
}