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

/*
try {
    // Find user by email
    $stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // Login successful
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role'],
                'runner_type' => $user['runner_type']
            ]
        ]);
    } else {
        // Login failed
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        error_log("Stored password hash: " . $user['password']);
        error_log("User entered password: " . $password);


    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} finally {
    $conn = null;
}

*/
try {
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    $stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $storedHash = $user['password'];

        if (password_verify($password, $storedHash)) {
            // ✅ Password correct
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => [/* user data */]
            ]);
        } else {
            // ❌ Wrong password
            echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        }
    } else {
        // ❌ Email not found
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