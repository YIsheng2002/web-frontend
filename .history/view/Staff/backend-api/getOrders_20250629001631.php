<?php
require_once '../../../database.php';
header('Content-Type: application/json');
try{
    $stmt = $conn->prepare("Select * from ordering where status = 'pending'");
    $stmt->execute();
    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $members]);
} catch(PDOException $e){
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}