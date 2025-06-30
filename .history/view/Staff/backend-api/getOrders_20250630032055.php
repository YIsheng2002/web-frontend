<?php
require_once '../../../database.php';
header('Content-Type: application/json');

try {
    $statusParam = $_GET['status'] ?? 'pending';
    $statuses = array_map('trim', explode(',', $statusParam));
    $placeholders = implode(',', array_fill(0, count($statuses), '?'));

    $stmt = $conn->prepare("SELECT * FROM ordering WHERE status IN ($placeholders)");
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
