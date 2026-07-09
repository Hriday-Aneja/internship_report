/* ============================================================
   AUTH HELPERS — WWRAMS
   Reads the logged-in user that Login.jsx stores in localStorage
   under "currentUser". Always returns a safe object, so components
   never crash if the key is missing or corrupted.
   ============================================================ */

const FALLBACK_USER = {
  fullName: "User",
  employeeId: "",
  email: "",
  department: "",
  designation: "",
};

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return FALLBACK_USER;
    const parsed = JSON.parse(raw);
    return { ...FALLBACK_USER, ...parsed };
  } catch {
    return FALLBACK_USER;
  }
}

/* First letter of the user's name, uppercased — for the avatar bubble. */
export function getInitial(name) {
  const trimmed = (name || "").trim();
  return trimmed ? trimmed[0].toUpperCase() : "U";
}