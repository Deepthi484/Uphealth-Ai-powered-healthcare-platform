# UpHealth Backend API

This is the backend API for UpHealth - an AI-powered health platform that provides migraine prediction, heart risk assessment, disease detection, and personalized diet plans.

## 🚀 Features

- **User Authentication**: Secure signup and login with JWT tokens
- **MongoDB Atlas Integration**: Cloud-based database for scalability
- **Password Security**: Bcrypt hashing for secure password storage
- **Input Validation**: Comprehensive form validation and error handling
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Health Monitoring**: User profile management and health data storage

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd nextjs/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your actual values
   nano .env
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/uphealth?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**:
   - Choose the free tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Set up Database Access**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Select "Read and write to any database"
   - Click "Add User"

4. **Set up Network Access**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your values

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## 📡 API Endpoints

### Authentication Routes

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "password": "securepassword123",
  "confirmPassword": "securepassword123",
  "agreeToTerms": true,
  "agreeToPrivacy": true,
  "agreeToMarketing": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "age": 33,
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "age": 33,
      "role": "user",
      "lastLogin": "2024-01-15T10:30:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET `/api/auth/profile`
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "gender": "male",
      "fullName": "John Doe",
      "age": 33,
      "role": "user",
      "isEmailVerified": false,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

### Health Check

#### GET `/health`
Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "UpHealth Backend Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

## 🗄️ Database Schema

### User Model
- `firstName` (String, required)
- `lastName` (String, required)
- `email` (String, required, unique)
- `phone` (String, optional)
- `dateOfBirth` (Date, required)
- `gender` (String, enum: male/female/other/prefer-not-to-say)
- `password` (String, required, hashed)
- `agreeToTerms` (Boolean, required)
- `agreeToPrivacy` (Boolean, required)
- `agreeToMarketing` (Boolean, optional)
- `isEmailVerified` (Boolean, default: false)
- `lastLogin` (Date, default: now)
- `isActive` (Boolean, default: true)
- `role` (String, enum: user/admin/healthcare_provider, default: user)
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated)

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds of 12
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation for all inputs
- **CORS Protection**: Configured for frontend integration
- **Error Handling**: Proper error responses without sensitive data exposure

## 🧪 Testing

To test the API endpoints, you can use tools like:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // Optional
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `404`: Not Found
- `500`: Internal Server Error

## 🔧 Development

### Project Structure
```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   └── User.js             # User schema and methods
├── routes/
│   └── auth.js             # Authentication routes
├── server.js               # Main server file
├── package.json            # Dependencies and scripts
├── env.example             # Environment variables template
└── README.md               # This file
```

### Adding New Features

1. **Create new models** in the `models/` directory
2. **Add new routes** in the `routes/` directory
3. **Update server.js** to include new route files
4. **Test thoroughly** before deployment

## 🚀 Deployment

For production deployment:

1. **Set environment variables** for production
2. **Use a process manager** like PM2
3. **Set up SSL/TLS** certificates
4. **Configure proper CORS** origins
5. **Use environment-specific** MongoDB clusters

## 📞 Support

For issues and questions:
- Check the error logs in the console
- Verify your MongoDB Atlas connection
- Ensure all environment variables are set correctly
- Test the health endpoint: `GET /health`

## 📄 License

This project is licensed under the MIT License.
