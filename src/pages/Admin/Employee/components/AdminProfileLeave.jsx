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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormLabel,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import axios from '../../../../services/api';
import { neumorphismStyles } from '../Style';
import LoadingSpinner from '../../../../components/shared/LoadingSpinner';
import { useAuth } from '../../../../context/AuthContext';
import { capitalizeWords, formatDate } from '../../../../utils/common';



const AdminProfileLeave = ({ employeeId }) => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const { handleSubmit, control, reset, watch, setValue } = useForm();
  const { user } = useAuth();

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    if (employeeId) fetchLeaveRecords();
  }, [employeeId]);

  const fetchLeaveRecords = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/leave`, { params: { employee_id: employeeId } });
      setLeaveRecords(data?.data);
    } catch (error) {
      console.error('Failed to fetch leave records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRecord && editMode) {
      setValue("startDate", selectedRecord?.startDate.split('T')[0]);
      setValue("endDate", selectedRecord?.endDate.split('T')[0]);
    }
  }, [selectedRecord, editMode, setValue]);

  const handleAddLeaveRecord = async (formData) => {
    try {
      const payload = { ...formData, employee: employeeId };
      if (editMode) {
        await axios.put(`/leave/${selectedRecord._id}`, payload);
      } else {
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
    reset(record || { leaveType: '', startDate: '', endDate: '', reason: '', status: 'pending' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRecord(null);
    setEditMode(false);
  };

  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <Box sx={neumorphismStyles.container}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Leave</Typography>
        <Button sx={neumorphismStyles.button} startIcon={<Add />} onClick={() => handleOpen()}>
          Add Leave
        </Button>
      </Grid>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <TableContainer component={Paper} sx={neumorphismStyles.paper}>
          <Table>
            <TableHead>
              <TableRow>
                
                <TableCell>Leave Type</TableCell>
                <TableCell>Start Date</TableCell>
                {isLargeScreen && <TableCell>End Date</TableCell>}
                {isLargeScreen && <TableCell>Status</TableCell>}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRecords.map((record) => (
                <React.Fragment key={record._id}>
                  <TableRow>
                    <TableCell><strong>{record.leaveType}</strong></TableCell>
                    <TableCell>{formatDate(record.startDate)}</TableCell>
                    {isLargeScreen && <TableCell>{formatDate(record.endDate)}</TableCell>}
                    {isLargeScreen && <TableCell>{capitalizeWords(record.status)}</TableCell>}
                    <TableCell align="right">
                      <IconButton
                        sx={neumorphismStyles.button}
                        color="primary"
                        onClick={() => toggleRowExpansion(record._id)}
                      >
                        <Visibility />
                      </IconButton>

                    </TableCell>
                  </TableRow>
                  {/* Expanded Row */}
                  {expandedRow === record._id && (
                    <TableRow sx={neumorphismStyles.paper}>
                      <TableCell sx={neumorphismStyles.cell} colSpan={6} >
                        <Box sx={{ p: 2 }}>
                          <Typography variant="body2">
                            <strong>Leave Type:</strong> {record.leaveType}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Leave Reason:</strong> {record.reason}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Start Date:</strong> {formatDate(record.startDate)}
                          </Typography>
                          <Typography variant="body2">
                            <strong>End Date:</strong> {formatDate(record.endDate)}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Status:</strong> {capitalizeWords(record.status)}
                          </Typography>
                          {user?.role === 'admin' && (<Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button size='small' sx={neumorphismStyles.button} variant="outlined" color="secondary" startIcon={<Edit />} onClick={() => handleOpen(record)}>
                              Edit
                            </Button>
                            <Button size='small' sx={neumorphismStyles.button} variant="outlined" color="primary" startIcon={<Delete />} onClick={() => handleDeleteLeaveRecord(record._id)}>
                              Delete
                            </Button>
                          </Box>)}
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

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editMode ? 'Edit Leave Record' : 'Add Leave Record'}</DialogTitle>
        <DialogContent sx={neumorphismStyles.paper}>
          <Box component="form" noValidate onSubmit={handleSubmit(handleAddLeaveRecord)} sx={{ mt: 2 }}>

            {/* Leave Type */}
            <Controller
              name="leaveType"
              control={control}
              rules={{ required: 'Leave Type is required' }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" sx={neumorphismStyles.input}>
                  <InputLabel>Leave Type</InputLabel>
                  <Select {...field}>
                    <MenuItem value="EL">EL</MenuItem>
                    <MenuItem value="CL">CL</MenuItem>
                    <MenuItem value="SL">SL</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            {/* Start Date */}
            <Controller
              name="startDate"
              control={control}
              rules={{ required: 'Start Date is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={watch("startDate") ? formatDate(new Date(watch("startDate")), "dd MMM yyyy") : "Start Date"}
                  fullWidth
                  margin="normal"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={neumorphismStyles.input}
                  onChange={(e) => {
                    field.onChange(e);
                    const startDate = new Date(e.target.value);
                    if (watch("noOfDays")) {
                      const calculatedEndDate = new Date(startDate);
                      calculatedEndDate.setDate(calculatedEndDate.getDate() + Number(watch("noOfDays")) - 1);
                      setValue("endDate", calculatedEndDate.toISOString().split("T")[0]);
                    }
                  }}
                />
              )}
            />

            {/* No. of Days */}
            <Controller
              name="noOfDays"
              control={control}
              rules={{ required: 'No. of days is required', min: 1 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="No. of Days"
                  fullWidth
                  margin="normal"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={neumorphismStyles.input}
                  onChange={(e) => {
                    field.onChange(e);
                    const startDate = new Date(watch("startDate"));
                    if (startDate && e.target.value) {
                      const calculatedEndDate = new Date(startDate);
                      calculatedEndDate.setDate(calculatedEndDate.getDate() + Number(e.target.value) - 1);
                      setValue("endDate", calculatedEndDate.toISOString().split("T")[0]);
                    }
                  }}
                />
              )}
            />

            {/* Auto-filled End Date */}
            <FormControl fullWidth margin="normal">
              <FormLabel sx={{ mb: 1, fontWeight: 'bold' }}>End Date</FormLabel>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Box sx={{ ...neumorphismStyles.input, p: 2, borderRadius: 2, backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                    <Typography variant="body1">
                      {watch("endDate") ? formatDate(new Date(watch("endDate")), "dd MMM yyyy") : "--"}
                    </Typography>
                  </Box>
                )}
              />
            </FormControl>


            <DialogActions>
              <Button onClick={handleClose} variant={'outlined'} sx={neumorphismStyles.button}>Cancel</Button>
              <Button type="submit" color="secondary" variant={'outlined'} sx={neumorphismStyles.button}>Save</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default AdminProfileLeave;
