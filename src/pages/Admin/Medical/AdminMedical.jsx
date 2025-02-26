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
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import axios from '../../../services/api';
import { useForm, Controller } from 'react-hook-form';
import AsyncSelect from "react-select/async";
import { styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { ResponsiveTable } from '../../../components/shared/ResponsiveTable';
import { neumorphismStyles } from '../Employee/Style';
import { formatDate } from '../../../utils/common';


const AdminMedical = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { handleSubmit, control, reset, setValue } = useForm();
  const [expandedRow, setExpandedRow] = useState(null);

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  useEffect(() => {
    if (selectedRecord && editMode) {
      setValue("employee", {
        label: `${selectedRecord.employee.name} (${selectedRecord.employee.regimentalNo})`,
        value: selectedRecord.employee._id,
      });
      setValue("date", selectedRecord?.date.split('T')[0]);
      setValue("category", selectedRecord?.category);
      setValue("description", selectedRecord?.description);
    }
  }, [selectedRecord, editMode, setValue]);

  const fetchMedicalRecords = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/medical');
      setMedicalRecords(data);
    } catch (error) {
      console.error('Failed to fetch medical records:', error);
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

  const handleAddMedicalRecord = async (formData) => {
    try {
      const payload = {
        ...formData,
        employee: formData.employee.value,
      };
      if (editMode) {
        await axios.put(`/medical/${selectedRecord._id}`, payload);
      } else {
        await axios.post('/medical', payload);
      }
      fetchMedicalRecords();
      handleClose();
    } catch (error) {
      console.error('Failed to save medical record:', error);
    }
  };

  const handleDeleteMedicalRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this medical record?')) {
      try {
        await axios.delete(`/medical/${id}`);
        fetchMedicalRecords();
      } catch (error) {
        console.error('Failed to delete medical record:', error);
      }
    }
  };

  const handleOpen = (record = null) => {
    setEditMode(!!record);
    setSelectedRecord(record);
    reset(record || { employee: '', date: '', category: '', description: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRecord(null);
    setEditMode(false);
  };

  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id); // Toggle row expansion
  };

  return (
    <Box sx={neumorphismStyles.container2}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Medical</Typography>
        <Button sx={neumorphismStyles.button2}
          variant="outlined"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Record
        </Button>
      </Grid>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <ResponsiveTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={neumorphismStyles.cell}>#</TableCell>
                <TableCell sx={neumorphismStyles.cell}>Employee</TableCell>
                <TableCell sx={neumorphismStyles.cell}>Category</TableCell>
                {isLargeScreen && <TableCell sx={neumorphismStyles.cell}>Date</TableCell>}
                {isLargeScreen && <TableCell sx={neumorphismStyles.cell}>Description</TableCell>}
                <TableCell sx={neumorphismStyles.cell} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicalRecords.map((record, index) => (
                <React.Fragment key={record._id}>
                  {/* Main Row */}
                  <TableRow>
                    <TableCell sx={neumorphismStyles.cell} width="50px">
                      <Typography variant="body2" fontWeight="bold" textAlign="center">
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell sx={neumorphismStyles.cell}>{record.employee?.name}</TableCell>
                    <TableCell sx={neumorphismStyles.cell}>{record.category}</TableCell>
                    {isLargeScreen && <TableCell sx={neumorphismStyles.cell}>{formatDate(record.date)}</TableCell>}
                    {isLargeScreen && <TableCell sx={neumorphismStyles.cell}>{record.description}</TableCell>}
                    <TableCell sx={neumorphismStyles.cell} align="right">
                      <IconButton
                        color="primary"
                        sx={neumorphismStyles.button}
                        onClick={() => toggleRowExpansion(record._id)}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row */}
                  {expandedRow === record._id && (
                    <TableRow>
                      <TableCell sx={neumorphismStyles.cell} colSpan={isLargeScreen ? 5 : 3}>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="body2">
                            <strong>Employee Details:</strong> {record.employee?.name} ({record.employee?.regimentalNo})
                          </Typography>
                          <Typography variant="body2">
                            <strong>Date:</strong> {formatDate(record.date)}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Category:</strong> {record.category}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Description:</strong> {record.description}
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
                              onClick={() => handleDeleteMedicalRecord(record._id)}
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
        <DialogTitle>{editMode ? 'Edit Medical Record' : 'Add Medical Record'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate onSubmit={handleSubmit(handleAddMedicalRecord)} sx={{ mt: 2 }}>
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
              name="date"
              control={control}
              rules={{ required: 'Date is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Date"
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
              name="category"
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field, fieldState }) => (
                <FormControl fullWidth margin="normal" error={!!fieldState.error}>
                  <InputLabel>Category</InputLabel>
                  <Select {...field}>
                    <MenuItem value="SHAPE1">SHAPE1</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {fieldState.error && <span>{fieldState.error.message}</span>}
                </FormControl>
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Description" fullWidth margin="normal" />
              )}
            />
            <DialogActions>
              <Button sx={neumorphismStyles.button} onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button sx={neumorphismStyles.button} type="submit" color="success">
                Save
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminMedical;
