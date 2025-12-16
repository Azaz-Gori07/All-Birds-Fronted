import { jwtDecode } from "jwt-decode";

export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000; // current time (seconds)
    if (decoded.exp && decoded.exp > now) {
      return true; // ✅ token abhi valid hai
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      return false; // ❌ expired
    }
  } catch (err) {
    console.error("Invalid token:", err);
    return false;
  }
};
