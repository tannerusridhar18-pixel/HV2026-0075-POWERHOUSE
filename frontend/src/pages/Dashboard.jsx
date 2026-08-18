import {
  IndianRupee,
  TrendingUp,
  Receipt,
  ShoppingCart,
  Clock,
  ArrowUpRight
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from "recharts";

import StatCard from "../components/StatCard";

const salesData = [
  { month: "Jan", sales: 42000 },
  { month: "Feb", sales: 51000 },
  { month: "Mar", sales: 47000 },
  { month: "Apr", sales: 63000 },
  { month: "May", sales: 59000 },
  { month: "Jun", sales: 72000 }
];

const expenseData = [
  { category: "Raw Material", amount: 12000 },
  { category: "Transport", amount: 6500 },
  { category: "Utilities", amount: 4800 },
  { category: "Operations", amount: 7200 }
];

export default function Dashboard() {

  return (
    <div>

      <div className="page-header">

        <div>
          <h1>Business Dashboard</h1>
          <p>
            Monitor your MSME business performance
          </p>
        </div>

        <a
          href="/orders"
          className="primary-btn"
        >
          + Create Order
        </a>

      </div>

      <div className="stats-grid">

        <StatCard
          title="Total Sales"
          value="₹38,350"
          subtitle="↑ 12.5% this month"
          icon={IndianRupee}
          type="blue"
        />

        <StatCard
          title="Total Expenses"
          value="₹12,000"
          subtitle="8.2% from last month"
          icon={Receipt}
          type="orange"
        />

        <StatCard
          title="Estimated Profit"
          value="₹26,350"
          subtitle="↑ 15.8% this month"
          icon={TrendingUp}
          type="green"
        />

        <StatCard
          title="Pending Orders"
          value="8"
          subtitle="3 require attention"
          icon={Clock}
          type="purple"
        />

      </div>

      <div className="charts-grid">

        <div className="chart-card">

          <div className="chart-header">

            <div>
              <h3>Sales Overview</h3>
              <p>Monthly sales performance</p>
            </div>

            <select className="chart-filter">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>

          </div>

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart data={salesData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#174a8b"
                  fill="#dce8fa"
                  strokeWidth={2}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="chart-card">

          <div className="chart-header">

            <div>
              <h3>Expense Breakdown</h3>
              <p>Business spending categories</p>
            </div>

          </div>

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={expenseData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10 }}
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="amount"
                  fill="#174a8b"
                  radius={[5, 5, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card">

          <div className="card-heading">

            <div>
              <h3>Recent Orders</h3>
              <p>Latest customer transactions</p>
            </div>

            <a href="/orders" className="view-btn">
              View All
              <ArrowUpRight size={14} />
            </a>

          </div>

          <div className="order-list">

            <div className="order-row">

              <div className="order-icon">
                <ShoppingCart size={17} />
              </div>

              <div className="order-details">
                <strong>ORD-10023</strong>
                <span>ABC Traders</span>
              </div>

              <strong>₹38,350</strong>

              <span className="status confirmed">
                Confirmed
              </span>

            </div>

            <div className="order-row">

              <div className="order-icon">
                <ShoppingCart size={17} />
              </div>

              <div className="order-details">
                <strong>ORD-10022</strong>
                <span>Metro Supplies</span>
              </div>

              <strong>₹21,500</strong>

              <span className="status pending">
                Pending
              </span>

            </div>

          </div>

        </div>

        <div className="insight-card">

          <div className="insight-title">

            <div className="insight-icon">
              ✦
            </div>

            <div>
              <h3>Business Insight</h3>
              <span>Smart recommendation</span>
            </div>

          </div>

          <p>
            Raw-material expenses are currently your
            largest recorded expense category. Reviewing
            supplier pricing or purchasing quantities
            could improve your estimated profit.
          </p>

          <a
            href="/insights"
            className="insight-btn"
          >
            View Detailed Insights
          </a>

        </div>

      </div>

    </div>
  );
}