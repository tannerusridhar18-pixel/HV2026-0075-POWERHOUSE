import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Lock, Mail } from "lucide-react";
import { authAPI } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem("msme_user_id", String(data.userId));
      localStorage.setItem("msme_business_name", data.businessName || "");
      localStorage.setItem("msme_owner_name", data.ownerName || "");
      localStorage.setItem("msme_email", data.email || email);
      localStorage.setItem("msme_token", data.token || "");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-brand-panel">
        <div className="login-logo">SB</div>
        <h1>MSME SmartBiz Hub</h1>
        <p>One digital platform for orders, billing, invoices and expense management.</p>
        <div className="login-flow"><span>Customers</span><b>→</b><span>Orders</span><b>→</b><span>Invoices</span><b>→</b><span>Insights</span></div>
      </div>
      <div className="login-form-panel">
        <div className="login-card">
          <Building2 size={30} className="login-icon" />
          <h2>Welcome back</h2><p>Sign in to manage your business</p>
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <div className="input-icon"><Mail size={17}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
            <label>Password</label>
            <div className="input-icon"><Lock size={17}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
            {error && <div className="error-message">{error}</div>}
            <button className="login-button" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
            <div className="login-register-link"><span>Don't have an account?</span><Link to="/register">Create Business Account</Link></div>
          </form>
        </div>
      </div>
    </div>
  );
}
