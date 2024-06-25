import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    Table, TableHead, TableBody, TableCell, TableRow, Button, TextField, Dialog, DialogActions,
    DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl, IconButton
} from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';
import './PatientsList.css';

function PatientsList() {
    const [patients, setPatients] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [rights, setRights] = useState([]);
    const { isAuthorized, userId } = useContext(AuthContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [newPatient, setNewPatient] = useState({
        first_name: '',
        last_name: '',
        dob: '',
        gender: '',
        department: '',
    });

    useEffect(() => {
        if (isAuthorized) {
            fetchData();
            fetchRights();
        } else {
            navigate("/login");
        }
    }, [isAuthorized]);

    const fetchData = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "/patients", {
                params: {
                    userId: userId
                }
            });
            setPatients(response.data);

            const updatedPatients = await Promise.all(response.data.map(async (patient) => {
                const department = await getDepartmentDescription(patient.id_right);
                return { ...patient, department };
            }));

            setPatients(updatedPatients);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchRights = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "/api/rights");
            const departmentRights = response.data.filter(right => right.is_department === 1);
            setRights(departmentRights);
        } catch (error) {
            console.error('Error fetching rights:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value.toLowerCase());
    };

    const filterPatients = (patient) => {
        if (!searchText) return true;
        return Object.values(patient).some(value =>
            String(value).toLowerCase().includes(searchText)
        );
    };

    const formatDate = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPatient({ ...newPatient, [name]: value });
    };

    const handleAddPatient = async () => {
        if (!newPatient.first_name || !newPatient.last_name || !newPatient.dob || !newPatient.gender || !newPatient.department) {
            alert('Please fill in all fields.');
            return;
        }

        const today = new Date();
        const dobDate = new Date(newPatient.dob);
        if (dobDate > today) {
            alert('Date of Birth cannot be in the future.');
            return;
        }

        try {
            const response = await axios.post(process.env.REACT_APP_API_ADDRESS + "/patients", newPatient);
            const addedPatient = { ...response.data, department: await getDepartmentDescription(response.data.id_right) };
            setPatients([...patients, addedPatient]);
            setOpen(false);
            setNewPatient({
                first_name: '',
                last_name: '',
                dob: '',
                gender: '',
                department: '',
            });
            fetchData();
            alert('Patient saved successfully.');
        } catch (error) {
            console.error('Error adding patient:', error);
        }
    };

    const handleDeletePatient = async (id) => {
        if (!window.confirm('Are you sure you want to delete this patient?')) {
            return;
        }

        try {
            await axios.delete(process.env.REACT_APP_API_ADDRESS + "/patients/" + id);
            setPatients(patients.filter(patient => patient.id !== id));
            window.location.reload(false);
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    const getDepartmentDescription = async (id_right) => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_ADDRESS + '/rights/' + id_right);
            return response.data.description || 'N/A';
        } catch (error) {
            console.error('Error fetching department description:', error);
            return 'N/A';
        }
    };

    return (
        <div className="container">
            <TextField
                className="filterInput searchContainer"
                label="Search by name..."
                variant="outlined"
                value={searchText}
                onChange={handleSearchChange}
            />
            <IconButton
                className="addButton"
                onClick={handleClickOpen}
            >
                <AddIcon className="icon" />
            </IconButton>
            <div className="tableContainer">
                <Table className="patientTable">
                    <TableHead>
                        <TableRow className="tableHeader">
                            <TableCell className="tableCell">ID</TableCell>
                            <TableCell className="tableCell">First Name</TableCell>
                            <TableCell className="tableCell">Last Name</TableCell>
                            <TableCell className="tableCell">Date Of Birth</TableCell>
                            <TableCell className="tableCell">Gender</TableCell>
                            <TableCell className="tableCell">Department</TableCell>
                            <TableCell className="tableCell"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.filter(filterPatients).map((patient, index) => (
                            <TableRow key={patient.id} className={`tableRow ${index % 2 === 0 ? 'tableRowEven' : ''} tableRowHover`}>
                                <TableCell className="tableCell">{patient.id}</TableCell>
                                <TableCell className="tableCell">{patient.first_name}</TableCell>
                                <TableCell className="tableCell">{patient.last_name}</TableCell>
                                <TableCell className="tableCell">{formatDate(new Date(patient.dob))}</TableCell>
                                <TableCell className="tableCell">{patient.gender}</TableCell>
                                <TableCell className="tableCell">{patient.department}</TableCell>
                                <TableCell className="tableCell">
                                    <IconButton component={Link} to={`/patients/${patient.id}`} className="iconButton">
                                        <InfoIcon />
                                    </IconButton>
                                    <IconButton className="iconButton deleteButton" onClick={() => handleDeletePatient(patient.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="First Name"
                        type="text"
                        fullWidth
                        name="first_name"
                        value={newPatient.first_name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Last Name"
                        type="text"
                        fullWidth
                        name="last_name"
                        value={newPatient.last_name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        name="dob"
                        value={newPatient.dob}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                            max: formatDate(new Date()), 
                        }}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Gender</InputLabel>
                        <Select
                            name="gender"
                            value={newPatient.gender}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Department</InputLabel>
                        <Select
                            name="department"
                            value={newPatient.department}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="">Select Department</MenuItem>
                            {rights.map(right => (
                                <MenuItem key={right.id} value={right.id}>
                                    {right.description}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddPatient} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default PatientsList;
