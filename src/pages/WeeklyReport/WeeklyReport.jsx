import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WeeklyReport.css";
import {
  STORAGE_KEYS,
  createId,
  getStoredArray,
  normalizeActivity,
  removeStoredValue,
  setStoredValue
} from "../../utils/constants";
import { formatDate, formatDateRange } from "../../utils/formatDate";
import { getCurrentEmployee } from "../../utils/auth";

const createEmptyDraft = () => ({
  fromDate: "",
  toDate: "",
  deliverables: "",
  challenges: "",
  nextWeekPlan: "",
  remarks: ""
});

const loadReportDraft = () => {
  if (typeof window === "undefined") {
    return createEmptyDraft();
  }

  const savedDraft = window.localStorage.getItem(STORAGE_KEYS.reportDraft);

  if (!savedDraft) {
    return createEmptyDraft();
  }

  try {
    const parsedDraft = JSON.parse(savedDraft);

    return {
      fromDate: parsedDraft.fromDate ?? "",
      toDate: parsedDraft.toDate ?? "",
      deliverables: parsedDraft.deliverables ?? "",
      challenges: parsedDraft.challenges ?? "",
      nextWeekPlan: parsedDraft.nextWeekPlan ?? "",
      remarks: parsedDraft.remarks ?? "",
    };
  } catch {
    return createEmptyDraft();
  }
};

function WeeklyReport() {
  const employee = getCurrentEmployee();
  const navigate = useNavigate();
  const [reportDraft, setReportDraft] = useState(loadReportDraft);
  const [activities, setActivities] = useState(() =>
    getStoredArray(STORAGE_KEYS.activities)
      .map(normalizeActivity)
      .filter((activity) => activity.title.trim())
  );

  useEffect(() => {
    setStoredValue(STORAGE_KEYS.reportDraft, reportDraft);
  }, [reportDraft]);

  useEffect(() => {
    const syncActivities = () => {
      setActivities(
        getStoredArray(STORAGE_KEYS.activities)
          .map(normalizeActivity)
          .filter((activity) => activity.title.trim())
      );
    };

    syncActivities();
    window.addEventListener("storage", syncActivities);
    window.addEventListener("wwrams:activities-updated", syncActivities);

    return () => {
      window.removeEventListener("storage", syncActivities);
      window.removeEventListener("wwrams:activities-updated", syncActivities);
    };
  }, []);

  const completedCount = useMemo(
    () => activities.filter((activity) => activity.title.trim() && activity.status === "Completed").length,
    [activities]
  );

  const inProgressCount = useMemo(
    () => activities.filter((activity) => activity.title.trim() && activity.status === "In Progress").length,
    [activities]
  );

  const pendingCount = useMemo(
    () => activities.filter((activity) => activity.title.trim() && activity.status === "Pending").length,
    [activities]
  );

  const totalHoursWorked = useMemo(
    () =>
      activities.reduce((sum, activity) => {
        const numericHours = Number(activity.hours);

        return Number.isFinite(numericHours) ? sum + numericHours : sum;
      }, 0),
    [activities]
  );

  const updateDraftField = (field, value) => {
    setReportDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const hasActivities = activities.length > 0;
    const requiredFieldsFilled =
      reportDraft.fromDate &&
      reportDraft.toDate &&
      reportDraft.deliverables.trim() &&
      reportDraft.challenges.trim() &&
      reportDraft.nextWeekPlan.trim();

    if (!hasActivities) {
      alert("Add activities first from the Activities page.");
      return;
    }

    if (!requiredFieldsFilled) {
      alert("Please fill the week duration, deliverables, challenges, and next week plan.");
      return;
    }

    const submittedReport = {
      reportId: createId("RPT"),
      status: "Submitted",
      employee,
      weekDuration: {
        fromDate: reportDraft.fromDate,
        toDate: reportDraft.toDate,
        label: formatDateRange(reportDraft.fromDate, reportDraft.toDate),
      },
      activities: activities.map((activity) => {
        const { isEditing, ...reportActivity } = activity;
        return reportActivity;
      }),
      activityCount: activities.length,
      totalHoursWorked,
      deliverables: reportDraft.deliverables.trim(),
      challenges: reportDraft.challenges.trim(),
      nextWeekPlan: reportDraft.nextWeekPlan.trim(),
      remarks: reportDraft.remarks.trim(),
      submissionDateTime: new Date().toISOString(),
    };

    const storedReports = getStoredArray(STORAGE_KEYS.reports);
    setStoredValue(STORAGE_KEYS.reports, [...storedReports, submittedReport]);
    removeStoredValue(STORAGE_KEYS.reportDraft);

    navigate("/reports", { replace: true });
  };

  const activitySummary = [
    {
      label: "Completed",
      value: completedCount,
      className: "completed-circle",
    },
    {
      label: "In Progress",
      value: inProgressCount,
      className: "progress-circle",
    },
    {
      label: "Pending",
      value: pendingCount,
      className: "pending-circle",
    },
  ];

  return (
    <div className="weekly-report">
      <section className="report-hero">
        <div>
          <p className="eyebrow">Government portal workflow</p>
          <h1>Create Weekly Report</h1>
          <p className="subtitle">
            Weekly activities are loaded automatically from local storage. Complete the report details and submit to
            save it in your reports history.
          </p>
        </div>

        <div className="hero-stats">
          {activitySummary.map((item) => (
            <div key={item.label} className={`status-circle ${item.className}`}>
              <span className="stat-label">{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Employee Details</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Employee ID</label>
            <input type="text" value={employee.id} readOnly />
          </div>

          <div className="form-group">
            <label>Employee Name</label>
            <input type="text" value={employee.name} readOnly />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input type="text" value={employee.department} readOnly />
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input type="text" value={employee.designation} readOnly />
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Week Duration</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>From Date</label>
            <input
              type="date"
              value={reportDraft.fromDate}
              onChange={(event) => updateDraftField("fromDate", event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>To Date</label>
            <input
              type="date"
              value={reportDraft.toDate}
              onChange={(event) => updateDraftField("toDate", event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Activities Performed</h2>

        {activities.length > 0 ? (
          <div className="table-wrap">
            <table className="activity-table report-table">
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
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.title || "-"}</td>
                    <td>{activity.project || "-"}</td>
                    <td>{formatDate(activity.date)}</td>
                    <td>{activity.hours || "-"}</td>
                    <td>{activity.status}</td>
                    <td>{activity.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-report-state">
            No activities found. Add activities from the Activities page before creating a weekly report.
          </div>
        )}
      </section>

      <section className="section">
        <h2>Report Details</h2>

        <div className="form-grid report-text-grid">
          <div className="form-group full-width">
            <label>Deliverables</label>
            <textarea
              rows="4"
              value={reportDraft.deliverables}
              onChange={(event) => updateDraftField("deliverables", event.target.value)}
              placeholder="Summarize the completed deliverables"
            />
          </div>

          <div className="form-group full-width">
            <label>Challenges</label>
            <textarea
              rows="4"
              value={reportDraft.challenges}
              onChange={(event) => updateDraftField("challenges", event.target.value)}
              placeholder="Note blockers, risks, or issues"
            />
          </div>

          <div className="form-group full-width">
            <label>Next Week Plan</label>
            <textarea
              rows="4"
              value={reportDraft.nextWeekPlan}
              onChange={(event) => updateDraftField("nextWeekPlan", event.target.value)}
              placeholder="Outline goals for the next week"
            />
          </div>

          <div className="form-group full-width">
            <label>Remarks</label>
            <textarea
              rows="3"
              value={reportDraft.remarks}
              onChange={(event) => updateDraftField("remarks", event.target.value)}
              placeholder="Optional remarks"
            />
          </div>
        </div>
      </section>

      <div className="button-group">
        <button className="draft-btn" type="button" onClick={handleSubmit}>
          Create Report
        </button>

        <button className="submit-btn" type="button" onClick={handleSubmit}>
          Submit Report
        </button>
      </div>
    </div>
  );
}

export default WeeklyReport;