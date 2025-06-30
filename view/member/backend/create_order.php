<?php
header('Content-Type: application/json');
require_once 'db_connection.php'; // Include your database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the order data from the request
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
        exit;
    }

    $user_id = $data['user_id'];
    $address = $data['address'];
    $payment_method = $data['payment_method'];
    $cart_items = $data['cart_items'];


    // Calculate total
    $total = 0;
    foreach ($cart_items as $item) {
        $total += $item['price'] * $item['quantity'];
    }

    try {
        // Insert order into the orders table
        $stmt = $pdo->prepare("INSERT INTO ordering (customer_id, delivery_address, total_amount, payment_method, status) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $address, $total, $payment_method, 'pending']);
        $order_id = $pdo->lastInsertId(); // Get the last inserted order ID

        // Insert order items into the order_items table
        foreach ($cart_items as $item) {
            $stmt = $pdo->prepare("INSERT INTO order_item (order_id, menu_id, quantity) VALUES (?, ?, ?)");
            $stmt->execute([$order_id, $item['id'], $item['quantity']]);
        }

        // Return success response
        echo json_encode(['status' => 'success', 'order_id' => $order_id]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is allowed']);
}
