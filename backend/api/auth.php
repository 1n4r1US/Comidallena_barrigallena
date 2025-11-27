<?php
// ============================================
// AUTH API ENDPOINT
// ============================================

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/AuthController.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $controller = new AuthController($db);

    $method = $_SERVER['REQUEST_METHOD'];
    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    switch ($method) {
        case 'POST':
            $action = $data['action'] ?? '';

            switch ($action) {
                case 'register':
                    $controller->register($data);
                    break;

                case 'login':
                    $controller->login($data);
                    break;

                case 'logout':
                    $controller->logout();
                    break;

                default:
                    Response::error('Acción no válida', null, 400);
            }
            break;

        case 'GET':
            $controller->me();
            break;

        default:
            Response::error('Método no permitido', null, 405);
    }

} catch (Exception $e) {
    error_log('Auth API Error: ' . $e->getMessage());
    Response::error('Error del servidor', null, 500);
}
