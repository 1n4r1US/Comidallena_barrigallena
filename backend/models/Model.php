<?php
// ============================================
// BASE MODEL CLASS
// ============================================

abstract class Model
{
    protected $db;
    protected $table;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * Find all records
     */
    public function findAll($limit = 100, $offset = 0)
    {
        $query = "SELECT * FROM {$this->table} LIMIT :limit OFFSET :offset";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int) $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Find record by ID
     */
    public function findById($id)
    {
        $query = "SELECT * FROM {$this->table} WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * Delete record by ID
     */
    public function delete($id)
    {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Count total records
     */
    public function count($where = '')
    {
        $query = "SELECT COUNT(*) as total FROM {$this->table}";
        if ($where) {
            $query .= " WHERE " . $where;
        }
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        return $result['total'] ?? 0;
    }
}
