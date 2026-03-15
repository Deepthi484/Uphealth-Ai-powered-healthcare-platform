const express = require('express');
const router = express.Router();
const { PythonShell } = require('python-shell');
const path = require('path');

// Simple migraine prediction route
router.post('/migraine', async (req, res) => {
    try {
        console.log('🧠 Migraine prediction request received');
        console.log('Request body:', req.body);

        const {
            Age, Duration, Frequency, Location, Character, Intensity,
            Nausea, Vomit, Phonophobia, Photophobia, Visual, Sensory,
            Dysphasia, Dysarthria, Vertigo, Tinnitus, Hypoacusis,
            Diplopia, Defect, Ataxia, Conscience, Paresthesia, DPF
        } = req.body;

        // Simple validation
        if (!Age || !Duration || !Frequency) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: Age, Duration, Frequency'
            });
        }

        // Create input data for Python script
        const inputData = {
            Age: parseInt(Age) || 30,
            Duration: parseInt(Duration) || 1,
            Frequency: parseInt(Frequency) || 5,
            Location: parseInt(Location) || 1,
            Character: parseInt(Character) || 1,
            Intensity: parseInt(Intensity) || 2,
            Nausea: parseInt(Nausea) || 1,
            Vomit: parseInt(Vomit) || 0,
            Phonophobia: parseInt(Phonophobia) || 1,
            Photophobia: parseInt(Photophobia) || 1,
            Visual: parseInt(Visual) || 1,
            Sensory: parseInt(Sensory) || 2,
            Dysphasia: parseInt(Dysphasia) || 0,
            Dysarthria: parseInt(Dysarthria) || 0,
            Vertigo: parseInt(Vertigo) || 0,
            Tinnitus: parseInt(Tinnitus) || 0,
            Hypoacusis: parseInt(Hypoacusis) || 0,
            Diplopia: parseInt(Diplopia) || 0,
            Defect: parseInt(Defect) || 0,
            Ataxia: parseInt(Ataxia) || 0,
            Conscience: parseInt(Conscience) || 0,
            Paresthesia: parseInt(Paresthesia) || 0,
            DPF: parseInt(DPF) || 0
        };

        console.log('📝 Processed input data:', inputData);

        // Run Python prediction script with REAL model
        const options = {
            mode: 'json',
            pythonPath: 'python',
            pythonOptions: ['-u'],
            scriptPath: path.join(__dirname, '..'),
            args: ['migraine', JSON.stringify(inputData)]
        };

        console.log('🐍 Running Python script with options:', options);

        PythonShell.run('predict_migraine.py', options, (err, results) => {
            if (err) {
                console.error('❌ Python script error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Prediction failed',
                    error: err.message
                });
            }

            console.log('🐍 Python script results:', results);

            if (results && results.length > 0) {
                const result = results[0];
                console.log('✅ Sending real prediction:', result);
                
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
                    message: 'No prediction result received from model'
                });
            }
        });

    } catch (error) {
        console.error('❌ Migraine prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Simple health risk prediction route
router.post('/health-risk', async (req, res) => {
    try {
        console.log('❤️ Health risk prediction request received');
        console.log('Request body:', req.body);

        const {
            Patient_ID, Respiratory_Rate, Oxygen_Saturation, O2_Scale,
            Systolic_BP, Heart_Rate, Temperature, Consciousness, On_Oxygen
        } = req.body;

        // Simple validation
        if (!Heart_Rate || !Systolic_BP) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: Heart_Rate, Systolic_BP'
            });
        }

        // Create input data
        const inputData = {
            Patient_ID: Patient_ID || "TEST001",
            Respiratory_Rate: parseFloat(Respiratory_Rate) || 16,
            Oxygen_Saturation: parseFloat(Oxygen_Saturation) || 98,
            O2_Scale: parseInt(O2_Scale) || 1,
            Systolic_BP: parseFloat(Systolic_BP) || 120,
            Heart_Rate: parseFloat(Heart_Rate) || 72,
            Temperature: parseFloat(Temperature) || 37.0,
            Consciousness: Consciousness || "A",
            On_Oxygen: parseInt(On_Oxygen) || 0
        };

        console.log('📝 Processed input data:', inputData);

        // Run Python prediction script with REAL model
        const options = {
            mode: 'json',
            pythonPath: 'python',
            pythonOptions: ['-u'],
            scriptPath: path.join(__dirname, '..'),
            args: ['health_risk', JSON.stringify(inputData)]
        };

        console.log('🐍 Running Python script with options:', options);

        PythonShell.run('predict_health_risk.py', options, (err, results) => {
            if (err) {
                console.error('❌ Python script error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Prediction failed',
                    error: err.message
                });
            }

            console.log('🐍 Python script results:', results);

            if (results && results.length > 0) {
                const result = results[0];
                console.log('✅ Sending real prediction:', result);
                
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
                    message: 'No prediction result received from model'
                });
            }
        });

    } catch (error) {
        console.error('❌ Health risk prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router;
