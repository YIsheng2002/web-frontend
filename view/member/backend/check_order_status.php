<?php
header('Content-Type: application/json');
require_once 'db_connection.php'; // Include your database connection

// Get the order number from the POST request
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
    exit;
}

$order_number = $data['order_number'];
$user_id = $data['user_id'];

try {
    // Prepare and execute the SQL statement to fetch the order status
    $stmt = $pdo->prepare("SELECT status FROM ordering WHERE order_id = ? AND customer_id = ?");
    $stmt->execute([$order_number, $user_id]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($order) {
        // Map the status to a user-friendly message
        $statusMap = [
            'pending' => 'Your order is in pending',
            'assigned' => 'Your order has been assigned',
            'picked up' => 'Your order has been picked up',
            'in transit' => 'Your order is in transit',
            'delivered' => 'Your order has been delivered'
        ];
        
        $message = $statusMap[$order['status']] ?? 'Order found with status: ' . $order['status'];
        echo json_encode(['status' => 'success', 'message' => $message]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Order not found.']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
