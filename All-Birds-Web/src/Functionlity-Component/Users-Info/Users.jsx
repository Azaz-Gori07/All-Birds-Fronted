import React, { useState, useEffect } from "react";
import "./Users.css";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [adminPage, setAdminPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const rowsPerPage = 5;

  // ===== Edit modal states =====
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

  // ===== Create modal states =====
  const [createUser, setCreateUser] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("user");

  // ===== Fetch users =====
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const adminUsers = users.filter(
    (u) => u.role === "admin" || u.role === "superadmin"
  );
  const defaultUsers = users.filter((u) => u.role === "user");

  const filterData = (data) =>
    data.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

  const paginate = (data, page) => {
    const startIndex = (page - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  };

  const createNewUser = async () => {
  try {
    const token = localStorage.getItem("token"); // 👈 make sure token exists
    if (!token) {
      alert("You are not logged in or token expired!");
      return;
    }

    const res = await fetch("/api/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ send token
      },
      body: JSON.stringify({
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
      }),
    });
console.log(res);

    if (!res.ok) throw new Error(`Creation failed: ${res.status}`);

    const newUser = await res.json();
    setUsers((prev) => [...prev, newUser]);
    setCreateUser(false);

    // reset form
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("user");
  } catch (err) {
    console.error(err);
    alert(err.message || "Creation failed");
  }
};


  // ===== Delete User =====
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // ===== Start Edit =====
  const startEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  // ===== Save Edit =====
  const saveEdit = async () => {
    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          role: editRole,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();

      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? updated : u))
      );
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // ===== Table Renderer =====
  const renderTable = (data, columns, title, page, setPage, showRole = true) => {
    const filtered = filterData(data);
    const paginated = paginate(filtered, page);
    const totalPages = Math.ceil(filtered.length / rowsPerPage);

    return (
      <div className="users-section">
        <h3 className="users-subheading">{title}</h3>
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th key={i}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length ? (
                paginated.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    {showRole && <td className="capitalize">{user.role}</td>}
                    <td className="actions-cell">
                      <button className="edit-btn" onClick={() => startEdit(user)}>
                        ✏ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="no-data">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              ⬅ Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next ➡
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="users-container">
      <h2 className="users-heading">👥 Users Management</h2>

      {/* Search & Create */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setAdminPage(1);
            setUserPage(1);
          }}
        />
        <button
          className="create-user"
          onClick={() => {
            // reset create form every time you open
            setNewName("");
            setNewEmail("");
            setNewPassword("");
            setNewRole("user");
            setCreateUser(true);
          }}
        >
          Create User
        </button>
      </div>

      {renderTable(
        adminUsers,
        ["ID", "Name", "Email", "Role", "Actions"],
        "🛡 Admins & Super Admins",
        adminPage,
        setAdminPage,
        true
      )}

      {renderTable(
        defaultUsers,
        ["ID", "Name", "Email", "Actions"],
        "👤 Default Users",
        userPage,
        setUserPage,
        false
      )}

      {/* ===== Edit Modal ===== */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit User</h3>
            <label>
              Name:
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </label>
            <label>
              Role:
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </label>
            <div className="modal-actions">
              <button onClick={saveEdit} className="save-btn">Save</button>
              <button onClick={() => setEditingUser(null)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Create Modal ===== */}
      {createUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create User</h3>
            <label>
              Name:
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <label>
              Role:
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </label>
            <div className="modal-actions">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  createNewUser();
                }}
                className="save-btn"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setCreateUser(false);
                  setNewEmail("");
                  setNewName("");
                  setNewPassword("");
                  setNewRole("user");
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
