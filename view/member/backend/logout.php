<?php
session_start(); // Start the session

// Unset all session variables
$_SESSION = [];

// Destroy the session
session_destroy();

// Return a JSON response indicating success
echo json_encode(['status' => 'success', 'message' => 'Logged out successfully']);
?>