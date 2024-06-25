import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Typography,
  Button,
  Paper,
  TextField,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PredictionResult from './PredictionResult';
import './CommonForm.css';

export function CommonForm({ prefilledPatientId }) {
  const [image, setImage] = useState(null);
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState(prefilledPatientId || '');
  const [diagnoses, setDiagnoses] = useState([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [predictions, setPredictions] = useState([]);
  const [note, setNote] = useState('');
  const fileInputRef = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "/patients");
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    const fetchDiagnoses = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "/diagnosis");
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
      const response = await axios.post(process.env.REACT_APP_API_ADDRESS+ "/chestXray-analyze", formData, {
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
      const response = await axios.post(process.env.REACT_APP_API_ADDRESS + "/save-record", formDataSave, {
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
          color="primary"
          component="span"
          fullWidth
          startIcon={<CloudUploadIcon />}
          className="button"
          onClick={() => fileInputRef.current.click()}
        >
          Choose Image
        </Button>
      </div>
    );
  }

  function AnalyzeImageButton() {
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpload}
          className="button"
        >
          Analyze Image
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
          <Typography variant="body1" color="textSecondary" align='center'>
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
    <div>
      <div className="root">
        <div className="inputWrapper">
          <div className="leftSection">
            <Typography variant="h4" className="header">
              Enter Record Details
            </Typography>
            <div className="inputFields">
              <div className="inputWrapper">
                <TextField
                  select
                  label="Patient"
                  variant="outlined"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  fullWidth
                  className="inputField"
                  disabled={prefilledPatientId}
                >
                  {patients
                    .sort((a, b) => {
                      const lastNameComparison = a.last_name.localeCompare(b.last_name);
                      if (lastNameComparison !== 0) {
                        return lastNameComparison;
                      }
                      return a.first_name.localeCompare(b.first_name);
                    })
                    .map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {`${patient.last_name}, ${patient.first_name}`}
                      </MenuItem>
                    ))}
                </TextField>
              </div>
              <div className="inputWrapper">
                <TextField
                  select
                  label="Diagnosis"
                  variant="outlined"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  fullWidth
                  className="inputField"
                >
                  {diagnoses.map((diagnosis) => (
                    <MenuItem key={diagnosis.id} value={diagnosis.id}>
                      {diagnosis.diagnosis}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="inputWrapper">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  className="inputField"
                  customInput={
                    <TextField
                      label="Date"
                      variant="outlined"
                      fullWidth
                      className="inputField"
                    />
                  }
                />
              </div>
              <div className="inputWrapper">
                <TextField
                  label="Note"
                  variant="outlined"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  fullWidth
                  multiline
                  rows={7}
                  className="inputField"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="inputWrapper">
          <div className="rightSection">
            <Typography variant="h4" className="header">
              Image Details
            </Typography>
            <div>
              {
                !image && (
                  <div className="inputWrapper">
                    <DragAndDropField />
                  </div>
                )
              }
              {image && (
                <>
                  <Typography variant="h6" className="selectedImageText">
                    Selected Image:
                  </Typography>
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
      </div>
      <div className="footer">
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
