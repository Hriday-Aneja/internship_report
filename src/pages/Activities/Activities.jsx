import { useEffect, useMemo, useState } from "react";
import "../../components/PageShell/PageShell.css";
import ActivityTable from "../../components/ActivityTable/ActivityTable";
import Toast from "../../components/Toast/Toast";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";


import {
  ACTIVITY_PRIORITIES,
  ACTIVITY_STATUSES,
  STORAGE_KEYS,
  createId,
  normalizeActivity,
  getStoredArray,
  setStoredValue,
} from "../../utils/constants";
import "./Activities.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrash,
  faXmark,
  faFloppyDisk,
  faListCheck,
  faDiagramProject,
  faAlignLeft,
  faCalendarDays,
  faClock,
  faBarsProgress,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";


/* Drafts live in their own storage key so they never pollute the main table
   until the user explicitly clicks "Add". */
const DRAFTS_KEY = "wwrams.activityDrafts";

/* Local date (YYYY-MM-DD) — used as the modal default and as the max
   selectable date, so users can pick today or a past date but never a
   future one. */
function getTodayString() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

function createEmptyForm() {
  return {
    title: "",
    project: "",
    description: "",
    fromDate: getTodayString(),
    date: getTodayString(),
    hours: "",
    status: "Completed",
    priority: "Medium",
  };
}

/* ------------------------------------------------------------------
   MAIN TABLE INTEGRATION
   The "main table" reads from STORAGE_KEYS.activities (WeeklyReport
   and Reports already consume this key). Calling this function appends
   a confirmed activity there and notifies any mounted components via a
   custom window event, so the main table can refresh in the same tab.
   Teammates: listen with
     window.addEventListener("wwrams:activities-updated", handler)
   ------------------------------------------------------------------ */
/* Format a Date as local YYYY-MM-DD (avoids toISOString timezone drift). */
function toDateString(dateObject) {
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* Expand a From→To range into one YYYY-MM-DD string per day (inclusive). */
function getDatesInRange(fromString, toString) {
  const dates = [];
  const [fy, fm, fd] = fromString.split("-").map(Number);
  const [ty, tm, td] = toString.split("-").map(Number);
  const cursor = new Date(fy, fm - 1, fd);
  const end = new Date(ty, tm - 1, td);
  let guard = 0;
  while (cursor <= end && guard < 366) {
    dates.push(toDateString(cursor));
    cursor.setDate(cursor.getDate() + 1);
    guard += 1;
  }
  return dates.length > 0 ? dates : [toString];
}

export function addActivityToMainTable(activity) {
  const mainActivities = getStoredArray(STORAGE_KEYS.activities).map(normalizeActivity);

  /* Multi-day work becomes one entry per day: same activity, each row
     dated to its own day. Single-day work produces exactly one row. */
  const fromDate = activity.fromDate || activity.date;
  const toDate = activity.date;
  const days = getDatesInRange(fromDate, toDate);

  const newRows = days.map((dayString) => ({
    ...normalizeActivity({ ...activity, isEditing: false }),
    id: createId("ACT"),
    date: dayString,
    fromDate: dayString,
    description: activity.description ?? "",
  }));

  setStoredValue(STORAGE_KEYS.activities, [...mainActivities, ...newRows]);
  window.dispatchEvent(new CustomEvent("wwrams:activities-updated"));
  return newRows;
}

function Activities() {
  /* Confirmed activities (the main table data) — used for the KPI row. */
  const [mainActivities, setMainActivities] = useState(() =>
    getStoredArray(STORAGE_KEYS.activities).map(normalizeActivity)
  );

  /* Draft entries saved from the modal but not yet added to the main table. */
  const [drafts, setDrafts] = useState(() =>
    getStoredArray(DRAFTS_KEY).map((draft) => ({
      ...normalizeActivity(draft),
      description: draft.description ?? "",
      fromDate: draft.fromDate ?? draft.date ?? "",
    }))
  );

  /* Modal state */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(createEmptyForm);
  const [formError, setFormError] = useState("");
  const [editingDraftId, setEditingDraftId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingDraftId, setDeletingDraftId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const todayString = getTodayString();

  /* Persist drafts */
  useEffect(() => {
    setStoredValue(DRAFTS_KEY, drafts);
  }, [drafts]);

  /* Keep KPIs in sync when the main table changes (other tabs or same tab). */
  useEffect(() => {
    const refreshMain = () => {
      setMainActivities(getStoredArray(STORAGE_KEYS.activities).map(normalizeActivity));
    };

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEYS.activities) refreshMain();
      if (event.key === DRAFTS_KEY) {
        setDrafts(
          getStoredArray(DRAFTS_KEY).map((draft) => ({
            ...normalizeActivity(draft),
            description: draft.description ?? "",
            fromDate: draft.fromDate ?? draft.date ?? "",
          }))
        );
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("wwrams:activities-updated", refreshMain);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("wwrams:activities-updated", refreshMain);
    };
  }, []);

  /* KPI counts come from the main table (confirmed activities). */
  const totalCount = useMemo(
    () => mainActivities.filter((activity) => activity.title.trim()).length,
    [mainActivities]
  );
  const completedCount = useMemo(
    () => mainActivities.filter((a) => a.title.trim() && a.status === "Completed").length,
    [mainActivities]
  );
  const activeCount = useMemo(
    () => mainActivities.filter((a) => a.title.trim() && a.status === "In Progress").length,
    [mainActivities]
  );
  const pendingCount = useMemo(
    () => mainActivities.filter((a) => a.title.trim() && a.status === "Pending").length,
    [mainActivities]
  );

  /* ---------------- Modal handlers ---------------- */

  const openCreateModal = () => {
    setForm(createEmptyForm());
    setFormError("");
    setEditingDraftId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (draft) => {
    setForm({
      title: draft.title,
      project: draft.project,
      description: draft.description ?? "",
      fromDate: draft.fromDate || draft.date || todayString,
      date: draft.date || todayString,
      hours: draft.hours,
      status: draft.status,
      priority: draft.priority,
    });
    setFormError("");
    setEditingDraftId(draft.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDraftId(null);
    setFormError("");
  };

  const updateForm = (field, value) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      /* If the To date moves earlier than From, pull From along. */
      if (field === "date" && next.fromDate && value && next.fromDate > value) {
        next.fromDate = value;
      }
      return next;
    });
  };

  const handleSave = () => {
    if (!form.title.trim()) return setFormError("Activity title is required.");
    if (!form.project.trim()) return setFormError("Project name is required.");
    if (!form.date) return setFormError("Please choose the To date.");
    if (form.date > todayString) {
      return setFormError("To date cannot be in the future. Choose today or a past date.");
    }
    if (!form.fromDate) return setFormError("Please choose the From date.");
    if (form.fromDate > form.date) {
      return setFormError("From date cannot be after the To date.");
    }
    const hoursNumber = Number(form.hours);
    if (!String(form.hours).trim() || Number.isNaN(hoursNumber) || hoursNumber <= 0) {
      return setFormError("Enter valid hours (greater than 0).");
    }

    if (editingDraftId) {
      setDrafts((current) =>
        current.map((draft) =>
          draft.id === editingDraftId ? { ...draft, ...form } : draft
        )
      );
    } else {
      setDrafts((current) => [...current, { id: createId("ACT"), ...form }]);
    }

    closeModal();
  };

  /* ---------------- Draft card actions ---------------- */

  const handleDeleteDraft = (draftId) => {
    setDrafts((current) => current.filter((draft) => draft.id !== draftId));
    setToastMessage("Activity deleted successfully!");
    setShowToast(true);
    setIsDeleteOpen(false);
    setDeletingDraftId(null);
  };

  const openDeleteDialog = (draftId) => {
    setDeletingDraftId(draftId);
    setIsDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setDeletingDraftId(null);
  };

  const handleAddToMain = (draft) => {
    addActivityToMainTable(draft);
    setDrafts((current) => current.filter((item) => item.id !== draft.id));
  };

  return (
    <div className="page-shell">
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} tone="danger" />}
      <div className="page-shell-header activities-header">
        <div>
          <h1>Activities</h1>
          <p>Create and manage work activities for weekly reporting.</p>
        </div>
        <button type="button" className="activities-add-button" onClick={openCreateModal}>
          <FontAwesomeIcon icon={faPlus} /> Add 
        </button>
      </div>

      <div className="page-shell-card">
        {/* KPI row — all four on one line */}
        <div className="activities-kpis">
          <div className="activities-kpi kpi-total">
            <span>Total</span>
            <strong>{totalCount}</strong>
          </div>
          <div className="activities-kpi kpi-completed">
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>
          <div className="activities-kpi kpi-progress">
            <span>In Progress</span>
            <strong>{activeCount}</strong>
          </div>
          <div className="activities-kpi kpi-pending">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        {/* Draft entries — appear only after the modal is saved */}
        {drafts.length > 0 && (
          <div className="activities-drafts">
            {drafts.map((draft) => (
              <div className="activities-draft-card" key={draft.id}>
                <table className="page-shell-table activities-draft-table">
                  <thead>
                    <tr>
                      <th>Activity Title</th>
                      <th>Project</th>
                      <th>Date</th>
                      <th>Hours</th>
                      <th>Status</th>
                      <th>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{draft.title}</td>
                      <td>{draft.project}</td>
                      <td>
                        {draft.fromDate && draft.fromDate !== draft.date
                          ? `${draft.fromDate} \u2192 ${draft.date}`
                          : draft.date}
                      </td>
                      <td>{draft.hours}</td>
                      <td>{draft.status}</td>
                      <td>{draft.priority}</td>
                    </tr>
                  </tbody>
                </table>

                {draft.description && (
                  <p className="activities-draft-description">
                    <FontAwesomeIcon icon={faAlignLeft} /> {draft.description}
                  </p>
                )}

                <div className="activities-draft-actions">
                  <button
                    type="button"
                    className="page-shell-button primary"
                    onClick={() => handleAddToMain(draft)}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add
                  </button>
                  <button
                    type="button"
                    className="page-shell-button secondary"
                    onClick={() => openEditModal(draft)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} /> Edit
                  </button>
                  <button
                    type="button"
                    className="page-shell-button danger"
                    onClick={() => openDeleteDialog(draft.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vertical modal */}
      {isModalOpen && (
        <div className="activities-modal-backdrop" onClick={closeModal}>
          <div
            className="activities-modal"
            role="dialog"
            aria-modal="true"
            aria-label={editingDraftId ? "Edit activity" : "Add new activity"}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="activities-modal-header">
              <h3>{editingDraftId ? "Edit Activity" : "Add New Activity"}</h3>
              <button
                type="button"
                className="activities-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="activities-modal-body">
              <label className="activities-field">
                <span>Activity Title</span>
                <div className="activities-input-wrap">
                  <FontAwesomeIcon icon={faListCheck} className="activities-input-icon" />
                  <input
                    type="text"
                    value={form.title}
                    placeholder="Enter activity title"
                    onChange={(event) => updateForm("title", event.target.value)}
                  />
                </div>
              </label>


              <label className="activities-field">
                <span>Description</span>
                <div className="activities-input-wrap activities-textarea-wrap">
                  <FontAwesomeIcon icon={faAlignLeft} className="activities-input-icon" />
                  <textarea
                    rows="2"
                    value={form.description}
                    placeholder="Short description of the work"
                    onChange={(event) => updateForm("description", event.target.value)}
                  />
                </div>
              </label>

              <label className="activities-field">
                <span>Project</span>
                <div className="activities-input-wrap">
                  <FontAwesomeIcon icon={faDiagramProject} className="activities-input-icon" />
                  <input
                    type="text"
                    value={form.project}
                    placeholder="Project name"
                    onChange={(event) => updateForm("project", event.target.value)}
                  />
                </div>
              </label>

              <div className="activities-form-grid">
                <label className="activities-field">
                  <span>From</span>
                  <div className="activities-input-wrap">
                    <FontAwesomeIcon icon={faCalendarDays} className="activities-input-icon" />
                    <input
                      type="date"
                      value={form.fromDate}
                      max={form.date || todayString}
                      onChange={(event) => updateForm("fromDate", event.target.value)}
                    />
                  </div>
                </label>

                <label className="activities-field">
                  <span>To</span>
                  <div className="activities-input-wrap">
                    <FontAwesomeIcon icon={faCalendarDays} className="activities-input-icon" />
                    <input
                      type="date"
                      value={form.date}
                      max={todayString}
                      onChange={(event) => updateForm("date", event.target.value)}
                    />
                  </div>
                </label>

                <label className="activities-field">
                  <span>Hours</span>
                  <div className="activities-input-wrap">
                    <FontAwesomeIcon icon={faClock} className="activities-input-icon" />
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={form.hours}
                      placeholder="0.0"
                      onChange={(event) => updateForm("hours", event.target.value)}
                    />
                  </div>
                </label>

                <label className="activities-field">
                  <span>Status</span>
                  <div className="activities-input-wrap">
                    <FontAwesomeIcon icon={faBarsProgress} className="activities-input-icon" />
                    <select
                      value={form.status}
                      onChange={(event) => updateForm("status", event.target.value)}
                    >
                      {ACTIVITY_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                <label className="activities-field">
                  <span>Priority</span>
                  <div className="activities-input-wrap">
                    <FontAwesomeIcon icon={faFlag} className="activities-input-icon" />
                    <select
                      value={form.priority}
                      onChange={(event) => updateForm("priority", event.target.value)}
                    >
                      {ACTIVITY_PRIORITIES.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>

              {formError && <p className="activities-form-error">{formError}</p>}
            </div>

            <div className="activities-modal-footer">
              <button type="button" className="page-shell-button primary" onClick={handleSave}>
                <FontAwesomeIcon icon={faFloppyDisk} /> Save
              </button>
              <button type="button" className="page-shell-button secondary" onClick={closeModal}>
                <FontAwesomeIcon icon={faXmark} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isDeleteOpen} onClose={closeDeleteDialog} fullWidth maxWidth="xs">
        <DialogTitle>Delete Activity</DialogTitle>
        <DialogContent dividers>
          <p>Do you want to delete this activity?</p>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <button type="button" className="page-shell-button secondary" onClick={closeDeleteDialog}>
            Cancel
          </button>
          <button
            type="button"
            className="page-shell-button danger"
            onClick={() => deletingDraftId && handleDeleteDraft(deletingDraftId)}
          >
            Delete
          </button>
        </DialogActions>
      </Dialog>
      <ActivityTable />
    </div>

  );
}

export default Activities;