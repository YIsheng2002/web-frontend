<?php
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

    // Debugging: Log incoming data
    error_log("🔍 Incoming Data at " . date('Y-m-d H:i:s'));
    error_log("User ID: $id");
    error_log("Role: $role");
    error_log("First Name: $firstName");
    error_log("Last Name: $lastName");
    error_log("Username: $username");
    error_log("Email: $email");
    error_log("Password: $password");
    error_log("Phone Number: $phone");
    error_log("Gender: $gender");
    error_log("Runner Type: " . ($runnerType ?? 'null'));


    // ✅ Updated to validate 'user_id' instead of 'id'
    $requiredFields = ['user_id', 'role', 'firstName', 'lastName', 'username', 'email', 'phoneNumber', 'gender'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
            exit;
        }
    }

    // ✅ Correct variable assignment using user_id
    $id = $data['user_id'];
    $role = $data['role'];
    $firstName = $data['firstName'];
    $lastName = $data['lastName'];
    $username = $data['username'];
    $email = $data['email'];
    $phone = $data['phoneNumber'];
    $gender = $data['gender'];
    $runnerType = $data['runnerType'] ?? null;
    $password = $data['password'] ?? '';
    $repassword = $data['repassword'] ?? '';

    // Fields to update
    $fieldsToUpdate = [
        'role' => $role,
        'firstname' => $firstName,
        'lastname' => $lastName,
        'username' => $username,
        'email' => $email,
        'phonenumber' => $phone,
        'gender' => $gender,
        'runner_type' => $runnerType
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
