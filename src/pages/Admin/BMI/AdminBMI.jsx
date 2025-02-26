import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Button,
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
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete, Visibility, Search } from "@mui/icons-material";
import axios from "../../../services/api";
import { useForm, Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { useMediaQuery, useTheme } from "@mui/material";
import TuneIcon from '@mui/icons-material/Tune';
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { neumorphismStyles } from "../Employee/Style";
import { ResponsiveTable } from "../../../components/shared/ResponsiveTable";


const AdminBMI = () => {
  const [bmiRecords, setBmiRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null); // To track the expanded row
  const { handleSubmit, control, reset, watch, setValue } = useForm();
  const theme = useTheme();
  const [openFilter, setOpenFilter] = useState(false);
  const [bmiFilter, setBmiFilter] = useState('');
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg")); // Check if screen is large

  // Fetch BMI Records
  useEffect(() => {
    fetchBMIRecords();
  }, []);

  const fetchBMIRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/bmi?bmi=${bmiFilter}`);
      setBmiRecords(response.data);
    } catch (error) {
      console.error("Error fetching BMI records:", error);
    }
    setLoading(false);
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
        bmi: ""
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
    <Box sx={neumorphismStyles.container2}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">BMI
          <Tooltip title="Filters">
            <IconButton size="small" sx={{ ml: 1, ...neumorphismStyles.button }} color={openFilter ? 'success' : ''} onClick={() => setOpenFilter(prev => !prev)}>
              <TuneIcon />
            </IconButton>
          </Tooltip>
        </Typography>
        <Button sx={neumorphismStyles.button2} variant='outlined' color="primary" startIcon={<Add />} onClick={() => handleOpen()}>
          Add BMI
        </Button>
      </Grid>

      {/* Filters */}
      {openFilter && (<Grid container spacing={2} sx={{ mb: 2 }}>

        <Grid item xs={6} md={2}>
          <TextField
            label="BMI (Greater Than)"
            type="number"
            value={bmiFilter}
            onChange={(e) => setBmiFilter(e.target.value)}
            sx={{ mb: 2, width: 250, ...neumorphismStyles.input }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => fetchBMIRecords()} color="primary">
                  <Search />
                </IconButton>
              ),
            }}
          />
        </Grid>
      </Grid>)}




      {loading ? (
        <LoadingSpinner />
      ) : (
        <ResponsiveTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={neumorphismStyles.cell}>#</TableCell>
                <TableCell sx={neumorphismStyles.cell} >Employee</TableCell>
                {isLargeScreen && <TableCell sx={neumorphismStyles.cell} >Weight (kg)</TableCell>}
                {isLargeScreen && <TableCell sx={neumorphismStyles.cell} >Height (cm)</TableCell>}
                <TableCell sx={neumorphismStyles.cell} >BMI</TableCell>
                <TableCell sx={neumorphismStyles.cell} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bmiRecords.map((record, index) => (
                <React.Fragment key={record._id}>
                  {/* Main Row */}
                  <TableRow>
                    <TableCell sx={neumorphismStyles.cell} width="50px">
                      <Typography variant="body2" fontWeight="bold" textAlign="center">
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell sx={neumorphismStyles.cell} >{`${record.employee?.name} (${record.employee?.regimentalNo})`}</TableCell>
                    {isLargeScreen && <TableCell sx={neumorphismStyles.cell} >{record.weight}</TableCell>}
                    {isLargeScreen && <TableCell sx={neumorphismStyles.cell} >{record.height}</TableCell>}
                    <TableCell sx={neumorphismStyles.cell} >{record.bmi}</TableCell>
                    <TableCell sx={neumorphismStyles.cell} align="right">
                      <IconButton sx={neumorphismStyles.button} color="primary" onClick={() => toggleRowExpansion(record._id)}>
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row */}
                  {expandedRow === record._id && (
                    <TableRow>
                      <TableCell sx={neumorphismStyles.cell} colSpan={isLargeScreen ? 6 : 4}>
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
                          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button sx={neumorphismStyles.button}
                              color="primary"
                              size='small'
                              startIcon={<Edit />}
                              onClick={() => handleOpen(record)}
                            >
                              Edit
                            </Button>
                            <Button sx={neumorphismStyles.button}
                              color="secondary"
                              size='small'
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
        <DialogContent sx={neumorphismStyles.container}>
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
          <DialogActions>
          <Button sx={neumorphismStyles.button} onClick={handleClose} >
            Cancel
          </Button>
          <Button sx={neumorphismStyles.button} onClick={handleSubmit(handleSaveRecord)} color="success">
            {editMode ? "Save" : "Add"}
          </Button>
        </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminBMI;
