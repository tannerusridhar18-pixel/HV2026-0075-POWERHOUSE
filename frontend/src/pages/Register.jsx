import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName:"", ownerName:"", email:"", phone:"", gstin:"",
    businessType:"", password:"", confirmPassword:""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");
    if (formData.password.length < 6) return setError("Password must contain at least 6 characters.");
    setLoading(true);
    try {
      const payload = {...formData};
      delete payload.confirmPassword;
      const { data } = await authAPI.register(payload);
      localStorage.setItem("msme_user_id", String(data.userId));
      localStorage.setItem("msme_business_name", data.businessName || "");
      localStorage.setItem("msme_owner_name", data.ownerName || "");
      localStorage.setItem("msme_email", data.email || "");
      localStorage.setItem("msme_token", data.token || "");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-brand">
          <div className="register-logo">SB</div>
          <h1>MSME SmartBiz Hub</h1>
          <p className="register-tagline">One smart platform to manage your complete business workflow.</p>
          <div className="register-features">
            {[
              ["Digital Orders","Create and manage customer orders easily."],
              ["Smart Billing","Automate calculations and billing."],
              ["Invoice Management","Generate and manage professional invoices."],
              ["Business Insights","Understand sales, expenses and profitability."]
            ].map(([a,b])=><div className="register-feature" key={a}><div className="feature-icon">✓</div><div><strong>{a}</strong><span>{b}</span></div></div>)}
          </div>
        </div>
        <div className="register-form-area">
          <div className="register-form-card">
            <span className="register-label">BUSINESS REGISTRATION</span>
            <h2>Create your account</h2><p>Set up your MSME SmartBiz business profile</p>
            <form onSubmit={handleSubmit}>
              <div className="section-title">Business Information</div>
              <div className="register-row">
                <div className="register-input-group"><label>Business Name *</label><input name="businessName" value={formData.businessName} onChange={handleChange} required/></div>
                <div className="register-input-group"><label>Owner Name *</label><input name="ownerName" value={formData.ownerName} onChange={handleChange} required/></div>
              </div>
              <div className="register-row">
                <div className="register-input-group"><label>Business Type</label><select name="businessType" value={formData.businessType} onChange={handleChange}><option value="">Select business type</option><option>Manufacturing</option><option>Retail</option><option>Wholesale</option><option>Service</option><option>Other</option></select></div>
                <div className="register-input-group"><label>GSTIN</label><input name="gstin" value={formData.gstin} onChange={handleChange}/></div>
              </div>
              <div className="section-title">Contact Information</div>
              <div className="register-row">
                <div className="register-input-group"><label>Email Address *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required/></div>
                <div className="register-input-group"><label>Phone Number *</label><input name="phone" value={formData.phone} onChange={handleChange} required/></div>
              </div>
              <div className="section-title">Account Security</div>
              <div className="register-row">
                <div className="register-input-group"><label>Password *</label><div className="password-wrapper"><input type={showPassword?"text":"password"} name="password" value={formData.password} onChange={handleChange} required minLength="6"/><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword?"Hide":"Show"}</button></div></div>
                <div className="register-input-group"><label>Confirm Password *</label><div className="password-wrapper"><input type={showConfirmPassword?"text":"password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required/><button type="button" onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword?"Hide":"Show"}</button></div></div>
              </div>
              <label className="register-terms"><input type="checkbox" required/><span>I agree to the MSME SmartBiz Hub terms and conditions.</span></label>
              {error && <div className="error-message">{error}</div>}
              <button className="create-account-btn" disabled={loading}>{loading?"Creating...":"Create Business Account"}</button>
            </form>
            <div className="already-account"><span>Already have an account?</span><Link to="/login">Sign in</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}
