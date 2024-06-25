import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableHead, TableBody, TableCell, TableRow, IconButton, TextField, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles({
    container: {
        width: '100%',
        overflowY: 'auto',
        overflowX: 'auto',
        margin: '0 auto', 
    },
    patientTable: {
        width: '100%',
    },
    tableHeader: {
        backgroundColor: '#e0e0e0',
        height: '50px',
    },
    tableRowEven: {
        backgroundColor: '#f2f2f2',
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: '#ddd',
        },
    },
    tableCell: {
        padding: '4px',
        border: '1px solid #ddd',
        minWidth: '100px',
        maxWidth: '100px',
        wordWrap: 'break-word',
    },
    tableHeaderCell: {
        padding: '4px',
        border: '1px solid #ddd',
        width: 'auto',           
        minWidth: '100px',
        wordWrap: 'break-word',
        backgroundColor: '#e0e0e0',
        cursor: 'pointer',
    },
    tableTypeCell: {
        padding: '4px',
        border: '1px solid #ddd',
        width: '40%',
        height: '40px',
        minWidth: '100px',
        wordWrap: 'break-word',
        backgroundColor: '#3c788a',
        cursor: 'pointer',
        color: 'white'
    },
    detailsButton: {
        backgroundColor: '#e0e0e0',
    },
    editIcon: {
        marginRight: '8px',
    },
    fullSizeImage: {
        maxWidth: '100%',
        maxHeight: '100%',
        margin: 'auto',
        display: 'block',
    },
});

const PatientRecordsTable = ({ records }) => {
    const classes = useStyles();
    const [dataTypesMap, setDataTypesMap] = useState({});
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [editingRecordId, setEditingRecordId] = useState(null);
    const [editedDiagnosisId, setEditedDiagnosisId] = useState('');
    const [editedNote, setEditedNote] = useState('');
    const [fullSizeImage, setFullSizeImage] = useState(null); 
    const [diagnosisOptions, setDiagnosisOptions] = useState([]); 
    const [dialogOpen, setDialogOpen] = useState(false); 

    const fetchDataTypes = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "/datatypes");
            const dataTypesMap = response.data.reduce((acc, datatype) => {
                acc[datatype.id] = datatype.data_type;
                return acc;
            }, {});
            setDataTypesMap(dataTypesMap);
        } catch (error) {
            console.error('Error fetching datatypes:', error);
        }
    };

    useEffect(() => {
        fetchDataTypes();
        fetchDiagnosisOptions(); 
    }, []);

    const fetchDiagnosisOptions = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "/diagnosis");
            setDiagnosisOptions(response.data);
        } catch (error) {
            console.error('Error fetching diagnosis options:', error);
        }
    };

    const getDataTypeById = (id) => {
        return dataTypesMap[id] || "none";
    };

    const handleSort = (column) => {
        if (sortedColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortedColumn(column);
            setSortDirection('asc');
        }
    };

    const handleEdit = (record) => {
        console.log('Editing record:', record);
        setEditingRecordId(record.ID);
        setEditedDiagnosisId(record.diagnosis_ID);
        setEditedNote(record.note);
    };

    const handleSave = async () => {
        try {
            const response = await axios.post(process.env.REACT_APP_API_ADDRESS + "/update-record", {
                id_record: editingRecordId,
                note: editedNote,
                id_diagnosis: editedDiagnosisId,
            });
            console.log('Save response:', response.data);
            setEditingRecordId(null);
            setEditedDiagnosisId('');
            setEditedNote('');
            window.location.reload(false);
    
        } catch (error) {
            console.error('Error saving record:', error);
        }
    };
    
    const handleCancel = () => {
        setEditingRecordId(null);
        setEditedDiagnosisId('');
        setEditedNote('');
    };
    

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this record?');
    
        if (confirmDelete) {
            console.log('Deleting record:', id);
    
            try {
                const response = await axios.delete(process.env.REACT_APP_API_ADDRESS + "/main/" + id);
    
                if (response.status === 204) {
                    console.log('Record deleted successfully');
                    alert('Record deleted.');
                    window.location.reload(false);
                } else if (response.status === 404) {
                    console.log('Record not found');
                } else {
                    console.error('Failed to delete record:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting record:', error);
            }
        } else {
            console.log('Deletion canceled');
        }
    };

    const handleImageClick = (imageUrl) => {
        setFullSizeImage(imageUrl);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setFullSizeImage(null);
        setDialogOpen(false);
    };

    if (!records) {
        return <div>No records found</div>;
    }

    const formatDate = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const groupedRecords = records.reduce((grouped, record) => {
        if (!grouped[record.data_type_ID]) {
            grouped[record.data_type_ID] = [];
        }
        grouped[record.data_type_ID].push(record);
        return grouped;
    }, {});

    Object.values(groupedRecords).forEach(records => {
        records.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
    });

    return (
        <div className={classes.container}>
            {Object.keys(groupedRecords).map((dataTypeID) => (
                <div key={dataTypeID}>
                    <Table className={classes.patientTable}>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.tableTypeCell} colSpan={5} align="left">
                                    {getDataTypeById(dataTypeID)}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.tableHeaderCell} onClick={() => handleSort('date')}>
                                    Date {sortedColumn === 'date' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </TableCell>
                                <TableCell className={classes.tableHeaderCell}>
                                    Diagnosis
                                </TableCell>
                                <TableCell className={classes.tableHeaderCell}>Image</TableCell>
                                <TableCell className={classes.tableHeaderCell}>Note</TableCell>
                                <TableCell className={classes.tableHeaderCell}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groupedRecords[dataTypeID].map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell className={classes.tableCell}>{formatDate(new Date(record.date))}</TableCell>
                                    <TableCell className={classes.tableCell}>
                                        {editingRecordId === record.ID ? (
                                            <Select
                                            value={editedDiagnosisId} 
                                            onChange={(e) => setEditedDiagnosisId(e.target.value)}
                                        >
                                            {diagnosisOptions.map(option => (
                                                <MenuItem key={option.id} value={option.id}>{option.diagnosis}</MenuItem>
                                            ))}
                                        </Select>
                                        ) : (
                                            record.diagnosis
                                        )}
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        <img
                                            src={process.env.REACT_APP_API_ADDRESS + "/images/" + record.image}
                                            width='50px'
                                            alt="Patient Record"
                                            onClick={() => handleImageClick(process.env.REACT_APP_API_ADDRESS + "/images/" + record.image)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        {editingRecordId === record.ID ? (
                                            <TextField
                                                value={editedNote}
                                                onChange={(e) => setEditedNote(e.target.value)}
                                                multiline
                                                fullWidth
                                            />
                                        ) : (
                                            record.note
                                        )}
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
    {editingRecordId === record.ID ? (
        <>
            <IconButton color="primary" onClick={handleSave}>
                <CheckIcon /> 
            </IconButton>
            <IconButton onClick={handleCancel}>
                <CloseIcon />
            </IconButton>
        </>
    ) : (
        <>
            <IconButton color="primary" onClick={() => handleEdit(record)}>
                <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => handleDelete(record.ID)}>
                <DeleteIcon />
            </IconButton>
        </>
    )}
</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ))}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogContent>
                    {fullSizeImage && <img src={fullSizeImage} className={classes.fullSizeImage} alt="Full Size" />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PatientRecordsTable;
