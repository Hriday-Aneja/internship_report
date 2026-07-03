import "./Footer.css";
import { FaShieldAlt, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <FaShieldAlt className="footer-icon" />
        <span>Secure Portal</span>
      </div>

      <div className="footer-center">
        © 2026 <strong>C-DAC Delhi</strong> | Internal Reporting & Task Management
      </div>

      <div className="footer-right">
        <FaEnvelope className="footer-icon" />
        <span>admin@cdacdelhi.in</span>
        <span className="version">v1.0</span>
      </div>
    </footer>
  );
}

export default Footer;