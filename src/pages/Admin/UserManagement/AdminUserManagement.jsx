import React, { useState, useEffect } from 'react';
import axios from '../../../services/api';
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography,
  Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip
} from '@mui/material';
import { neumorphismStyles } from '../Employee/Style';
import { Delete } from '@mui/icons-material';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [newUser, setNewUser] = useState({ regimentalNo: '', password: '', role: 'employee', isAdmin: false });
  const [createdUser, setCreatedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/user');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const { data } = await axios.post('/user', newUser);
      setCreatedUser(data);
      setNewUser({ regimentalNo: '', password: '', role: 'employee', isAdmin: false });
      fetchUsers();
      setOpen(false);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const confirmDeleteUser = (id) => {
    setDeleteUserId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteUserId) return;

    try {
      await axios.delete(`/user/${deleteUserId}`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setDeleteDialogOpen(false);
      setDeleteUserId(null);
    }
  };

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setNewUser({
      ...newUser,
      role: selectedRole,
      isAdmin: selectedRole === 'admin'
    });
  };

  return (
    <Box sx={neumorphismStyles.container2}>
      <Typography variant="h4">User Management</Typography>
      <Button sx={neumorphismStyles.button2} variant="outlined" color="success" onClick={() => setOpen(true)}>
        Add User
      </Button>

      {/* User Table */}
      {loading ? (
        <LoadingSpinner />
      ) : (<TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={neumorphismStyles.cell}>#</TableCell>
              <TableCell sx={neumorphismStyles.cell}>Regimental No</TableCell>
              <TableCell sx={neumorphismStyles.cell}>Role</TableCell>
              <TableCell sx={neumorphismStyles.cell}>Password</TableCell>
              <TableCell sx={neumorphismStyles.cell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell sx={neumorphismStyles.cell} width="50px">
                  <Typography variant="body2" fontWeight="bold" textAlign="center">
                    {index + 1}
                  </Typography>
                </TableCell>
                <TableCell sx={neumorphismStyles.cell}>{user.regimentalNo}</TableCell>
                <TableCell sx={neumorphismStyles.cell}>{user.role}</TableCell>
                <TableCell sx={neumorphismStyles.cell}>{user.password}</TableCell>
                <TableCell sx={neumorphismStyles.cell}>
                  <Tooltip title="Delete" arrow>
                    <IconButton
                      sx={{ ...neumorphismStyles.button }}
                      color="error"
                      size="small"
                      onClick={() => confirmDeleteUser(user._id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>)}

      {/* Add User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Regimental No"
            value={newUser.regimentalNo}
            onChange={(e) => setNewUser({ ...newUser, regimentalNo: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Password"
            type="text"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select value={newUser.role} onChange={handleRoleChange}>
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button sx={neumorphismStyles.button} onClick={() => setOpen(false)}>Cancel</Button>
          <Button sx={neumorphismStyles.button} color="success" onClick={handleCreateUser}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button sx={neumorphismStyles.button} onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button sx={neumorphismStyles.button} color="error" onClick={handleDeleteConfirmed}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUserManagement;
