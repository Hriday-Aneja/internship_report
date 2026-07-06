import "./Dashboard.css";
import TopSection from "./components/TopSection";
import SummaryCards from "./components/SummaryCards";
import QuickActions from "./components/QuickActions";
import DashboardBottom from "./components/DashboardBottom";
import WorkReportChart from "./components/WorkReportChart";

function Dashboard() {
  return (
    <div className="dashboard">

      <TopSection />

      <SummaryCards />

      <QuickActions />

      <DashboardBottom />

      <WorkReportChart />

    </div>
  );
}

export default Dashboard;