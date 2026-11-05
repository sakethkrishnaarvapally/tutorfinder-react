import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, saveUsers } from "../utils/storage";
import { getRequests, saveRequests } from "../utils/requests";
import { useAuth } from "../context/AuthContext";
import "./AdminDashboard.css";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleString() : "Before tracking";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  const loadData = useCallback(() => {
    setUsers(getUsers());
    setRequests(getRequests());
  }, []);

  useEffect(() => {
    loadData();
    // Update when another tab changes data, and re-check every 3 seconds.
    window.addEventListener("storage", loadData);
    const timer = setInterval(loadData, 3000);
    return () => {
      window.removeEventListener("storage", loadData);
      clearInterval(timer);
    };
  }, [loadData]);

  const students = users.filter((u) => u.role?.toLowerCase() === "student");
  const tutors = users.filter((u) => u.role?.toLowerCase() === "tutor");
  const activeTutors = tutors.filter((t) =>
    ["approved", "active"].includes(t.status?.toLowerCase())
  );
  const pendingRequests = requests.filter(
    (r) => r.status?.toLowerCase() === "pending"
  );

  const recent = [...users]
    .filter((u) => u.role?.toLowerCase() !== "admin")
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const deleteUser = (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    saveUsers(users.filter((u) => u.id !== id));
    loadData();
  };

  const approveTutor = (id) => {
    saveUsers(users.map((u) => (u.id === id ? { ...u, status: "approved" } : u)));
    loadData();
  };

  const updateRequest = (id, status) => {
    saveRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
    loadData();
  };

  const { logout: authLogout } = useAuth();
  const logout = () => {
    authLogout();
    navigate("/login");
  };

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="admin-page">
      <header className="admin-nav">
        <div className="admin-brand">
          Tutor<span>Finder</span>
        </div>
        <nav>
          <button onClick={() => scrollTo("top")}>Dashboard</button>
          <button onClick={() => scrollTo("users")}>Users</button>
          <button onClick={() => scrollTo("tutors")}>Tutors</button>
          <button onClick={() => scrollTo("requests")}>Requests</button>
          <button className="admin-logout" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="admin-main" id="top">
        <section className="admin-hero">
          <p className="admin-eyebrow">Administration</p>
          <h1>Admin Dashboard</h1>
          <p>Manage students, tutors and platform activities from one place.</p>
        </section>

        <section className="admin-stats">
          <div className="stat-card">
            <span>Total Students</span>
            <strong>{students.length}</strong>
          </div>
          <div className="stat-card">
            <span>Total Tutors</span>
            <strong>{tutors.length}</strong>
          </div>
          <div className="stat-card">
            <span>Pending Requests</span>
            <strong>{pendingRequests.length}</strong>
          </div>
          <div className="stat-card">
            <span>Active Tutors</span>
            <strong>{activeTutors.length}</strong>
          </div>
        </section>

        <section className="admin-panel" id="users">
          <div className="panel-head">
            <h2>Registered Students</h2>
            <button className="refresh-btn" onClick={loadData}>
              Refresh
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty">
                      No students have registered yet.
                    </td>
                  </tr>
                ) : (
                  students.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>Student</td>
                      <td>
                        <button
                          className="btn-danger"
                          onClick={() => deleteUser(u.id, u.name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-panel" id="tutors">
          <div className="panel-head">
            <h2>Registered Tutors</h2>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tutors.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty">
                      No tutors have registered yet.
                    </td>
                  </tr>
                ) : (
                  tutors.map((u) => {
                    const approved = ["approved", "active"].includes(
                      u.status?.toLowerCase()
                    );
                    return (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={approved ? "tag-ok" : "tag-wait"}>
                            {approved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="actions">
                          {!approved && (
                            <button
                              className="btn-ok"
                              onClick={() => approveTutor(u.id)}
                            >
                              Approve
                            </button>
                          )}
                          <button
                            className="btn-danger"
                            onClick={() => deleteUser(u.id, u.name)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-panel" id="requests">
          <div className="panel-head">
            <h2>Tutor Requests</h2>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Tutor</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty">
                      No requests yet.
                    </td>
                  </tr>
                ) : (
                  requests.map((r, i) => (
                    <tr key={r.id ?? i}>
                      <td>{r.studentName || r.student || "-"}</td>
                      <td>{r.tutorName || r.tutor || "-"}</td>
                      <td>{r.subject || "-"}</td>
                      <td>{r.status || "pending"}</td>
                      <td className="actions">
                        {(r.status || "pending").toLowerCase() === "pending" && (
                          <>
                            <button
                              className="btn-ok"
                              onClick={() => updateRequest(r.id, "accepted")}
                            >
                              Accept
                            </button>
                            <button
                              className="btn-danger"
                              onClick={() => updateRequest(r.id, "rejected")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-panel" id="recent">
          <div className="panel-head">
            <h2>Recently Registered</h2>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty">
                      No registrations yet.
                    </td>
                  </tr>
                ) : (
                  recent.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td className="cap">{u.role}</td>
                      <td>{formatDate(u.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}