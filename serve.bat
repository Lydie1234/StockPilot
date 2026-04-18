@echo off
REM Script pour lancer le serveur Laravel avec SQLite activé
REM Ce script configure l'extension PDO SQLite et lance le serveur

setlocal enabledelayedexpansion

set PHPRC=%~dp0php.ini.local
set port=8000

if not "%1"=="" (
    set port=%1
)

echo Lancement du serveur Laravel sur le port %port%...
echo Extension SQLite: activée

php artisan serve --port=%port%

:end
endlocal
