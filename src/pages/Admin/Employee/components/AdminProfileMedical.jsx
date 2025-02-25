import React, { useState, useEffect } from 'react';
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import axios from '../../../../services/api';
import { neumorphismStyles } from '../Style';
import LoadingSpinner from '../../../../components/shared/LoadingSpinner';
import { useAuth } from '../../../../context/AuthContext';

// Styled components for responsive layouts
const ResponsiveTable = styled(TableContainer)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    overflowX: 'auto',
  },
}));

const AdminProfileMedical = ({ employeeId }) => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { handleSubmit, control, reset, setValue } = useForm();
  const [expandedRow, setExpandedRow] = useState(null); // To track the expanded row
  const { user } = useAuth();
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
      const { data } = await axios.get('/medical', { params: { employee_id: employeeId } });
      setMedicalRecords(data);
    } catch (error) {
      console.error('Failed to fetch medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicalRecord = async (formData) => {
    try {
      const payload = {
        ...formData,
        employee: employeeId,
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
    <Box sx={{ p: 2 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Medical</Typography>
        {!medicalRecords.length && (<Button
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          size='small'
          sx={neumorphismStyles.button}
        >
          Add Record
        </Button>)}
      </Grid>

      {loading ? (
        <LoadingSpinner />
      ) : (

        medicalRecords.length ? medicalRecords.map((record) => (<ResponsiveTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                {isLargeScreen && <TableCell>Date</TableCell>}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              <React.Fragment key={record._id}>
                {/* Main Row */}
                <TableRow>
                  <TableCell>{record.category}</TableCell>
                  {isLargeScreen && <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>}
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
                  <TableRow>
                    <TableCell colSpan={isLargeScreen ? 5 : 3} sx={neumorphismStyles.cell}>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="body2">
                          <strong>Employee Details:</strong> {record.employee?.name} ({record.employee?.regimentalNo})
                        </Typography>
                        <Typography variant="body2">
                          <strong>Date:</strong> {new Date(record.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Category:</strong> {record.category}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Description:</strong> {record.description}
                        </Typography>
                        {user?.role === 'admin' && (<Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                          <Button
                            sx={neumorphismStyles.button}
                            variant="outlined"
                            color="secondary"
                            startIcon={<Edit />}
                            onClick={() => handleOpen(record)}
                          >
                            Edit
                          </Button>
                          <Button
                            sx={neumorphismStyles.button}
                            variant="outlined"
                            color="primary"
                            startIcon={<Delete />}
                            onClick={() => handleDeleteMedicalRecord(record._id)}
                          >
                            Delete
                          </Button>
                        </Box>)}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            </TableBody>
          </Table>
        </ResponsiveTable>)) : null)
      }

      {/* Modal for Add/Edit */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editMode ? 'Edit Medical Record' : 'Add Medical Record'}</DialogTitle>
        <DialogContent sx={neumorphismStyles.paper}>
          <Box component="form" noValidate onSubmit={handleSubmit(handleAddMedicalRecord)} sx={{ mt: 2 }}>
            <Controller
              name="date"
              control={control}
              rules={{ required: 'Date is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  sx={neumorphismStyles.input}
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
                <FormControl fullWidth margin="normal" error={!!fieldState.error} sx={neumorphismStyles.input}>
                  <InputLabel>Category</InputLabel>
                  <Select {...field}>
                    <MenuItem value="SHAPE1">SHAPE1</MenuItem>
                    <MenuItem value="SHAPE5">SHAPE5</MenuItem>
                  </Select>
                  {fieldState.error && <span>{fieldState.error.message}</span>}
                </FormControl>
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField sx={neumorphismStyles.input} {...field} label="Description" fullWidth margin="normal" />
              )}
            />
            <DialogActions>
              <Button sx={neumorphismStyles.button} onClick={handleClose} variant={'outlined'} color="secondary">
                Cancel
              </Button>
              <Button sx={neumorphismStyles.button} variant={'outlined'} type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminProfileMedical;
