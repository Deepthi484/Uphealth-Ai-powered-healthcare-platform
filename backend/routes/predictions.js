const express = require('express');
const router = express.Router();
const { PythonShell } = require('python-shell');
const path = require('path');

// Migraine Prediction
router.post('/migraine', async (req, res) => {
    try {
        const {
            Age, Duration, Frequency, Location, Character, Intensity,
            Nausea, Vomit, Phonophobia, Photophobia, Visual, Sensory,
            Dysphasia, Dysarthria, Vertigo, Tinnitus, Hypoacusis,
            Diplopia, Defect, Ataxia, Conscience, Paresthesia, DPF
        } = req.body;

        // Validate required fields
        const requiredFields = [
            'Age', 'Duration', 'Frequency', 'Location', 'Character', 'Intensity',
            'Nausea', 'Vomit', 'Phonophobia', 'Photophobia', 'Visual', 'Sensory',
            'Dysphasia', 'Dysarthria', 'Vertigo', 'Tinnitus', 'Hypoacusis',
            'Diplopia', 'Defect', 'Ataxia', 'Conscience', 'Paresthesia', 'DPF'
        ];

        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === null) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required field: ${field}`
                });
            }
        }

        // Create Python script options
        const options = {
            mode: 'json',
            pythonPath: 'python',
            pythonOptions: ['-u'],
            scriptPath: path.join(__dirname, '..'),
            args: [
                'migraine',
                JSON.stringify({
                    Age: parseInt(Age),
                    Duration: parseInt(Duration),
                    Frequency: parseInt(Frequency),
                    Location: parseInt(Location),
                    Character: parseInt(Character),
                    Intensity: parseInt(Intensity),
                    Nausea: parseInt(Nausea),
                    Vomit: parseInt(Vomit),
                    Phonophobia: parseInt(Phonophobia),
                    Photophobia: parseInt(Photophobia),
                    Visual: parseInt(Visual),
                    Sensory: parseInt(Sensory),
                    Dysphasia: parseInt(Dysphasia),
                    Dysarthria: parseInt(Dysarthria),
                    Vertigo: parseInt(Vertigo),
                    Tinnitus: parseInt(Tinnitus),
                    Hypoacusis: parseInt(Hypoacusis),
                    Diplopia: parseInt(Diplopia),
                    Defect: parseInt(Defect),
                    Ataxia: parseInt(Ataxia),
                    Conscience: parseInt(Conscience),
                    Paresthesia: parseInt(Paresthesia),
                    DPF: parseInt(DPF)
                })
            ]
        };

        // Run Python prediction script
        PythonShell.run('predict_migraine.py', options, (err, results) => {
            if (err) {
                console.error('Python script error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Prediction failed',
                    error: err.message
                });
            }

            if (results && results.length > 0) {
                const result = results[0];
                res.json({
                    success: true,
                    prediction: result.prediction,
                    confidence: result.confidence,
                    migraine_type: result.migraine_type,
                    risk_level: result.risk_level,
                    recommendations: result.recommendations
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'No prediction result received'
                });
            }
        });

    } catch (error) {
        console.error('Migraine prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Health Risk Assessment
router.post('/health-risk', async (req, res) => {
    try {
        const {
            Patient_ID, Respiratory_Rate, Oxygen_Saturation, O2_Scale, Systolic_BP,
            Heart_Rate, Temperature, Consciousness, On_Oxygen
        } = req.body;

        // Validate required fields
        const requiredFields = [
            'Patient_ID', 'Respiratory_Rate', 'Oxygen_Saturation', 'O2_Scale', 'Systolic_BP',
            'Heart_Rate', 'Temperature', 'Consciousness', 'On_Oxygen'
        ];

        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === null) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required field: ${field}`
                });
            }
        }

        // Create Python script options
        const options = {
            mode: 'json',
            pythonPath: 'python',
            pythonOptions: ['-u'],
            scriptPath: path.join(__dirname, '..'),
            args: [
                'health_risk',
                JSON.stringify({
                    Patient_ID: Patient_ID,
                    Respiratory_Rate: parseFloat(Respiratory_Rate),
                    Oxygen_Saturation: parseFloat(Oxygen_Saturation),
                    O2_Scale: parseInt(O2_Scale),
                    Systolic_BP: parseFloat(Systolic_BP),
                    Heart_Rate: parseFloat(Heart_Rate),
                    Temperature: parseFloat(Temperature),
                    Consciousness: Consciousness,
                    On_Oxygen: parseInt(On_Oxygen)
                })
            ]
        };

        // Run Python prediction script
        PythonShell.run('predict_health_risk.py', options, (err, results) => {
            if (err) {
                console.error('Python script error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Prediction failed',
                    error: err.message
                });
            }

            if (results && results.length > 0) {
                const result = results[0];
                res.json({
                    success: true,
                    prediction: result.prediction,
                    confidence: result.confidence,
                    risk_level: result.risk_level,
                    recommendations: result.recommendations,
                    vital_signs_analysis: result.vital_signs_analysis
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'No prediction result received'
                });
            }
        });

    } catch (error) {
        console.error('Health risk prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router;
