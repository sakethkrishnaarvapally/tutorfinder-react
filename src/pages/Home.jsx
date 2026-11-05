import { Link } from "react-router-dom";

const features = [
  { icon: "🔎", color: "blue-icon", title: "Easy Tutor Search", text: "Search tutors by subject, location and availability." },
  { icon: "🎓", color: "green-icon", title: "Qualified Tutors", text: "View tutor qualifications, experience and expertise." },
  { icon: "💰", color: "orange-icon", title: "Affordable Fees", text: "Compare tutor fees and choose according to your budget." },
  { icon: "⭐", color: "purple-icon", title: "Reviews & Ratings", text: "Check ratings and reviews before choosing a tutor." },
];

const steps = [
  { title: "Create Account", text: "Register as a student or tutor." },
  { title: "Search Tutor", text: "Search using subject and location." },
  { title: "View Profile", text: "Check qualifications, fees and reviews." },
  { title: "Send Request", text: "Send a request and start learning." },
];

const stats = [
  { value: "100+", label: "Qualified Tutors" },
  { value: "20+", label: "Subjects" },
  { value: "500+", label: "Students" },
];

export default function Home() {
  return (
    <>
      {/* NAVIGATION BAR */}
      <header className="navbar">
        <div className="logo">
          <span className="logo-icon">📚</span>
          <span>
            Tutor<span className="blue">Finder</span>
          </span>
        </div>

        <nav>
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/login">Login</Link>
          <Link to="/signup" className="nav-signup">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <div className="small-title">🎓 PERSONALIZED LEARNING</div>

          <h1>
            Find the Right Tutor
            <span>For Your Learning</span>
          </h1>

          <p>
            Connect with qualified home tutors based on subject, location,
            availability and fees.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="btn primary-btn">
              🔎 Find a Tutor
            </Link>
            <Link to="/signup" className="btn secondary-btn">
              👨‍🏫 Become a Tutor
            </Link>
          </div>

          <div className="hero-stats">
            {stats.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-image">
          <div className="learning-illustration">
            <div className="person teacher">👨‍🏫</div>
            <div className="book-stack">📚</div>
            <div className="person student">👩‍🎓</div>
            <div className="floating-card card-one">⭐ 4.9 Rating</div>
            <div className="floating-card card-two">🎓 Qualified Tutor</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section">
        <div className="section-heading">
          <span>OUR FEATURES</span>
          <h2>Everything You Need to Learn Better</h2>
          <p>Find the right tutor and make your learning experience easier.</p>
        </div>

        <div className="feature-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className={`feature-icon ${f.color}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="how-section">
        <div className="section-heading">
          <span>SIMPLE PROCESS</span>
          <h2>How TutorFinder Works</h2>
          <p>Get connected with the right tutor in just a few simple steps.</p>
        </div>

        <div className="steps">
          {steps.map((s, i) => (
            <div className="step" key={s.title}>
              <div className="step-number">{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-section">
        <div>
          <h2>Ready to Start Learning?</h2>
          <p>Find a qualified tutor who matches your learning requirements.</p>
        </div>

        <Link to="/signup" className="cta-button">
          Get Started →
        </Link>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-content">
          <div>
            <div className="footer-logo">📚 TutorFinder</div>
            <p>Connecting students with the right tutors.</p>
          </div>

          <div>
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>

          <div>
            <h3>Platform</h3>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
          </div>
        </div>

        <div className="copyright">© 2026 TutorFinder. All Rights Reserved.</div>
      </footer>
    </>
  );
}
