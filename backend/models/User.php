<?php
// ============================================
// USER MODEL
// ============================================

require_once 'Model.php';

class User extends Model
{
    protected $table = 'users';

    /**
     * Create new user
     */
    public function create($data)
    {
        $query = "INSERT INTO {$this->table} 
                  (username, email, password, full_name, avatar) 
                  VALUES (:username, :email, :password, :full_name, :avatar)";

        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':username', $data['username']);
        $stmt->bindValue(':email', $data['email']);
        $stmt->bindValue(':password', password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]));
        $stmt->bindValue(':full_name', $data['full_name']);
        $stmt->bindValue(':avatar', $data['avatar'] ?? 'uploads/avatars/default.png');

        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    /**
     * Update user
     */
    public function update($id, $data)
    {
        $fields = [];
        $params = [':id' => $id];

        if (isset($data['full_name'])) {
            $fields[] = "full_name = :full_name";
            $params[':full_name'] = $data['full_name'];
        }

        if (isset($data['avatar'])) {
            $fields[] = "avatar = :avatar";
            $params[':avatar'] = $data['avatar'];
        }

        if (isset($data['password'])) {
            $fields[] = "password = :password";
            $params[':password'] = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]);
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
     * Find user by email
     */
    public function findByEmail($email)
    {
        $query = "SELECT * FROM {$this->table} WHERE email = :email LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * Find user by username
     */
    public function findByUsername($username)
    {
        $query = "SELECT * FROM {$this->table} WHERE username = :username LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':username', $username);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * Verify password
     */
    public function verifyPassword($password, $hash)
    {
        return password_verify($password, $hash);
    }

    /**
     * Get user's public data (without password)
     */
    public function getPublicData($user)
    {
        if (!$user)
            return null;

        unset($user['password']);
        return $user;
    }
}
