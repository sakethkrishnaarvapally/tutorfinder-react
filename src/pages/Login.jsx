import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import useBodyClass from "../hooks/useBodyClass.js";

const benefits = [
  { icon: "🎓", title: "Qualified Tutors", text: "Learn from experienced tutors" },
  { icon: "🔍", title: "Easy Tutor Search", text: "Find tutors by subject and location" },
  { icon: "⭐", title: "Trusted Reviews", text: "Check ratings and student reviews" },
];

const homeByRole = {
  student: "/student",
  tutor: "/tutor",
  admin: "/admin",
};

export default function Login() {
  useBodyClass("login-page");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const result = login(email.trim(), password);
    if (!result.ok) {
      alert(result.message);
      return;
    }

    const target = homeByRole[result.user.role];
    if (!target) {
      alert("Invalid user role.");
      return;
    }
    navigate(target);
  }

  return (
    <>
      <header className="navbar">
        <div className="logo">
          <span className="logo-icon">📚</span>
          <span>
            Tutor<span className="blue">Finder</span>
          </span>
        </div>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/signup" className="nav-signup">
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="login-section">
        <div className="login-card">
          {/* LEFT SIDE */}
          <div className="login-left">
            <div className="welcome-icon">🎓</div>
            <h1>Welcome Back!</h1>
            <p>Find the perfect tutor for your learning journey.</p>

            <div className="login-benefits">
              {benefits.map((b) => (
                <div className="benefit" key={b.title}>
                  <span className="benefit-icon">{b.icon}</span>
                  <div>
                    <strong>{b.title}</strong>
                    <small>{b.text}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="login-right">
            <div className="login-heading">
              <h2>Login</h2>
              <p>Login to your TutorFinder account</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="login-input">
                <label htmlFor="loginEmail">Email Address</label>
                <div className="input-wrapper">
                  <span>✉️</span>
                  <input
                    type="email"
                    id="loginEmail"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-input">
                <label htmlFor="loginPassword">Password</label>
                <div className="input-wrapper">
                  <span>🔒</span>
                  <input
                    type="password"
                    id="loginPassword"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-options">
                <label>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>

                <a href="#" onClick={(e) => e.preventDefault()}>
                  Forgot Password?
                </a>
              </div>

              <button type="submit" className="login-submit">
                Login
                <span>→</span>
              </button>
            </form>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <p className="create-account">
              Don't have an account? <Link to="/signup">Create Account</Link>
            </p>

            <Link to="/" className="back-home">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      <footer className="login-footer">
        <p>© 2026 TutorFinder | Connecting Students with Tutors</p>
      </footer>
    </>
  );
}
