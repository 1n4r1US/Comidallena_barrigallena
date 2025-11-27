<?php
// ============================================
// FAVORITES API ENDPOINT
// ============================================

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Favorite.php';
require_once __DIR__ . '/../controllers/AuthController.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $favoriteModel = new Favorite($db);

    $method = $_SERVER['REQUEST_METHOD'];
    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    switch ($method) {
        case 'GET':
            // Get user's favorites
            $userId = AuthController::requireAuth();
            $favorites = $favoriteModel->getUserFavorites($userId);
            Response::success('Favoritos obtenidos', $favorites);
            break;

        case 'POST':
            // Toggle favorite
            $userId = AuthController::requireAuth();

            if (empty($data['recipe_id'])) {
                Response::error('ID de receta requerido', null, 400);
            }

            $result = $favoriteModel->toggle($userId, $data['recipe_id']);
            $message = $result['action'] === 'added' ? 'Agregado a favoritos' : 'Eliminado de favoritos';
            Response::success($message, $result);
            break;

        default:
            Response::error('Método no permitido', null, 405);
    }

} catch (Exception $e) {
    error_log('Favorites API Error: ' . $e->getMessage());
    Response::error('Error del servidor', null, 500);
}
