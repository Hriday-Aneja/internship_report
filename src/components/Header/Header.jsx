import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaChevronDown,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import "./Header.css";

function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const notifications = [
    "Weekly report is due on Friday, 27 June 2026.",
    "Your report for 12 - 18 June 2026 has been approved.",
    "Team meeting scheduled on 25 June 2026 at 11:00 AM.",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formattedDate = currentDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = currentDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setProfileOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="top-header">
      {/* Left Section */}
      <div className="left-area">
        <button
          className="menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FaBars />
        </button>

        <div className="brand">
          <img src="/logo12.png" alt="C-DAC Logo" />

          <div>
            <h2>Employee Work Report System</h2>
            <p>Centre for Development of Advanced Computing</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="header-actions">

        {/* Date & Time */}
        <div className="date-box">
          <strong>{formattedDate}</strong>
          <span>{formattedTime}</span>
        </div>

        {/* Notifications */}
        <div className="notif-wrap" ref={notifRef}>
          <button
            className="notif-btn"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <FaBell />

            <span className="notif-badge">
              {notifications.length}
            </span>
          </button>

          {notifOpen && (
            <div className="notif-dropdown">

              <div className="notif-header">
                Notifications
              </div>

              {notifications.map((item, index) => (
                <div
                  className="notif-item"
                  key={index}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div
          className="profile-menu"
          ref={profileRef}
        >
          <button
            className="profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="avatar">P</div>

            <div className="user-text">
              <strong>Paarth Sharma</strong>
              <p>EMP001</p>
            </div>

            <FaChevronDown />
          </button>

          {profileOpen && (
            <div className="profile-dropdown">

              <div className="profile-header">

                <div className="avatar large">
                  P
                </div>

                <div>
                  <strong>Paarth Sharma</strong>
                  <p>EMP001</p>
                </div>

              </div>

              <div className="dropdown-item">
                <FaUserCircle />
                My Profile
              </div>

              <div className="dropdown-item">
                <FaCog />
                Settings
              </div>

              <hr />

              <button type="button" className="dropdown-item logout" onClick={handleLogout}>
                <FaSignOutAlt />
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;