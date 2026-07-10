/* ============================================================
   WEEKLY REPORT — PRINT / PDF SUMMARY
   Renders a submitted report as a formal printable document and
   opens the browser print dialog. Choosing "Save as PDF" in that
   dialog produces the PDF the HOD / Centre Head reviews.
   No external dependencies.
   ============================================================ */

import { formatDate, formatDateTime, formatDateRange } from "./formatDate";

/* Escape user-entered text so it renders as text, not markup. */
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function activityRowsHtml(activities) {
  if (!Array.isArray(activities) || activities.length === 0) {
    return `<tr><td colspan="6" class="empty">No activities recorded.</td></tr>`;
  }

  return activities
    .map(
      (activity, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(activity.title)}</td>
          <td>${escapeHtml(activity.project)}</td>
          <td>${escapeHtml(formatDate(activity.date) || activity.date)}</td>
          <td class="center">${escapeHtml(activity.hours)}</td>
          <td>${escapeHtml(activity.status)}</td>
        </tr>`
    )
    .join("");
}

export function printReportPdf(report) {
  if (!report) return;

  const employee = report.employee || {};
  const weekLabel =
    report.weekDuration?.label ||
    formatDateRange(report.weekDuration?.fromDate, report.weekDuration?.toDate);

  const documentHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Weekly Report ${escapeHtml(report.reportId)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Segoe UI", Arial, sans-serif;
      color: #1f2a3d;
      padding: 40px 48px;
      font-size: 13px;
      line-height: 1.5;
    }
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #0f2747;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .doc-header h1 { font-size: 20px; color: #0f2747; }
    .doc-header p { color: #5b6b82; font-size: 12px; }
    .doc-meta { text-align: right; font-size: 12px; color: #5b6b82; }
    .doc-meta strong { color: #0f2747; }
    h2 {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #0f2747;
      border-bottom: 1px solid #d9e2ec;
      padding-bottom: 5px;
      margin: 22px 0 10px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 32px;
    }
    .info-grid p span { color: #5b6b82; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
    }
    th, td {
      border: 1px solid #d9e2ec;
      padding: 7px 9px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #eef3fb;
      color: #0f2747;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    td.center { text-align: center; }
    td.empty { text-align: center; color: #5b6b82; }
    .summary-strip {
      display: flex;
      gap: 14px;
      margin-top: 6px;
    }
    .summary-box {
      flex: 1;
      border: 1px solid #d9e2ec;
      border-left: 4px solid #0f2747;
      border-radius: 6px;
      padding: 10px 14px;
    }
    .summary-box span { display: block; font-size: 11px; color: #5b6b82; text-transform: uppercase; }
    .summary-box strong { font-size: 18px; color: #0f2747; }
    .text-block {
      border: 1px solid #d9e2ec;
      border-radius: 6px;
      padding: 10px 14px;
      min-height: 44px;
      white-space: pre-wrap;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 56px;
    }
    .signature { text-align: center; width: 220px; }
    .signature .line { border-top: 1px solid #1f2a3d; margin-bottom: 6px; }
    .signature p { font-size: 12px; color: #5b6b82; }
    .doc-footer {
      margin-top: 34px;
      padding-top: 10px;
      border-top: 1px solid #d9e2ec;
      font-size: 11px;
      color: #5b6b82;
      text-align: center;
    }
    @media print {
      body { padding: 24px 28px; }
      .summary-strip, .doc-header { break-inside: avoid; }
      tr { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="doc-header">
    <div>
      <h1>Weekly Work Report</h1>
      <p>WWRAMS &middot; Centre for Development of Advanced Computing</p>
    </div>
    <div class="doc-meta">
      <p><strong>Report ID:</strong> ${escapeHtml(report.reportId)}</p>
      <p><strong>Status:</strong> ${escapeHtml(report.status)}</p>
      <p><strong>Submitted:</strong> ${escapeHtml(formatDateTime(report.submissionDateTime))}</p>
    </div>
  </div>

  <h2>Employee Details</h2>
  <div class="info-grid">
    <p><span>Employee ID:</span> <strong>${escapeHtml(employee.id)}</strong></p>
    <p><span>Name:</span> <strong>${escapeHtml(employee.name)}</strong></p>
    <p><span>Department:</span> ${escapeHtml(employee.department)}</p>
    <p><span>Designation:</span> ${escapeHtml(employee.designation)}</p>
  </div>

  <h2>Report Summary</h2>
  <div class="summary-strip">
    <div class="summary-box"><span>Week Duration</span><strong>${escapeHtml(weekLabel)}</strong></div>
    <div class="summary-box"><span>Total Activities</span><strong>${escapeHtml(report.activityCount)}</strong></div>
    <div class="summary-box"><span>Total Hours Worked</span><strong>${escapeHtml(report.totalHoursWorked)}</strong></div>
  </div>

  <h2>Activities Performed</h2>
  <table>
    <thead>
      <tr>
        <th style="width:36px">#</th>
        <th>Activity</th>
        <th>Project</th>
        <th>Date</th>
        <th style="width:60px">Hours</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>${activityRowsHtml(report.activities)}</tbody>
  </table>

  <h2>Deliverables</h2>
  <div class="text-block">${escapeHtml(report.deliverables) || "&mdash;"}</div>

  <h2>Challenges Faced</h2>
  <div class="text-block">${escapeHtml(report.challenges) || "&mdash;"}</div>

  <h2>Next Week Plan</h2>
  <div class="text-block">${escapeHtml(report.nextWeekPlan) || "&mdash;"}</div>

  <div class="signatures">
    <div class="signature">
      <div class="line"></div>
      <p>Employee Signature</p>
    </div>
    <div class="signature">
      <div class="line"></div>
      <p>Reporting Officer / HOD</p>
    </div>
  </div>

  <div class="doc-footer">
    Generated by WWRAMS on ${escapeHtml(formatDateTime(new Date().toISOString()))} &middot; For official use only
  </div>

  <script>
    window.onload = function () {
      window.focus();
      window.print();
    };
  </script>
</body>
</html>`;

  const printWindow = window.open("", "_blank", "width=900,height=1000");
  if (!printWindow) {
    alert("Please allow pop-ups to print the report.");
    return;
  }
  printWindow.document.open();
  printWindow.document.write(documentHtml);
  printWindow.document.close();
}