<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Database configuration
$host = 'localhost';
$dbname = 'novasaas_osint_contact';
$username = 'novasaas_contact_db_admin';
$password = 'KontakVeryYoneticisi25%';

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    // Validate required fields
    $required_fields = ['name', 'email', 'suggestionType', 'details'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Field '$field' is required");
        }
    }

    // Validate email format
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // Validate suggestion type
    $valid_types = ['feature', 'tool', 'bug', 'general'];
    if (!in_array($input['suggestionType'], $valid_types)) {
        throw new Exception('Invalid suggestion type');
    }

    // Prepare and execute insert statement
    $stmt = $pdo->prepare("
        INSERT INTO contact_suggestions (
            name, 
            email, 
            phone, 
            suggestion_type, 
            details, 
            created_at,
            ip_address,
            user_agent
        ) VALUES (
            :name, 
            :email, 
            :phone, 
            :suggestion_type, 
            :details, 
            NOW(),
            :ip_address,
            :user_agent
        )
    ");

    $result = $stmt->execute([
        ':name' => trim($input['name']),
        ':email' => trim($input['email']),
        ':phone' => isset($input['phone']) ? trim($input['phone']) : null,
        ':suggestion_type' => $input['suggestionType'],
        ':details' => trim($input['details']),
        ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
        ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null
    ]);

    if ($result) {
        $suggestion_id = $pdo->lastInsertId();
        
        // Return success response
        echo json_encode([
            'success' => true,
            'message' => 'Suggestion submitted successfully',
            'id' => $suggestion_id
        ]);
    } else {
        throw new Exception('Failed to insert suggestion');
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
?>