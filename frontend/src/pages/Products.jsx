import { useEffect, useState } from "react";
import { Search, Plus, Package, MoreVertical } from "lucide-react";
import Modal from "../components/Modal";
import { productAPI } from "../services/api";

export default function Products(){
 const [products,setProducts]=useState([]);const [search,setSearch]=useState("");const [show,setShow]=useState(false);const [error,setError]=useState("");const [form,setForm]=useState({name:"",price:"",stock:""});
 const load=async()=>{try{const {data}=await productAPI.getAll();setProducts(data)}catch(e){setError(e.response?.data?.error||"Unable to load products.")}};
 useEffect(()=>{load()},[]);
 const add=async e=>{e.preventDefault();try{await productAPI.create({name:form.name,price:Number(form.price),stock:Number(form.stock||0)});setForm({name:"",price:"",stock:""});setShow(false);load()}catch(e){setError(e.response?.data?.error||"Unable to save product.")}};
 const filtered=products.filter(p=>(p.name||"").toLowerCase().includes(search.toLowerCase()));
 return <div><div className="page-header"><div><h1>Products</h1><p>Manage products, prices and stock</p></div><button className="primary-btn" onClick={()=>setShow(true)}><Plus size={16}/> Add Product</button></div>
 {error&&<div className="error-message">{error}</div>}<div className="module-card"><div className="table-toolbar"><div className="table-search"><Search size={17}/><input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/></div><span className="record-count">{filtered.length} Products</span></div>
 <div className="table-wrapper"><table><thead><tr><th>Product</th><th>Unit Price</th><th>Stock</th><th>Stock Status</th><th>Actions</th></tr></thead><tbody>{filtered.map(p=><tr key={p.id}><td><div className="table-person"><div className="product-icon"><Package size={17}/></div><strong>{p.name}</strong></div></td><td>₹{Number(p.price).toLocaleString()}</td><td>{p.stock}</td><td><span className={p.stock<100?"status low":"status confirmed"}>{p.stock<100?"Low Stock":"In Stock"}</span></td><td><button className="icon-btn"><MoreVertical size={17}/></button></td></tr>)}</tbody></table></div></div>
 {show&&<Modal title="Add New Product" onClose={()=>setShow(false)}><form onSubmit={add}><div className="form-group"><label>Product Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div><div className="form-row"><div className="form-group"><label>Unit Price *</label><input type="number" min="0" required value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div><div className="form-group"><label>Stock</label><input type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></div></div><div className="form-actions"><button type="button" className="secondary-btn" onClick={()=>setShow(false)}>Cancel</button><button className="primary-btn">Save Product</button></div></form></Modal>}</div>;
}
