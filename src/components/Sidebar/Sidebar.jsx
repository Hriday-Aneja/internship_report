import "./Sidebar.css";
import { NavLink } from "react-router-dom";
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
  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">
          <FaHome className="sidebar-icon" />
          <span className="sidebar-text">Dashboard</span>
        </NavLink>

        <NavLink to="/profile" className="sidebar-link">
          <FaUser className="sidebar-icon" />
          <span className="sidebar-text">My Profile</span>
        </NavLink>

        <NavLink to="/weekly-report" className="sidebar-link">
          <FaFileAlt className="sidebar-icon" />
          <span className="sidebar-text">Weekly Report</span>
        </NavLink>

        <NavLink to="/activities" className="sidebar-link">
          <FaTasks className="sidebar-icon" />
          <span className="sidebar-text">Current Activities</span>
        </NavLink>

        <NavLink to="/reports" className="sidebar-link">
          <FaClipboardList className="sidebar-icon" />
          <span className="sidebar-text">My Reports</span>
        </NavLink>

        <NavLink to="/documents" className="sidebar-link">
          <FaFolder className="sidebar-icon" />
          <span className="sidebar-text">Documents</span>
        </NavLink>

        <NavLink to="/logout" className="sidebar-link">
          <FaSignOutAlt className="sidebar-icon" />
          <span className="sidebar-text">Logout</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;