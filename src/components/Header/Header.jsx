import { useEffect, useState, useRef } from "react";
import { FaBars, FaBell } from "react-icons/fa";
import "./Header.css";

function Header({ toggleSidebar }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const notifications = [
    "Weekly report is due on Friday, 27 June 2026.",
    "Your report for 12 - 18 June 2026 has been approved.",
    "Team meeting scheduled on 25 June 2026 at 11:00 AM.",
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formattedDate = currentDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="top-header">
      <div className="left-area">
        <button
          className="menu-btn"
          onClick={toggleSidebar}
          type="button"
          aria-label="Toggle sidebar"
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

      <div className="header-actions">
        <div className="date-box">{formattedDate}</div>

        <div className="notif-wrap" ref={notifRef}>
          <button
            className="notif-btn"
            onClick={() => setNotifOpen((prev) => !prev)}
            type="button"
            aria-label="Notifications"
          >
            <FaBell />
            <span className="notif-badge">{notifications.length}</span>
          </button>

          {notifOpen && (
            <div className="notif-dropdown">
              <div className="notif-header">Notifications</div>
              {notifications.map((item, index) => (
                <div className="notif-item" key={index}>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="user-info">
          <div className="avatar">P</div>
          <div className="user-text">
            <strong>Paarth Sharma</strong>
            <p>EMP001</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;