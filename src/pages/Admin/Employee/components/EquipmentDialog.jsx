import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "../../../../services/api";
import { neumorphismStyles } from "../Style";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";

const EquipmentDialog = ({ open, onClose, employee, setEmployee }) => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all available equipment
  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/equipment");
        setEquipmentList(data);
      } catch (error) {
        console.error("Failed to fetch equipment:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchEquipment();
  }, [open]);

  // Add equipment to employee
  const handleAddEquipment = async (equipment) => {
    try {
      await axios.post(`/employee/equipment/${equipment._id}`, { employee_id: employee._id });

      setEmployee((prev) => ({
        ...prev,
        equipment: [...prev.equipment, { ...equipment }],
      }));
    } catch (error) {
      console.error("Failed to add equipment:", error);
    }
  };

  // Remove equipment from employee
  const handleRemoveEquipment = async (equipmentId) => {
    try {
      await axios.delete(`/employee/equipment/${equipmentId}`, {
        data: { employee_id: employee._id }, // `data` is required for DELETE requests with body
      });

      setEmployee((prev) => ({
        ...prev,
        equipment: prev.equipment.filter((eq) => eq._id !== equipmentId),
      }));
    } catch (error) {
      console.error("Failed to remove equipment:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Manage Equipment</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <List>
            {equipmentList.map((equipment) => {
              const isAssigned = employee.equipment.some((eq) => eq._id === equipment._id);

              return (
                <ListItem key={equipment._id} divider>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {equipment.name} ({equipment.category?.name})
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        Status: {equipment.status}
                      </Typography>
                    }
                  />
                  <Tooltip title={isAssigned ? "Remove Equipment" : "Assign Equipment"}>
                    <IconButton
                      sx={neumorphismStyles.button}
                      onClick={() =>
                        isAssigned ? handleRemoveEquipment(equipment._id) : handleAddEquipment(equipment)
                      }
                      color={isAssigned ? "secondary" : "primary"}
                    >
                      {isAssigned ? <RemoveIcon /> : <AddIcon />}
                    </IconButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button sx={neumorphismStyles.button} onClick={onClose} variant='outlined' color='secondary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EquipmentDialog;
