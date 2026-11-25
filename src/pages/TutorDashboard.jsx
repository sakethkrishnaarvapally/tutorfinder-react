import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getRequestsForTutor, updateRequestStatus } from "../utils/requests.js";
import "./TutorDashboard.css";

const schedule = [
  { day: "Monday", time: "5:00 PM - 8:00 PM", available: true },
  { day: "Tuesday", time: "5:00 PM - 8:00 PM", available: true },
  { day: "Wednesday", time: "Not Available", available: false },
  { day: "Thursday", time: "5:00 PM - 8:00 PM", available: true },
  { day: "Friday", time: "5:00 PM - 8:00 PM", available: true },
  { day: "Saturday", time: "10:00 AM - 2:00 PM", available: true },
];

const students = [
  { icon: "👨‍🎓", name: "Rahul", subject: "Mathematics", classes: 8, active: true },
  { icon: "👩‍🎓", name: "Priya", subject: "Mathematics", classes: 6, active: true },
  { icon: "👨‍🎓", name: "Arjun", subject: "Physics", classes: 4, active: false },
];

export default function TutorDashboard() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const tutorId = user?.id ?? user?._id;

  const [requests, setRequests] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileForm, setProfileForm] = useState(() => ({
    name: user?.name || "",
    phone: user?.phone || "",
    subject: user?.subject || "",
    qualification: user?.qualification || "",
    experience: user?.experience || "",
    location: user?.location || "",
    fee: user?.fee ?? "",
    availability: user?.availability || "",
    bio: user?.bio || "",
  }));

  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      phone: user?.phone || "",
      subject: user?.subject || "",
      qualification: user?.qualification || "",
      experience: user?.experience || "",
      location: user?.location || "",
      fee: user?.fee ?? "",
      availability: user?.availability || "",
      bio: user?.bio || "",
    });
  }, [user]);

  function handleProfileInput(event) {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  }

  function openProfileEditor() {
    setProfileMessage("");
    setProfileError("");
    setProfileForm({
      name: user?.name || "",
      phone: user?.phone || "",
      subject: user?.subject || "",
      qualification: user?.qualification || "",
      experience: user?.experience || "",
      location: user?.location || "",
      fee: user?.fee ?? "",
      availability: user?.availability || "",
      bio: user?.bio || "",
    });
    setIsEditingProfile(true);
  }

  function handleProfileSave(event) {
    event.preventDefault();
    setProfileMessage("");
    setProfileError("");

    const required = ["name", "subject", "qualification", "experience", "location", "availability"];
    if (required.some((field) => !String(profileForm[field] || "").trim())) {
      setProfileError("Please complete all required profile fields.");
      return;
    }

    const fee = Number(profileForm.fee);
    if (!Number.isFinite(fee) || fee <= 0) {
      setProfileError("Please enter a valid hourly fee greater than zero.");
      return;
    }

    const result = updateProfile({
      ...profileForm,
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
      subject: profileForm.subject.trim(),
      qualification: profileForm.qualification.trim(),
      experience: profileForm.experience.trim(),
      location: profileForm.location.trim(),
      fee,
      bio: profileForm.bio.trim(),
    });

    if (!result.ok) {
      setProfileError(result.error || "Profile update failed.");
      return;
    }

    setIsEditingProfile(false);
    setProfileMessage("Your profile has been updated successfully.");
  }

  // Load requests belonging to this tutor
  const loadRequests = useCallback(() => {
    if (!tutorId) {
      setRequests([]);
      return;
    }

    setRequests(getRequestsForTutor(tutorId));
  }, [tutorId]);

  // Automatically refresh incoming requests
  useEffect(() => {
    loadRequests();

    window.addEventListener("requestsUpdated", loadRequests);
    window.addEventListener("storage", loadRequests);

    return () => {
      window.removeEventListener("requestsUpdated", loadRequests);
      window.removeEventListener("storage", loadRequests);
    };
  }, [loadRequests]);

  const pendingCount = requests.filter(
    (r) => r.status === "pending"
  ).length;

  const acceptedCount = requests.filter(
    (r) => r.status === "accepted"
  ).length;

  // Accept or reject a student request
  function updateStatus(id, status) {
    const success = updateRequestStatus(id, status);

    if (success) {
      loadRequests();

      alert(
        status === "accepted"
          ? "Student request accepted successfully!"
          : "Student request rejected successfully!"
      );
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="td-page">

      {/* NAVBAR */}
      <header className="td-navbar">

        <div className="td-logo">
          <span>📚</span>

          <div className="td-logo-name">
            Tutor<span>Finder</span>
          </div>
        </div>

        <nav className="td-nav-links">

          <a
            href="#dashboard"
            className="td-active"
            onClick={(e) => e.preventDefault()}
          >
            Dashboard
          </a>

          <a href="#students">Students</a>
          <a href="#requests">Requests</a>
          <a href="#schedule">Schedule</a>

          <button
            className="td-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </nav>
      </header>

      {/* WELCOME */}
      <section className="td-welcome" id="dashboard">

        <div>
          <small>TUTOR DASHBOARD</small>

          <h1>
            Welcome, {user?.name || "Tutor"}! 👋
          </h1>

          <p>
            Manage your students, requests, schedule and teaching profile.
          </p>
        </div>

        <div className="td-welcome-box">

          <div className="td-icon">👨‍🏫</div>

          <div>
            <strong>Teach. Inspire. Grow.</strong>
            <span>Make learning easier for students.</span>
          </div>

        </div>
      </section>

      {/* STATISTICS */}
      <section className="td-stats">

        <div className="td-stat">

          <div className="td-stat-icon td-blue">
            👨‍🎓
          </div>

          <div>
            <span>Total Students</span>
            <strong>{12 + acceptedCount}</strong>
          </div>

        </div>

        <div className="td-stat">

          <div className="td-stat-icon td-green">
            📩
          </div>

          <div>
            <span>Pending Requests</span>
            <strong>{pendingCount}</strong>
          </div>

        </div>

        <div className="td-stat">

          <div className="td-stat-icon td-orange">
            📅
          </div>

          <div>
            <span>Classes This Week</span>
            <strong>8</strong>
          </div>

        </div>

        <div className="td-stat">

          <div className="td-stat-icon td-purple">
            ⭐
          </div>

          <div>
            <span>Rating</span>
            <strong>4.8</strong>
          </div>

        </div>

      </section>

      <main className="td-main">

        {/* STUDENT REQUESTS */}
        <section id="requests" className="td-panel">

          <div className="td-panel-title">

            <div>
              <small>STUDENT REQUESTS</small>
              <h2>Recent Requests</h2>
            </div>

          </div>

          {requests.length === 0 ? (

            <div className="td-empty">

              <div>📩</div>

              <h3>No Student Requests</h3>

              <p>
                New student requests will appear here.
              </p>

            </div>

          ) : (

            [...requests].reverse().map((request) => (

              <div
                className="td-request"
                key={request.id}
              >

                <div className="td-avatar">
                  👨‍🎓
                </div>

                <div className="td-request-info">

                  <h3>{request.studentName}</h3>

                  <p>{request.subject}</p>

                  <small>
                    Requested on{" "}
                    {new Date(request.createdAt).toLocaleDateString()}
                  </small>

                  {request.message && (
                    <p>Message: {request.message}</p>
                  )}

                </div>

                <div
                  className={`td-status ${
                    request.status === "accepted"
                      ? "td-status-accepted"
                      : request.status === "rejected"
                      ? "td-status-rejected"
                      : ""
                  }`}
                >
                  {request.status}
                </div>

                {request.status === "pending" && (

                  <div className="td-buttons">

                    <button
                      className="td-accept"
                      onClick={() =>
                        updateStatus(request.id, "accepted")
                      }
                    >
                      Accept
                    </button>

                    <button
                      className="td-reject"
                      onClick={() =>
                        updateStatus(request.id, "rejected")
                      }
                    >
                      Reject
                    </button>

                  </div>

                )}

              </div>

            ))

          )}

        </section>

        {/* TEACHER PROFILE */}
        <section className="td-panel">

          <div className="td-panel-title">

            <div>
              <small>TEACHER PROFILE</small>
              <h2>My Profile</h2>
            </div>

            <button
              className="td-action"
              type="button"
              onClick={openProfileEditor}
            >
              ✏️ Edit Profile
            </button>

          </div>

          {profileMessage && (
            <div className="td-profile-alert td-profile-success" role="status">
              {profileMessage}
            </div>
          )}

          <div className="td-profile">

            <div className="td-profile-avatar">👨‍🏫</div>

            <div className="td-profile-details">
              <h3>{user?.name || "Tutor"}</h3>
              <p>📚 <b>Subject:</b> {user?.subject || "Not added"}</p>
              <p>🎓 <b>Qualification:</b> {user?.qualification || "Not added"}</p>
              <p>💼 <b>Experience:</b> {user?.experience || "Not added"}</p>
              <p>📍 <b>Location:</b> {user?.location || "Not added"}</p>
              <p>🕐 <b>Availability:</b> {user?.availability || "Not added"}</p>
              {user?.phone && <p>📞 <b>Phone:</b> {user.phone}</p>}
              {user?.bio && <p className="td-profile-bio">{user.bio}</p>}
            </div>

            <div className="td-fee">
              <span>Hourly Fee</span>
              <strong>₹{user?.fee ?? 0}</strong>
              <small>per hour</small>
            </div>

          </div>

          {isEditingProfile && (
            <form className="td-edit-form" onSubmit={handleProfileSave}>
              <div className="td-edit-heading">
                <div>
                  <small>UPDATE YOUR DETAILS</small>
                  <h3>Edit Tutor Profile</h3>
                </div>
                <button type="button" className="td-edit-close" onClick={() => setIsEditingProfile(false)} aria-label="Close edit form">×</button>
              </div>

              {profileError && <div className="td-profile-alert td-profile-error" role="alert">{profileError}</div>}

              <div className="td-edit-grid">
                <label className="td-edit-field">
                  <span>Full Name *</span>
                  <input name="name" value={profileForm.name} onChange={handleProfileInput} required />
                </label>

                <label className="td-edit-field">
                  <span>Email Address</span>
                  <input value={user?.email || ""} disabled />
                  <small>Email is your login ID and cannot be changed here.</small>
                </label>

                <label className="td-edit-field">
                  <span>Phone Number</span>
                  <input name="phone" type="tel" value={profileForm.phone} onChange={handleProfileInput} placeholder="Enter phone number" />
                </label>

                <label className="td-edit-field">
                  <span>Teaching Subject *</span>
                  <input name="subject" value={profileForm.subject} onChange={handleProfileInput} required />
                </label>

                <label className="td-edit-field">
                  <span>Qualification *</span>
                  <input name="qualification" value={profileForm.qualification} onChange={handleProfileInput} placeholder="e.g. M.Sc Mathematics" required />
                </label>

                <label className="td-edit-field">
                  <span>Teaching Experience *</span>
                  <input name="experience" value={profileForm.experience} onChange={handleProfileInput} placeholder="e.g. 5 Years" required />
                </label>

                <label className="td-edit-field">
                  <span>Location *</span>
                  <input name="location" value={profileForm.location} onChange={handleProfileInput} required />
                </label>

                <label className="td-edit-field">
                  <span>Hourly Fee (₹) *</span>
                  <input name="fee" type="number" min="1" step="1" value={profileForm.fee} onChange={handleProfileInput} required />
                </label>

                <label className="td-edit-field">
                  <span>Availability *</span>
                  <select name="availability" value={profileForm.availability} onChange={handleProfileInput} required>
                    <option value="">Select availability</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Weekend">Weekend</option>
                  </select>
                </label>

                <label className="td-edit-field td-edit-full">
                  <span>About Me</span>
                  <textarea name="bio" rows="4" value={profileForm.bio} onChange={handleProfileInput} placeholder="Describe your teaching experience and approach..." />
                </label>
              </div>

              <div className="td-edit-actions">
                <button type="submit" className="td-save-profile">Save Changes</button>
                <button type="button" className="td-cancel-profile" onClick={() => setIsEditingProfile(false)}>Cancel</button>
              </div>
            </form>
          )}

        </section>

        {/* WEEKLY SCHEDULE */}
        <section id="schedule" className="td-panel">

          <div className="td-panel-title">

            <div>
              <small>MY SCHEDULE</small>
              <h2>Weekly Availability</h2>
            </div>

            <button
              className="td-action"
              onClick={() =>
                alert("Schedule editing feature opened.")
              }
            >
              ✏️ Edit Schedule
            </button>

          </div>

          <div className="td-schedule">

            {schedule.map((d) => (

              <div className="td-day" key={d.day}>

                <strong>{d.day}</strong>

                <span>{d.time}</span>

                <small
                  className={
                    d.available
                      ? "td-available"
                      : "td-unavailable"
                  }
                >
                  ● {d.available ? "Available" : "Unavailable"}
                </small>

              </div>

            ))}

          </div>

        </section>

        {/* RECENT STUDENTS */}
        <section id="students" className="td-panel">

          <div className="td-panel-title">

            <div>
              <small>MY STUDENTS</small>
              <h2>Recent Students</h2>
            </div>

          </div>

          <div className="td-table">

            <div className="td-row td-header">
              <span>Student</span>
              <span>Subject</span>
              <span>Classes</span>
              <span>Status</span>
            </div>

            {students.map((s) => (

              <div className="td-row" key={s.name}>

                <span>
                  {s.icon} {s.name}
                </span>

                <span>{s.subject}</span>

                <span>{s.classes}</span>

                <span
                  className={
                    s.active ? "td-active" : "td-pending"
                  }
                >
                  {s.active ? "Active" : "Pending"}
                </span>

              </div>

            ))}

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer>

        <div>
          <strong>📚 TutorFinder</strong>
          <p>Connecting students with qualified tutors.</p>
        </div>

        <p>© 2026 TutorFinder. All Rights Reserved.</p>

      </footer>

    </div>
  );
}