<?php
require_once '../../../database.php';
header('Content-Type: application/json');

try {
    // Get all users with role 'runner'
    $stmt = $conn->prepare("SELECT user_id AS runner_id, runner_type FROM user WHERE runner_type = 'runner'");
    $stmt->execute();
    $runners = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $runners
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
