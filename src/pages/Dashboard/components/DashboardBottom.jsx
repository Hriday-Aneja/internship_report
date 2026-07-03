import {
  FaBell,
  FaClipboardList,
  FaHistory,
} from "react-icons/fa";

function DashboardBottom() {
  return (
    <div className="dashboard-bottom">

      <div className="bottom-card">

        <h2>
          <FaClipboardList /> Current Task
        </h2>

        <p><strong>Project:</strong> Employee Work Report System</p>

        <p><strong>Task:</strong> Dashboard Development</p>

        <p><strong>Status:</strong> In Progress</p>

        <div className="progress">
          <div className="progress-bar"></div>
        </div>

        <div className="progress-info">
          <span>Progress</span>
          <span>75%</span>
        </div>

      </div>

      <div className="bottom-card">

        <h2>
          <FaHistory /> Recent Activity
        </h2>

        <ul>
          <li>✔ Weekly Report Submitted</li>
          <li>✔ Activity Updated</li>
          <li>✔ Dashboard Module Started</li>
          <li>✔ Profile Updated</li>
        </ul>

      </div>

      <div className="bottom-card">

        <h2>
          <FaBell /> Notifications
        </h2>

        <ul>

          <li className="notification success">
            Report approved by HOD
          </li>

          <li className="notification warning">
            Weekly report due on Friday
          </li>

          <li className="notification info">
            Team meeting tomorrow at 11:00 AM
          </li>

          <li className="notification warning">
            Upload pending document
          </li>

        </ul>

      </div>

    </div>
  );
}

export default DashboardBottom;