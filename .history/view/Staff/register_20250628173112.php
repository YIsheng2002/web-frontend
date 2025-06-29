<?php
header('Content-Type: application/json');
require_once 'database.php';

$data = json_decode(file_get_contents('php://input'), true);

if(!isset($data['action'])||$data['action'] !== 'signup'){
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
    exit;
}

$signupData = [
    'username' => $data['username'] ?? '',
    'email' => $data['email'] ?? '',
    'password' => $data['password'] ?? '',
    'confirmPassword' => $data['confirmPassword'] ?? ''
];

// Set Default role & runner_type (not invovled in signup)
$role = 'admin';
$runner_type = '-';

try{
    $stmt = $conn->prepare("INSERT INTO staff (username, email, password, role, runner_type) VALUES (?, ?, ?, ?, ?)");

    echo json_encode([
        'success' => true,
        'message' => 'Account created successfully!'
    ]);
}catch(PDO){
    echo json_encode([
        'success' => false,
        'message' => 'Error creating account: ' . $e->getMessage()
    ]);
} finally {
    $conn = null; // Close the database connection      
}
?>