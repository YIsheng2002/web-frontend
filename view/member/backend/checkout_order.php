<?php
session_start();

header('Content-Type: application/json');

// Check login
if (!isset($_SESSION['user']) || !$_SESSION['user']['is_logged_in']) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

// Get the JSON
$data = json_decode(file_get_contents('php://input'), true);

// Save to session or database
if (is_array($data)) {
    $_SESSION['cart'] = $data;
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
}
