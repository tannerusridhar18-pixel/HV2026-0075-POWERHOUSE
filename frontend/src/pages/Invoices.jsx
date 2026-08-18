import {
  FileText,
  Download,
  Printer,
  Search
} from "lucide-react";

const invoices = [
  {
    number: "INV-10023",
    customer: "ABC Traders",
    date: "18 Aug 2026",
    amount: 38350,
    status: "Generated"
  },
  {
    number: "INV-10022",
    customer: "Metro Supplies",
    date: "17 Aug 2026",
    amount: 21500,
    status: "Paid"
  },
  {
    number: "INV-10021",
    customer: "Sri Manufacturing",
    date: "15 Aug 2026",
    amount: 18750,
    status: "Pending"
  }
];

export default function Invoices() {

  return (
    <div>

      <div className="page-header">

        <div>
          <h1>Invoices</h1>

          <p>
            Generate and manage sales invoices
          </p>
        </div>

      </div>

      <div className="module-card">

        <div className="table-toolbar">

          <div className="table-search">

            <Search size={17} />

            <input
              placeholder="Search invoice..."
            />

          </div>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {invoices.map((invoice) => (

                <tr key={invoice.number}>

                  <td>

                    <div className="table-person">

                      <div className="product-icon">
                        <FileText size={17} />
                      </div>

                      <strong>
                        {invoice.number}
                      </strong>

                    </div>

                  </td>

                  <td>{invoice.customer}</td>

                  <td>{invoice.date}</td>

                  <td>
                    ₹{invoice.amount.toLocaleString()}
                  </td>

                  <td>

                    <span className="status confirmed">
                      {invoice.status}
                    </span>

                  </td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="small-action"
                        onClick={() => window.print()}
                      >
                        <Printer size={14} />
                        Print
                      </button>

                      <button className="small-action">
                        <Download size={14} />
                        PDF
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}