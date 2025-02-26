import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Grid, Button, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import axios from '../../../services/api';
import { useForm, Controller } from 'react-hook-form';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { neumorphismStyles } from '../Employee/Style';
import { ResponsiveTable } from '../../../components/shared/ResponsiveTable';
import { formatDate } from '../../../utils/common';
import TuneIcon from '@mui/icons-material/Tune';

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
  const [statusFilter, setStatusFilter] = useState('');
  const [openFilter, setOpenFilter] = useState(false);
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    fetchEquipment();
    fetchCategories();
  }, [statusFilter]);

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
      setValue('status', selectedRecord.status);
    }
  }, [selectedRecord, editMode, setValue]);

  // Fetch all equipment records
  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/equipment', {
        params: { status: statusFilter },
      });
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
    setExpandedRow(expandedRow === id ? null : id);
  };
  return (
    <Box sx={neumorphismStyles.container2}>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Equipment
          <Tooltip title="Filters">
            <IconButton size="small" sx={{ ml: 1, ...neumorphismStyles.button }} color={openFilter ? 'success' : ''} onClick={() => setOpenFilter(prev => !prev)}>
              <TuneIcon />
            </IconButton>
          </Tooltip>
        </Typography>

        <Button sx={neumorphismStyles.button2}
          variant="outlined"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Equipment
        </Button>
      </Grid>

      {/* Filters */}
      {openFilter && (<Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={2.5}>
          <FormControl sx={{ minWidth: 180, my: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select
              sx={neumorphismStyles.input}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="In Use">In Use</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
              <MenuItem value="Retired">Retired</MenuItem>
            </Select>
          </FormControl>
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
                <TableCell sx={neumorphismStyles.cell}>Name</TableCell>
                <TableCell sx={neumorphismStyles.cell}>Category</TableCell>
                {isLargeScreen && <TableCell sx={neumorphismStyles.cell}>Status</TableCell>}
                <TableCell sx={neumorphismStyles.cell} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipment.map((record, index) => (
                <React.Fragment key={record._id}>
                  <TableRow >
                    <TableCell sx={neumorphismStyles.cell} width="50px">
                      <Typography variant="body2" fontWeight="bold" textAlign="center">
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell sx={neumorphismStyles.cell}>{record.name}</TableCell>
                    <TableCell sx={neumorphismStyles.cell}>{record.category.name}</TableCell>
                    {isLargeScreen && <TableCell sx={neumorphismStyles.cell}>{record.status}</TableCell>}
                    <TableCell sx={neumorphismStyles.cell} align="right">
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
                      <TableCell sx={neumorphismStyles.cell} colSpan={isLargeScreen ? 5 : 3}>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="body2">
                            <strong>Name:</strong> {record.name}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Purchase Date:</strong> {formatDate(record.purchaseDate)}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Category:</strong> {record.category?.name}
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
                            <strong>Last Serviced:</strong> {formatDate(record.lastServiced)}
                          </Typography>}
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
                              onClick={() => handleDeleteEquipment(record._id)}
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

export default AdminEquipment;
