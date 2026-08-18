import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FileText,
  Receipt,
  Lightbulb,
  Settings,
  LogOut
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    label: "Customers",
    path: "/customers",
    icon: Users
  },
  {
    label: "Products",
    path: "/products",
    icon: Package
  },
  {
    label: "Orders",
    path: "/orders",
    icon: ShoppingCart
  },
  {
    label: "Invoices",
    path: "/invoices",
    icon: FileText
  },
  {
    label: "Expenses",
    path: "/expenses",
    icon: Receipt
  },
  {
    label: "Insights",
    path: "/insights",
    icon: Lightbulb
  }
];

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("msme_logged_in");
    navigate("/login");
  };

  return (
    <aside className="sidebar">

      <div className="brand">
        <div className="brand-mark">SB</div>

        <div>
          <h2>SmartBiz</h2>
          <span>MSME Business Hub</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="section-title">BUSINESS</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="sidebar-bottom">

        <p className="section-title">SYSTEM</p>

        <NavLink to="/settings" className="sidebar-link">
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>

        <button className="logout-link" onClick={logout}>
          <LogOut size={19} />
          <span>Logout</span>
        </button>

      </div>

      <div className="business-profile">
        <div className="business-avatar">P</div>

        <div>
          <strong>Power House</strong>
          <span>Business Admin</span>
        </div>
      </div>

    </aside>
  );
}