
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "student",
    subject: "",
    qualification: "",
    experience: "",
    location: "",
    fee: "",
    availability: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (form.role === "tutor") {
      if (
        !form.subject ||
        !form.qualification ||
        !form.experience ||
        !form.location ||
        !form.fee ||
        !form.availability
      ) {
        setError("Please complete all tutor profile fields.");
        return;
      }
    }

    const result = signup(form);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    alert(
      form.role === "tutor"
        ? "Tutor account created! Wait for admin approval."
        : "Account created! Please log in."
    );

    navigate("/login");
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Create account</h1>
        <p className="signup-sub">
          Join TutorFinder as a student or a tutor.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Full name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label>Email address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>I am a</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
          </select>

          {form.role === "tutor" && (
            <>
              <h3>Tutor Profile Details</h3>

              <label>Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g. Mathematics"
                required
              />

              <label>Qualification</label>
              <input
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                placeholder="e.g. M.Sc Mathematics"
                required
              />

              <label>Experience</label>
              <input
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="e.g. 3 Years"
                required
              />

              <label>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Hyderabad"
                required
              />

              <label>Fee per hour (₹)</label>
              <input
                type="number"
                name="fee"
                min="1"
                value={form.fee}
                onChange={handleChange}
                placeholder="e.g. 500"
                required
              />

              <label>Availability</label>
              <select
                name="availability"
                value={form.availability}
                onChange={handleChange}
                required
              >
                <option value="">Select availability</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Weekend">Weekend</option>
              </select>
            </>
          )}

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            required
          />

          <label>Confirm password</label>
          <input
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            placeholder="Re-enter your password"
            required
          />

          {error && <p className="signup-error">{error}</p>}

          <button type="submit">Create account</button>
        </form>

        <p className="signup-foot">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        <p className="signup-foot">
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
