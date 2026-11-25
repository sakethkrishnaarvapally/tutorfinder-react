import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import useBodyClass from "../hooks/useBodyClass.js";
import { getUsers } from "../utils/storage.js";
import { useEffect, useState } from "react";
import { sendTutorRequest } from "../utils/requests.js";
import StudentNavbar from "../components/StudentNavbar.jsx";
import StudentFooter from "../components/StudentFooter.jsx";
import "./TutorProfile.css";

export default function TutorProfile() {
  useBodyClass("student-page");
  const { id } = useParams();
  const { user } = useAuth();

  const [tutor, setTutor] = useState(() =>
    getUsers().find((item) =>
      String(item.id ?? item._id) === id &&
      item.role?.toLowerCase() === "tutor"
    ) || null
  );

  useEffect(() => {
    const loadTutor = () => {
      const current = getUsers().find((item) =>
        String(item.id ?? item._id) === id &&
        item.role?.toLowerCase() === "tutor"
      ) || null;
      setTutor(current);
    };

    loadTutor();
    window.addEventListener("usersUpdated", loadTutor);
    window.addEventListener("storage", loadTutor);
    return () => {
      window.removeEventListener("usersUpdated", loadTutor);
      window.removeEventListener("storage", loadTutor);
    };
  }, [id]);

  return (
    <>
      <StudentNavbar />

      <main className="tp-wrap">
        <Link to="/student" className="tp-back">
          ← Back to tutors
        </Link>

        {!tutor ? (
          <div className="tp-card tp-missing">
            <div style={{ gridColumn: "1 / -1" }}>
              <h2>Tutor not found</h2>
              <p>This tutor may have been removed.</p>
            </div>
          </div>
        ) : (
          <div className="tp-card">
            <div className="tp-avatar">👨‍🏫</div>

            <div className="tp-details">
              <h1>{tutor.name}</h1>
              <div className="tp-rating">⭐ {tutor.rating}</div>

              <p>
                <strong>📚 Subject:</strong> {tutor.subject}
              </p>
              <p>
                <strong>🎓 Qualification:</strong> {tutor.qualification}
              </p>
              <p>
                <strong>💼 Experience:</strong> {tutor.experience}
              </p>
              <p>
                <strong>📍 Location:</strong> {tutor.location}
              </p>
              <p>
                <strong>🕐 Availability:</strong> {tutor.availability}
              </p>
              {tutor.phone && (
                <p><strong>📞 Phone:</strong> {tutor.phone}</p>
              )}
              {tutor.bio && (
                <p><strong>About:</strong> {tutor.bio}</p>
              )}

              <div className="tp-fee">
                ₹{tutor.fee} <small>per hour</small>
              </div>

              <div>
                <button
                  className="request-btn"
                  onClick={() => alert(sendTutorRequest(tutor, user).message)}
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <StudentFooter />
    </>
  );
}