import PageShell from "../../components/PageShell/PageShell";

function Activities() {
  return (
    <PageShell
      title="Current Activities"
      subtitle="Track your ongoing tasks and work items."
    >
      <div className="page-shell-card">
        <p>Your current activities will appear here once assigned or updated.</p>
      </div>
    </PageShell>
  );
}

export default Activities;
