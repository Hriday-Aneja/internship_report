function SummaryCards() {
  return (
    <div className="summary-cards">

      <div className="card">
        <h4>Reports Submitted</h4>
        <h2>08</h2>
        <p>This Month</p>
      </div>

      <div className="card">
        <h4>Pending Reports</h4>
        <h2>01</h2>
        <p>This Week</p>
      </div>

      <div className="card">
        <h4>Current Week Status</h4>
        <h2 className="green">Submitted</h2>
        <p>23 Jun - 29 Jun</p>
      </div>

      <div className="card">
        <h4>Workload Status</h4>
        <h2 className="orange">Medium</h2>
        <p>Current Workload</p>
      </div>

    </div>
  );
}

export default SummaryCards;