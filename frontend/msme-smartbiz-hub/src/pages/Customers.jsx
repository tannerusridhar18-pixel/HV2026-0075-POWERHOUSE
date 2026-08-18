import { useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Users
} from "lucide-react";

import Modal from "../components/Modal";

const initialCustomers = [
  {
    id: 1,
    name: "ABC Traders",
    phone: "+91 9876543210",
    email: "contact@abctraders.com",
    gstin: "29ABCDE1234F1Z5"
  },
  {
    id: 2,
    name: "Metro Supplies",
    phone: "+91 9123456780",
    email: "metro@example.com",
    gstin: "29XYZDE5678G1Z2"
  },
  {
    id: 3,
    name: "Sri Manufacturing",
    phone: "+91 9988776655",
    email: "sri@example.com",
    gstin: "29LMNOP1234A1Z3"
  }
];

export default function Customers() {

  const [customers, setCustomers] =
    useState(initialCustomers);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    gstin: ""
  });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.phone.includes(search)
  );

  const addCustomer = (e) => {

    e.preventDefault();

    const newCustomer = {
      id: Date.now(),
      ...form
    };

    setCustomers([
      ...customers,
      newCustomer
    ]);

    setForm({
      name: "",
      phone: "",
      email: "",
      gstin: ""
    });

    setShowModal(false);
  };

  return (
    <div>

      <div className="page-header">

        <div>
          <h1>Customers</h1>
          <p>
            Manage your customers and business relationships
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          Add Customer
        </button>

      </div>

      <div className="module-card">

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
            {filteredCustomers.length} Customers
          </div>

        </div>

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

              {filteredCustomers.map((customer) => (

                <tr key={customer.id}>

                  <td>
                    <div className="table-person">

                      <div className="customer-avatar">
                        {customer.name.charAt(0)}
                      </div>

                      <strong>
                        {customer.name}
                      </strong>

                    </div>
                  </td>

                  <td>{customer.phone}</td>

                  <td>{customer.email}</td>

                  <td>
                    <span className="gst-badge">
                      {customer.gstin}
                    </span>
                  </td>

                  <td>
                    <button className="icon-btn">
                      <MoreVertical size={17} />
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {filteredCustomers.length === 0 && (
          <div className="empty-state">
            <Users size={35} />
            <h3>No customers found</h3>
            <p>Try a different search.</p>
          </div>
        )}

      </div>

      {showModal && (

        <Modal
          title="Add New Customer"
          onClose={() => setShowModal(false)}
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
                    name: e.target.value
                  })
                }
                placeholder="ABC Traders"
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
                      phone: e.target.value
                    })
                  }
                  placeholder="+91..."
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
                      email: e.target.value
                    })
                  }
                  placeholder="customer@email.com"
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
                    gstin: e.target.value
                  })
                }
                placeholder="GSTIN"
              />
            </div>

            <div className="form-actions">

              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowModal(false)}
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

    </div>
  );
}