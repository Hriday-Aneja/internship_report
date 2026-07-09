import PageShell from "../../components/PageShell/PageShell";
import { getCurrentUser } from "../../utils/auth";

function Profile() {
  const currentUser = getCurrentUser();
  return (
    <PageShell
      title="My Profile"
      subtitle="View and manage your employee profile details."
    >
      <div className="page-shell-card">
        <p>
          <strong>Name:</strong> {currentUser.fullName}
        </p>
        <p>
          <strong>Employee ID:</strong> {currentUser.employeeId}
        </p>
        <p>
          <strong>Department:</strong> {currentUser.department}
        </p>
        <p>
          <strong>Designation:</strong> {currentUser.designation}
        </p>
      </div>
    </PageShell>
  );
}

export default Profile;