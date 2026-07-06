import { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

import {
  Assignment,
  Delete,
  Edit,
  Refresh,
  Search,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

const rows = [
  {
    id: 1,
    activity: "Login Module",
    project: "Employee Portal",
    date: "06 Jul 2026",
    hours: 6,
    status: "Completed",
  },
  {
    id: 2,
    activity: "Dashboard UI",
    project: "Employee Portal",
    date: "05 Jul 2026",
    hours: 5,
    status: "Pending",
  },
  {
    id: 3,
    activity: "API Integration",
    project: "Employee Portal",
    date: "04 Jul 2026",
    hours: 7,
    status: "In Progress",
  },
];

export default function ActivityTable() {
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    return rows.filter(
      (row) =>
        row.activity.toLowerCase().includes(search.toLowerCase()) ||
        row.project.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const cardStyle = {
    p: 2.5,
    borderRadius: 3,
    border: "1px solid #E5E7EB",
    boxShadow: "none",
    transition: ".25s",

    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 10px 24px rgba(0,0,0,.08)",
    },
  };

  const columns = [
    {
  field: "serial",
  headerName: "#",
  width: 70,
  sortable: false,
  align: "center",
  headerAlign: "center",
  renderCell: (params) =>
    params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
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

      renderCell: (params) => {
        let color = "info";

        if (params.value === "Completed") color = "success";
        if (params.value === "Pending") color = "warning";

        return (
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
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,

      renderCell: () => (
        <>
          <Tooltip title="Edit">
            <IconButton
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
              <Edit
                fontSize="small"
                sx={{ color: "#ED6C02" }}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
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
              <Delete
                fontSize="small"
                sx={{ color: "#D32F2F" }}
              />
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
{/* Header */}
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
  {/* Left Side */}
  <Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Assignment
        sx={{
          color: "#0f2747",
          fontSize: 24,
        }}
      />

      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "#0f2747",
        }}
      >
        Activity History
      </Typography>
    </Box>

    <Typography
      variant="body2"
      sx={{
        mt: 0.8,
        color: "#64748B",
      }}
    >
      Review and manage employee work activities.
    </Typography>
  </Box>

</Box>

{/* Toolbar */}
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
  {/* Left Section */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      flexWrap: "wrap",
    }}
  >
    <TextField
      size="small"
      placeholder="Search activities..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      sx={{
        width: {
          xs: "100%",
          md: 340,
        },

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

  {/* Right Section */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
    }}
  >
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
{/* DataGrid */}
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
    pageSizeOptions={[5, 10, 20]}
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
          <Typography color="text.secondary">
            No activities found.
          </Typography>
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

      "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within":
        {
          outline: "none",
        },
    }}
  />
</Box>
  </Paper>
);
}