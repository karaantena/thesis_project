import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Typography,
  Button,
  Paper,
  TextField
} from '@material-ui/core';
import Autocomplete from '@mui/material/Autocomplete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PredictionResult from './PredictionResult';
import './CommonForm.css';
import { AuthContext } from '../AuthContext';


export function CommonForm({ prefilledPatientId }) {
  const [image, setImage] = useState(null);
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState(prefilledPatientId || '');
  const [diagnoses, setDiagnoses] = useState([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [predictions, setPredictions] = useState([]);
  const [note, setNote] = useState('');
  const { userId } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:3001/patients', {
          params: {
              userId: userId
          }
      });
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    const fetchDiagnoses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/diagnosis');
        setDiagnoses(response.data);
      } catch (error) {
        console.error('Error fetching diagnoses:', error);
      }
    };

    fetchPatients();
    fetchDiagnoses();
  }, []);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
      setPredictions([]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedImage = e.dataTransfer.files[0];
    setImage(selectedImage);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleUpload = async () => {
    if (!image) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:3001/chestXray-analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded successfully:', response.data);
      setDiagnosis(response.data[0].id);
      setPredictions(response.data);

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSave = async () => {
    if (!patientId || !diagnosis) {
      alert('Please fill in the fields.');
      return;
    }
    const formDataSave = new FormData();
    formDataSave.append('image', image);
    formDataSave.append('patientId', parseInt(patientId));
    formDataSave.append('diagnosisId', parseInt(diagnosis));
    formDataSave.append('note', note);
    formDataSave.append('date', selectedDate);

    try {
      const response = await axios.post('http://localhost:3001/save-record', formDataSave, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Data saved successfully:', response.data);
      alert('Saved');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  function ChooseImageButton() {
    return (
      <div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageChange}
          accept="image/*"
          className="button"
        />
        <Button
          variant="contained"
          color="secondary"
          component="span"
          startIcon={<CloudUploadIcon />}
          className="button"
          onClick={() => fileInputRef.current.click()}
        >
          Choose
        </Button>
      </div>
    );
  }

  function AnalyzeImageButton() {
    return (
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpload}
          className="button"
        >
          Analyze
        </Button>
      </div>
    );
  }

  function DragAndDropField() {
    return (
      <div>
        <Paper
          className="dropZone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Typography variant="body1" color="textSecondary" className="dropZoneText" align='center'>
            Drag & Drop or{' '}
            <label htmlFor="contained-button-file">
              select an image
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="input"
                id="contained-button-file"
              />
            </label>
          </Typography>
        </Paper>
      </div>
    );
  }

  return (
    <div className="container">
      <Typography variant="h2" className="middleHeader">
        Enter Record Details and Scan Image
      </Typography>
      <div className="sectionsWrapper">
        <div className="leftSection">        
          <div className="inputFields">
            {prefilledPatientId === null || prefilledPatientId === undefined ? (
              <div className="inputWrapper">
                <Autocomplete
                  options={patients}
                  getOptionLabel={(patient) => `${patient.last_name}, ${patient.first_name}`}
                  value={patients.find((patient) => patient.id === patientId) || null}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setPatientId(newValue.id);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Patient"
                      variant="outlined"
                      fullWidth
                      className="inputField"
                    />
                  )}
                />
              </div>
            ) : null}
            <div className="inputWrapper">
              <div className="rowWrapper">
                <TextField
                  select
                  label="Diagnosis"
                  variant="outlined"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="fixedWidthField inputField"
                >
                  {diagnoses.map((diagnosis) => (
                    <MenuItem key={diagnosis.id} value={diagnosis.id}>
                      {diagnosis.diagnosis}
                    </MenuItem>
                  ))}
                </TextField>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  className="fixedWidthField"
                  customInput={
                    <TextField
                      label="Date"
                      variant="outlined"
                      className="fixedWidthField inputField"
                    />
                  }
                />
              </div>
            </div>
            <div className="inputWrapper">
              <TextField
                label="Note"
                variant="outlined"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                multiline
                rows={13}
                className="inputField"
              />
            </div>
          </div>
        </div>
        <div className="rightSection">
          <div>
            {!image && (
              <div className="inputWrapper">
                <DragAndDropField />
              </div>
            )}
            {image && (
              <>
                <div className="inputWrapper">
                  <div className="selectedImageAndButtonsContainer">
                    <div className="selectedImageContainer">
                      <div
                        className={fullscreen ? "fullscreenImage" : "selectedImage"}
                        cursor="pointer"
                        onClick={toggleFullscreen}
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Selected"
                          className={fullscreen ? "fullscreenImageContent" : "image"}
                        />
                      </div>
                    </div>
                    <div className="buttonContainer">
                      <ChooseImageButton />
                      <AnalyzeImageButton />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="inputWrapper">
            {image && (
              <div>
                <PredictionResult predictions={predictions} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="saveButtonContainer">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          className="saveButton"
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default CommonForm;
