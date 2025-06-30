<?php
session_start(); // Start the session
require_once 'db_connection.php'; // Include your database connection

// Check if the request is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get and sanitize input data
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];

    // Validate inputs
    if (empty($email) || empty($password)) {
        http_response_code(400); // Bad Request
        echo json_encode(['status' => 'error', 'message' => 'Email and password are required']);
        exit;
    }

    try {
        // Prepare and execute the query to find the user
        $stmt = $pdo->prepare("SELECT * FROM user WHERE email = ?");
        $stmt->execute([$email]);

        // Check if the user exists
        if ($stmt->rowCount() === 0) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid email']);
            exit;
        }

        // Fetch the user data
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verify the password
        if (password_verify($password, $user['password'])) {
            // Store user information in session
            // $_SESSION['user_id'] = $user['user_id'];
            // $_SESSION['email'] = $user['email'];
            // $_SESSION['full_name'] = $user['full_name'];
            // $_SESSION['username'] = $user['username'];
            // $_SESSION['phone_number'] = $user['phone_number'];
            // $_SESSION['address'] = $user['address'];
            // $_SESSION['role'] = $user['role'];
            // $_SESSION['is_logged_in'] = true;

            $_SESSION['user'] = [
                'user_id' => $user['user_id'],
                'full_name' => $user['full_name'],
                'username' => $user['username'],
                'phone_number' => $user['phone_number'],
                'email' => $user['email'], 
                'address' => $user['address'],
                'role' => $user['role'],
                'is_logged_in' => true
            ];

            // Success response with redirect URL
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Login successful',
                'redirect' => 'menu.php',
                'user' => [
                    'id' => $user['user_id'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid email or password', 'user' => $user]);
            exit;
        }
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        exit;
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is allowed']);
    exit;
}
