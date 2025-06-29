<?php
header('Content-Type: application/json');
require_once '../../../database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['user_id']) || empty($input['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User ID is required']);
        exit;
    }

    $userId = $input['user_id'];

    $stmt = $conn->prepare("DELETE FROM user WHERE user_id = :id");
    $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Member deleted successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No member found with the given ID.']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
