<?php
// This file is part of the Order Management System project.
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
require_once '../../../database.php';

try {
    // Optional role filter
    $role = $_GET['role'] ?? null;

    if ($role) {
        $stmt = $conn->prepare("SELECT * FROM user WHERE role = :role");
        $stmt->bindParam(':role', $role);
    } else {
        $stmt = $conn->prepare("SELECT * FROM user");
    }

    $stmt->execute();
    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $members]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
