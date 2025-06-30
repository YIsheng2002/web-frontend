<?php
// This file is part of the Order Management System project.
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
require_once '../../../database.php';

try {
    $stmt = $conn->prepare("SELECT CONCAT(firstName, ' ', lastName) AS fullname, email, gender FROM user");
    $stmt->execute(); // ✅ ADD THIS LINE
    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $members]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} 
?>