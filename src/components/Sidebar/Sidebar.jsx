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

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>


      <nav className="sidebar-nav">

        <NavLink
          to="/dashboard"
          className={linkClass}
          title="Dashboard"
          end
        >
          <FaHome className="sidebar-icon" />
          {sidebarOpen && (
            <span className="sidebar-text">Dashboard</span>
          )}
        </NavLink>

        <NavLink
          to="/profile"
          className={linkClass}
          title="My Profile"
        >
          <FaUser className="sidebar-icon" />
          {sidebarOpen && (
            <span className="sidebar-text">My Profile</span>
          )}
        </NavLink>

        <NavLink
          to="/weekly-report"
          className={linkClass}
          title="Weekly Report"
        >
          <FaFileAlt className="sidebar-icon" />
          {sidebarOpen && (
            <span className="sidebar-text">Weekly Report</span>
          )}
        </NavLink>

        <NavLink
          to="/activities"
          className={linkClass}
          title="Current Activities"
        >
          <FaTasks className="sidebar-icon" />
          {sidebarOpen && (
            <span className="sidebar-text"> Activities</span>
          )}
        </NavLink>

        <NavLink
          to="/reports"
          className={linkClass}
          title="My Reports"
        >
          <FaClipboardList className="sidebar-icon" />
          {sidebarOpen && (
            <span className="sidebar-text">My Reports</span>
          )}
        </NavLink>

        <NavLink
          to="/documents"
          className={linkClass}
          title="Documents"
        >
          <FaFolder className="sidebar-icon" />
          {sidebarOpen && (
            <span className="sidebar-text">Documents</span>
          )}
        </NavLink>

      </nav>
    </aside>
  );
}

export default Sidebar;