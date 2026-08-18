import { useState } from "react";
import {
  Plus,
  Search,
  Receipt
} from "lucide-react";

import Modal from "../components/Modal";

const initialExpenses = [
  {
    id: 1,
    date: "18 Aug 2026",
    category: "Raw Material",
    description: "Steel sheets",
    amount: 12000,
    payment: "UPI"
  },
  {
    id: 2,
    date: "17 Aug 2026",
    category: "Transport",
    description: "Material transportation",
    amount: 6500,
    payment: "Bank Transfer"
  },
  {
    id: 3,
    date: "16 Aug 2026",
    category: "Utilities",
    description: "Electricity bill",
    amount: 4800,
    payment: "UPI"
  }
];

export default function Expenses() {

  const [expenses, setExpenses] =
    useState(initialExpenses);

  const [showModal, setShowModal] =
    useState(false);

  const [form, setForm] = useState({
    category: "Raw Material",
    description: "",
    amount: "",
    payment: "UPI"
  });

  const addExpense = (e) => {

    e.preventDefault();

    const expense = {
      id: Date.now(),
      date: "18 Aug 2026",
      category: form.category,
      description: form.description,
      amount: Number(form.amount),
      payment: form.payment
    };

    setExpenses([
      expense,
      ...expenses
    ]);

    setForm({
      category: "Raw Material",
      description: "",
      amount: "",
      payment: "UPI"
    });

    setShowModal(false);
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) =>
      sum + expense.amount,
    0
  );

  return (
    <div>

      <div className="page-header">

        <div>
          <h1>Expenses</h1>

          <p>
            Track and manage business spending
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          Add Expense
        </button>

      </div>

      <div className="expense-summary">

        <div>
          <span>Total Recorded Expenses</span>

          <strong>
            ₹{totalExpenses.toLocaleString()}
          </strong>
        </div>

        <div>
          <span>Transactions</span>

          <strong>
            {expenses.length}
          </strong>
        </div>

      </div>

      <div className="module-card">

        <div className="table-toolbar">

          <div className="table-search">

            <Search size={17} />

            <input
              placeholder="Search expenses..."
            />

          </div>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Payment Method</th>
              </tr>

            </thead>

            <tbody>

              {expenses.map((expense) => (

                <tr key={expense.id}>

                  <td>{expense.date}</td>

                  <td>

                    <span className="category-badge">
                      {expense.category}
                    </span>

                  </td>

                  <td>{expense.description}</td>

                  <td>
                    <strong>
                      ₹{expense.amount.toLocaleString()}
                    </strong>
                  </td>

                  <td>{expense.payment}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {showModal && (

        <Modal
          title="Record New Expense"
          onClose={() => setShowModal(false)}
        >

          <form onSubmit={addExpense}>

            <div className="form-row">

              <div className="form-group">

                <label>Category *</label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value
                    })
                  }
                >

                  <option>Raw Material</option>
                  <option>Transport</option>
                  <option>Utilities</option>
                  <option>Operations</option>
                  <option>Equipment</option>
                  <option>Other</option>

                </select>

              </div>

              <div className="form-group">

                <label>Amount *</label>

                <input
                  type="number"
                  required
                  min="0"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: e.target.value
                    })
                  }
                  placeholder="12000"
                />

              </div>

            </div>

            <div className="form-group">

              <label>Description *</label>

              <input
                required
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value
                  })
                }
                placeholder="Steel sheets"
              />

            </div>

            <div className="form-group">

              <label>Payment Method</label>

              <select
                value={form.payment}
                onChange={(e) =>
                  setForm({
                    ...form,
                    payment: e.target.value
                  })
                }
              >

                <option>UPI</option>
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>Card</option>

              </select>

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
                Save Expense
              </button>

            </div>

          </form>

        </Modal>

      )}

    </div>
  );
}