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
  Typography,
  Divider,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { neumorphismStyles } from '../Style';

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
        {employees.map((employee, index) => (
          <React.Fragment key={employee._id}>
            <ListItem
              sx={{
                display: 'flex',
                alignItems: 'center',
                paddingY: 1,
                gap: 1
              }}
            >
              <Typography
                variant="body2"
                sx={{ width: '25px', textAlign: 'center', fontWeight: 'bold', color: 'gray' }}
              >
                {index + 1}.
              </Typography>

              {/* Employee Details */}
              <ListItemText
                primary={employee.name}
                secondary={`Regimental: ${employee.regimentalNo}${employee.phone ? ', Phone: ' + employee.phone : ''}`}
                sx={{ flex: 1 }}
              />

              {/* Actions */}
              <Tooltip title="View Details">
                <IconButton sx={neumorphismStyles.button} color="secondary" onClick={() => handleViewProfile(employee._id)}>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </ListItem>

            {index < employees.length - 1 && <Divider sx={{ backgroundColor: '#e0e0e0' }} />}
          </React.Fragment>
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
