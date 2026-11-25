const USERS_KEY = "users";
const SESSION_KEY = "currentUser";

// ---------- Generic Helpers ----------

export const read = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Storage error:", error);
  }
};

export const remove = (key) => localStorage.removeItem(key);

const readList = (key) => {
  const data = read(key, []);
  return Array.isArray(data) ? data : [];
};

// ---------- Users ----------

export const getUsers = () => readList(USERS_KEY);

export const saveUsers = (users) => write(USERS_KEY, users);

// Default admin account
export const ensureAdmin = () => {
  const users = getUsers();

  if (!users.some((u) => u.role === "admin")) {
    saveUsers([
      ...users,
      {
        id: 1,
        name: "Admin",
        email: "admin@tutorfinder.com",
        password: "admin123",
        role: "admin",
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ]);
  }
};

// Create student or tutor account
export const addUser = (data) => {
  const { name, email, password, role } = data;
  const users = getUsers();

  const cleanEmail = email.trim().toLowerCase();
  const cleanRole =
    String(role).toLowerCase() === "tutor" ? "tutor" : "student";

  if (users.some((u) => u.email?.toLowerCase() === cleanEmail)) {
    return {
      ok: false,
      error: "An account with this email already exists.",
    };
  }

  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: cleanEmail,
    password,
    role: cleanRole,
    status: cleanRole === "tutor" ? "pending" : "active",
    createdAt: new Date().toISOString(),

    ...(cleanRole === "tutor" && {
      subject: data.subject?.trim() || "",
      qualification: data.qualification?.trim() || "",
      experience: data.experience?.trim() || "",
      location: data.location?.trim() || "",
      fee: Number(data.fee) || 0,
      availability: data.availability || "",
      rating: "New",
    }),
  };

  saveUsers([...users, newUser]);

  return { ok: true, user: newUser };
};

// Find user during login
export const findUser = (email, password) =>
  getUsers().find(
    (u) =>
      u.email?.toLowerCase() === email.trim().toLowerCase() &&
      u.password === password
  ) || null;

// Update user
export const updateUser = (id, changes) => {
  const users = getUsers().map((u) =>
    String(u.id ?? u._id) === String(id)
      ? { ...u, ...changes, id: u.id ?? u._id }
      : u
  );

  saveUsers(users);
  const updated = users.find(
    (u) => String(u.id ?? u._id) === String(id)
  ) || null;

  // Notify other components in this tab to reload registered tutor data.
  if (updated) {
    window.dispatchEvent(new CustomEvent("usersUpdated"));
  }

  return updated;
};

// Delete user
export const removeUser = (id) =>
  saveUsers(getUsers().filter((u) => u.id !== id));

// ---------- Session ----------

export const getSession = () => read(SESSION_KEY, null);

export const setSession = (user) => {
  const { password, ...safe } = user;
  write(SESSION_KEY, safe);
  return safe;
};

export const clearSession = () => remove(SESSION_KEY);

// Initialize application
export const seedData = () => ensureAdmin();