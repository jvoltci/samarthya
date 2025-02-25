import React from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { initialFormData } from '../AdminEmployee';
import LoadingSpinner from '../../../../components/shared/LoadingSpinner';

const EmployeeForm = ({
  formData,
  setFormData,
  handleSubmit,
  openDialog,
  setOpenDialog,
  loading,
  isEditMode,
  setIsEditMode
}) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    return formData.name && formData.phone && formData.dob;
  };

  const handlClose = () => {
    setIsEditMode(false)
    setOpenDialog(false)
    setFormData(initialFormData)
  }

  return (
    <Dialog open={openDialog} onClose={() => handlClose()}>
      <DialogTitle>{isEditMode ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Phone"
          name="phone"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <TextField
          label="Date of Birth"
          name="dob"
          variant="outlined"
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.dob}
          onChange={handleChange}
          required
        />

        {/* Role Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            label="Role"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="employee">Employee</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Regimental ID"
          name="regimentalNo"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={formData.regimentalNo}
          onChange={handleChange}
        />

        {/* Rank Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Rank</InputLabel>
          <Select
            name="rank"
            value={formData.rank}
            onChange={handleChange}
            label="Rank"
          >
            <MenuItem value="Junior">Junior</MenuItem>
            <MenuItem value="Senior">Senior</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Date of Joining"
          name="doj"
          variant="outlined"
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.doj}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handlClose()} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={loading || !isFormValid()}
        >
          {loading ? <LoadingSpinner /> : isEditMode ? 'Update Employee' : 'Add Employee'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;
