<?php
$phpIni = 'C:\\Program Files (x86)\\PHP\\php.ini';

if (!file_exists($phpIni)) {
    die("Fichier php.ini introuvable à: $phpIni\n");
}

// Lire le fichier
$content = file_get_contents($phpIni);

// Vérifier si déjà activé
if (strpos($content, 'extension=pdo_sqlite') !== false && strpos($content, ';extension=pdo_sqlite') === false) {
    echo "✓ Extension pdo_sqlite est déjà activée!\n";
    exit(0);
}

// Activer l'extension
$newContent = str_replace(';extension=pdo_sqlite', 'extension=pdo_sqlite', $content);

if ($newContent === $content) {
    die("Impossible de trouver ;extension=pdo_sqlite dans php.ini\n");
}

// Écrire le fichier
if (!is_writable($phpIni)) {
    die("Pas de droits d'écriture sur $phpIni\n");
}

if (file_put_contents($phpIni, $newContent)) {
    echo "✓ Extension pdo_sqlite activée avec succès!\n";
} else {
    die("Erreur lors de l'écriture du fichier php.ini\n");
}
?>
