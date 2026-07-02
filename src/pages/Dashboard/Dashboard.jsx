import "./Dashboard.css";
import TopSection from "./components/TopSection";
import SummaryCards from "./components/SummaryCards";
import QuickActions from "./components/QuickActions";
import DashboardBottom from "./components/DashboardBottom";

function Dashboard() {
  return (
    <div className="dashboard">

      <TopSection />

      <SummaryCards />

      <QuickActions />

      <DashboardBottom />

    </div>
  );
}

export default Dashboard;