<?php
require_once '../../../database.php';
header('Content-Type: application/json');

try {
    $status = $_GET['status'] ?? null;
    $orders = [];

    if ($status) {
        $stmt = $conn->prepare("SELECT * FROM ordering WHERE status = :status");
        $stmt->bindParam(':status', $status);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $stmt = $conn->prepare("SELECT * FROM ordering WHERE status = 'pending'");
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

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
