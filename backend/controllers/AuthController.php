<?php
// ============================================
// AUTH CONTROLLER
// ============================================

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class AuthController
{
    private $userModel;

    public function __construct($db)
    {
        $this->userModel = new User($db);
    }

    /**
     * Register new user
     */
    public function register($data)
    {
        // Validate input
        $errors = [];

        if (!Validator::required($data['full_name'] ?? '')) {
            $errors['full_name'] = 'El nombre completo es requerido';
        }

        if (!Validator::username($data['username'] ?? '')) {
            $errors['username'] = 'Usuario inválido (3-50 caracteres alfanuméricos)';
        }

        if (!Validator::email($data['email'] ?? '')) {
            $errors['email'] = 'Email inválido';
        }

        if (!Validator::password($data['password'] ?? '', 6)) {
            $errors['password'] = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!empty($errors)) {
            Response::error('Validación fallida', $errors, 400);
        }

        // Check if email already exists
        if ($this->userModel->findByEmail($data['email'])) {
            Response::error('El email ya está registrado', null, 409);
        }

        // Check if username already exists
        if ($this->userModel->findByUsername($data['username'])) {
            Response::error('El nombre de usuario ya existe', null, 409);
        }

        // Create user
        $userId = $this->userModel->create([
            'username' => Validator::sanitize($data['username']),
            'email' => Validator::sanitize($data['email']),
            'password' => $data['password'],
            'full_name' => Validator::sanitize($data['full_name'])
        ]);

        if ($userId) {
            $user = $this->userModel->findById($userId);
            $user = $this->userModel->getPublicData($user);

            // Create session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user'] = $user;

            Response::success('Usuario creado exitosamente', $user, 201);
        }

        Response::error('Error al crear usuario', null, 500);
    }

    /**
     * Login user
     */
    public function login($data)
    {
        // Validate
        if (!Validator::email($data['email'] ?? '') || !Validator::required($data['password'] ?? '')) {
            Response::error('Email y contraseña son requeridos', null, 400);
        }

        // Find user
        $user = $this->userModel->findByEmail($data['email']);

        if (!$user || !$this->userModel->verifyPassword($data['password'], $user['password'])) {
            Response::error('Email o contraseña incorrectos', null, 401);
        }

        // Create session
        $user = $this->userModel->getPublicData($user);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user'] = $user;

        Response::success('Login exitoso', $user);
    }

    /**
     * Logout user
     */
    public function logout()
    {
        session_destroy();
        Response::success('Sesión cerrada exitosamente');
    }

    /**
     * Get current user
     */
    public function me()
    {
        if (!isset($_SESSION['user_id'])) {
            Response::unauthorized('No autenticado');
        }

        Response::success('Usuario actual', $_SESSION['user']);
    }

    /**
     * Check if user is authenticated
     */
    public static function requireAuth()
    {
        if (!isset($_SESSION['user_id'])) {
            Response::unauthorized('Debes iniciar sesión');
        }
        return $_SESSION['user_id'];
    }
}
