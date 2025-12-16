import React, { useState, useEffect } from 'react';
import './User.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function User() {
  const navigate = useNavigate();

  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

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
  const [signupStep, setSignupStep] = useState(1); // 1: form, 2: otp verification
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: otp, 3: reset password
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [signupOtp, setSignupOtp] = useState('');
  const [forgotForm, setForgotForm] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [statusMessage, setStatusMessage] = useState(''); // New state for non-alert feedback

  const isValidGmail = form.email.endsWith('@gmail.com');
  const isForgotEmailValid = forgotForm.email.endsWith('@gmail.com');

  // Resend Timer Effect
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatusMessage('');
  };

  const handleForgotChange = (e) => {
    setForgotForm({ ...forgotForm, [e.target.name]: e.target.value });
    setStatusMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    if (!isValidGmail) {
      setStatusMessage("Please enter a valid Gmail address");
      return;
    }
    if (!form.password) {
      setStatusMessage("Please enter your password");
      return;
    }
    if (mode === 'signup' && !form.name) {
      setStatusMessage("Please enter your name");
      return;
    }

    try {
      setLoading(true);

      if (mode === 'signup') {
        const res = await fetch("/api/auth/send-signup-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        });

        const data = await res.json();
        if (!res.ok) {
          setStatusMessage(data.error || "Something went wrong sending OTP.");
          return;
        }

        setStatusMessage("OTP sent to your email!");
        setSignupStep(2);
        setResendTimer(60);
        return;
      }

      // Login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusMessage(data.error || "Login failed. Please try again.");
        return;
      }

      const token = data.token;
      const decoded = jwtDecode(token);

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
      setStatusMessage("Server error during sign in/up.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignupOTP = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    if (!signupOtp) {
      setStatusMessage("Please enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/verify-and-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          otp: signupOtp,
          name: form.name,
          password: form.password
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage(data.error || "Invalid OTP or account creation failed.");
        return;
      }

      setStatusMessage("Account created successfully! Please login.");
      setMode('login');
      setSignupStep(1);
      setSignupOtp('');
      setForm({ name: '', email: '', password: '' });
      setResendTimer(0);
    } catch (err) {
      setStatusMessage("Server error during OTP verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setStatusMessage('');

    try {
      setLoading(true);
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email || forgotForm.email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage(data.error || "Failed to resend OTP.");
        return;
      }

      setStatusMessage("OTP resent successfully!");
      setResendTimer(60);
    } catch (err) {
      setStatusMessage("Server error while trying to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    if (!isForgotEmailValid) {
      setStatusMessage("Please enter a valid Gmail address.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotForm.email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage(data.error || "Failed to send OTP. Check your email.");
        return;
      }

      setStatusMessage("OTP sent to your email!");
      setForgotStep(2);
    } catch (err) {
      setStatusMessage("Server error while sending forgot password OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    if (!forgotForm.otp) {
      setStatusMessage("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotForm.email, otp: forgotForm.otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage(data.message || "Invalid OTP.");
        return;
      }

      setStatusMessage("OTP verified successfully! Set your new password.");
      setForgotStep(3);
    } catch (err) {
      setStatusMessage("Server error during OTP verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    if (!forgotForm.newPassword || !forgotForm.confirmPassword) {
      setStatusMessage("Please fill both password fields.");
      return;
    }
    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      setStatusMessage("Passwords do not match.");
      return;
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
      if (!res.ok) {
        setStatusMessage(data.error || "Failed to reset password.");
        return;
      }

      setStatusMessage("Password reset successful! Please login.");
      setMode('login');
      setForgotStep(1);
      setForgotForm({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatusMessage("Server error during password reset.");
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
            {mode === 'signup'
              ? (signupStep === 1 ? "Sign up" : "Verify Email")
              : mode === 'forgot'
                ? "Forgot Password"
                : "Sign in"}
          </h1>
          <p>
            {mode === 'signup'
              ? (signupStep === 1 ? "Create your account" : `Enter the OTP sent to ${form.email}`)
              : mode === 'forgot'
                ? "Reset your password"
                : "Choose how you'd like to sign in"}
          </p>
        </div>

        {/* Status Message Display */}
        {statusMessage && (
          <div style={{
            padding: '10px',
            margin: '10px 0',
            backgroundColor: statusMessage.includes('successful') || statusMessage.includes('sent') ? '#e6fffb' : '#ffebeb',
            color: statusMessage.includes('successful') || statusMessage.includes('sent') ? '#006d75' : '#cf1322',
            border: `1px solid ${statusMessage.includes('successful') || statusMessage.includes('sent') ? '#87e8de' : '#ffa39e'}`,
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {statusMessage}
          </div>
        )}

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
                    setStatusMessage('');
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
          ) : mode === 'signup' && signupStep === 2 ? (
            <>
              <form className="email-form" onSubmit={handleVerifySignupOTP}>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={signupOtp}
                  onChange={(e) => setSignupOtp(e.target.value)}
                  maxLength="6"
                />
                <button
                  type="submit"
                  className="continue-btn"
                  disabled={!signupOtp || loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>

              <div style={{
                marginTop: '15px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {resendTimer > 0 ? (
                  <p style={{ color: '#666', fontSize: '14px' }}>
                    Resend OTP in {resendTimer}s
                  </p>
                ) : (
                  <span
                    style={{
                      color: '#4ecdc4',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none'
                    }}
                    onClick={handleResendOTP}
                    onMouseOver={(e) => {
                      e.target.style.color = '#45b7aa';
                      e.target.style.textDecoration = 'underline';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = '#4ecdc4';
                      e.target.style.textDecoration = 'none';
                    }}
                  >
                    Resend OTP
                  </span>
                )}

                <span
                  style={{
                    color: '#ff6b6b',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onClick={() => {
                    setSignupStep(1);
                    setSignupOtp('');
                    setResendTimer(0);
                    setStatusMessage('');
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#ff5252';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = '#ff6b6b';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  ← Change Email
                </span>
              </div>
            </>
          ) : (
            <>
              <form className="email-form" onSubmit={handleSubmit}>
                {mode === 'signup' && (
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
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
                    onClick={() => {
                      setMode('forgot');
                      setStatusMessage('');
                    }}
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
                    onClick={() => {
                      setMode('signup');
                      setStatusMessage('');
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
                    onClick={() => {
                      setMode('login');
                      setStatusMessage('');
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