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

try {
    $statusParam = $_GET['status'] ?? 'pending';
    $statuses = array_map('trim', explode(',', $statusParam));
    $placeholders = implode(',', array_fill(0, count($statuses), '?'));

    // Join with users table to get customer name
    $stmt = $conn->prepare("
        SELECT 
            o.*, 
            u.full_name AS customer_full_name
        FROM ordering o
        LEFT JOIN user u ON o.customer_id = u.user_id
        WHERE o.status IN ($placeholders)
    ");
    $stmt->execute($statuses);

    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($orders)) {
        echo json_encode([
            'success' => true,
            'data' => [],
            'message' => 'No orders found for the selected status.'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'data' => $orders
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
