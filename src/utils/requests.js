
import { read, write } from "./storage.js";

const REQUESTS_KEY = "requests";

export const getRequests = () => {
  const data = read(REQUESTS_KEY, []);
  return Array.isArray(data) ? data : [];
};

export const saveRequests = (requests) =>
  write(REQUESTS_KEY, requests);

// Create a student-to-tutor request
export const addRequest = ({
  studentId,
  studentName,
  tutorId,
  tutorName,
  subject,
  message = "",
}) => {
  if (!studentId || !tutorId) {
    return {
      ok: false,
      message: "Please log in before sending a request.",
    };
  }

  const requests = getRequests();

  const exists = requests.some(
    (r) =>
      String(r.studentId) === String(studentId) &&
      String(r.tutorId) === String(tutorId) &&
      r.status === "pending"
  );

  if (exists) {
    return {
      ok: false,
      message: "You already have a pending request for this tutor.",
    };
  }

  const request = {
    id: Date.now(),
    studentId,
    studentName,
    tutorId,
    tutorName,
    subject,
    message,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  saveRequests([...requests, request]);

  return {
    ok: true,
    message: "Tutor request sent successfully!",
    request,
  };
};

// Student dashboard compatibility
export const sendTutorRequest = (data, user) =>
  addRequest({
    studentId: user?.id ?? data.studentId,
    studentName: user?.name ?? data.studentName,
    tutorId: data.id ?? data.tutorId,
    tutorName: data.name ?? data.tutorName,
    subject: data.subject,
    message: data.message || "",
  });

// Update request status
export const updateRequestStatus = (id, status) => {
  saveRequests(
    getRequests().map((r) =>
      r.id === id ? { ...r, status } : r
    )
  );
};

export const getRequestsForStudent = (studentId) =>
  getRequests().filter(
    (r) => String(r.studentId) === String(studentId)
  );

export const getRequestsForTutor = (tutorId) =>
  getRequests().filter(
    (r) => String(r.tutorId) === String(tutorId)
  );

export const hasPendingRequest = (studentId, tutorId) =>
  getRequests().some(
    (r) =>
      String(r.studentId) === String(studentId) &&
      String(r.tutorId) === String(tutorId) &&
      r.status === "pending"
  );

export const deleteRequest = (id) =>
  saveRequests(getRequests().filter((r) => r.id !== id));
