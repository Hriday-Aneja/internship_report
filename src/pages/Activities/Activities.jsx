import { useEffect, useMemo, useState } from "react";
import PageShell from "../../components/PageShell/PageShell";
import ActivityTable from "../../components/ActivityTable/ActivityTable";
import {
  ACTIVITY_PRIORITIES,
  ACTIVITY_STATUSES,
  STORAGE_KEYS,
  createEmptyActivity,
  normalizeActivity,
  getStoredArray,
  setStoredValue,
} from "../../utils/constants";

function Activities() {
  const [activities, setActivities] = useState(() => {
    const storedActivities = getStoredArray(STORAGE_KEYS.activities).map(normalizeActivity);

    return storedActivities.length > 0 ? storedActivities : [createEmptyActivity()];
  });

  useEffect(() => {
    setStoredValue(STORAGE_KEYS.activities, activities);
  }, [activities]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key !== STORAGE_KEYS.activities) {
        return;
      }

      const storedActivities = getStoredArray(STORAGE_KEYS.activities).map(normalizeActivity);
      setActivities(storedActivities.length > 0 ? storedActivities : [createEmptyActivity()]);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const completedCount = useMemo(
    () => activities.filter((activity) => activity.title.trim() && activity.status === "Completed").length,
    [activities]
  );

  const activeCount = useMemo(
    () => activities.filter((activity) => activity.title.trim() && activity.status === "In Progress").length,
    [activities]
  );

  const pendingCount = useMemo(
    () => activities.filter((activity) => activity.title.trim() && activity.status === "Pending").length,
    [activities]
  );

  const updateActivity = (index, field, value) => {
    setActivities((currentActivities) =>
      currentActivities.map((activity, activityIndex) =>
        activityIndex === index ? { ...activity, [field]: value } : activity
      )
    );
  };

  const toggleEdit = (index) => {
    setActivities((currentActivities) =>
      currentActivities.map((activity, activityIndex) => {
        if (activityIndex !== index) {
          return activity;
        }

        if (
          activity.isEditing &&
          (!activity.title.trim() || !activity.project.trim() || !activity.date || !String(activity.hours).trim())
        ) {
          return activity;
        }

        return {
          ...activity,
          isEditing: !activity.isEditing,
        };
      })
    );
  };

  const addActivity = () => {
    const lastActivity = activities[activities.length - 1];

    if (
      !lastActivity ||
      lastActivity.isEditing ||
      !lastActivity.title.trim() ||
      !lastActivity.project.trim() ||
      !lastActivity.date ||
      !String(lastActivity.hours).trim()
    ) {
      return;
    }

    setActivities((currentActivities) => [...currentActivities, createEmptyActivity()]);
  };

  const deleteActivity = (index) => {
    setActivities((currentActivities) => {
      const remainingActivities = currentActivities.filter((_, activityIndex) => activityIndex !== index);

      return remainingActivities.length > 0 ? remainingActivities : [createEmptyActivity()];
    });
  };

  const lastActivity = activities[activities.length - 1];
  const canAddActivity = Boolean(
    lastActivity &&
      !lastActivity.isEditing &&
      lastActivity.title.trim() &&
      lastActivity.project.trim() &&
      lastActivity.date &&
      String(lastActivity.hours).trim()
  );

  return (
    <PageShell
      title="Activities"
      subtitle="Create and manage work activities for weekly reporting."
    >
      <div className="page-shell-card">
        <div className="page-shell-toolbar">
          <div>
            <h2>Activity Register</h2>
            <p>Activities are saved automatically and used in the weekly report workflow.</p>
          </div>

          <div className="page-shell-kpis">
            <div className="page-shell-kpi">
              <span>Total</span>
              <strong>{activities.filter((activity) => activity.title.trim()).length}</strong>
            </div>

            <div className="page-shell-kpi">
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </div>

            <div className="page-shell-kpi">
              <span>In Progress</span>
              <strong>{activeCount}</strong>
            </div>

            <div className="page-shell-kpi">
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>
        </div>

        <table className="page-shell-table">
          <thead>
            <tr>
              <th>Activity Title</th>
              <th>Project</th>
              <th>Date</th>
              <th>Hours</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {activities.map((activity, index) => (
              <tr key={activity.id}>
                <td>
                  <input
                    type="text"
                    value={activity.title}
                    onChange={(event) => updateActivity(index, "title", event.target.value)}
                    placeholder="Enter activity title"
                    disabled={!activity.isEditing}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={activity.project}
                    onChange={(event) => updateActivity(index, "project", event.target.value)}
                    placeholder="Project name"
                    disabled={!activity.isEditing}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={activity.date}
                    onChange={(event) => updateActivity(index, "date", event.target.value)}
                    disabled={!activity.isEditing}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={activity.hours}
                    onChange={(event) => updateActivity(index, "hours", event.target.value)}
                    placeholder="Hours"
                    disabled={!activity.isEditing}
                  />
                </td>
                <td>
                  <select
                    value={activity.status}
                    onChange={(event) => updateActivity(index, "status", event.target.value)}
                    disabled={!activity.isEditing}
                  >
                    {ACTIVITY_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={activity.priority}
                    onChange={(event) => updateActivity(index, "priority", event.target.value)}
                    disabled={!activity.isEditing}
                  >
                    {ACTIVITY_PRIORITIES.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="page-shell-actions">
                    <button className="page-shell-button secondary" type="button" onClick={() => toggleEdit(index)}>
                      {activity.isEditing ? "Save" : "Edit"}
                    </button>

                    <button
                      className="page-shell-button danger"
                      type="button"
                      onClick={() => deleteActivity(index)}
                      disabled={activities.length === 1}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <p className="page-shell-empty-state" style={{ margin: 0, flex: "1 1 360px" }}>
            Fill and save the current activity before creating the next one.
          </p>

          <button className="page-shell-button primary" type="button" onClick={addActivity} disabled={!canAddActivity}>
            + Add Activity
          </button>
        </div>
      </div>
    <ActivityTable />
    </PageShell>
    
  );
}

export default Activities;
