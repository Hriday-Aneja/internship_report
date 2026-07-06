import {
  FaBell,
  FaClipboardList,
  FaHistory,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

function DashboardBottom() {
  return (
    <div className="dashboard-bottom">

      {/* Current Task */}
      <div className="bottom-card">

        <h2>
          <FaClipboardList /> Current Task
        </h2>

        <div className="task-row">
          <span className="task-label">Project</span>
          <span className="task-value">Employee Work Report System</span>
        </div>

        <div className="task-row">
          <span className="task-label">Task</span>
          <span className="task-value">Dashboard Development</span>
        </div>

        <div className="task-row">
          <span className="task-label">Status</span>
          <span className="task-status">In Progress</span>
        </div>

        <div className="progress">
          <div className="progress-bar"></div>
        </div>

        <div className="progress-info">
          <span>Progress</span>
          <span>75%</span>
        </div>

      </div>

    {/* Recent Activity */}
<div className="bottom-card">

  <h2>
    <FaHistory /> Recent Activity
  </h2>

  <div className="activity-item">
    <div className="activity-dot green"></div>

    <div className="activity-content">
      <h4>Weekly Report Submitted</h4>
      <p>23 June 2026 • 10:30 AM</p>
    </div>
  </div>

  <div className="activity-item">
    <div className="activity-dot blue"></div>

    <div className="activity-content">
      <h4>Current Activity Updated</h4>
      <p>22 June 2026 • 03:45 PM</p>
    </div>
  </div>

  <div className="activity-item">
    <div className="activity-dot purple"></div>

    <div className="activity-content">
      <h4>Dashboard Module Started</h4>
      <p>21 June 2026 • 09:15 AM</p>
    </div>
  </div>

  <div className="activity-item">
    <div className="activity-dot orange"></div>

    <div className="activity-content">
      <h4>Profile Updated</h4>
      <p>20 June 2026 • 05:20 PM</p>
    </div>
  </div>

</div>
     {/* Notifications */}
<div className="bottom-card">

  <div className="card-header">
    <h2>
      <FaBell /> Notifications
    </h2>

    <span className="view-all">View All</span>
  </div>

  <div className="notify-item success">

    <FaCheckCircle className="notify-icon" />

    <div className="notify-content">
      <h4>Report Approved</h4>
      <p>Your weekly report has been approved by HOD.</p>
      <small>2 hours ago</small>
    </div>

  </div>

  <div className="notify-item warning">

    <FaExclamationTriangle className="notify-icon" />

    <div className="notify-content">
      <h4>Weekly Report Due</h4>
      <p>Please submit your weekly report before Friday.</p>
      <small>Today</small>
    </div>

  </div>

  <div className="notify-item info">

    <FaInfoCircle className="notify-icon" />

    <div className="notify-content">
      <h4>Team Meeting</h4>
      <p>Team meeting scheduled at 11:00 AM tomorrow.</p>
      <small>Yesterday</small>
    </div>

  </div>

</div>
    </div>
  );
}

export default DashboardBottom;