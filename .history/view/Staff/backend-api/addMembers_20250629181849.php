<?php
require_once '../../../database.php';
header('Content-Type: application/json');


$data = json_decode(file_get_contents("php://input"), true);

$memberType = $data['memberType'] ?? '';
$firstName = $data['firstName'] ?? '';
$lastName = $data['lastName'] ?? '';
$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$phoneNumber = $data['phoneNumber'] ?? '';
$gender = $data['gender'] ?? '';
$runnerType = $data['runnerType'] ?? null;

// Basic validation
if (!$memberType || !$firstName || !$lastName || !$username || !$email || !$password || !$phoneNumber || !$gender) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

try {
    // Check if username exists
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM members WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Username already exists.']);
        exit;
    }

    // Check if email exists
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM members WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already exists.']);
        exit;
    }

    // Check if phone number exists
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM members WHERE phonenumber = ?");
    $stmt->execute([$phoneNumber]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Phone number already exists.']);
        exit;
    }

    // (Optional) Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert into DB
    $stmt = $pdo->prepare("INSERT INTO members (type, firstname, lastname, username, email, password, phonenumber, gender, runner_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $memberType, $firstName, $lastName, $username, $email, $hashedPassword, $phoneNumber, $gender, $runnerType
    ]);

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

// Logging function
function logError($context, $details = '') {
    $logFile = __DIR__ . '/error.log';
    $timestamp = date('Y-m-d H:i:s');
    $entry = "[$timestamp] $context: " . print_r($details, true) . "\n";
    file_put_contents($logFile, $entry, FILE_APPEND);
}
?>
