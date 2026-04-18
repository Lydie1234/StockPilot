@echo off
REM Script pour exécuter les commandes artisan avec le php.ini local activant SQLite

setlocal enabledelayedexpansion

set PHPRC=%~dp0php.ini.local

REM Exécuter la commande passée en paramètre
php artisan %*

:end
endlocal
