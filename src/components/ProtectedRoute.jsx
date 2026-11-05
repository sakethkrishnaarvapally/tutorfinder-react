import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HOME_BY_ROLE = {
  student: "/student",
  tutor: "/tutor",
  admin: "/admin",
};

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  // Not logged in: go to login.
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but wrong role: send them to their own dashboard.
  if (role && user.role !== role) {
    return <Navigate to={HOME_BY_ROLE[user.role] || "/login"} replace />;
  }

  return children;
}