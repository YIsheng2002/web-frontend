<?php
// Set header for JSON response
header('Content-Type: application/json');
require_once 'db_connection.php'; // Include your database connection

// Check if the request is POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is allowed']);
    exit;
}

// Get and sanitize input data
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
// $username = filter_input(INPUT_POST, 'username', FILTER_UNSAFE_RAW, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
$username = $_POST['username'];
$raw_password = $_POST['password'];
$full_name = $_POST['fullName'];
$phone_number = $_POST['phoneNumber'];
$address = $_POST['address'];
$role = 'customer';

try {
    // Check if email or username already exists
    $stmt = $pdo->prepare("SELECT * FROM user WHERE email = ? OR username = ?");
    $stmt->execute([$email, $username]);
    
    if ($stmt->rowCount() > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['status' => 'error', 'message' => 'Email or username already exists']);
        exit;
    }

    // Hash password (using Argon2, better than bcrypt)
    $hashed_password = password_hash($raw_password, PASSWORD_ARGON2ID);

    // Insert user into database
    $stmt = $pdo->prepare("INSERT INTO user (email, username, password, full_name, phone_number, address, role) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$email, $username, $hashed_password, $full_name, $phone_number, $address, $role]);

    // Success response
    http_response_code(201); // Created
    echo json_encode([
        'status' => 'success', 
        'message' => 'Registration successful! Redirecting...',
        'redirect' => 'userLogin.html'
    ]);

} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
