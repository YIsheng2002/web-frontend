<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
require_once '../../../database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['action']) || $data['action'] !== 'signup') {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
    exit;
}

$signupData = $data['data'];
$username = $signupData['username'] ?? '';
$email = $signupData['email'] ?? '';
$password = $signupData['password'] ?? '';

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);
$role = 'staff';

try {
    $stmt = $conn->prepare("INSERT INTO user (username, email, password, role, runner_type) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$username, $email, $hashedPassword, $role, $runner_type]);

    echo json_encode([
        'success' => true,
        'message' => 'Account created successfully!'
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error creating account: ' . $e->getMessage()
    ]);
} finally {
    $conn = null;
}
?>
