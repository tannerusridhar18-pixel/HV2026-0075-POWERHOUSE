import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="application">
      <Sidebar />
      <main className="application-main">
        <Topbar />
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}
