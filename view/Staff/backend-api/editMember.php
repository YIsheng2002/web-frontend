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

// editMember.php
header('Content-Type: application/json');
require_once '../../../database.php'; // Adjust path if needed

try {
    // Parse JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['action']) || $input['action'] !== 'editMember') {
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
        exit;
    }

    $data = $input['data'];

    // ✅ Updated to validate 'user_id' instead of 'id'
    $requiredFields = ['user_id', 'role', 'full_name', 'username', 'email', 'phoneNumber', 'address' ];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
            exit;
        }
    }

    // ✅ Correct variable assignment using user_id
    $id = $data['user_id'];
    $role = $data['role'];
    $fullName = $data['full_name'];
    $username = $data['username'];
    $email = $data['email'];
    $phone = $data['phoneNumber'];
    $runnerType = $data['runnerType'] ?? null;
    $address = $data['address'] ?? ''; // New field for address

    
    // Debugging: Log incoming data
    error_log("🔍 Incoming Data at " . date('Y-m-d H:i:s'));
    error_log("User ID: $id");
    error_log("Role: $role");
    error_log("Full Name: $fullName");
    error_log("Username: $username");
    error_log("Email: $email");
    error_log("Phone Number: $phone");
    error_log("Runner Type: " . ($runnerType ?? 'null'));
    error_log("Address: $address"); // Log the new address field

    // Fields to update
    $fieldsToUpdate = [
        'role' => $role,
        'full_name' => $fullName,
        'username' => $username,
        'email' => $email,
        'phone_number' => $phone,
        'runner_type' => $runnerType,
        'address' => $address // New field for address
    ];

    // Optional password update
    if (!empty($password) && $password === $repassword) {
        $fieldsToUpdate['password'] = password_hash($password, PASSWORD_DEFAULT);
    }

    // Build dynamic SQL
    $setClause = implode(', ', array_map(fn($k) => "$k = :$k", array_keys($fieldsToUpdate)));
    $sql = "UPDATE user SET $setClause WHERE user_id = :id";
    $stmt = $conn->prepare($sql);

    // Bind values
    foreach ($fieldsToUpdate as $key => $value) {
        $stmt->bindValue(":$key", $value);
    }
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);

    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Member updated successfully.']);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
