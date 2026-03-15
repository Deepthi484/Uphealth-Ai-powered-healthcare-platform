@echo off
echo Starting UpHealth Full-Stack Application...
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3001
echo.
echo Press Ctrl+C to stop both servers
echo.

cd backend
start "Backend Server" cmd /k "npm run dev"

cd ../nextjs
start "Frontend Server" cmd /k "npm run dev"

echo Both servers are starting...
echo Check the new command windows for server status
pause
