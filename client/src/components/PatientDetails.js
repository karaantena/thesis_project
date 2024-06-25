import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Table, Dialog, DialogTitle, DialogContent, DialogActions, TableBody, TableCell, TableRow, Typography, Button, IconButton, Select, MenuItem } from '@material-ui/core';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import PatientRecordsTable from './PatientRecordsTable';
import CommonForm from './CommonForm';
import './PatientDetails.css';
import AddIcon from '@material-ui/icons/Add';

function PatientDetails() {
    const { id } = useParams();
    const [patientDetails, setPatientDetails] = useState(null);
    const [patientRecords, setPatientRecords] = useState(null);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [initialDepartment, setInitialDepartment] = useState('');
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const { isAuthorized, userId } = useContext(AuthContext);
    const navigate = useNavigate();
    const [access, setAccess] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
          try {
    
              const userRightsResponse = await axios.get(process.env.REACT_APP_API_ADDRESS+ "/api/user_rights/" + userId);
              const rights = userRightsResponse.data.map((ur) => ur.id_right);
              const patientDetailsResponse = await axios.get(process.env.REACT_APP_API_ADDRESS + "/patients/" + id);
              const department = patientDetailsResponse.data.id_right

              const access = (department && rights.includes(department)) || rights.includes(2) || rights.includes(1);
              setAccess(access)
            
            
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [isAuthorized, userId]);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "/patients/" + id);
                setPatientDetails(response.data);
                setLoading(false);
                if (response.data) {
                    setInitialDepartment(response.data.id_right || ''); 
                    setSelectedDepartment(response.data.id_right || ''); 
                }
            } catch (error) {
                console.error('Error fetching patient details:', error);
                setLoading(false);
            }
        };

        fetchPatientDetails();

    }, [id]);

    useEffect(() => {
        const fetchPatientRecords = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "/records/" + id);
                setPatientRecords(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching patient records:', error);
                setLoading(false);
            }
        };

        fetchPatientRecords();
    }, [id]);

    useEffect(() => {
        const fetchDepartmentOptions = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "/api/rights");
                const departmentRights = response.data.filter(right => right.is_department === 1);
                setDepartmentOptions(departmentRights);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching department options:', error);
                setLoading(false);
            }
        };

        fetchDepartmentOptions();


    }, []);

    const handleUpdateDepartment = async () => {
        try {
            await axios.put(process.env.REACT_APP_API_ADDRESS + "/patients/" + id, {
                id_right: selectedDepartment
            });
            setInitialDepartment(selectedDepartment);
            console.log('Patient department updated successfully');
        } catch (error) {
            console.error('Error updating patient department:', error);
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        window.location.reload(false);
    };

    const formatDate = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
   
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!access) {
        return (
            <div>
                User not authorised to access patient.
            </div>
        );
    }
    if (!patientDetails) {
        return <div>Patient not found</div>;
    }

    return (
        <div className="container-details">
            <div className="left-section">
                <div style={{ maxWidth: '500px' }}>
                    <Typography variant="h6">Personal Data</Typography>
                </div>
                <Table style={{ maxWidth: '500px' }}>
                    <TableBody>
                        <TableRow>
                            <TableCell className="table-header-cell">ID:</TableCell>
                            <TableCell className="table-cell">{patientDetails.id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="table-header-cell">First Name:</TableCell>
                            <TableCell className="table-cell">{patientDetails.first_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="table-header-cell">Last Name:</TableCell>
                            <TableCell className="table-cell">{patientDetails.last_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="table-header-cell">Date of Birth:</TableCell>
                            <TableCell className="table-cell">{formatDate(new Date(patientDetails.dob))}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="table-header-cell">Gender:</TableCell>
                            <TableCell className="table-cell">{patientDetails.gender}</TableCell>
                        </TableRow>
                        {patientDetails.id_right && (
                            <TableRow>
                                <TableCell className="table-header-cell">Department:</TableCell>
                                <TableCell className="table-cell">
                                    <Select
                                        value={selectedDepartment || ''}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Select Department' }}
                                    >
                                        <MenuItem value="" disabled>
                                            Select Department
                                        </MenuItem>
                                        {departmentOptions.map(department => (
                                            <MenuItem key={department.id} value={department.id}>
                                                {department.description}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Button
                                        onClick={handleUpdateDepartment}
                                        variant="contained"
                                        color="primary"
                                        style={{ marginLeft: '10px' }}
                                        disabled={selectedDepartment === initialDepartment}
                                    >
                                        Save
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="right-section">
                <div style={{ maxWidth: '90%' }}>
                    <Typography variant="h6">Records History</Typography>
                    <div style={{ display: 'flex' }}>
                        <IconButton className="addButton" onClick={handleOpenDialog}>
                            <AddIcon className="icon" />
                        </IconButton>
                    </div>
                    <PatientRecordsTable records={patientRecords} />
                </div>
            </div>
            <div>
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="dialog-title"
                    maxWidth="md"
                >
                    <DialogTitle id="dialog-title">
                        Add Record for Patient: {patientDetails.first_name} {patientDetails.last_name} (ID: {patientDetails.id})
                    </DialogTitle>
                    <DialogContent>
                        <CommonForm prefilledPatientId={id} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default PatientDetails;
