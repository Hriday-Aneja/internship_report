import { useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaTasks,
  FaFolderOpen,
  FaUpload,
} from "react-icons/fa";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Submit Weekly Report",
      icon: FaFileAlt,
      path: "/weekly-report",
    },
    {
      title: "Update Activity",
      icon: FaTasks,
      path: "/activities",
    },
    {
      title: "View Reports",
      icon: FaFolderOpen,
      path: "/reports",
    },
    {
      title: "Upload Documents",
      icon: FaUpload,
      path: "/documents",
    },
  ];

  return (
    <>
      <h2 className="section-title">Quick Actions</h2>

      <div className="quick-actions">
        {actions.map(({ title, icon: Icon, path }) => (
          <button
  key={title}
  type="button"
  className="action-card"
  onClick={() => navigate(path)}
>
  <Icon className="action-icon" />

  <h3>{title}</h3>

  <span className="action-btn">
    Go Now →
  </span>
</button>
        ))}
      </div>
    </>
  );
}

export default QuickActions;
