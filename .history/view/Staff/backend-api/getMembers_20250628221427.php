required_once '../../../databse.php';
header('Content-Type: application/json');

try {
    $stmt = $conn->prepare("SELECT fullname, email, gender, phonenumber FROM user WHERE role = 'member'");
    $stmt->execute();
    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $members]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}