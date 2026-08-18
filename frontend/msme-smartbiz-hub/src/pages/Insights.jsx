import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  IndianRupee
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const trendData = [
  { month: "Jan", sales: 42000, expenses: 18000 },
  { month: "Feb", sales: 51000, expenses: 21000 },
  { month: "Mar", sales: 47000, expenses: 19000 },
  { month: "Apr", sales: 63000, expenses: 25000 },
  { month: "May", sales: 59000, expenses: 23000 },
  { month: "Jun", sales: 72000, expenses: 27000 }
];

export default function Insights() {

  return (
    <div>

      <div className="page-header">

        <div>
          <h1>Business Insights</h1>

          <p>
            Turn your business records into useful decisions
          </p>
        </div>

      </div>

      <div className="insight-stats">

        <div className="mini-insight-card">

          <div className="mini-icon green">
            <TrendingUp size={20} />
          </div>

          <span>Sales Trend</span>

          <strong>Positive</strong>

          <small>
            Sales are showing an upward trend.
          </small>

        </div>

        <div className="mini-insight-card">

          <div className="mini-icon orange">
            <TrendingDown size={20} />
          </div>

          <span>Expense Pressure</span>

          <strong>Moderate</strong>

          <small>
            Raw material is the largest expense.
          </small>

        </div>

        <div className="mini-insight-card">

          <div className="mini-icon blue">
            <IndianRupee size={20} />
          </div>

          <span>Estimated Profit</span>

          <strong>₹26,350</strong>

          <small>
            Based on sales minus recorded expenses.
          </small>

        </div>

      </div>

      <div className="insights-grid">

        <div className="chart-card">

          <div className="chart-header">

            <div>
              <h3>Sales vs Expenses</h3>

              <p>
                Monthly business trend
              </p>
            </div>

          </div>

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={trendData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#174a8b"
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#d88920"
                  strokeWidth={2}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="ai-insight-panel">

          <div className="ai-header">

            <div className="ai-icon">
              <Lightbulb size={20} />
            </div>

            <div>
              <h3>Smart Business Insight</h3>
              <span>AI-assisted observation</span>
            </div>

          </div>

          <div className="ai-message">

            <p>
              Sales are showing a positive trend,
              but raw-material expenses remain the
              largest recorded expense category.
            </p>

            <p>
              Consider reviewing supplier pricing,
              purchasing quantities and inventory
              planning to improve your estimated
              profit margin.
            </p>

          </div>

          <div className="insight-recommendation">

            <strong>Recommendation</strong>

            <p>
              Monitor raw-material spending during
              the next business cycle.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}