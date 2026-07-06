import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function WorkReportChart() {
  const barData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Reports Submitted",
        data: [2, 2, 3, 1],
        backgroundColor: "#4f8ef7",
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: "#f0f0f0" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const doughnutData = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        data: [8, 3, 1],
        backgroundColor: ["#22c55e", "#3b82f6", "#f97316"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 10, padding: 15, font: { size: 12 } },
      },
    },
  };

  return (
    <div className="charts-section">
      <div className="bottom-card chart-card">
        <h2>Reports Overview</h2>
        <div className="chart-wrapper">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="bottom-card chart-card">
        <h2>Task Status Breakdown</h2>
        <div className="chart-wrapper doughnut-wrapper">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
}

export default WorkReportChart;