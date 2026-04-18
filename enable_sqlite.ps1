# Script à exécuter en tant qu'administrateur pour activer l'extension SQLite

$phpIni = "C:\Program Files (x86)\PHP\php.ini"

Write-Host "Activation de l'extension pdo_sqlite..." -ForegroundColor Green

$content = Get-Content $phpIni
$newContent = $content -replace '^;extension=pdo_sqlite$', 'extension=pdo_sqlite'

# Vérifier si le remplacement a été fait
if ($content -ne $newContent) {
    Set-Content -Path $phpIni -Value $newContent
    Write-Host "✓ Extension pdo_sqlite activée!" -ForegroundColor Green
    Write-Host "Veuillez redémarrer votre serveur PHP." -ForegroundColor Yellow
} else {
    Write-Host "Extension non trouvée ou déjà activée." -ForegroundColor Yellow
}
