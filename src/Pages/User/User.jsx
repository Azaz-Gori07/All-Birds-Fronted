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

  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const isValidGmail = form.email.endsWith('@gmail.com');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidGmail) return alert("Please enter a valid Gmail address");
    if (!form.password) return alert("Please enter your password");

    try {
      setLoading(true);
      const url = isSignup ? "api/auth/signup" : "/api/auth/login";

      const res = await apiFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) return alert(data.error || "Something went wrong");

      if (isSignup) {
        alert("Signup successful! Now login.");
        setIsSignup(false);
        return;
      }

      // ✅ Use token from response
      const token = data.token;
      const decoded = jwtDecode(token);
      console.log("Decoded:", decoded);

      // ✅ store everything in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("user", JSON.stringify({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      }));

      // ✅ redirect based on role
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

  return (
    <div className="full-page">
      <div className="login-page">
        <div className="logo-container">
          <img src="Allbirds_logo.png" alt="All Birds Logo" />
        </div>

        <div className="sign-in-container">
          <h1>{isSignup ? "Sign up" : "Sign in"}</h1>
          <p>{isSignup ? "Create your account" : "Choose how you'd like to sign in"}</p>
        </div>

        <div className="email-container">
          <form className="email-form" onSubmit={handleSubmit}>
            {isSignup && (
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
              {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
            </button>
          </form>

          <p>
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default User;
