    import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    gstin: "",
    businessType: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.businessName ||
      !formData.ownerName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    // Temporary registration logic.
    // Replace this with Spring Boot API later.
    console.log("Registration Data:", formData);

    alert("Business account created successfully!");

    navigate("/login");
  };

  return (
    <div className="register-page">

      <div className="register-container">

        {/* LEFT BRAND SECTION */}
        <div className="register-brand">

          <div className="register-logo">
            SB
          </div>

          <h1>MSME SmartBiz Hub</h1>

          <p className="register-tagline">
            One smart platform to manage your complete business workflow.
          </p>

          <div className="register-features">

            <div className="register-feature">
              <div className="feature-icon">✓</div>
              <div>
                <strong>Digital Orders</strong>
                <span>Create and manage customer orders easily.</span>
              </div>
            </div>

            <div className="register-feature">
              <div className="feature-icon">✓</div>
              <div>
                <strong>Smart Billing</strong>
                <span>Automate calculations and billing.</span>
              </div>
            </div>

            <div className="register-feature">
              <div className="feature-icon">✓</div>
              <div>
                <strong>Invoice Management</strong>
                <span>Generate and manage professional invoices.</span>
              </div>
            </div>

            <div className="register-feature">
              <div className="feature-icon">✓</div>
              <div>
                <strong>Business Insights</strong>
                <span>Understand sales, expenses and profitability.</span>
              </div>
            </div>

          </div>

        </div>


        {/* RIGHT REGISTRATION FORM */}
        <div className="register-form-area">

          <div className="register-form-card">

            <div className="register-header">

              <span className="register-label">
                BUSINESS REGISTRATION
              </span>

              <h2>Create your account</h2>

              <p>
                Set up your MSME SmartBiz business profile
              </p>

            </div>


            <form onSubmit={handleSubmit}>

              {/* BUSINESS INFORMATION */}

              <div className="section-title">
                Business Information
              </div>

              <div className="register-row">

                <div className="register-input-group">

                  <label>
                    Business Name <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="businessName"
                    placeholder="Enter business name"
                    value={formData.businessName}
                    onChange={handleChange}
                  />

                </div>

                <div className="register-input-group">

                  <label>
                    Owner Name <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="ownerName"
                    placeholder="Enter owner name"
                    value={formData.ownerName}
                    onChange={handleChange}
                  />

                </div>

              </div>


              <div className="register-row">

                <div className="register-input-group">

                  <label>
                    Business Type
                  </label>

                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select business type
                    </option>

                    <option value="Manufacturing">
                      Manufacturing
                    </option>

                    <option value="Retail">
                      Retail
                    </option>

                    <option value="Wholesale">
                      Wholesale
                    </option>

                    <option value="Service">
                      Service
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                <div className="register-input-group">

                  <label>
                    GSTIN
                  </label>

                  <input
                    type="text"
                    name="gstin"
                    placeholder="Enter GSTIN"
                    value={formData.gstin}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* CONTACT INFORMATION */}

              <div className="section-title">
                Contact Information
              </div>

              <div className="register-row">

                <div className="register-input-group">

                  <label>
                    Email Address <span>*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="business@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>

                <div className="register-input-group">

                  <label>
                    Phone Number <span>*</span>
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* SECURITY */}

              <div className="section-title">
                Account Security
              </div>

              <div className="register-row">

                <div className="register-input-group">

                  <label>
                    Password <span>*</span>
                  </label>

                  <div className="password-wrapper">

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>

                  </div>

                </div>


                <div className="register-input-group">

                  <label>
                    Confirm Password <span>*</span>
                  </label>

                  <div className="password-wrapper">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>

                  </div>

                </div>

              </div>


              {/* TERMS */}

              <label className="register-terms">

                <input
                  type="checkbox"
                  required
                />

                <span>
                  I agree to the MSME SmartBiz Hub terms and
                  conditions.
                </span>

              </label>


              {/* SUBMIT */}

              <button
                type="submit"
                className="create-account-btn"
              >
                Create Business Account
              </button>

            </form>


            {/* LOGIN LINK */}

            <div className="already-account">

              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Sign in
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;