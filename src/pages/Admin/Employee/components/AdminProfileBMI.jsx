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
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useMediaQuery, useTheme } from "@mui/material";
import { styled } from '@mui/system';
import axios from "../../../../services/api";
import { neumorphismStyles } from "../Style";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import { useAuth } from "../../../../context/AuthContext";
import { formatDate } from "../../../../utils/common";

// Styled component for responsiveness
const ResponsiveTable = styled(TableContainer)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    overflowX: 'auto',
  },
}));

const AdminProfileBMI = ({ employeeId }) => {
  const [bmiRecord, setBmiRecord] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null); // To track the expanded row
  const { handleSubmit, control, reset, watch, setValue } = useForm();
  const theme = useTheme();
  const { user } = useAuth();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg")); // Check if screen is large

  // Fetch BMI Records
  useEffect(() => {
    fetchBMIRecords();
  }, []);

  const fetchBMIRecords = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/bmi", { params: { employee_id: employeeId, sort: 'desc' } });
      setBmiRecord(data?.length ? data[0] : null);
    } catch (error) {
      console.error("Failed to fetch BMI records:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add or Update BMI Record
  const handleSaveRecord = async (formData) => {
    try {
      formData = { ...formData, createdAt: new Date() }
      const payload = {
        ...formData,
        employee: employeeId,
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
        {!bmiRecord && (<Button sx={neumorphismStyles.button} startIcon={<Add />} onClick={() => handleOpen()}>
          Add BMI
        </Button>)}
      </Grid>

      {loading ? (
        <LoadingSpinner />
      ) : bmiRecord ? (
        <ResponsiveTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>BMI</TableCell>
                {isLargeScreen && <TableCell>Weight (kg)</TableCell>}
                {isLargeScreen && <TableCell>Height (cm)</TableCell>}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Main Row */}
              <TableRow>
                <TableCell>{bmiRecord.bmi}</TableCell>
                {isLargeScreen && <TableCell>{bmiRecord.weight}</TableCell>}
                {isLargeScreen && <TableCell>{bmiRecord.height}</TableCell>}
                <TableCell align="right">
                  <IconButton
                    sx={neumorphismStyles.button}
                    color="primary"
                    onClick={() => toggleRowExpansion(bmiRecord._id)}
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>

              {/* Expanded Row */}
              {expandedRow === bmiRecord._id && (
                <TableRow>
                  <TableCell sx={neumorphismStyles.cell} colSpan={isLargeScreen ? 6 : 4}>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="body2">
                        <strong>Weight:</strong> {bmiRecord.weight} kg
                      </Typography>
                      <Typography variant="body2">
                        <strong>Height:</strong> {bmiRecord.height} cm
                      </Typography>
                      <Typography variant="body2">
                        <strong>BMI:</strong> {bmiRecord.bmi}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Created At:</strong> {formatDate(bmiRecord.createdAt)}
                      </Typography>

                      {user?.role === 'admin' && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                          <Button
                            sx={neumorphismStyles.button}
                            variant="outlined"
                            color="primary"
                            size='small'
                            startIcon={<Edit />}
                            onClick={() => handleOpen(bmiRecord)}
                          >
                            Edit
                          </Button>
                          <Button
                            sx={neumorphismStyles.button}
                            variant="outlined"
                            size='small'
                            color="secondary"
                            startIcon={<Delete />}
                            onClick={() => handleDeleteRecord(bmiRecord._id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ResponsiveTable>
      ) : (
        <Typography sx={{ textAlign: "center", color: "#777" }}>No BMI record found</Typography>
      )}


      {/* Modal for Add/Edit */}
      <Dialog open={open} onClose={handleClose} fullWidth >
        <DialogTitle>{editMode ? "Edit BMI Record" : "Add BMI Record"}</DialogTitle>
        <DialogContent sx={neumorphismStyles.paper}>
          <Box component="form" noValidate onSubmit={handleSubmit(handleSaveRecord)} sx={{ mt: 2 }}>
            <Controller
              sx={neumorphismStyles.input}
              name="weight"
              control={control}
              rules={{ required: "Weight is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Weight (kg)"
                  fullWidth
                  sx={neumorphismStyles.input}
                  margin="normal"
                  type="number"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="height"
              sx={neumorphismStyles.input}
              control={control}
              rules={{ required: "Height is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Height (cm)"
                  sx={neumorphismStyles.input}
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
                  sx={neumorphismStyles.input}
                  fullWidth
                  margin="normal"
                  type="number"
                  InputProps={{ readOnly: true }}
                />
              )}
            />
          </Box>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" sx={neumorphismStyles.button}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(handleSaveRecord)} variant="outlined" color="secondary" sx={neumorphismStyles.button}>
              {editMode ? "Save Changes" : "Add"}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminProfileBMI;
