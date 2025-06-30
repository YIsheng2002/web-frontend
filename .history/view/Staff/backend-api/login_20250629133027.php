<?php
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
    $stmt = $conn->prepare("SELECT *, CONCAT(firstName, ' ', lastName) AS fullname FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);


    if (!$user) {
        // ❌ Email not found
        echo json_encode(['success' => false, 'message' => 'User does not exist']);
        exit;
    }

    if ($user) {
        // DEBUG: Log stored and entered passwords
        error_log("✅ Email found: " . $user['email']);
        error_log("🔐 Stored hash: " . $user['password']);
        error_log("🔑 Entered password: " . $password);
        error_log("user_id found: " . $user['user_id']);
        error_log("username: " . $user['username']);
        error_log("fullname: " . $user['fullname']);
        error_log("email: " . $user['email']);
        error_log("phonenumber: " . $user['phonenumber']);
        error_log("gender: " . $user['gender']);
        error_log("role: " . $user['role']);
        error_log("runner_type: " . $user['runner_type']);


        if (password_verify($password, $user['password'])) {
            // Login successful
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['user_id'],
                    'username' => $user['username'],
                    'fullname' => $user['fullname'],
                    'email' => $user['email'],
                    'phonenumber' => $user['phonenumber'],
                    'gender' => $user['gender'],  // ✅ Add gender here
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