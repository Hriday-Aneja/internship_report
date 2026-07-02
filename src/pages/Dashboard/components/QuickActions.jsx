import {
  FaFileAlt,
  FaTasks,
  FaFolderOpen,
  FaUpload,
} from "react-icons/fa";

function QuickActions() {
  return (
    <>
      <h2 className="section-title">Quick Actions</h2>

      <div className="quick-actions">

        <div className="action-card">
            <FaFileAlt className="action-icon" />
          <h3>Submit Weekly Report</h3>
        </div>

        <div className="action-card">
          <FaTasks className="action-icon" />
          <h3>Update Activity</h3>
        </div>

        <div className="action-card">
          <FaFolderOpen className="action-icon" />
          <h3>View Reports</h3>
        </div>

        <div className="action-card">
          <FaUpload className="action-icon" />
          <h3>Upload Documents</h3>
        </div>

      </div>
    </>
  );
}

export default QuickActions;