import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Grid, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, MenuItem, FormControl, InputLabel, Select, Tooltip, FormLabel,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import axios from '../../../services/api';
import TuneIcon from '@mui/icons-material/Tune';
import { useForm, Controller } from 'react-hook-form';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AsyncSelect from "react-select/async";
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { neumorphismStyles } from '../Employee/Style';
import { ResponsiveTable } from '../../../components/shared/ResponsiveTable';
import { capitalizeWords, formatDate } from '../../../utils/common';

const AdminLeave = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const { handleSubmit, control, reset, watch, setValue } = useForm();

  const [filters, setFilters] = useState({
    on_leave: '',
    start_date: '',
    end_date: '',
  });

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    fetchLeaveRecords();
  }, [filters]);

  useEffect(() => {
    fetchLeaveRecords();
  }, []);

  useEffect(() => {
    if (selectedRecord && editMode) {
      setValue("leaveType", selectedRecord?.leaveType);
      setValue("startDate", selectedRecord?.startDate.split('T')[0]);
      setValue("endDate", selectedRecord?.endDate.split('T')[0]);
      setValue("resson", selectedRecord?.reason);
      setValue("status", selectedRecord?.status);
    }
  }, [selectedRecord, editMode, setValue]);

  const fetchLeaveRecords = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/leave', { params: filters });
      setLeaveRecords(data?.data);
    } catch (error) {
      console.error('Failed to fetch leave records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async (search = "") => {
    try {
      if (!search) return;
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

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
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
    <Box sx={neumorphismStyles.container2}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Leaves
          <Tooltip title="Filters">
            <IconButton size="small" sx={{ ml: 1, ...neumorphismStyles.button }} color={openFilter ? 'success' : ''} onClick={() => setOpenFilter(prev => !prev)}>
              <TuneIcon />
            </IconButton>
          </Tooltip>
        </Typography>
        <Button sx={neumorphismStyles.button2}
          color="primary"
          variant='outlined'
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Leave

        </Button>
      </Grid>

      {/* Filters */}
      {openFilter && (
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          {/* Leave Status Filter */}
          <Grid item xs={12} md={2.5}>
            <TextField
              select
              fullWidth
              label="Leave Status"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              sx={neumorphismStyles.input}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Grid>

          {/* On Leave Filter */}
          <Grid item xs={12} md={2.5}>
            <TextField
              select
              fullWidth
              label="On Leave"
              value={filters.on_leave}
              onChange={(e) => handleFilterChange("on_leave", e.target.value)}
              sx={neumorphismStyles.input}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">On Leave</MenuItem>
              <MenuItem value="false">Not On Leave</MenuItem>
            </TextField>
          </Grid>

          {/* Start Date Filter */}
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filters.start_date}
              onChange={(e) => handleFilterChange("start_date", e.target.value)}
              sx={neumorphismStyles.input}
            />
          </Grid>

          {/* End Date Filter */}
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filters.end_date}
              onChange={(e) => handleFilterChange("end_date", e.target.value)}
              sx={neumorphismStyles.input}
            />
          </Grid>
        </Grid>
      )}


      {loading ? (
        <LoadingSpinner />
      ) : (
        <ResponsiveTable component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={neumorphismStyles.cell}>#</TableCell>
                <TableCell sx={neumorphismStyles.cell}>Employee</TableCell>
                {isLargeScreen && <TableCell sx={neumorphismStyles.cell}>Leave Type</TableCell>}
                <TableCell sx={neumorphismStyles.cell}>Start Date</TableCell>
                {isLargeScreen && <TableCell sx={neumorphismStyles.cell}>End Date</TableCell>}
                {isLargeScreen && <TableCell sx={neumorphismStyles.cell}>Status</TableCell>}
                <TableCell sx={neumorphismStyles.cell} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRecords.map((record, index) => (
                <React.Fragment key={record._id}>
                  {/* Main Row */}
                  <TableRow>
                    <TableCell sx={neumorphismStyles.cell} width="50px">
                      <Typography variant="body2" fontWeight="bold" textAlign="center">
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell sx={neumorphismStyles.cell}>{record.employee?.name}</TableCell>
                    {isLargeScreen && <TableCell sx={neumorphismStyles.cell}>{record.leaveType}</TableCell>}
                    <TableCell sx={neumorphismStyles.cell}>{formatDate(record.startDate)}</TableCell>
                    {isLargeScreen && <TableCell sx={neumorphismStyles.cell}>{formatDate(record.endDate)}</TableCell>}
                    {isLargeScreen && <TableCell sx={neumorphismStyles.cell}>{capitalizeWords(record.status)}</TableCell>}
                    <TableCell sx={neumorphismStyles.cell} align="right">
                      <IconButton sx={neumorphismStyles.button} color="primary" onClick={() => toggleRowExpansion(record._id)}>
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row */}
                  {expandedRow === record._id && (
                    <TableRow>
                      <TableCell sx={neumorphismStyles.cell} colSpan={7}>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="body2"><strong>Name:</strong> {record.employee?.name}</Typography>
                          <Typography variant="body2"><strong>Leave Type:</strong> {record.leaveType}</Typography>
                          <Typography variant="body2"><strong>Leave Reason:</strong> {record.reason}</Typography>
                          <Typography variant="body2"><strong>Start Date:</strong> {formatDate(record.startDate)}</Typography>
                          <Typography variant="body2"><strong>End Date:</strong> {formatDate(record.endDate)}</Typography>
                          <Typography variant="body2"><strong>Status:</strong> {capitalizeWords(record.status)}</Typography>
                          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button size='small' sx={neumorphismStyles.button} color="secondary" startIcon={<Edit />} onClick={() => handleOpen(record)}>
                              Edit
                            </Button>
                            <Button size='small' sx={neumorphismStyles.button} color="error" startIcon={<Delete />} onClick={() => handleDeleteLeaveRecord(record._id)}>
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
        <DialogTitle>{editMode ? 'Edit Leave Record' : 'Add Leave Record'}</DialogTitle>
        <DialogContent sx={neumorphismStyles.container}>
          <Box component="form" noValidate onSubmit={handleSubmit(handleAddLeaveRecord)} sx={{ mt: 2 }}>
            <Controller
              sx={neumorphismStyles.input}
              name="employee"
              control={control}
              rules={{ required: 'Employee is required' }}
              render={({ field, fieldState }) => (
                <AsyncSelect
                  sx={neumorphismStyles.input}
                  {...field}
                  cacheOptions
                  loadOptions={fetchEmployees}
                  defaultOptions
                  placeholder="Search Employee by Name or Regimental No"
                  styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
                  value={
                    watch("employee")
                      ? watch("employee")
                      : editMode && selectedRecord
                        ? {
                          label: `${selectedRecord?.employee.name} (${selectedRecord?.employee.regimentalNo})`,
                          value: selectedRecord?.employee._id,
                        }
                        : null
                  }
                  onChange={(selected) => field.onChange(selected)} // Ensure onChange updates form state
                />
              )}
            />

            <Controller
              name="leaveType"
              control={control}
              rules={{ required: 'Leave Type is required' }}
              render={({ field, fieldState }) => (
                <FormControl sx={neumorphismStyles.input} fullWidth margin="normal" error={!!fieldState.error}>
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
              name="reason"
              control={control}
              render={({ field }) => (
                <TextField sx={neumorphismStyles.input} {...field} label="Reason" fullWidth margin="normal" />
              )}
            />
            <Controller
              name="status"
              control={control}
              rules={{ required: 'Status is required' }}
              render={({ field, fieldState }) => (
                <FormControl sx={neumorphismStyles.input} fullWidth margin="normal" error={!!fieldState.error}>
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

            <Controller
              name="startDate"
              control={control}
              rules={{ required: 'Start Date is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  sx={neumorphismStyles.input}
                  {...field}
                  label="Start Date"
                  fullWidth
                  margin="normal"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    const newStartDate = new Date(e.target.value);
                    const days = watch("noOfDays") || 0;
                    if (days > 0) {
                      const calculatedEndDate = new Date(newStartDate);
                      calculatedEndDate.setDate(calculatedEndDate.getDate() + parseInt(days));
                      setValue("endDate", calculatedEndDate.toISOString().split("T")[0]); // Updates the End Date
                    }
                  }}
                />
              )}
            />

            <Controller
              name="noOfDays"
              control={control}
              rules={{ required: 'Number of Days is required', min: 1 }}
              render={({ field, fieldState }) => (
                <TextField
                  sx={neumorphismStyles.input}
                  {...field}
                  label="No. of Days"
                  fullWidth
                  margin="normal"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    const days = parseInt(e.target.value, 10);
                    const startDate = watch("startDate");
                    if (startDate && days > 0) {
                      const calculatedEndDate = new Date(startDate);
                      calculatedEndDate.setDate(calculatedEndDate.getDate() + days);
                      setValue("endDate", calculatedEndDate.toISOString().split("T")[0]); // Updates the End Date
                    }
                  }}
                />
              )}
            />

            {/* Auto-filled End Date */}
            <FormControl fullWidth margin="normal">
              <FormLabel sx={{ mb: 1, fontWeight: 'bold' }}>End Date</FormLabel>
              <Box sx={{ ...neumorphismStyles.input, p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="body1">
                  {watch("endDate") ? formatDate(new Date(watch("endDate")), "dd MMM yyyy") : "--"}
                </Typography>
              </Box>
            </FormControl>
            <DialogActions>
              <Button sx={neumorphismStyles.button} onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button sx={neumorphismStyles.button} type="submit" color="primary">
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
