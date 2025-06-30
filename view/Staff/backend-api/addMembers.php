<?php
header("Access-Control-Allow-Origin: *");

// Allow specific HTTP methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight (OPTIONS) requests and exit early
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once '../../../database.php'; // Adjust the path as necessary
header('Content-Type: application/json');


$data = json_decode(file_get_contents("php://input"), true);

$form = $data['data'] ?? []; // 👈 Extract actual form data

$role = $form['role'] ?? '';
$full_name = $form['full_name'] ?? ''; // New field for full name
$username = $form['username'] ?? '';
$email = $form['email'] ?? '';
$password = $form['password'] ?? '';
$phonenumber = $form['phoneNumber'] ?? ''; 
$runnerType = $form['runnerType'] ?? ''; 
$address = $form['address'] ?? ''; // New field for address

error_log("🔍 Incoming Data:");
error_log("Role: $role");
error_log("Full Name: $full_name"); // Log the new full name field
error_log("Username: $username");
error_log("Email: $email");
error_log("Password: $password");
error_log("Phone Number: $phonenumber");
error_log("Runner Type: $runnerType");
error_log("Address: $address"); // Log the new address field




// Basic validation
if (!$role || !$username || !$email || !$password || !$phonenumber || !$address || !$full_name) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

try {
    // Check if username exists
    $stmt = $conn->prepare("SELECT COUNT(*) FROM user WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Username already exists.']);
        exit;
    }

    // Check if email exists
    $stmt = $conn->prepare("SELECT COUNT(*) FROM user WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already exists.']);
        exit;
    }

    // Check if phone number exists
    $stmt = $conn->prepare("SELECT COUNT(*) FROM user WHERE phone_number = ?");
    $stmt->execute([$phonenumber]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Phone number already exists.']);
        exit;
    }

    // (Optional) Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert into DB
    $stmt = $conn->prepare("INSERT INTO user (role, full_name, username, email, password, phone_number, runner_type, address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $role,
        $full_name,
        $username,
        $email,
        $hashedPassword,
        $phonenumber,
        $runnerType,
        $address
    ]);

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}


?>