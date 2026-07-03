import PageShell from "../../components/PageShell/PageShell";

function Profile() {
  return (
    <PageShell
      title="My Profile"
      subtitle="View and manage your employee profile details."
    >
      <div className="page-shell-card">
        <p>
          <strong>Name:</strong> Paarth Sharma
        </p>
        <p>
          <strong>Employee ID:</strong> EMP001
        </p>
        <p>
          <strong>Department:</strong> Software Development
        </p>
        <p>
          <strong>Designation:</strong> Project Engineer
        </p>
      </div>
    </PageShell>
  );
}

export default Profile;
