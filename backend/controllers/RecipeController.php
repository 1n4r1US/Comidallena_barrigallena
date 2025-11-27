<?php
// ============================================
// RECIPE CONTROLLER
// ============================================

require_once __DIR__ . '/../models/Recipe.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/AuthController.php';

class RecipeController
{
    private $recipeModel;

    public function __construct($db)
    {
        $this->recipeModel = new Recipe($db);
    }

    /**
     * Get all recipes with filters
     */
    public function index($filters = [])
    {
        $recipes = $this->recipeModel->search($filters);
        Response::success('Recetas obtenidas', $recipes);
    }

    /**
     * Get single recipe
     */
    public function show($id)
    {
        $recipe = $this->recipeModel->findByIdWithUser($id);

        if (!$recipe) {
            Response::notFound('Receta no encontrada');
        }

        // Increment views
        $this->recipeModel->incrementViews($id);

        Response::success('Receta obtenida', $recipe);
    }

    /**
     * Create new recipe
     */
    public function create($data)
    {
        $userId = AuthController::requireAuth();

        // Validate
        $errors = [];

        if (!Validator::required($data['title'] ?? '')) {
            $errors['title'] = 'El título es requerido';
        }

        if (empty($data['ingredients']) || !is_array($data['ingredients'])) {
            $errors['ingredients'] = 'Los ingredientes son requeridos';
        }

        if (empty($data['instructions']) || !is_array($data['instructions'])) {
            $errors['instructions'] = 'Las instrucciones son requeridas';
        }

        if (isset($data['difficulty']) && !Validator::enum($data['difficulty'], ['Fácil', 'Intermedia', 'Difícil'])) {
            $errors['difficulty'] = 'Dificultad inválida';
        }

        if (!empty($errors)) {
            Response::error('Validación fallida', $errors, 400);
        }

        // Create recipe
        $recipeId = $this->recipeModel->create([
            'user_id' => $userId,
            'title' => Validator::sanitize($data['title']),
            'description' => Validator::sanitize($data['description'] ?? ''),
            'ingredients' => $data['ingredients'],
            'instructions' => $data['instructions'],
            'prep_time' => (int) ($data['prep_time'] ?? 0),
            'cook_time' => (int) ($data['cook_time'] ?? 0),
            'servings' => (int) ($data['servings'] ?? 1),
            'difficulty' => $data['difficulty'] ?? 'Fácil',
            'category' => Validator::sanitize($data['category'] ?? 'Otra'),
            'image' => $data['image'] ?? 'uploads/recipes/default.jpg',
            'is_public' => (bool) ($data['is_public'] ?? true)
        ]);

        if ($recipeId) {
            $recipe = $this->recipeModel->findByIdWithUser($recipeId);
            Response::success('Receta creada exitosamente', $recipe, 201);
        }

        Response::error('Error al crear receta', null, 500);
    }

    /**
     * Update recipe
     */
    public function update($id, $data)
    {
        $userId = AuthController::requireAuth();

        // Check if recipe exists and belongs to user
        $recipe = $this->recipeModel->findById($id);

        if (!$recipe) {
            Response::notFound('Receta no encontrada');
        }

        if ($recipe['user_id'] != $userId) {
            Response::forbidden('No tienes permiso para editar esta receta');
        }

        // Validate difficulty if provided
        if (isset($data['difficulty']) && !Validator::enum($data['difficulty'], ['Fácil', 'Intermedia', 'Difícil'])) {
            Response::error('Dificultad inválida', null, 400);
        }

        // Sanitize text fields
        $updateData = [];
        $textFields = ['title', 'description', 'category', 'image'];
        foreach ($textFields as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = Validator::sanitize($data[$field]);
            }
        }

        // Add other fields
        $otherFields = ['ingredients', 'instructions', 'prep_time', 'cook_time', 'servings', 'difficulty', 'is_public'];
        foreach ($otherFields as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = $data[$field];
            }
        }

        // Update
        if ($this->recipeModel->update($id, $updateData)) {
            $recipe = $this->recipeModel->findByIdWithUser($id);
            Response::success('Receta actualizada exitosamente', $recipe);
        }

        Response::error('Error al actualizar receta', null, 500);
    }

    /**
     * Delete recipe
     */
    public function delete($id)
    {
        $userId = AuthController::requireAuth();

        // Check if recipe exists and belongs to user
        $recipe = $this->recipeModel->findById($id);

        if (!$recipe) {
            Response::notFound('Receta no encontrada');
        }

        if ($recipe['user_id'] != $userId) {
            Response::forbidden('No tienes permiso para eliminar esta receta');
        }

        // Delete
        if ($this->recipeModel->delete($id)) {
            Response::success('Receta eliminada exitosamente');
        }

        Response::error('Error al eliminar receta', null, 500);
    }
}
