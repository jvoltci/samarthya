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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import axios from '../../../services/api';
import { useForm, Controller } from 'react-hook-form';
import AsyncSelect from "react-select/async";
import { styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Styled components for responsive layouts
const ResponsiveTable = styled(TableContainer)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    overflowX: 'auto',
  },
}));

const AdminEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { handleSubmit, control, reset, setValue } = useForm();
  const [expandedRow, setExpandedRow] = useState(null); // To track the expanded row
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  // Fetch equipment records and categories from the API
  useEffect(() => {
    fetchEquipment();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedRecord && editMode) {
      setValue('name', selectedRecord.name);
      setValue('purchaseDate', selectedRecord.purchaseDate.split('T')[0]);
      setValue("category", selectedRecord?.category._id);
      setValue('isServiceable', selectedRecord.isServiceable);
      setValue('description', selectedRecord.description);
      setValue('remarks', selectedRecord.remarks);
      setValue('manufacturer', selectedRecord.manufacturer);
      setValue('warrantyPeriod', selectedRecord.warrantyPeriod);
      setValue('lastServiced', selectedRecord.purchaseDate.split('T')[0]);
      setValue('assignedTo', selectedRecord.assignedTo._id);
      setValue('status', selectedRecord.status);
    }
  }, [selectedRecord, editMode, setValue]);

  // Fetch all equipment records
  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/equipment');
      setEquipment(data);
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/equipment/category');
      setCategories(data.map((category) => ({
        label: category.name,
        value: category._id,
      })));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
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


  // Handle adding or editing equipment record
  const handleAddEquipment = async (formData) => {
    try {
      const payload = {
        ...formData,
        category: formData.category,
        purchaseDate: new Date(formData.purchaseDate),
        lastServiced: formData.lastServiced ? new Date(formData.lastServiced) : null,
      };
      if (editMode) {
        await axios.put(`/equipment/${selectedRecord._id}`, payload);
      } else {
        await axios.post('/equipment', payload);
      }
      fetchEquipment();
      handleClose();
    } catch (error) {
      console.error('Failed to save equipment:', error);
    }
  };

  // Handle deleting equipment record
  const handleDeleteEquipment = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await axios.delete(`/equipment/${id}`);
        fetchEquipment();
      } catch (error) {
        console.error('Failed to delete equipment:', error);
      }
    }
  };

  // Open modal for adding/editing equipment
  const handleOpen = (record = null) => {
    setEditMode(!!record);
    setSelectedRecord(record);
    reset(record || {
      name: '',
      purchaseDate: '',
      category: '',
      isServiceable: false,
      description: '',
      remarks: '',
      manufacturer: '',
      warrantyPeriod: '',
      lastServiced: '',
      assignedTo: '',
      status: 'In Use',
    });
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedRecord(null);
    setEditMode(false);
  };

  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id); // Toggle row expansion
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Equipment</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Equipment
        </Button>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        <ResponsiveTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                {isLargeScreen && <TableCell>Status</TableCell>}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipment.map((record) => (
                <React.Fragment key={record._id}>
                  <TableRow >
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.category.name}</TableCell>
                    {isLargeScreen && <TableCell>{record.status}</TableCell>}
                    <TableCell align="right">
                      <IconButton
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
                      <TableCell colSpan={isLargeScreen ? 5 : 3} sx={{ backgroundColor: '#f9f9f9' }}>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="body2">
                            <strong>Name:</strong> {record.name}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Purchase Date:</strong> {new Date(record.purchaseDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Category:</strong> {record.category?.name}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Assigned To:</strong> {record.category?.assignedTo}
                          </Typography>
                          {record.status && <Typography variant="body2">
                            <strong>Status:</strong> {record.status}
                          </Typography>}
                          <Typography variant="body2">
                            <strong>isServiceable:</strong> {record.isServiceable ? "Yes" : "No"}
                          </Typography>
                          {record.description && <Typography variant="body2">
                            <strong>Description:</strong> {record.description}
                          </Typography>}
                          {record.remarks && <Typography variant="body2">
                            <strong>Remarks:</strong> {record.remarks}
                          </Typography>}
                          {record.manufacturer && <Typography variant="body2">
                            <strong>Manufacturer:</strong> {record.manufacturer}
                          </Typography>}
                          {record.warrantyPeriod && <Typography variant="body2">
                            <strong>Warranty Period:</strong> {record.warrantyPeriod}
                          </Typography>}
                          {record.lastServiced && <Typography variant="body2">
                            <strong>Last Serviced:</strong> {new Date(record.lastServiced).toLocaleDateString()}
                          </Typography>}
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
        <DialogTitle>{editMode ? 'Edit Equipment' : 'Add Equipment'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate onSubmit={handleSubmit(handleAddEquipment)} sx={{ mt: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  margin="normal"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="purchaseDate"
              control={control}
              rules={{ required: 'Purchase Date is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Purchase Date"
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
                  <Select value={selectedRecord?.category} {...field}>
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && <span>{fieldState.error.message}</span>}
                </FormControl>
              )}
            />
            <Controller
              name="isServiceable"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} defaultChecked={selectedRecord?.isServiceable} />}
                  label="Is Serviceable?"
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Description" fullWidth margin="normal" />
              )}
            />
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Remarks" fullWidth margin="normal" />
              )}
            />
            <Controller
              name="manufacturer"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Manufacturer" fullWidth margin="normal" />
              )}
            />
            <Controller
              name="warrantyPeriod"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Warranty Period" fullWidth margin="normal" />
              )}
            />
            <Controller
              name="lastServiced"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Last Serviced" fullWidth margin="normal" type="date" InputLabelProps={{ shrink: true }} />
              )}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Assigned To</InputLabel>
              <Controller
                name="assignedTo"
                control={control}
                render={({ field, fieldState }) => (
                  <AsyncSelect
                    {...field}
                    cacheOptions
                    loadOptions={fetchEmployees}
                    defaultOptions
                    placeholder="Search Name or Regimental No"
                    styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
                    value={
                      editMode && selectedRecord && selectedRecord.assignedTo
                        ? {
                          label: `${selectedRecord.assignedTo.name} (${selectedRecord.assignedTo.regimentalNo})`,
                          value: selectedRecord.assignedTo._id,
                        }
                        : null
                    }
                    onChange={(newValue) => field.onChange(newValue ? newValue.value : null)}
                  />
                )}
              />
            </FormControl>

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    {['In Use', 'Available', 'Under Maintenance', 'Retired'].map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
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

export default AdminEquipment;
