// API Configuration
const API_CONFIG = {
    // FastAPI server (for direct predictions)
    FASTAPI_BASE_URL: 'http://localhost:8000',
    
    // Express.js server (for auth)
    EXPRESS_BASE_URL: 'http://localhost:5000',
    
    // Current active API endpoints (using FastAPI for predictions)
    BASE_URL: 'http://localhost:8000',  // Using FastAPI for predictions
    PREDICTION_ENDPOINTS: {
        // Original working endpoints
        MIGRAINE: 'http://localhost:8000/api/predictions/migraine',
        HEALTH_RISK: 'http://localhost:8000/api/predictions/health-risk'
    }
};

export default API_CONFIG;

