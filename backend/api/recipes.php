<?php
// ============================================
// RECIPES API ENDPOINT
// ============================================

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/RecipeController.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $controller = new RecipeController($db);

    $method = $_SERVER['REQUEST_METHOD'];
    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    // Get ID from URL if present
    $id = $_GET['id'] ?? null;

    switch ($method) {
        case 'GET':
            if ($id) {
                // Get single recipe
                $controller->show($id);
            } else {
                // Get all recipes with filters
                $filters = [
                    'query' => $_GET['query'] ?? '',
                    'category' => $_GET['category'] ?? '',
                    'difficulty' => $_GET['difficulty'] ?? '',
                    'max_time' => $_GET['max_time'] ?? '',
                    'user_id' => $_GET['user_id'] ?? '',
                    'limit' => $_GET['limit'] ?? 50,
                    'offset' => $_GET['offset'] ?? 0
                ];
                $controller->index($filters);
            }
            break;

        case 'POST':
            // Create recipe
            $controller->create($data);
            break;

        case 'PUT':
            // Update recipe
            if (!$id) {
                Response::error('ID de receta requerido', null, 400);
            }
            $controller->update($id, $data);
            break;

        case 'DELETE':
            // Delete recipe
            if (!$id) {
                Response::error('ID de receta requerido', null, 400);
            }
            $controller->delete($id);
            break;

        default:
            Response::error('Método no permitido', null, 405);
    }

} catch (Exception $e) {
    error_log('Recipes API Error: ' . $e->getMessage());
    Response::error('Error del servidor', null, 500);
}
