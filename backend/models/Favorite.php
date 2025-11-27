<?php
// ============================================
// FAVORITE MODEL
// ============================================

require_once 'Model.php';

class Favorite extends Model
{
    protected $table = 'favorites';

    /**
     * Toggle favorite (add or remove)
     */
    public function toggle($userId, $recipeId)
    {
        // Check if exists
        $query = "SELECT id FROM {$this->table} WHERE user_id = :user_id AND recipe_id = :recipe_id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':recipe_id', $recipeId, PDO::PARAM_INT);
        $stmt->execute();
        $exists = $stmt->fetch();

        if ($exists) {
            // Remove
            $query = "DELETE FROM {$this->table} WHERE user_id = :user_id AND recipe_id = :recipe_id";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindValue(':recipe_id', $recipeId, PDO::PARAM_INT);
            $stmt->execute();
            return ['action' => 'removed', 'is_favorite' => false];
        } else {
            // Add
            $query = "INSERT INTO {$this->table} (user_id, recipe_id) VALUES (:user_id, :recipe_id)";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindValue(':recipe_id', $recipeId, PDO::PARAM_INT);
            $stmt->execute();
            return ['action' => 'added', 'is_favorite' => true];
        }
    }

    /**
     * Get user's favorites
     */
    public function getUserFavorites($userId)
    {
        $query = "SELECT r.*, u.username, u.full_name, u.avatar 
                  FROM {$this->table} f
                  JOIN recipes r ON f.recipe_id = r.id
                  JOIN users u ON r.user_id = u.id
                  WHERE f.user_id = :user_id
                  ORDER BY f.created_at DESC";

        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        $favorites = $stmt->fetchAll();

        // Decode JSON fields
        foreach ($favorites as &$recipe) {
            $recipe['ingredients'] = json_decode($recipe['ingredients'], true);
            $recipe['instructions'] = json_decode($recipe['instructions'], true);
        }

        return $favorites;
    }

    /**
     * Check if recipe is favorited by user
     */
    public function isFavorite($userId, $recipeId)
    {
        $query = "SELECT id FROM {$this->table} WHERE user_id = :user_id AND recipe_id = :recipe_id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':recipe_id', $recipeId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch() !== false;
    }
}
