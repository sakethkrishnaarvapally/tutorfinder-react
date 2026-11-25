
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import useBodyClass from "../hooks/useBodyClass.js";
import { getUsers } from "../utils/storage.js";
import {
  sendTutorRequest,
  getRequestsForStudent,
} from "../utils/requests.js";
import { sampleTutors } from "../data/tutors.js";
import StudentNavbar from "../components/StudentNavbar.jsx";
import StudentFooter from "../components/StudentFooter.jsx";

const emptyFilters = {
  subject: "",
  location: "",
  availability: "",
};

function matches(tutor, filters) {
  const s = filters.subject.toLowerCase().trim();
  const l = filters.location.toLowerCase().trim();

  return (
    (!s || String(tutor.subject || "").toLowerCase().includes(s)) &&
    (!l || String(tutor.location || "").toLowerCase().includes(l)) &&
    (!filters.availability ||
      tutor.availability === filters.availability)
  );
}

export default function StudentDashboard() {
  useBodyClass("student-page");

  const { user } = useAuth();
  const navigate = useNavigate();

  const studentId = user?.id ?? user?._id;

  const [tutors, setTutors] = useState([]);
  const [requests, setRequests] = useState([]);

  const [form, setForm] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);

  // Load tutors
  const loadTutors = useCallback(() => {
    const users = getUsers();

    const registeredTutors = users
      .filter(
        (u) =>
          u.role?.toLowerCase() === "tutor" &&
          ["approved", "active"].includes(
            u.status?.toLowerCase()
          )
      )
      .map((u) => ({
        ...u,
        id: u.id ?? u._id,
        fee: u.fee || 0,
        rating: u.rating || "New",
      }));

    setTutors([
      ...sampleTutors,
      ...registeredTutors,
    ]);
  }, []);

  // Load student requests
  const loadRequests = useCallback(() => {
    if (!studentId) {
      setRequests([]);
      return;
    }

    setRequests(getRequestsForStudent(studentId));
  }, [studentId]);

  useEffect(() => {
    loadTutors();
    loadRequests();

    window.addEventListener("focus", loadTutors);
    window.addEventListener("storage", loadTutors);
    window.addEventListener("storage", loadRequests);
    window.addEventListener("requestsUpdated", loadRequests);

    return () => {
      window.removeEventListener("focus", loadTutors);
      window.removeEventListener("storage", loadTutors);
      window.removeEventListener("storage", loadRequests);
      window.removeEventListener("requestsUpdated", loadRequests);
    };
  }, [loadTutors, loadRequests]);

  // Search filters
  const update = (field) => (e) =>
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

  const results = tutors.filter((tutor) =>
    matches(tutor, applied)
  );

  // Send request to tutor
  function handleRequest(tutor) {
    if (!user || !studentId) {
      alert("Please log in before sending a request.");
      return;
    }

    const result = sendTutorRequest(tutor, user);

    alert(result.message);

    if (result.ok) {
      loadRequests();
    }
  }

  // Status badge
  function getStatusClass(status) {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "request-accepted";

      case "rejected":
        return "request-rejected";

      default:
        return "request-pending";
    }
  }

  return (
    <>
      <StudentNavbar />

      {/* WELCOME */}
      <section className="student-welcome">
        <div>
          <p className="welcome-label">STUDENT DASHBOARD</p>

          <h1>Welcome back, {user?.name}! 👋</h1>

          <p>
            Find the perfect tutor for your learning needs.
          </p>
        </div>

        <div className="welcome-image">
          <span>🎓</span>

          <div>
            <strong>Learn Smarter</strong>
            <small>Find. Connect. Learn.</small>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="search-section">

        <div className="search-heading">
          <div>
            <span>FIND YOUR TUTOR</span>
            <h2>Search for the Perfect Tutor</h2>
          </div>
        </div>

        <div className="search-box">

          <div className="search-field">
            <label htmlFor="subjectSearch">
              📚 Subject
            </label>

            <input
              id="subjectSearch"
              placeholder="e.g. Mathematics"
              value={form.subject}
              onChange={update("subject")}
            />
          </div>

          <div className="search-field">
            <label htmlFor="locationSearch">
              📍 Location
            </label>

            <input
              id="locationSearch"
              placeholder="e.g. Hyderabad"
              value={form.location}
              onChange={update("location")}
            />
          </div>

          <div className="search-field">
            <label htmlFor="availabilitySearch">
              🕐 Availability
            </label>

            <select
              id="availabilitySearch"
              value={form.availability}
              onChange={update("availability")}
            >
              <option value="">Any time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Weekend">Weekend</option>
            </select>
          </div>

          <button
            className="search-button"
            onClick={() => setApplied(form)}
          >
            🔍 Search
          </button>

        </div>
      </section>

      {/* AVAILABLE TUTORS */}
      <section className="tutor-section">

        <div className="tutor-heading">
          <div>
            <span>AVAILABLE TUTORS</span>
            <h2>Recommended Tutors</h2>
          </div>

          <p>
            Choose a tutor based on your requirements.
          </p>
        </div>

        <div className="tutor-grid">

          {results.length === 0 ? (

            <div className="no-results">
              <div style={{ fontSize: "50px" }}>🔍</div>
              <h3>No Tutors Found</h3>
              <p>Try changing your subject or location.</p>
            </div>

          ) : (

            results.map((tutor) => (

              <div className="tutor-card" key={tutor.id}>

                <div className="tutor-icon">👨‍🏫</div>

                <h3>{tutor.name}</h3>

                <p>
                  <strong>📚 Subject:</strong> {tutor.subject}
                </p>

                <p>
                  <strong>🎓 Qualification:</strong>{" "}
                  {tutor.qualification}
                </p>

                <p>
                  <strong>💼 Experience:</strong>{" "}
                  {tutor.experience}
                </p>

                <p>
                  <strong>📍 Location:</strong>{" "}
                  {tutor.location}
                </p>

                <p>
                  <strong>💰 Fee:</strong> ₹{tutor.fee}/hour
                </p>

                <p>
                  <strong>🕐 Availability:</strong>{" "}
                  {tutor.availability}
                </p>

                <p className="rating">
                  ⭐ {tutor.rating || "New"}
                </p>

                <div className="tutor-buttons">

                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(`/tutors/${tutor.id}`)
                    }
                  >
                    View Profile
                  </button>

                  <button
                    className="request-btn"
                    onClick={() => handleRequest(tutor)}
                  >
                    Send Request
                  </button>

                </div>

              </div>

            ))

          )}

        </div>
      </section>

      {/* MY REQUESTS */}
      <section className="tutor-section" id="my-requests">

        <div className="tutor-heading">
          <div>
            <span>REQUEST MANAGEMENT</span>
            <h2>My Tutor Requests</h2>
          </div>

          <p>Track the status of your tutor requests.</p>
        </div>

        {requests.length === 0 ? (

          <div className="no-results">
            <div style={{ fontSize: "45px" }}>📩</div>

            <h3>No Requests Yet</h3>

            <p>
              Send a request to a tutor to see it here.
            </p>
          </div>

        ) : (

          <div className="my-requests-list">

            {[...requests].reverse().map((request) => (

              <div
                className="tutor-card"
                key={request.id}
              >

                <h3>👨‍🏫 {request.tutorName}</h3>

                <p>
                  <strong>📚 Subject:</strong>{" "}
                  {request.subject}
                </p>

                <p>
                  <strong>📅 Requested:</strong>{" "}
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>

                <p>
                  <strong>📌 Status:</strong>{" "}
                  <span
                    className={getStatusClass(request.status)}
                  >
                    {request.status}
                  </span>
                </p>

                {request.message && (
                  <p>
                    <strong>Message:</strong>{" "}
                    {request.message}
                  </p>
                )}

              </div>

            ))}

          </div>

        )}

      </section>

      <StudentFooter />
    </>
  );
}
