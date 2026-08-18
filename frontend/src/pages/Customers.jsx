import { useEffect, useState } from "react";
import { Search, Plus, MoreVertical, Users } from "lucide-react";
import Modal from "../components/Modal";
import { customerAPI } from "../services/api";

export default function Customers() {
  const [customers,setCustomers]=useState([]);
  const [search,setSearch]=useState("");
  const [showModal,setShowModal]=useState(false);
  const [error,setError]=useState("");
  const [form,setForm]=useState({name:"",phone:"",email:"",gstin:""});

  const load=async()=>{try{const {data}=await customerAPI.getAll();setCustomers(data)}catch(e){setError(e.response?.data?.error||"Unable to load customers.")}};
  useEffect(()=>{load()},[]);

  const addCustomer=async e=>{
    e.preventDefault();setError("");
    try{await customerAPI.create(form);setForm({name:"",phone:"",email:"",gstin:""});setShowModal(false);load()}
    catch(e){setError(e.response?.data?.error||"Unable to save customer.")}
  };
  const filtered=customers.filter(c=>(c.name||"").toLowerCase().includes(search.toLowerCase())||(c.phone||"").includes(search));

  return <div>
    <div className="page-header"><div><h1>Customers</h1><p>Manage your customers and business relationships</p></div><button className="primary-btn" onClick={()=>setShowModal(true)}><Plus size={16}/> Add Customer</button></div>
    {error&&<div className="error-message">{error}</div>}
    <div className="module-card"><div className="table-toolbar"><div className="table-search"><Search size={17}/><input placeholder="Search customers..." value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="record-count">{filtered.length} Customers</div></div>
      <div className="table-wrapper"><table><thead><tr><th>Customer</th><th>Phone</th><th>Email</th><th>GSTIN</th><th>Actions</th></tr></thead><tbody>
      {filtered.map(c=><tr key={c.id}><td><div className="table-person"><div className="customer-avatar">{(c.name||"?").charAt(0)}</div><strong>{c.name}</strong></div></td><td>{c.phone}</td><td>{c.email||"—"}</td><td><span className="gst-badge">{c.gstin||"—"}</span></td><td><button className="icon-btn"><MoreVertical size={17}/></button></td></tr>)}</tbody></table></div>
      {!filtered.length&&<div className="empty-state"><Users size={35}/><h3>No customers found</h3><p>Add your first customer.</p></div>}
    </div>
    {showModal&&<Modal title="Add New Customer" onClose={()=>setShowModal(false)}><form onSubmit={addCustomer}>
      <div className="form-group"><label>Customer Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
      <div className="form-row"><div className="form-group"><label>Phone *</label><input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div><div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div></div>
      <div className="form-group"><label>GSTIN</label><input value={form.gstin} onChange={e=>setForm({...form,gstin:e.target.value})}/></div>
      <div className="form-actions"><button type="button" className="secondary-btn" onClick={()=>setShowModal(false)}>Cancel</button><button className="primary-btn">Save Customer</button></div>
    </form></Modal>}
  </div>;
}
