import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = () => {
  return (
    <div className="app-layout">

      {/* Left Navigation */}
      <Sidebar />

      {/* Main Application Area */}
      <div className="main-area">

        {/* Top Header */}
        <Topbar />

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default Layout;