import { useEffect, useState } from "react";
import { dashboardAPI } from "../services/api";

export default function Insights(){
 const [d,setD]=useState(null),[error,setError]=useState("");
 useEffect(()=>{dashboardAPI.getSummary().then(r=>setD(r.data)).catch(e=>setError(e.response?.data?.error||"Unable to load insights."))},[]);
 if(error)return <div className="error-message">{error}</div>;
 if(!d)return <div className="loading-state">Loading insights...</div>;
 const margin=d.totalSales?((d.estimatedProfit/d.totalSales)*100):0;
 return <div><div className="page-header"><div><h1>Insights</h1><p>Understand sales, expenses and profitability</p></div></div><div className="stats-grid"><div className="stat-card"><span>Profit Margin</span><strong>{margin.toFixed(1)}%</strong><small>Estimated from recorded data</small></div><div className="stat-card"><span>Low Stock Items</span><strong>{d.lowStockProducts}</strong><small>Below 100 units</small></div><div className="stat-card"><span>Pending Orders</span><strong>{d.pendingOrders}</strong><small>Need attention</small></div></div><div className="module-card"><h2>Business interpretation</h2><p>Total sales are ₹{Number(d.totalSales).toLocaleString()}, expenses are ₹{Number(d.totalExpenses).toLocaleString()}, and estimated profit is ₹{Number(d.estimatedProfit).toLocaleString()}.</p></div></div>;
}
