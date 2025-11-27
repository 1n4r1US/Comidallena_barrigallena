-- ============================================
-- DATABASE SCHEMA - Comida Llena
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS comida_llena 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE comida_llena;

-- ============================================
-- TABLA: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar VARCHAR(255) DEFAULT 'uploads/avatars/default.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: recipes
-- ============================================
CREATE TABLE IF NOT EXISTS recipes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    ingredients JSON NOT NULL,
    instructions JSON NOT NULL,
    prep_time INT UNSIGNED DEFAULT 0,
    cook_time INT UNSIGNED DEFAULT 0,
    servings INT UNSIGNED DEFAULT 1,
    difficulty ENUM('Fácil', 'Intermedia', 'Difícil') DEFAULT 'Fácil',
    category VARCHAR(50) DEFAULT 'Otra',
    image VARCHAR(255) DEFAULT 'uploads/recipes/default.jpg',
    is_public BOOLEAN DEFAULT TRUE,
    views INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty),
    INDEX idx_is_public (is_public),
    FULLTEXT idx_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: favorites
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    recipe_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, recipe_id),
    INDEX idx_user_id (user_id),
    INDEX idx_recipe_id (recipe_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: comments
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    recipe_id INT UNSIGNED NOT NULL,
    comment TEXT NOT NULL,
    rating TINYINT UNSIGNED CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: shares
-- ============================================
CREATE TABLE IF NOT EXISTS shares (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT UNSIGNED NOT NULL,
    shared_by INT UNSIGNED NOT NULL,
    share_method VARCHAR(50) DEFAULT 'link',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS DE PRUEBA (SEED)
-- ============================================

-- Usuario de prueba
INSERT INTO users (username, email, password, full_name) VALUES
('demo', 'demo@example.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS0eL8n6i', 'Usuario Demo');
-- Contraseña: password

-- Recetas de ejemplo
INSERT INTO recipes (user_id, title, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, category, image) VALUES
(1, 'Enchiladas Verdes', 'Deliciosas enchiladas bañadas en salsa verde con pollo deshebrado', 
 '["12 tortillas de maíz", "500g de pechuga de pollo", "1 kg de tomates verdes", "2 chiles serranos", "Crema", "Queso fresco"]',
 '["Cocina el pollo y deshebra", "Prepara la salsa verde licuando los tomates", "Calienta las tortillas", "Rellena y enrolla", "Baña con salsa y gratina"]',
 20, 30, 6, 'Intermedia', 'Mexicana', '../img/enchiladas.jpg'),

(1, 'Pasta Alfredo', 'Cremosa pasta con salsa alfredo casera',
 '["400g de fettuccine", "200ml de crema", "100g de queso parmesano", "Mantequilla", "Ajo"]',
 '["Cocina la pasta al dente", "Prepara la salsa alfredo con crema y queso", "Mezcla todo", "Sirve caliente con parmesano"]',
 10, 20, 4, 'Fácil', 'Italiana', '../img/pasta.jpg');
