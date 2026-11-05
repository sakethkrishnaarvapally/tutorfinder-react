import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function StudentNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="student-navbar">
      <div className="student-logo">
        <span>📚</span>
        <strong>
          Tutor<span>Finder</span>
        </strong>
      </div>

      <nav>
        <Link to="/student" className="active">
          Dashboard
        </Link>
        <a href="#" onClick={(e) => e.preventDefault()}>
          My Requests
        </a>
        <a href="#" onClick={(e) => e.preventDefault()}>
          My Reviews
        </a>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>
    </header>
  );
}
