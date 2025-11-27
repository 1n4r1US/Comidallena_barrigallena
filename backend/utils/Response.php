<?php
// ============================================
// RESPONSE UTILITY - JSON Responses
// ============================================

class Response
{
    /**
     * Send success response
     */
    public static function success($message, $data = null, $code = 200)
    {
        http_response_code($code);
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * Send error response
     */
    public static function error($message, $errors = null, $code = 400)
    {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * Send unauthorized response
     */
    public static function unauthorized($message = 'No autorizado')
    {
        self::error($message, null, 401);
    }

    /**
     * Send forbidden response
     */
    public static function forbidden($message = 'Acceso denegado')
    {
        self::error($message, null, 403);
    }

    /**
     * Send not found response
     */
    public static function notFound($message = 'Recurso no encontrado')
    {
        self::error($message, null, 404);
    }
}
