@echo off
echo Starting Kinetic AI Integration...

:: Start FastAPI Backend
start cmd /k "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

:: Wait a bit for backend to initialize
timeout /t 5

:: Start ngrok for backend
start cmd /k "ngrok http 8000 --host-header=localhost"

:: Wait for ngrok to initialize
timeout /t 5

:: Start Next.js Frontend
start cmd /k "npm run dev"

echo All services started! Check the terminal windows for details.
