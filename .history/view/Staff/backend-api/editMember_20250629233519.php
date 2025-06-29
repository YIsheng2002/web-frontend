<?php
// editMember.php
header('Content-Type: application/json');
require_once '../../../database.php'; // Adjust path as needed

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['action']) || $input['action'] !== 'editMember') {
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
        exit;
    }

    $data = $input['data'];

    // Validate required fields
    $requiredFields = ['id', 'role', 'firstName', 'lastName', 'username', 'email', 'phoneNumber', 'gender'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
            exit;
        }
    }

    $id = $data['id'];
    $role = $data['role'];
    $firstName = $data['firstName'];
    $lastName = $data['lastName'];
    $username = $data['username'];
    $email = $data['email'];
    $phone = $data['phoneNumber'];
    $gender = $data['gender'];
    $runnerType = $data['runnerType'] ?? null;
    $password = $data['password'];
    $repassword = $data['repassword'];

    // Build update fields
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

    // If password provided and matched, hash and include it
    if (!empty($password) && $password === $repassword) {
        $fieldsToUpdate['password'] = password_hash($password, PASSWORD_DEFAULT);
    }

    // Build dynamic SQL SET clause
    $setClause = implode(', ', array_map(fn($k) => "$k = :$k", array_keys($fieldsToUpdate)));
    $sql = "UPDATE user SET $setClause WHERE id = :id";

    $stmt = $conn->prepare($sql);

    // Bind parameters
    foreach ($fieldsToUpdate as $key => $value) {
        $stmt->bindValue(":$key", $value);
    }
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);

    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Member updated successfully.']);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    exit;
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    exit;
}
