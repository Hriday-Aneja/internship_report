import Sidebar from "../../../components/layout/Sidebar";
import DashboardCard from "../../../components/ui/DashboardCard";

function EmployeeDashboard() {

    return (

        <>

            <Header />

            <div className="dashboard-container">

                <Sidebar />

                <main className="dashboard-content">

                    <h1>Employee Dashboard</h1>

                    <div className="cards">

                        <DashboardCard
                            title="Reports Submitted"
                            value="10"
                        />

                        <DashboardCard
                            title="Pending Reports"
                            value="1"
                        />

                        <DashboardCard
                            title="Workload"
                            value="Medium"
                        />

                        <DashboardCard
                            title="Current Week"
                            value="Not Submitted"
                        />

                    </div>

                </main>

            </div>

            <Footer />

        </>

    );

}

export default EmployeeDashboard;