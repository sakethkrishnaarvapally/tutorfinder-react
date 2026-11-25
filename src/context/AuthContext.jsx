import { createContext, useContext, useState, useEffect } from "react";
import {
  addUser,
  findUser,
  getSession,
  setSession,
  clearSession,
  ensureAdmin,
  updateUser,
} from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Read the saved session on first render, so a refresh keeps you logged in.
  const [user, setUser] = useState(() => getSession());

  useEffect(() => {
    ensureAdmin();
  }, []);

  // Returns { ok: true, user } or { ok: false, error }.
  const login = (email, password) => {
    ensureAdmin();
    const found = findUser(email, password);
    if (!found) {
      return { ok: false, error: "Incorrect email or password." };
    }
    const safe = setSession(found);
    setUser(safe);
    return { ok: true, user: safe };
  };

  // Creates the account but does not log in. Returns { ok } or { ok: false, error }.
  const signup = (data) => addUser(data);

  // Update the logged-in tutor's profile in Local Storage and session.
  const updateProfile = (changes) => {
    if (!user?.id || user.role !== "tutor") {
      return { ok: false, error: "Only a logged-in tutor can update this profile." };
    }

    const updated = updateUser(user.id, changes);
    if (!updated) {
      return { ok: false, error: "Could not update the profile. Please try again." };
    }

    const safeUser = setSession(updated);
    setUser(safeUser);
    return { ok: true, user: safeUser };
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export default AuthContext;