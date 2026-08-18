import { Plus, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const titles = {
    "/dashboard": "Dashboard",
    "/customers": "Customers",
    "/products": "Products",
    "/orders": "Orders",
    "/invoices": "Invoices",
    "/expenses": "Expenses",
    "/insights": "Insights"
  };
  return (
    <header className="topbar">
      <div className="topbar-title">{titles[location.pathname] || "SmartBiz"}</div>
      <div className="topbar-actions">
        <div className="search-box"><Search size={16}/><input placeholder="Search..." /></div>
        <button className="quick-add" onClick={() => navigate("/customers")}><Plus size={15}/> Quick Add</button>
      </div>
    </header>
  );
}
