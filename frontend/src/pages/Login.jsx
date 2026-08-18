import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Lock, Mail } from "lucide-react";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    localStorage.setItem("msme_logged_in", "true");

    navigate("/dashboard");
  };

  return (
    <div className="login-page">

      <div className="login-brand-panel">

        <div className="login-logo">
          SB
        </div>

        <h1>
          MSME SmartBiz Hub
        </h1>

        <p>
          One digital platform for orders, billing,
          invoices and expense management.
        </p>

        <div className="login-flow">

          <span>Customers</span>
          <b>→</b>
          <span>Orders</span>
          <b>→</b>
          <span>Invoices</span>
          <b>→</b>
          <span>Insights</span>

        </div>

      </div>

      <div className="login-form-panel">

        <div className="login-card">

          <Building2 size={30} className="login-icon" />

          <h2>Welcome back</h2>

          <p>
            Sign in to manage your business
          </p>

          <form onSubmit={handleLogin}>

            <label>Email</label>

            <div className="input-icon">
              <Mail size={17} />

              <input
                type="email"
                placeholder="admin@powerhouse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label>Password</label>

            <div className="input-icon">
              <Lock size={17} />

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="login-button">
              Sign In
            </button>

            <div className="login-register-link">
  <span>Don't have an account?</span>

  <Link to="/register">
    Create Business Account
  </Link>
</div>

          </form>

          <small className="demo-login">
            Demo mode: any valid email and password
          </small>

        </div>

      </div>

    </div>
  );
}