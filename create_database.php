<?php
require_once __DIR__.'/vendor/autoload.php';

$host = env('DB_HOST', '127.0.0.1');
$port = env('DB_PORT', 3306);
$username = env('DB_USERNAME', 'root');
$password = env('DB_PASSWORD', '');
$database = env('DB_DATABASE', 'laravel');

// Load .env
if (file_exists(__DIR__ . '/.env')) {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}

$host = $_ENV['DB_HOST'] ?? '127.0.0.1';
$port = $_ENV['DB_PORT'] ?? 3306;
$username = $_ENV['DB_USERNAME'] ?? 'root';
$password = $_ENV['DB_PASSWORD'] ?? '';
$database = $_ENV['DB_DATABASE'] ?? 'laravel';

try {
    // Connect without database first
    $pdo = new PDO(
        "mysql:host={$host}:{$port}",
        $username,
        $password
    );
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    echo "✓ Database '{$database}' created successfully!\n";
    echo "Run: php artisan migrate\n";
    
} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "\nMake sure:\n";
    echo "1. MySQL server is running\n";
    echo "2. Host: {$host}:{$port}\n";
    echo "3. Username: {$username}\n";
    exit(1);
}
?>
