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
require_once '../../../database.php';
header('Content-Type: application/json');

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

$order_id = $data['order_id'] ?? null;
$runner_id = $data['runner_id'] ?? null;
$runnerType = $data['runner_type'] ?? null;

if (!$order_id || !$runner_id || !$runnerType) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing order_id, runner_id, or runner_type'
    ]);
    exit;
}

try {
    // Update the ordering table to assign the runner and runner_type
    $stmt = $conn->prepare("UPDATE ordering SET runner_id = ?, runner_type = ?, status = 'assigned' WHERE order_id = ?");
    $stmt->execute([$runner_id, $runnerType, $order_id]);

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
