@echo off
title CODEQUEST - Play. Code. Conquer.
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"

echo ========================================================
echo   🎮 CODEQUEST - Play. Code. Conquer.
echo   Launching AAA Title Screen & Battle Server...
echo ========================================================
echo.

start "" "http://localhost:4000/"

cd /d "C:\Users\pimra\.gemini\antigravity\scratch\codequest\server"
node dist/index.js
