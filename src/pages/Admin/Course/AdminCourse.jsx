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
    MenuItem
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import axios from "../../../services/api";
import { useForm, Controller } from "react-hook-form";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { ResponsiveTable } from "../../../components/shared/ResponsiveTable";
import { neumorphismStyles } from "../Employee/Style";


const AdminCourse = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const { handleSubmit, control, reset } = useForm();
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

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
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <Box sx={neumorphismStyles.container2}>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4">Courses</Typography>
                <Button sx={neumorphismStyles.button2}
                    variant="outlined"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => handleOpen()}
                >
                    Add Course
                </Button>
            </Grid>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <ResponsiveTable component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={neumorphismStyles.cell}>#</TableCell>
                                <TableCell sx={neumorphismStyles.cell} >Course Name</TableCell>
                                <TableCell sx={neumorphismStyles.cell} >Type</TableCell>
                                {isLargeScreen && <TableCell sx={neumorphismStyles.cell} >Description</TableCell>}
                                {isLargeScreen && <TableCell sx={neumorphismStyles.cell} >Duration</TableCell>}
                                <TableCell sx={neumorphismStyles.cell} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((course, index) => (
                                <React.Fragment key={course._id}>
                                    <TableRow>
                                        <TableCell sx={neumorphismStyles.cell} width="50px">
                                            <Typography variant="body2" fontWeight="bold" textAlign="center">
                                                {index + 1}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={neumorphismStyles.cell} >{course.name}</TableCell>
                                        <TableCell sx={neumorphismStyles.cell} >{course.type}</TableCell>
                                        {isLargeScreen && <TableCell sx={neumorphismStyles.cell} >{course.description}</TableCell>}
                                        {isLargeScreen && <TableCell sx={neumorphismStyles.cell} >{course.duration}</TableCell>}
                                        <TableCell sx={neumorphismStyles.cell} align="right">
                                            <IconButton sx={neumorphismStyles.button} color="primary" onClick={() => toggleRowExpansion(course._id)}>
                                                <Visibility />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>

                                    {expandedRow === course._id && (
                                        <TableRow>
                                            <TableCell sx={neumorphismStyles.cell} colSpan={isLargeScreen ? 5 : 3}>
                                                <Box sx={{ p: 2 }}>
                                                    <Typography><strong>Name:</strong> {course.name}</Typography>
                                                    <Typography><strong>Type:</strong> {course.type}</Typography>
                                                    <Typography><strong>Description:</strong> {course.description}</Typography>
                                                    <Typography><strong>Duration:</strong> {course.duration}</Typography>
                                                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                                                        <Button size='small' sx={neumorphismStyles.button}
                                                            startIcon={<Edit />}
                                                            onClick={() => handleOpen(course)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button size='small' sx={neumorphismStyles.button}
                                                            startIcon={<Delete />}
                                                            onClick={() => handleDeleteCourse(course._id)}
                                                            color="secondary"
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
                    <Button sx={neumorphismStyles.button} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button sx={neumorphismStyles.button} onClick={handleSubmit(handleAddCourse)} color="success">
                        {editMode ? "Save" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminCourse;
