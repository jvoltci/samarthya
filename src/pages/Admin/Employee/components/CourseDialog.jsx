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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "../../../../services/api";
import { neumorphismStyles } from "../Style";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";

const CourseDialog = ({ open, onClose, employee, setEmployee }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/course");
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchCourses();
  }, [open]);

  // Add course to employee
  const handleAddCourse = async (course) => {
    try {
      await axios.post(`/employee/course/${course._id}`, { employee_id: employee._id});

      setEmployee((prev) => ({
        ...prev,
        courses: [...prev.courses, { ...course }],
      }));
    } catch (error) {
      console.error("Failed to add course:", error);
    }
  };

  // Remove course from employee
  const handleRemoveCourse = async (courseId) => {
    try {
        await axios.delete(`/employee/course/${courseId}`, { employee_id: employee._id});

      setEmployee((prev) => ({
        ...prev,
        courses: prev.courses.filter((course) => course._id !== courseId),
      }));
    } catch (error) {
      console.error("Failed to remove course:", error);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Manage Courses</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <List>
            {courses.map((course) => {
              const isAssigned = employee.courses.some((c) => c._id === course._id);

              return (
                <ListItem key={course._id}>
                  <ListItemText primary={course.name} />
                  <IconButton
                    sx={neumorphismStyles.button}
                    onClick={() =>
                      isAssigned ? handleRemoveCourse(course._id) : handleAddCourse(course)
                    }
                    color={isAssigned ? "secondary" : "primary"}
                  >
                    {isAssigned ? <RemoveIcon /> : <AddIcon />}
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button sx={neumorphismStyles.button} onClick={onClose} variant='outlined' color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseDialog;
