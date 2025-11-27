<?php
// ============================================
// RECIPE MODEL
// ============================================

require_once 'Model.php';

class Recipe extends Model
{
    protected $table = 'recipes';

    /**
     * Create new recipe
     */
    public function create($data)
    {
        $query = "INSERT INTO {$this->table} 
                  (user_id, title, description, ingredients, instructions, 
                   prep_time, cook_time, servings, difficulty, category, image, is_public) 
                  VALUES (:user_id, :title, :description, :ingredients, :instructions,
                          :prep_time, :cook_time, :servings, :difficulty, :category, :image, :is_public)";

        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':user_id', $data['user_id'], PDO::PARAM_INT);
        $stmt->bindValue(':title', $data['title']);
        $stmt->bindValue(':description', $data['description'] ?? '');
        $stmt->bindValue(':ingredients', json_encode($data['ingredients'], JSON_UNESCAPED_UNICODE));
        $stmt->bindValue(':instructions', json_encode($data['instructions'], JSON_UNESCAPED_UNICODE));
        $stmt->bindValue(':prep_time', $data['prep_time'] ?? 0, PDO::PARAM_INT);
        $stmt->bindValue(':cook_time', $data['cook_time'] ?? 0, PDO::PARAM_INT);
        $stmt->bindValue(':servings', $data['servings'] ?? 1, PDO::PARAM_INT);
        $stmt->bindValue(':difficulty', $data['difficulty'] ?? 'Fácil');
        $stmt->bindValue(':category', $data['category'] ?? 'Otra');
        $stmt->bindValue(':image', $data['image'] ?? 'uploads/recipes/default.jpg');
        $stmt->bindValue(':is_public', $data['is_public'] ?? true, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    /**
     * Update recipe
     */
    public function update($id, $data)
    {
        $fields = [];
        $params = [':id' => $id];

        $allowedFields = [
            'title',
            'description',
            'prep_time',
            'cook_time',
            'servings',
            'difficulty',
            'category',
            'image',
            'is_public'
        ];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "{$field} = :{$field}";
                $params[":{$field}"] = $data[$field];
            }
        }

        if (isset($data['ingredients'])) {
            $fields[] = "ingredients = :ingredients";
            $params[':ingredients'] = json_encode($data['ingredients'], JSON_UNESCAPED_UNICODE);
        }

        if (isset($data['instructions'])) {
            $fields[] = "instructions = :instructions";
            $params[':instructions'] = json_encode($data['instructions'], JSON_UNESCAPED_UNICODE);
        }

        if (empty($fields)) {
            return false;
        }

        $query = "UPDATE {$this->table} SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($query);

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        return $stmt->execute();
    }

    /**
     * Get recipes with filters
     */
    public function search($filters = [])
    {
        $where = ["is_public = 1"];
        $params = [];

        if (!empty($filters['query'])) {
            $where[] = "(title LIKE :query OR description LIKE :query)";
            $params[':query'] = '%' . $filters['query'] . '%';
        }

        if (!empty($filters['category'])) {
            $where[] = "category = :category";
            $params[':category'] = $filters['category'];
        }

        if (!empty($filters['difficulty'])) {
            $where[] = "difficulty = :difficulty";
            $params[':difficulty'] = $filters['difficulty'];
        }

        if (!empty($filters['max_time'])) {
            $where[] = "(prep_time + cook_time) <= :max_time";
            $params[':max_time'] = (int) $filters['max_time'];
        }

        if (!empty($filters['user_id'])) {
            $where = ["user_id = :user_id"]; // Override public filter
            $params[':user_id'] = (int) $filters['user_id'];
        }

        $query = "SELECT r.*, u.username, u.full_name, u.avatar 
                  FROM {$this->table} r 
                  JOIN users u ON r.user_id = u.id 
                  WHERE " . implode(' AND ', $where) . " 
                  ORDER BY r.created_at DESC 
                  LIMIT :limit OFFSET :offset";

        $stmt = $this->db->prepare($query);

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        $stmt->bindValue(':limit', (int) ($filters['limit'] ?? 50), PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int) ($filters['offset'] ?? 0), PDO::PARAM_INT);

        $stmt->execute();
        $recipes = $stmt->fetchAll();

        // Decode JSON fields
        foreach ($recipes as &$recipe) {
            $recipe['ingredients'] = json_decode($recipe['ingredients'], true);
            $recipe['instructions'] = json_decode($recipe['instructions'], true);
        }

        return $recipes;
    }

    /**
     * Get recipe by ID with user info
     */
    public function findByIdWithUser($id)
    {
        $query = "SELECT r.*, u.username, u.full_name, u.avatar 
                  FROM {$this->table} r 
                  JOIN users u ON r.user_id = u.id 
                  WHERE r.id = :id LIMIT 1";

        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $recipe = $stmt->fetch();

        if ($recipe) {
            $recipe['ingredients'] = json_decode($recipe['ingredients'], true);
            $recipe['instructions'] = json_decode($recipe['instructions'], true);
        }

        return $recipe;
    }

    /**
     * Increment views
     */
    public function incrementViews($id)
    {
        $query = "UPDATE {$this->table} SET views = views + 1 WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
