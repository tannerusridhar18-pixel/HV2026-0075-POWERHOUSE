import {
  Search,
  Bell,
  Plus
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="topbar">

      <div className="search-box">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search customers, orders, invoices..."
        />
      </div>

      <div className="topbar-actions">

        <button
          className="quick-add"
          onClick={() => navigate("/orders")}
        >
          <Plus size={17} />
          New Order
        </button>

        <button className="notification">
          <Bell size={19} />
          <span />
        </button>

        <div className="user-profile">

          <div className="user-avatar">
            P
          </div>

          <div>
            <strong>Power House</strong>
            <small>Administrator</small>
          </div>

        </div>

      </div>

    </header>
  );
}