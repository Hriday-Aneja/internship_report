import { useState } from "react";
import "./WeeklyReport.css";

function WeeklyReport() {

  const [activities, setActivities] = useState([
    {
      activity: "",
      hours: "",
      status: "Completed",
      isEditing: true,
    },
  ]);

  const addActivity = () => {
    setActivities([
      ...activities,
      {
        activity: "",
        hours: "",
        status: "Completed",
        isEditing: true,
      },
    ]);
  };

  const handleChange = (index, field, value) => {

    const updatedActivities = [...activities];

    updatedActivities[index][field] = value;

    setActivities(updatedActivities);

  };

  const deleteActivity = (index) => {

    const updatedActivities = activities.filter(
      (_, i) => i !== index
    );

    setActivities(updatedActivities);

  };
  const saveDraft = () => {
  alert("Draft Saved Successfully!");
};

const submitReport = () => {
  alert("Weekly Report Submitted Successfully!");
};

  const toggleEdit = (index) => {

    const updatedActivities = [...activities];

    updatedActivities[index].isEditing =
      !updatedActivities[index].isEditing;

    setActivities(updatedActivities);

  };

  return (

    <div className="weekly-report">

      <h1>Weekly Work Report</h1>

      <p className="subtitle">
        Fill in your work details for the selected week.
      </p>

      {/* Employee Details */}

      <div className="section">

        <h2>Employee Details</h2>

        <div className="form-grid">

          <div className="form-group">

            <label>Employee ID</label>

            <input
              type="text"
              value="EMP001"
              readOnly
            />

          </div>

          <div className="form-group">

            <label>Employee Name</label>

            <input
              type="text"
              value="Divya Azad"
              readOnly
            />

          </div>

          <div className="form-group">

            <label>Department</label>

            <input
              type="text"
              value="Software Development"
              readOnly
            />

          </div>

          <div className="form-group">

            <label>Designation</label>

            <input
              type="text"
              value="Frontend Intern"
              readOnly
            />

          </div>

        </div>

      </div>

      {/* Week Duration */}

      <div className="section">

        <h2>Week Duration</h2>

        <div className="form-grid">

          <div className="form-group">

            <label>From Date</label>

            <input type="date" />

          </div>

          <div className="form-group">

            <label>To Date</label>

            <input type="date" />

          </div>

        </div>

      </div>

      {/* Activities */}

      <div className="section">

        <h2>Activities Performed</h2>

        <table className="activity-table">

          <thead>

            <tr>

              <th>Activity</th>

              <th>Hours Spent</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {activities.map((item, index) => (

              <tr key={index}>

                <td>

                  <input
                    type="text"
                    placeholder="Enter activity"
                    value={item.activity}
                    onChange={(e) =>
                      handleChange(index, "activity", e.target.value)
                    }
                    disabled={!item.isEditing}
                  />

                </td>

                <td>

                  <input
                    type="number"
                    placeholder="Hours"
                    min="0"
                    value={item.hours}
                    onChange={(e) =>
                      handleChange(index, "hours", e.target.value)
                    }
                    disabled={!item.isEditing}
                  />

                </td>

                <td>

                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleChange(index, "status", e.target.value)
                    }
                    disabled={!item.isEditing}
                  >

                    <option>Completed</option>

                    <option>In Progress</option>

                    <option>Pending</option>

                  </select>

                </td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() => toggleEdit(index)}
                  >
                    {item.isEditing ? "Save" : "Edit"}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteActivity(index)}
                    disabled={activities.length === 1}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <button
          className="add-btn"
          onClick={addActivity}
        >
          + Add Activity
        </button>

      </div>
      <div className="button-group">

  <button
    className="draft-btn"
    onClick={saveDraft}
  >
    Save Draft
  </button>

  <button
    className="submit-btn"
    onClick={submitReport}
  >
    Submit Report
  </button>

</div>

    </div>
    

  );
}

export default WeeklyReport;