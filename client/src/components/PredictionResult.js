import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Circle from 'react-circle';

const useStyles = makeStyles((theme) => ({
    header3Text: {
        marginBottom: 15,
        fontWeight: 'bold',
        fontSize: '1rem',
        fontFamily: 'Sofia Pro, Arial, Helvetica, sans-serif',
    },
}));

const PredictionResult = ({ predictions }) => {
    const classes = useStyles();
    const [diagnosesMap, setDiagnosesMap] = useState({});

    const fetchDiagnoses = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "/diagnosis");
            const diagnosesMap = response.data.reduce((acc, diagnosis) => {
                acc[diagnosis.id] = diagnosis.diagnosis;
                return acc;
            }, {});
            setDiagnosesMap(diagnosesMap);
        } catch (error) {
            console.error('Error fetching diagnoses:', error);
        }
    };

    useEffect(() => {
        fetchDiagnoses();
    }, []);

    const getDiagnosisById = (id) => {
        return diagnosesMap[id] || "none";
    };

    if (!predictions || predictions.length === 0) {
        return <div>
            <h3 className={classes.header3Text}>Prediction results:</h3>
            <div>No predictions yet.</div>
            </div>
    }

    return (
        <div style = {{ width: '100%'}}>
            <h3 className={classes.header3Text}>Prediction results:</h3>
            <div style={{ display: 'flex'}}>
                <div style={{ marginRight: '20px' }}>
                    <Circle
                        size={150}
                        progressColor="cornflowerblue"
                        progress={Math.round(predictions[0].probability * 100)}
                    />
                    <p align='center'>{getDiagnosisById(predictions[0].id)}</p>
                </div>
                <div>
                    <Circle
                        size={150}
                        progressColor="cornflowerblue"
                        progress={Math.round(predictions[1].probability * 100)}
                    />
                    <p align='center'>{getDiagnosisById(predictions[1].id)}</p>
                </div>
            </div>
        </div>
    );
}

export default PredictionResult;
