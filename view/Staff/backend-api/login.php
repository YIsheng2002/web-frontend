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
header('Content-Type: application/json');
require_once '../../../database.php';

// Decode the incoming JSON
$data = json_decode(file_get_contents('php://input'), true);

// Validate action
if (!isset($data['action']) || $data['action'] !== 'login') {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
    exit;
}

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

try {
    // Find user by email
    $stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);


    if (!$user) {
        // ❌ Email not found
        echo json_encode(['success' => false, 'message' => 'User does not exist']);
        exit;
    }

    if ($user) {

        if (password_verify($password, $user['password'])) {
            // Login successful
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['user_id'],
                    'username' => $user['username'],
                    'fullname' => $user['full_name'],
                    'email' => $user['email'],
                    'phonenumber' => $user['phone_number'],
                    'role' => $user['role'],
                    'runner_type' => $user['runner_type']
                ]

            ]);
        } else {
            error_log("❌ Password mismatch");
            echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        }

    } else {
        // DEBUG: email not found
        error_log("❌ Email not found in database");
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} finally {
    $conn = null;
}
?>