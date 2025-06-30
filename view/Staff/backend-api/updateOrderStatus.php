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

// Get raw POST/PUT data
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['order_id'], $input['status'])) {
    echo json_encode(['success' => false, 'message' => 'Missing order_id or status']);
    exit;
}

$order_id = $input['order_id'];
$status = $input['status'];

try {
    $stmt = $conn->prepare("UPDATE ordering SET status = ? WHERE order_id = ?");
    $stmt->execute([$status, $order_id]);

    echo json_encode(['success' => true, 'message' => 'Order status updated']);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
