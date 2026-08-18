import { useState } from "react";
import {
  Plus,
  Trash2,
  ShoppingCart,
  Search
} from "lucide-react";

const customers = [
  "ABC Traders",
  "Metro Supplies",
  "Sri Manufacturing"
];

const products = [
  {
    id: 1,
    name: "Steel Component A",
    price: 250
  },
  {
    id: 2,
    name: "Steel Component B",
    price: 150
  },
  {
    id: 3,
    name: "Industrial Fastener",
    price: 75
  }
];

export default function Orders() {

  const [orders, setOrders] = useState([
    {
      id: "ORD-10023",
      customer: "ABC Traders",
      date: "18 Aug 2026",
      amount: 38350,
      status: "Confirmed"
    },
    {
      id: "ORD-10022",
      customer: "Metro Supplies",
      date: "17 Aug 2026",
      amount: 21500,
      status: "Pending"
    }
  ]);

  const [showCreate, setShowCreate] =
    useState(false);

  const [customer, setCustomer] =
    useState("");

  const [items, setItems] = useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const addItem = () => {

    if (!selectedProduct) return;

    const product = products.find(
      (p) => p.id === Number(selectedProduct)
    );

    if (!product) return;

    setItems([
      ...items,
      {
        ...product,
        quantity: Number(quantity),
        total:
          product.price * Number(quantity)
      }
    ]);

    setSelectedProduct("");
    setQuantity(1);
  };

  const removeItem = (index) => {

    setItems(
      items.filter((_, i) => i !== index)
    );
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const tax = subtotal * 0.18;

  const total = subtotal + tax;

  const createOrder = () => {

    if (!customer || items.length === 0) {
      alert("Select a customer and add products.");
      return;
    }

    const newOrder = {
      id: `ORD-${10024 + orders.length}`,
      customer,
      date: "18 Aug 2026",
      amount: total,
      status: "Pending"
    };

    setOrders([
      newOrder,
      ...orders
    ]);

    setCustomer("");
    setItems([]);
    setShowCreate(false);
  };

  return (
    <div>

      <div className="page-header">

        <div>
          <h1>Orders</h1>

          <p>
            Create and manage customer orders
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowCreate(true)}
        >
          <Plus size={16} />
          Create Order
        </button>

      </div>

      {!showCreate && (

        <div className="module-card">

          <div className="table-toolbar">

            <div className="table-search">

              <Search size={17} />

              <input
                placeholder="Search orders..."
              />

            </div>

          </div>

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr key={order.id}>

                    <td>
                      <strong>{order.id}</strong>
                    </td>

                    <td>{order.customer}</td>

                    <td>{order.date}</td>

                    <td>
                      ₹{order.amount.toLocaleString()}
                    </td>

                    <td>

                      <span
                        className={
                          order.status === "Confirmed"
                            ? "status confirmed"
                            : "status pending"
                        }
                      >
                        {order.status}
                      </span>

                    </td>

                    <td>
                      <button className="small-action">
                        View
                      </button>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {showCreate && (

        <div className="order-builder">

          <div className="builder-header">

            <div>
              <h2>Create New Order</h2>
              <p>Build the customer order and calculate billing automatically.</p>
            </div>

            <button
              className="secondary-btn"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </button>

          </div>

          <div className="form-group">

            <label>Customer *</label>

            <select
              value={customer}
              onChange={(e) =>
                setCustomer(e.target.value)
              }
            >

              <option value="">
                Select customer
              </option>

              {customers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}

            </select>

          </div>

          <div className="add-item-row">

            <div className="form-group">

              <label>Product</label>

              <select
                value={selectedProduct}
                onChange={(e) =>
                  setSelectedProduct(e.target.value)
                }
              >

                <option value="">
                  Select product
                </option>

                {products.map((product) => (

                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name} — ₹{product.price}
                  </option>

                ))}

              </select>

            </div>

            <div className="form-group quantity-input">

              <label>Quantity</label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
              />

            </div>

            <button
              className="add-item-btn"
              onClick={addItem}
            >
              <Plus size={17} />
              Add
            </button>

          </div>

          <div className="order-items">

            {items.length === 0 ? (

              <div className="empty-order">
                <ShoppingCart size={32} />

                <p>
                  No products added to this order.
                </p>
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

                  {items.map((item, index) => (

                    <tr key={index}>

                      <td>{item.name}</td>

                      <td>{item.quantity}</td>

                      <td>₹{item.price}</td>

                      <td>
                        ₹{item.total.toLocaleString()}
                      </td>

                      <td>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            removeItem(index)
                          }
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
              <strong>₹{subtotal.toLocaleString()}</strong>
            </div>

            <div>
              <span>Tax (18%)</span>
              <strong>₹{tax.toLocaleString()}</strong>
            </div>

            <div className="grand-total">
              <span>Grand Total</span>
              <strong>₹{total.toLocaleString()}</strong>
            </div>

          </div>

          <div className="form-actions">

            <button
              className="secondary-btn"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </button>

            <button
              className="primary-btn"
              onClick={createOrder}
            >
              Save Order
            </button>

          </div>

        </div>

      )}

    </div>
  );
}