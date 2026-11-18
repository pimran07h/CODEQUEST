@echo off
title CODEQUEST - Uploading to GitHub
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%LOCALAPPDATA%\Programs\Git\ucrt64\bin;%PATH%"
cd /d "C:\Users\pimra\.gemini\antigravity\scratch\codequest"

echo ===================================================
echo   CODEQUEST - Pushing to GitHub (Branch: main)
echo   Repository: https://github.com/pimran07h/CODEQUEST.git
echo ===================================================
echo.
echo If prompted, click 'Sign in with your browser' to authorize GitHub.
echo.

git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================
    echo   SUCCESS! All files uploaded to GitHub.
    echo   View at: https://github.com/pimran07h/CODEQUEST
    echo ===================================================
) else (
    echo ===================================================
    echo   Push encountered an error. Please check credentials above.
    echo ===================================================
)
echo.
pause
