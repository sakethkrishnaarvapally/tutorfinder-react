
import { read, write } from "./storage.js";

const REQUESTS_KEY = "requests";

// Notify dashboards in the same tab
const notifyRequestsChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("requestsUpdated"));
  }
};

// Get all requests
export const getRequests = () => {
  const data = read(REQUESTS_KEY, []);
  return Array.isArray(data) ? data : [];
};

// Save requests
export const saveRequests = (requests) => {
  write(REQUESTS_KEY, requests);
  notifyRequestsChanged();
};

// Create student-to-tutor request
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
export const sendTutorRequest = (data, user) => {
  return addRequest({
    studentId: user?.id ?? user?._id ?? data.studentId,
    studentName: user?.name ?? data.studentName,
    tutorId: data.id ?? data._id ?? data.tutorId,
    tutorName: data.name ?? data.tutorName,
    subject: data.subject,
    message: data.message || "",
  });
};

// Update request status
export const updateRequestStatus = (id, status) => {
  const validStatuses = ["pending", "accepted", "rejected"];

  if (!validStatuses.includes(status)) {
    return false;
  }

  const requests = getRequests();

  const updatedRequests = requests.map((r) =>
    String(r.id) === String(id)
      ? { ...r, status }
      : r
  );

  saveRequests(updatedRequests);
  return true;
};

// Get requests for student
export const getRequestsForStudent = (studentId) =>
  getRequests().filter(
    (r) => String(r.studentId) === String(studentId)
  );

// Get requests for tutor
export const getRequestsForTutor = (tutorId) =>
  getRequests().filter(
    (r) => String(r.tutorId) === String(tutorId)
  );

// Check pending request
export const hasPendingRequest = (studentId, tutorId) =>
  getRequests().some(
    (r) =>
      String(r.studentId) === String(studentId) &&
      String(r.tutorId) === String(tutorId) &&
      r.status === "pending"
  );

// Delete request
export const deleteRequest = (id) => {
  saveRequests(
    getRequests().filter(
      (r) => String(r.id) !== String(id)
    )
  );
};
