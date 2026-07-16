@echo off
title SCERT Portal Dashboard
echo =======================================================
echo          SCERT Portal Dashboard Starter
echo =======================================================
echo.
echo Starting the local server...
echo The dashboard will open automatically in your browser.
echo.
echo IMPORTANT: Do NOT close this black window while you are 
echo using the dashboard. To stop the server, just close this window.
echo.

:: Open the browser after waiting 5 seconds for the server to start
start /b cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000/admin"

:: Start the Next.js development server
npm run dev
