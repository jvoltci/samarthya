import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import axios from '../../../services/api';
import { useForm, Controller } from 'react-hook-form';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AsyncSelect from "react-select/async";

const AdminLeave = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);  // Track which row is expanded
  const { handleSubmit, control, reset } = useForm();

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    fetchLeaveRecords();
  }, []);

  const fetchLeaveRecords = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/leave');
      setLeaveRecords(data);
    } catch (error) {
      console.error('Failed to fetch leave records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async (search = "") => {
    try {
      if(!search) return;
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

  const handleAddLeaveRecord = async (formData) => {
    try {
      if (editMode) {
        await axios.put(`/leave/${selectedRecord._id}`, formData);
      } else {
        const payload = {
          ...formData,
          employee: formData.employee.value,
        };
        await axios.post('/leave', payload);
      }
      fetchLeaveRecords();
      handleClose();
    } catch (error) {
      console.error('Failed to save leave record:', error);
    }
  };

  const handleDeleteLeaveRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave record?')) {
      try {
        await axios.delete(`/leave/${id}`);
        fetchLeaveRecords();
      } catch (error) {
        console.error('Failed to delete leave record:', error);
      }
    }
  };

  const handleOpen = (record = null) => {
    setEditMode(!!record);
    setSelectedRecord(record);
    reset(record || { employee: '', leaveType: '', startDate: '', endDate: '', reason: '', status: 'pending' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRecord(null);
    setEditMode(false);
  };

  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id);  // Toggle row expansion
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Leaves</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Leave
        </Button>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                {isLargeScreen && <TableCell>Leave Type</TableCell>}
                <TableCell>Start Date</TableCell>
                {isLargeScreen && <TableCell>End Date</TableCell>}
                {isLargeScreen && <TableCell>Status</TableCell>}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRecords.map((record) => (
                <React.Fragment key={record._id}>
                  {/* Main Row */}
                  <TableRow>
                    <TableCell>{record.employee?.name}</TableCell>
                    {isLargeScreen && <TableCell>{record.leaveType}</TableCell>}
                    <TableCell>{new Date(record.startDate).toLocaleDateString()}</TableCell>
                    {isLargeScreen && <TableCell>{new Date(record.endDate).toLocaleDateString()}</TableCell>}
                    {isLargeScreen && <TableCell>{record.status}</TableCell>}
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => toggleRowExpansion(record._id)}>
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row */}
                  {expandedRow === record._id && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ backgroundColor: '#f9f9f9' }}>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="body2">
                            <strong>Name:</strong> {record.employee?.name}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Leave Type:</strong> {record.leaveType}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Leave Reason:</strong> {record.reason}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Start Date:</strong> {new Date(record.startDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            <strong>End Date:</strong> {new Date(record.endDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Status:</strong> {record.status}
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
                              onClick={() => handleDeleteLeaveRecord(record._id)}
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
        </TableContainer>
      )}

      {/* Modal for Add/Edit */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editMode ? 'Edit Leave Record' : 'Add Leave Record'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate onSubmit={handleSubmit(handleAddLeaveRecord)} sx={{ mt: 2 }}>
            <Controller
              name="employee"
              control={control}
              rules={{ required: 'Employee is required' }}
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
              name="leaveType"
              control={control}
              rules={{ required: 'Leave Type is required' }}
              render={({ field, fieldState }) => (
                <FormControl fullWidth margin="normal" error={!!fieldState.error}>
                  <InputLabel>Leave Type</InputLabel>
                  <Select {...field}>
                    <MenuItem value="EL">EL</MenuItem>
                    <MenuItem value="CL">CL</MenuItem>
                    <MenuItem value="SL">SL</MenuItem>
                  </Select>
                  {fieldState.error && <span>{fieldState.error.message}</span>}
                </FormControl>
              )}
            />
            <Controller
              name="startDate"
              control={control}
              rules={{ required: 'Start Date is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Start Date"
                  fullWidth
                  margin="normal"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              rules={{ required: 'End Date is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="End Date"
                  fullWidth
                  margin="normal"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Reason" fullWidth margin="normal" />
              )}
            />
            <Controller
              name="status"
              control={control}
              rules={{ required: 'Status is required' }}
              render={({ field, fieldState }) => (
                <FormControl fullWidth margin="normal" error={!!fieldState.error}>
                  <InputLabel>Status</InputLabel>
                  <Select {...field}>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                  {fieldState.error && <span>{fieldState.error.message}</span>}
                </FormControl>
              )}
            />
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminLeave;
