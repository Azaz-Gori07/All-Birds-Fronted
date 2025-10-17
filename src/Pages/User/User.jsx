import React, { useState, useEffect } from "react";
import "./User.css";
import { useNavigate } from "react-router-dom";

function User() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const isValidGmail = form.email.endsWith("@gmail.com");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid JSON in localStorage.user:", err);
        localStorage.removeItem("user");
      }
    }

    if (token && role) {
      if (role === "admin" || role === "superadmin") {
        navigate("/dashboard");
      }
    }
  }, [navigate]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidGmail) {
      alert("Please enter a valid Gmail address");
      return;
    }

    if (!form.password) {
      alert("Please enter your password");
      return;
    }

    try {
      setLoading(true);
      const url = isSignup ? "/api/auth/signup" : "/api/auth/login";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        if (!isSignup) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);

          if (data.role === "admin" || data.role === "superadmin") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        } else {
          alert("Signup successful! Now login.");
          setIsSignup(false);
        }
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="full-page">
      {user ? (
        <div className="user-dashboard">
          <div className="user-box">
            <img
              src={user.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="User Avatar"
              className="user-avatar"
            />
            <div className="user-details">
              <h3>{user.name || "User"}</h3>
              <p>{user.email}</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );

}

export default User;
