<?php
// This file is part of the Order Management System project.
require_once '../../../database.php';
header('Content-Type: application/json');

try {
   $stmt = $conn->prepare("SELECT CONCAT(firstName, ' ', lastName) AS fullname, email, gender FROM user WHERE role = 'staff'");

    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $members]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} 
?>