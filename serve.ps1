# Script PowerShell pour lancer le serveur Laravel avec SQLite activé

$port = if ($args.Count -gt 0) { $args[0] } else { 8000 }
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Lancement du serveur Laravel sur le port $port..." -ForegroundColor Green
Write-Host "Extension SQLite: activée" -ForegroundColor Green
Write-Host ""

$env:PHPRC = "$scriptDir\php.ini.local"

Set-Location $scriptDir
& php artisan serve --port=$port
