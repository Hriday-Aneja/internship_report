import PageShell from "../../components/PageShell/PageShell";

function Reports() {
  return (
    <PageShell
      title="My Reports"
      subtitle="Browse your submitted and pending weekly reports."
    >
      <div className="page-shell-card">
        <p>No reports to display yet. Submit a weekly report from the dashboard.</p>
      </div>
    </PageShell>
  );
}

export default Reports;
