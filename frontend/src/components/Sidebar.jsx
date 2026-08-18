import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Package, ShoppingCart, Receipt, WalletCards, BarChart3, LogOut } from "lucide-react";

const links = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/customers", "Customers", Users],
  ["/products", "Products", Package],
  ["/orders", "Orders", ShoppingCart],
  ["/invoices", "Invoices", Receipt],
  ["/expenses", "Expenses", WalletCards],
  ["/insights", "Insights", BarChart3]
];

export default function Sidebar() {
  const navigate = useNavigate();
  const business = localStorage.getItem("msme_business_name") || "My Business";

  const logout = () => {
    localStorage.removeItem("msme_user_id");
    localStorage.removeItem("msme_business_name");
    localStorage.removeItem("msme_owner_name");
    localStorage.removeItem("msme_email");
    localStorage.removeItem("msme_token");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">SB</div>
        <div><h2>SmartBiz</h2><span>MSME HUB</span></div>
      </div>
      <div className="section-title">MAIN MENU</div>
      <nav>
        {links.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className="logout-link" onClick={logout}><LogOut size={17}/> Logout</button>
        <div className="business-profile">
          <div className="business-avatar">{business.charAt(0).toUpperCase()}</div>
          <div><strong>{business}</strong><span>Business account</span></div>
        </div>
      </div>
    </aside>
  );
}
