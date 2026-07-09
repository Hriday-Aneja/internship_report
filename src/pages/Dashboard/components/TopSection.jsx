import { getCurrentUser } from "../../../utils/auth";

function TopSection() {
  const currentUser = getCurrentUser();
  return (
    <div className="top-section">

      <div className="welcome">

        <h1>Welcome back, {currentUser.fullName}!</h1>

        <p>Here's an overview of your work and reports.</p>

      </div>

      

    </div>
  );
}

export default TopSection;