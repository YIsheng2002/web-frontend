<?php
header('Content-Type: application/json');
require_once 'db_connection.php';

try {
    // Get all unique categories and subcategories
    $categoriesQuery = $pdo->prepare("
        SELECT DISTINCT category, subcategory 
        FROM menu
        ORDER BY category, subcategory
    ");
    $categoriesQuery->execute();
    $categoriesData = $categoriesQuery->fetchAll(PDO::FETCH_ASSOC);
    
    // Get all menu items
    $itemsQuery = $pdo->prepare("SELECT * FROM menu");
    $itemsQuery->execute();
    $menuItems = $itemsQuery->fetchAll(PDO::FETCH_ASSOC);
    
    // Organize data for response
    $result = [
        'categories' => [],
        'menuItems' => $menuItems
    ];
    
    // Process categories hierarchy
    $groupedCategories = [];
    foreach ($categoriesData as $row) {
        $category = $row['category'];
        $subcategory = $row['subcategory'];
        
        if (!isset($groupedCategories[$category])) {
            $groupedCategories[$category] = [];
        }
        
        if ($subcategory) {
            $groupedCategories[$category][] = $subcategory;
        }
    }
    
    $result['categories'] = $groupedCategories;
    
    echo json_encode($result);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}