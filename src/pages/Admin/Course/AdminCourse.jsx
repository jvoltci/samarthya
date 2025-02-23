import React, { useState, useEffect } from "react";
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
    CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { styled } from "@mui/system";
import axios from "../../../services/api";
import { useForm, Controller } from "react-hook-form";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Styled Table for responsiveness
const ResponsiveTable = styled(TableContainer)(({ theme }) => ({
    [theme.breakpoints.down("md")]: {
        overflowX: "auto",
    },
}));

const AdminCourse = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null); // To track expanded rows
    const { handleSubmit, control, reset } = useForm();

    // Material-UI useTheme and useMediaQuery for responsive design
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg")); // Check if screen is large

    useEffect(() => {
        fetchCourses();
    }, []);

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

    const handleAddCourse = async (formData) => {
        try {
            if (editMode) {
                await axios.put(`/course/${selectedCourse._id}`, formData);
            } else {
                await axios.post("/course", formData);
            }
            fetchCourses();
            handleClose();
        } catch (error) {
            console.error("Failed to save course:", error);
        }
    };

    const handleDeleteCourse = async (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await axios.delete(`/course/${id}`);
                fetchCourses();
            } catch (error) {
                console.error("Failed to delete course:", error);
            }
        }
    };

    const handleOpen = (course = null) => {
        setEditMode(!!course);
        setSelectedCourse(course);
        reset(course || { name: "", type: "", description: "", duration: "" });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCourse(null);
        setEditMode(false);
    };

    const toggleRowExpansion = (id) => {
        setExpandedRow(expandedRow === id ? null : id); // Toggle row expansion
    };

    return (
        <Box sx={{ p: 2 }}>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4">Courses</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => handleOpen()}
                >
                    Add Course
                </Button>
            </Grid>

            {loading ? (
                <CircularProgress />
            ) : (
                <ResponsiveTable component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Course Name</TableCell>
                                <TableCell>Type</TableCell>
                                {isLargeScreen && <TableCell>Description</TableCell>}
                                {isLargeScreen && <TableCell>Duration</TableCell>}
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((course) => (
                                <React.Fragment key={course._id}>
                                    {/* Main Row */}
                                    <TableRow>
                                        <TableCell>{course.name}</TableCell>
                                        <TableCell>{course.type}</TableCell>
                                        {isLargeScreen && <TableCell>{course.description}</TableCell>}
                                        {isLargeScreen && <TableCell>{course.duration}</TableCell>}
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => toggleRowExpansion(course._id)}
                                            >
                                                <Visibility />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>

                                    {/* Expanded Row */}
                                    {expandedRow === course._id && (
                                        <TableRow>
                                            <TableCell colSpan={isLargeScreen ? 5 : 3} sx={{ backgroundColor: "#f9f9f9" }}>
                                                <Box sx={{ p: 2 }}>
                                                    <Typography variant="body2">
                                                        <strong>Name:</strong> {course.name}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Type:</strong> {course.type}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Description:</strong> {course.description}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Duration:</strong> {course.duration}
                                                    </Typography>
                                                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            startIcon={<Edit />}
                                                            onClick={() => handleOpen(course)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            startIcon={<Delete />}
                                                            onClick={() => handleDeleteCourse(course._id)}
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
                <DialogTitle>{editMode ? "Edit Course" : "Add Course"}</DialogTitle>
                <DialogContent>
                    <Box component="form" noValidate onSubmit={handleSubmit(handleAddCourse)} sx={{ mt: 2 }}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Course name is required" }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Course Name"
                                    fullWidth
                                    margin="normal"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        <Controller
                            name="type"
                            control={control}
                            rules={{ required: "Type is required" }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Type"
                                    fullWidth
                                    margin="normal"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                >
                                    <MenuItem value="internal">Internal</MenuItem>
                                    <MenuItem value="external">External</MenuItem>
                                </TextField>
                            )}
                        />
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description"
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={4}
                                />
                            )}
                        />
                        <Controller
                            name="duration"
                            control={control}
                            rules={{ required: "Duration is required" }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Duration (e.g., 2 hours)"
                                    fullWidth
                                    margin="normal"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit(handleAddCourse)} variant="contained" color="primary">
                        {editMode ? "Save Changes" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminCourse;
