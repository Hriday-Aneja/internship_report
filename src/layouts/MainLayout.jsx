import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";
import "./MainLayout.css";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="app-shell">
      <Header toggleSidebar={toggleSidebar} />

      <div className="app-middle">
        <Sidebar sidebarOpen={sidebarOpen} />

        <main className="content">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout;