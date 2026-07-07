import { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

import { Assignment, Delete, Edit, Refresh, Search } from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { getStoredArray, normalizeActivity, STORAGE_KEYS } from "../../utils/constants";
import Toast from "../Toast/Toast";

const mapStoredActivityToRow = (activity) => ({
  id: activity.id,
  activity: activity.title,
  project: activity.project,
  date: activity.date,
  hours: activity.hours,
  status: activity.status,
});

const readStoredActivities = () =>
  getStoredArray(STORAGE_KEYS.activities).map((activity) => normalizeActivity(activity));

const writeStoredActivities = (activities) => {
  window.localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(activities));
  window.dispatchEvent(new CustomEvent("wwrams:activities-updated"));
};

export default function ActivityTable() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState(() => readStoredActivities().map(mapStoredActivityToRow));
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [editForm, setEditForm] = useState({
    activity: "",
    project: "",
    date: "",
    hours: "",
    status: "Completed",
    priority: "Medium",
    description: "",
  });
  const [formError, setFormError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const refreshRows = () => {
    setRows(readStoredActivities().map(mapStoredActivityToRow));
  };

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEYS.activities) {
        refreshRows();
      }
    };

    const handleActivityUpdate = () => {
      refreshRows();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("wwrams:activities-updated", handleActivityUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("wwrams:activities-updated", handleActivityUpdate);
    };
  }, []);

  const openEditDialog = (row) => {
    const storedRow = readStoredActivities().find((activity) => activity.id === row.id);

    setEditingRowId(row.id);
    setEditForm({
      activity: row.activity || "",
      project: row.project || "",
      date: row.date || "",
      hours: String(row.hours ?? ""),
      status: row.status || "Completed",
      priority: storedRow?.priority || "Medium",
      description: storedRow?.description || "",
    });
    setFormError("");
    setIsEditOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditOpen(false);
    setEditingRowId(null);
    setFormError("");
  };

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setDeletingRow(null);
  };

  const openDeleteDialog = (row) => {
    setDeletingRow(row);
    setIsDeleteOpen(true);
  };

  

  const updateEditForm = (field, value) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const handleDeleteRow = (row) => {
    const nextActivities = readStoredActivities().filter((activity) => activity.id !== row.id);
    writeStoredActivities(nextActivities);
    refreshRows();
    setToastMessage("Activity deleted successfully!");
    setShowToast(true);
    closeDeleteDialog();
  };

  const handleSaveEdit = () => {
    if (!editForm.activity.trim()) return setFormError("Activity title is required.");
    if (!editForm.project.trim()) return setFormError("Project name is required.");
    if (!editForm.date) return setFormError("Please choose a date.");

    const hoursNumber = Number(editForm.hours);
    if (!String(editForm.hours).trim() || Number.isNaN(hoursNumber) || hoursNumber <= 0) {
      return setFormError("Enter valid hours (greater than 0).");
    }

    const nextActivities = readStoredActivities().map((activity) =>
      activity.id === editingRowId
        ? {
            ...activity,
            title: editForm.activity.trim(),
            project: editForm.project.trim(),
            date: editForm.date,
            hours: String(editForm.hours).trim(),
            status: editForm.status,
            priority: editForm.priority,
            description: editForm.description,
          }
        : activity
    );

    writeStoredActivities(nextActivities);
    refreshRows();
    closeEditDialog();
  };

  const filteredRows = useMemo(() => {
    return rows.filter(
      (row) =>
        row.activity.toLowerCase().includes(search.toLowerCase()) ||
        row.project.toLowerCase().includes(search.toLowerCase())
    );
  }, [rows, search]);

  const columns = [
    {
      field: "serial",
      headerName: "#",
      width: 70,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    {
      field: "activity",
      headerName: "Activity",
      flex: 2,
      minWidth: 220,
    },
    {
      field: "project",
      headerName: "Project",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "hours",
      headerName: "Hours",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            minWidth: 110,
            borderRadius: "20px",
            fontWeight: 600,
            color:
              params.value === "Completed"
                ? "#0B6E4F"
                : params.value === "Pending"
                ? "#B26A00"
                : "#0057B8",
            backgroundColor:
              params.value === "Completed"
                ? "#E8F5E9"
                : params.value === "Pending"
                ? "#FFF8E1"
                : "#E3F2FD",
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton
              type="button"
              onClick={() => openEditDialog(params.row)}
              size="small"
              sx={{
                bgcolor: "#FFF4E5",
                mr: 1,
                transition: ".2s",
                "&:hover": {
                  bgcolor: "#FFE0B2",
                  transform: "scale(1.1)",
                },
              }}
            >
              <Edit fontSize="small" sx={{ color: "#ED6C02" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              type="button"
                onClick={() => {
                  setDeletingRow(params.row);
                  setIsDeleteOpen(true);
                }}
              size="small"
              sx={{
                bgcolor: "#FEECEC",
                transition: ".2s",
                "&:hover": {
                  bgcolor: "#FFD6D6",
                  transform: "scale(1.1)",
                },
              }}
            >
              <Delete fontSize="small" sx={{ color: "#D32F2F" }} />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid #E5E7EB",
        borderTop: "4px solid #0f2747",
        backgroundColor: "#fff",
      }}
    >
    {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} tone="danger" />}
      <Box
        sx={{
          px: 3,
          py: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E5E7EB",
          backgroundColor: "#FAFBFD",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Assignment sx={{ color: "#0f2747", fontSize: 24 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f2747" }}>
              Activity History
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ mt: 0.8, color: "#64748B" }}>
            Review and manage employee work activities.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          borderBottom: "1px solid #EEF2F7",
          backgroundColor: "#FAFBFD",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: { xs: "100%", md: 340 },
              "& .MuiOutlinedInput-root": {
                height: 44,
                borderRadius: 3,
                backgroundColor: "#fff",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#64748B" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            size="small"
            label="Status"
            defaultValue=""
            sx={{
              width: 160,
              "& .MuiOutlinedInput-root": {
                height: 44,
                borderRadius: 3,
                backgroundColor: "#fff",
              },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Project"
            defaultValue=""
            sx={{
              width: 170,
              "& .MuiOutlinedInput-root": {
                height: 44,
                borderRadius: 3,
                backgroundColor: "#fff",
              },
            }}
          >
            <MenuItem value="">All Projects</MenuItem>
            <MenuItem value="Employee Portal">Employee Portal</MenuItem>
            <MenuItem value="HRMS">HRMS</MenuItem>
            <MenuItem value="Dashboard">Dashboard</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip
            label={`${filteredRows.length} Records`}
            sx={{
              bgcolor: "#0f2747",
              color: "#fff",
              fontWeight: 600,
              borderRadius: "18px",
              px: 1.5,
              height: 36,
            }}
          />

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={refreshRows}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              borderColor: "#0f2747",
              color: "#0f2747",
              "&:hover": {
                bgcolor: "#EEF5FF",
                borderColor: "#0f2747",
              },
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          p: 3,
          "& .MuiDataGrid-root": {
            border: "1px solid #E5E7EB",
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          autoHeight
          rowHeight={60}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          pageSizeOptions={[5, 10, 20, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          slots={{
            noRowsOverlay: () => (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="text.secondary">No activities found.</Typography>
              </Box>
            ),
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-main": {
              borderRadius: 3,
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#F8FAFC",
              borderBottom: "2px solid #E5E7EB",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#0f2747",
              fontWeight: 700,
              fontSize: 14,
            },
            "& .MuiDataGrid-row": {
              transition: "0.2s ease",
            },
            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: "#FAFBFC",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#EEF5FF",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #EEF2F7",
            },
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #E5E7EB",
              backgroundColor: "#FAFAFA",
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
          }}
        />
      </Box>

      <Dialog open={isEditOpen} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Activity</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gap: 2, mt: 0.5 }}>
            <TextField
              label="Activity"
              value={editForm.activity}
              onChange={(event) => updateEditForm("activity", event.target.value)}
              fullWidth
            />
            <TextField
              label="Project"
              value={editForm.project}
              onChange={(event) => updateEditForm("project", event.target.value)}
              fullWidth
            />
            <TextField
              label="Date"
              type="date"
              value={editForm.date}
              onChange={(event) => updateEditForm("date", event.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Hours"
              type="number"
              value={editForm.hours}
              onChange={(event) => updateEditForm("hours", event.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Status"
              value={editForm.status}
              onChange={(event) => updateEditForm("status", event.target.value)}
              fullWidth
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </TextField>
            {formError && (
              <Typography sx={{ color: "#D32F2F", fontSize: 14 }}>{formError}</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeEditDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteOpen} onClose={closeDeleteDialog} fullWidth maxWidth="xs">
        <DialogTitle>Delete Activity</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Do you want to delete this activity?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => deletingRow && handleDeleteRow(deletingRow)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteOpen} onClose={closeDeleteDialog} fullWidth maxWidth="xs">
        <DialogTitle>Delete Activity</DialogTitle>
        <DialogContent dividers>
          <Typography>Do you want to delete this activity?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => deletingRow && handleDeleteRow(deletingRow)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
