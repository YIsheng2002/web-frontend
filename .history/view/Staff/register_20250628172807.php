<?php
header('Content -Type: application/json');
require_once 'database.php';

$data = json_decode(file_get_contents('php://input'), true);

if(!isset($data['action'])||$data['action'] !== 'signup'){
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
    exit;
}

$signupData = [
    'username' => $data['username'] ?? '',
    'email' => $data['email'] ?? '',
    'password' => $data['password'] ?? '',
    'confirmPassword' => $data['confirmPassword'] ?? ''
];

// Set Default role & runner_type (not invovled in signup)
$role = 'admin';
$runner_type = '-';