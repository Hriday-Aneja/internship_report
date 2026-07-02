import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaFileAlt,
  FaTasks,
  FaClipboardList,
  FaFolder,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar({ sidebarOpen }) {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={linkClass} end>
          <FaHome className="sidebar-icon" />
          <span className="sidebar-text">Dashboard</span>
        </NavLink>

        <NavLink to="/profile" className={linkClass}>
          <FaUser className="sidebar-icon" />
          <span className="sidebar-text">My Profile</span>
        </NavLink>

        <NavLink to="/weekly-report" className={linkClass}>
          <FaFileAlt className="sidebar-icon" />
          <span className="sidebar-text">Weekly Report</span>
        </NavLink>

        <NavLink to="/activities" className={linkClass}>
          <FaTasks className="sidebar-icon" />
          <span className="sidebar-text">Current Activities</span>
        </NavLink>

        <NavLink to="/reports" className={linkClass}>
          <FaClipboardList className="sidebar-icon" />
          <span className="sidebar-text">My Reports</span>
        </NavLink>

        <NavLink to="/documents" className={linkClass}>
          <FaFolder className="sidebar-icon" />
          <span className="sidebar-text">Documents</span>
        </NavLink>
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="sidebar-link sidebar-logout-btn"
      >
        <FaSignOutAlt className="sidebar-icon" />
        <span className="sidebar-text">Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
