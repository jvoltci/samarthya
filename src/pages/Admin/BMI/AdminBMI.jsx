import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import axios from "../../../services/api";
import { useForm, Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { useMediaQuery, useTheme } from "@mui/material";
import { styled } from '@mui/system';

// Styled component for responsiveness
const ResponsiveTable = styled(TableContainer)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    overflowX: 'auto',
  },
}));

const AdminBMI = () => {
  const [bmiRecords, setBmiRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null); // To track the expanded row
  const { handleSubmit, control, reset, watch, setValue } = useForm();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg")); // Check if screen is large

  // Fetch BMI Records
  useEffect(() => {
    fetchBMIRecords();
  }, []);

  const fetchBMIRecords = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/bmi");
      setBmiRecords(data);
    } catch (error) {
      console.error("Failed to fetch BMI records:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Employees for Dropdown
  const fetchEmployees = async (search = "") => {
    try {
      const { data } = await axios.get("/employee/search", { params: { search } });
      return data.map((employee) => ({
        label: `${employee.name} (${employee.regimentalNo})`,
        value: employee._id,
      }));
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      return [];
    }
  };

  // Add or Update BMI Record
  const handleSaveRecord = async (formData) => {
    try {
      formData = {...formData, createdAt: new Date().toLocaleDateString()}
      const payload = {
        ...formData,
        employee: formData.employee.value,
      };
      if (editMode) {
        await axios.put(`/bmi/${selectedRecord._id}`, payload);
      } else {
        await axios.post("/bmi", payload);
      }
      fetchBMIRecords();
      handleClose();
    } catch (error) {
      console.error("Failed to save BMI record:", error);
    }
  };

  // Delete BMI Record
  const handleDeleteRecord = async (id) => {
    if (window.confirm("Are you sure you want to delete this BMI record?")) {
      try {
        await axios.delete(`/bmi/${id}`);
        fetchBMIRecords();
      } catch (error) {
        console.error("Failed to delete BMI record:", error);
      }
    }
  };

  const handleOpen = (record = null) => {
    setEditMode(!!record);
    setSelectedRecord(record);
    reset(
      record || {
        employee: "",
        weight: "",
        height: "",
        bmi: "",
        createdAt: "",
      }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRecord(null);
    setEditMode(false);
  };

  // Auto-Calculate BMI when Weight or Height Changes
  const weight = watch("weight");
  const height = watch("height");
  useEffect(() => {
    if (weight && height) {
      const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
      setValue("bmi", bmi);
    }
  }, [weight, height, setValue]);

  // Toggle row expansion for visibility
  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id); // Toggle row expansion
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">BMI</Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()}>
          Add BMI
        </Button>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        <ResponsiveTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                {isLargeScreen &&<TableCell>Weight (kg)</TableCell>}
                {isLargeScreen &&<TableCell>Height (cm)</TableCell>}
                <TableCell>BMI</TableCell>
                {isLargeScreen && <TableCell>Createt At</TableCell>}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bmiRecords.map((record) => (
                <React.Fragment key={record._id}>
                  {/* Main Row */}
                  <TableRow>
                    <TableCell>{`${record.employee?.name} (${record.employee?.regimentalNo})`}</TableCell>
                    {isLargeScreen &&<TableCell>{record.weight}</TableCell>}
                    {isLargeScreen &&<TableCell>{record.height}</TableCell>}
                    <TableCell>{record.bmi}</TableCell>
                    {isLargeScreen && <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>}
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => toggleRowExpansion(record._id)}>
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row */}
                  {expandedRow === record._id && (
                    <TableRow>
                      <TableCell colSpan={isLargeScreen ? 6 : 4} sx={{ backgroundColor: '#f9f9f9' }}>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="body2">
                            <strong>Employee Details:</strong> {record.employee?.name} ({record.employee?.regimentalNo})
                          </Typography>
                          <Typography variant="body2">
                            <strong>Weight:</strong> {record.weight} kg
                          </Typography>
                          <Typography variant="body2">
                            <strong>Height:</strong> {record.height} cm
                          </Typography>
                          <Typography variant="body2">
                            <strong>BMI:</strong> {record.bmi}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Created At:</strong> {new Date(record.createdAt).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<Edit />}
                              onClick={() => handleOpen(record)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              startIcon={<Delete />}
                              onClick={() => handleDeleteRecord(record._id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </ResponsiveTable>
      )}

      {/* Modal for Add/Edit */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editMode ? "Edit BMI Record" : "Add BMI Record"}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate onSubmit={handleSubmit(handleSaveRecord)} sx={{ mt: 2 }}>
            <Controller
              name="employee"
              control={control}
              rules={{ required: "Employee is required" }}
              render={({ field, fieldState }) => (
                <AsyncSelect
                  {...field}
                  cacheOptions
                  loadOptions={fetchEmployees}
                  defaultOptions
                  placeholder="Search Employee by Name or Regimental No"
                  styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
                  value={
                    editMode && selectedRecord
                      ? {
                          label: `${selectedRecord?.employee.name} (${selectedRecord?.employee.regimentalNo})`,
                          value: selectedRecord?.employee._id,
                        }
                      : null
                  }
                />
              )}
            />
            <Controller
              name="weight"
              control={control}
              rules={{ required: "Weight is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Weight (kg)"
                  fullWidth
                  margin="normal"
                  type="number"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="height"
              control={control}
              rules={{ required: "Height is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Height (cm)"
                  fullWidth
                  margin="normal"
                  type="number"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="bmi"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="BMI"
                  fullWidth
                  margin="normal"
                  type="number"
                  InputProps={{ readOnly: true }}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleSaveRecord)} variant="contained" color="primary">
            {editMode ? "Save Changes" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminBMI;
