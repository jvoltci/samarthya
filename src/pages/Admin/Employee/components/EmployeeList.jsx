import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const EmployeeList = ({ employees, onEdit, onDelete }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState(null);
  
  const navigate = useNavigate();

  const handleViewProfile = (employeeId) => {
    navigate(`/admin/employee/${employeeId}`);
  };

  const handleDeleteClick = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await onDelete(selectedEmployeeId);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedEmployeeId(null);
  };

  return (
    <div>
      <List>
        {employees.map((employee) => (
          <ListItem
            key={employee._id}
            sx={{ borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between' }}
          >
            <ListItemText
              primary={employee.name}
              secondary={`Regimental: ${employee.regimentalNo}${employee.phone ? ', Phone: ' + employee.phone : ''}`}
            />
            <div>
              <Tooltip title="View Details">
                <IconButton onClick={() => handleViewProfile(employee._id)}>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title="Edit Employee">
                <IconButton onClick={() => onEdit(employee)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Employee">
                <IconButton onClick={() => handleDeleteClick(employee._id)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip> */}
            </div>
          </ListItem>
        ))}
      </List>

      {/* Delete Confirmation Dialog */}
      {/* <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this employee? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
};

export default EmployeeList;
