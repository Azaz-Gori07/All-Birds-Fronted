import React, { useState, useEffect } from 'react';
import './User.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function User() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && isTokenValid()) {
      if (role === "admin" || role === "superadmin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: otp, 3: reset password
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [forgotForm, setForgotForm] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const isValidGmail = form.email.endsWith('@gmail.com');
  const isForgotEmailValid = forgotForm.email.endsWith('@gmail.com');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleForgotChange = (e) => {
    setForgotForm({ ...forgotForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidGmail) return alert("Please enter a valid Gmail address");
    if (!form.password) return alert("Please enter your password");

    try {
      setLoading(true);
      const url = mode === 'signup' ? "api/auth/signup" : "/api/auth/login";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) return alert(data.error || "Something went wrong");

      if (mode === 'signup') {
        alert("Signup successful! Now login.");
        setMode('login');
        return;
      }

      const token = data.token;
      const decoded = jwtDecode(token);
      console.log("Decoded:", decoded);

      localStorage.setItem("token", token);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("user", JSON.stringify({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      }));

      if (decoded.role === "admin" || decoded.role === "superadmin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!isForgotEmailValid) return alert("Please enter a valid Gmail address");

    try {
      setLoading(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotForm.email }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to send OTP");

      alert("OTP sent to your email!");
      setForgotStep(2);
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!forgotForm.otp) return alert("Please enter OTP");

    try {
      setLoading(true);
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotForm.email, otp: forgotForm.otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert("Invalid OTP");
        return;
      }

      alert("OTP verified successfully!");
      setForgotStep(3);
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotForm.newPassword || !forgotForm.confirmPassword) {
      return alert("Please fill all fields");
    }
    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotForm.email,
          otp: forgotForm.otp,
          newPassword: forgotForm.newPassword
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to reset password");

      alert("Password reset successful! Please login.");
      setMode('login');
      setForgotStep(1);
      setForgotForm({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const renderForgotPassword = () => {
    if (forgotStep === 1) {
      return (
        <form className="email-form" onSubmit={handleSendOTP}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={forgotForm.email}
            onChange={handleForgotChange}
            className={isForgotEmailValid ? "valid-input" : "invalid-input"}
          />
          <button
            type="submit"
            className="continue-btn"
            disabled={!isForgotEmailValid || loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      );
    }

    if (forgotStep === 2) {
      return (
        <form className="email-form" onSubmit={handleVerifyOTP}>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={forgotForm.otp}
            onChange={handleForgotChange}
          />
          <button
            type="submit"
            className="continue-btn"
            disabled={!forgotForm.otp || loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      );
    }

    if (forgotStep === 3) {
      return (
        <form className="email-form" onSubmit={handleResetPassword}>
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={forgotForm.newPassword}
            onChange={handleForgotChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={forgotForm.confirmPassword}
            onChange={handleForgotChange}
          />
          <button
            type="submit"
            className="continue-btn"
            disabled={!forgotForm.newPassword || !forgotForm.confirmPassword || loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      );
    }
  };

  return (
    <div className="full-page">
      <div className="login-page">
        <div className="logo-container">
          <img src="Allbirds_logo.png" alt="All Birds Logo" />
        </div>

        <div className="sign-in-container">
          <h1>
            {mode === 'signup' ? "Sign up" : mode === 'forgot' ? "Forgot Password" : "Sign in"}
          </h1>
          <p>
            {mode === 'signup'
              ? "Create your account"
              : mode === 'forgot'
              ? "Reset your password"
              : "Choose how you'd like to sign in"}
          </p>
        </div>

        <div className="email-container">
          {mode === 'forgot' ? (
            <>
              {renderForgotPassword()}
              <p style={{ marginTop: '15px', textAlign: 'center' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  Remember your password?{" "}
                </span>
                <span
                  style={{
                    color: '#4ecdc4',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onClick={() => {
                    setMode('login');
                    setForgotStep(1);
                    setForgotForm({ email: '', otp: '', newPassword: '', confirmPassword: '' });
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#45b7aa';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = '#4ecdc4';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  Back to Login →
                </span>
              </p>
            </>
          ) : (
            <>
              <form className="email-form" onSubmit={handleSubmit}>
                {mode === 'signup' && (
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                  />
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className={isValidGmail ? "valid-input" : "invalid-input"}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />

                <button
                  type="submit"
                  className="continue-btn"
                  disabled={!isValidGmail || loading}
                >
                  {loading ? "Processing..." : mode === 'signup' ? "Sign Up" : "Login"}
                </button>
              </form>

              {mode === 'login' && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '15px',
                  gap: '10px'
                }}>
                  <span
                    style={{
                      color: '#ff6b6b',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none'
                    }}
                    onClick={() => setMode('forgot')}
                    onMouseOver={(e) => {
                      e.target.style.color = '#ff5252';
                      e.target.style.textDecoration = 'underline';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = '#ff6b6b';
                      e.target.style.textDecoration = 'none';
                    }}
                  >
                    Forgot Password?
                  </span>
                  <span
                    style={{
                      color: '#4ecdc4',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none'
                    }}
                    onClick={() => setMode('signup')}
                    onMouseOver={(e) => {
                      e.target.style.color = '#45b7aa';
                      e.target.style.textDecoration = 'underline';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = '#4ecdc4';
                      e.target.style.textDecoration = 'none';
                    }}
                  >
                    Create Account →
                  </span>
                </div>
              )}

              {mode === 'signup' && (
                <p style={{ marginTop: '15px', textAlign: 'center' }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>
                    Already have an account?{" "}
                  </span>
                  <span
                    style={{
                      color: '#4ecdc4',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none'
                    }}
                    onClick={() => setMode('login')}
                    onMouseOver={(e) => {
                      e.target.style.color = '#45b7aa';
                      e.target.style.textDecoration = 'underline';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = '#4ecdc4';
                      e.target.style.textDecoration = 'none';
                    }}
                  >
                    Login →
                  </span>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default User;