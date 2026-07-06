import { useEffect, useState } from "react";
import PageShell from "../../components/PageShell/PageShell";
import {
  STORAGE_KEYS,
  getStoredArray,
  setStoredValue,
} from "../../utils/constants";
import { formatDate, formatDateTime, formatDateRange } from "../../utils/formatDate";

function Reports() {
  const [reports, setReports] = useState(() => getStoredArray(STORAGE_KEYS.reports));
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    setStoredValue(STORAGE_KEYS.reports, reports);
  }, [reports]);

  useEffect(() => {
    const syncReports = () => {
      setReports(getStoredArray(STORAGE_KEYS.reports));
    };

    syncReports();
    window.addEventListener("storage", syncReports);

    return () => window.removeEventListener("storage", syncReports);
  }, []);

  const totalHours = reports.reduce((sum, report) => sum + Number(report.totalHoursWorked || 0), 0);

  const deleteReport = (reportId) => {
    const shouldDelete = window.confirm("Delete this report from local storage?");

    if (!shouldDelete) {
      return;
    }

    setReports((currentReports) => currentReports.filter((report) => report.reportId !== reportId));

    if (selectedReport?.reportId === reportId) {
      setSelectedReport(null);
    }
  };

  const closeModal = () => setSelectedReport(null);

  const openReport = (report) => setSelectedReport(report);

  return (
    <PageShell title="My Reports" subtitle="Browse every submitted weekly report stored in local storage.">
      <div className="page-shell-card">
        <div className="page-shell-toolbar">
          <div>
            <h2>Submitted Reports</h2>
            <p>All submitted reports persist after refresh and can be reviewed from this page.</p>
          </div>

          <div className="page-shell-kpis">
            <div className="page-shell-kpi">
              <span>Total Reports</span>
              <strong>{reports.length}</strong>
            </div>

            <div className="page-shell-kpi">
              <span>Total Activities</span>
              <strong>{reports.reduce((sum, report) => sum + Number(report.activityCount || 0), 0)}</strong>
            </div>

            <div className="page-shell-kpi">
              <span>Total Hours</span>
              <strong>{totalHours}</strong>
            </div>
          </div>
        </div>

        {reports.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table className="page-shell-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Week Duration</th>
                  <th>Number of Activities</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Total Hours Worked</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr key={report.reportId}>
                    <td>{report.reportId}</td>
                    <td>{report.weekDuration?.label || formatDateRange(report.weekDuration?.fromDate, report.weekDuration?.toDate)}</td>
                    <td>{report.activityCount}</td>
                    <td>{formatDateTime(report.submissionDateTime)}</td>
                    <td>{report.status}</td>
                    <td>{report.totalHoursWorked}</td>
                    <td>
                      <div className="page-shell-actions">
                        <button className="page-shell-button primary" type="button" onClick={() => openReport(report)}>
                          View Report
                        </button>
                        <button className="page-shell-button danger" type="button" onClick={() => deleteReport(report.reportId)}>
                          Delete Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="page-shell-empty-state">No reports have been submitted yet. Create a weekly report to get started.</div>
        )}
      </div>

      {selectedReport ? (
        <div className="page-shell-modal-backdrop" role="presentation" onClick={closeModal}>
          <div className="page-shell-modal" role="dialog" aria-modal="true" aria-labelledby="report-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="page-shell-modal-header">
              <div>
                <h2 id="report-modal-title">Report Information</h2>
                <p>{selectedReport.reportId}</p>
              </div>
              <button className="page-shell-button secondary" type="button" onClick={closeModal}>
                Close
              </button>
            </div>

            <div className="page-shell-modal-content">
              <div className="page-shell-modal-grid">
                <div className="page-shell-modal-card">
                  <span>Week Duration</span>
                  <strong>{formatDateRange(selectedReport.weekDuration?.fromDate, selectedReport.weekDuration?.toDate)}</strong>
                </div>

                <div className="page-shell-modal-card">
                  <span>Submission Date</span>
                  <strong>{formatDateTime(selectedReport.submissionDateTime)}</strong>
                </div>

                <div className="page-shell-modal-card">
                  <span>Status</span>
                  <strong>{selectedReport.status}</strong>
                </div>

                <div className="page-shell-modal-card">
                  <span>Activities</span>
                  <strong>{selectedReport.activityCount}</strong>
                </div>

                <div className="page-shell-modal-card">
                  <span>Total Hours Worked</span>
                  <strong>{selectedReport.totalHoursWorked}</strong>
                </div>

                <div className="page-shell-modal-card">
                  <span>Employee</span>
                  <strong>{selectedReport.employee?.name || "-"}</strong>
                </div>
              </div>

              <h3 className="page-shell-section-title">Activities Included</h3>
              <div style={{ overflowX: "auto" }}>
                <table className="page-shell-table">
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
                    {selectedReport.activities.map((activity) => (
                      <tr key={activity.id}>
                        <td>{activity.title}</td>
                        <td>{activity.project}</td>
                        <td>{formatDate(activity.date)}</td>
                        <td>{activity.hours}</td>
                        <td>{activity.status}</td>
                        <td>{activity.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="page-shell-section-title">Deliverables</h3>
              <div className="page-shell-empty-state">{selectedReport.deliverables || "-"}</div>

              <h3 className="page-shell-section-title">Challenges</h3>
              <div className="page-shell-empty-state">{selectedReport.challenges || "-"}</div>

              <h3 className="page-shell-section-title">Next Week Plan</h3>
              <div className="page-shell-empty-state">{selectedReport.nextWeekPlan || "-"}</div>

              <h3 className="page-shell-section-title">Remarks</h3>
              <div className="page-shell-empty-state">{selectedReport.remarks || "-"}</div>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}

export default Reports;
