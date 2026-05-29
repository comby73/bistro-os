@echo off
title Bistro OS
cd /d "%~dp0"

echo.
echo  Bistro OS - Iniciando servidor...
echo  -----------------------------------
echo  Carta clientes:  http://localhost:3000/carta
echo  Sistema interno: http://localhost:3000/login
echo  -----------------------------------
echo.

start "" http://localhost:3000/login

npm run dev
