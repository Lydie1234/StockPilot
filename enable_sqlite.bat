@echo off
setlocal enabledelayedexpansion

REM Chemin du php.ini
set phpini=C:\Program Files (x86)\PHP\php.ini

REM Lire le fichier et remplacer la ligne
echo Activation de l'extension pdo_sqlite...

REM Créer un fichier temporaire
for /f "tokens=*" %%a in ('type "%phpini%"') do (
    set line=%%a
    if "!line:;extension=pdo_sqlite=!" neq "!line!" (
        echo extension=pdo_sqlite >> "%phpini%.tmp"
    ) else (
        echo !line! >> "%phpini%.tmp"
    )
)

REM Remplacer le fichier original
move /y "%phpini%.tmp" "%phpini%"

echo Extension activée!
pause
