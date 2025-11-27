<?php
// ============================================
// VALIDATOR UTILITY - Input Validation
// ============================================

class Validator
{
    /**
     * Check if value is required (not empty)
     */
    public static function required($value)
    {
        return !empty(trim($value));
    }

    /**
     * Validate email format
     */
    public static function email($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    /**
     * Validate password (minimum length)
     */
    public static function password($password, $minLength = 6)
    {
        return strlen($password) >= $minLength;
    }

    /**
     * Validate username (alphanumeric and underscore, 3-50 chars)
     */
    public static function username($username)
    {
        return preg_match('/^[a-zA-Z0-9_]{3,50}$/', $username);
    }

    /**
     * Validate string length
     */
    public static function length($value, $min, $max = null)
    {
        $len = strlen($value);
        if ($max === null) {
            return $len >= $min;
        }
        return $len >= $min && $len <= $max;
    }

    /**
     * Validate number
     */
    public static function number($value)
    {
        return is_numeric($value);
    }

    /**
     * Validate positive integer
     */
    public static function positiveInt($value)
    {
        return filter_var($value, FILTER_VALIDATE_INT) !== false && $value > 0;
    }

    /**
     * Sanitize string
     */
    public static function sanitize($value)
    {
        return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Validate enum value
     */
    public static function enum($value, array $allowed)
    {
        return in_array($value, $allowed, true);
    }
}
