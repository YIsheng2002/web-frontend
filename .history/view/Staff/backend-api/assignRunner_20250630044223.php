<?php
require_once '../../../database.php';
header('Content-Type: application/json');

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

$order_id = $data['order_id'] ?? null;
$runner_id = $data['runner_id'] ?? null;

if (!$order_id || !$runner_id) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing order_id or runner_id'
    ]);
    exit;
}

try {
    // Update the ordering table to assign the runner
    $stmt = $conn->prepare("UPDATE ordering SET runner_id = ?, status = 'assigned' WHERE order_id = ?");
    $stmt->execute([$runner_id, $order_id]);

    echo json_encode([
        'success' => true,
        'message' => 'Runner assigned successfully'
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
