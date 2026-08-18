import { useEffect, useState } from "react";
import { IndianRupee, TrendingUp, Wallet, ShoppingCart } from "lucide-react";
import { dashboardAPI } from "../services/api";
import StatCard from "../components/StatCard";

export default function Dashboard(){
 const [data,setData]=useState({totalSales:0,totalExpenses:0,estimatedProfit:0,pendingOrders:0,lowStockProducts:0,invoiceCount:0});
 const [error,setError]=useState("");
 useEffect(()=>{dashboardAPI.getSummary().then(r=>setData(r.data)).catch(e=>setError(e.response?.data?.error||"Unable to load dashboard."))},[]);
 return <div><div className="page-header"><div><h1>Dashboard</h1><p>Overview of your business performance</p></div></div>{error&&<div className="error-message">{error}</div>}
 <div className="stats-grid"><StatCard label="Total Sales" value={`₹${Number(data.totalSales).toLocaleString()}`} hint="From recorded orders"/><StatCard label="Expenses" value={`₹${Number(data.totalExpenses).toLocaleString()}`} hint="Recorded expenses"/><StatCard label="Estimated Profit" value={`₹${Number(data.estimatedProfit).toLocaleString()}`} hint="Sales minus expenses"/><StatCard label="Pending Orders" value={data.pendingOrders} hint="Orders awaiting action"/></div>
 <div className="dashboard-grid"><div className="module-card"><div className="card-heading"><div><h2>Business Snapshot</h2><p>Live values from your database</p></div></div><div className="snapshot-grid"><div><IndianRupee size={20}/><span>Total Sales</span><strong>₹{Number(data.totalSales).toLocaleString()}</strong></div><div><Wallet size={20}/><span>Expenses</span><strong>₹{Number(data.totalExpenses).toLocaleString()}</strong></div><div><TrendingUp size={20}/><span>Profit</span><strong>₹{Number(data.estimatedProfit).toLocaleString()}</strong></div><div><ShoppingCart size={20}/><span>Invoices</span><strong>{data.invoiceCount}</strong></div></div></div><div className="module-card"><h2>Attention</h2><p>{data.lowStockProducts} product(s) are below the low-stock threshold.</p><p>{data.pendingOrders} order(s) are pending.</p></div></div>
 </div>;
}
