# Backend Setup - Comida Llena

## 📋 Requisitos Previos

- WAMP/XAMPP instalado y corriendo
- MySQL activo
- PHP 7.4 o superior
- Extensiones PHP: PDO, pdo_mysql, json

---

## 🚀 Instalación

### 1. Crear Base de Datos

Abre phpMyAdmin (http://localhost/phpmyadmin) o MySQL desde línea de comandos:

```bash
# Opción 1: Desde phpMyAdmin
# - Ir a la pestaña "SQL"
# - Copiar y pegar el contenido de database/schema.sql
# - Click en "Continuar"

# Opción 2: Desde línea de comandos
mysql -u root -p < database/schema.sql
```

Esto creará:
- Base de datos `comida_llena`
- 5 tablas (users, recipes, favorites, comments, shares)
- 1 usuario de prueba (demo@example.com / password)
- 2 recetas de ejemplo

### 2. Verificar Configuración

Edita `backend/config/database.php` si tus credenciales son diferentes:

```php
private $host = 'localhost';
private $db_name = 'comida_llena';
private $username = 'root';
private $password = ''; // Cambia si tienes contraseña
```

### 3. Verificar Permisos

Asegúrate de que la carpeta `uploads/` tenga permisos de escritura:

```bash
# En Windows (WAMP), generalmente no es necesario
# En Linux/Mac:
chmod -R 755 uploads/
```

---

## 🧪 Probar el Backend

### Opción 1: Usar cURL (Línea de Comandos)

```bash
# Test: Registro de usuario
curl -X POST http://localhost/Comidallena_barrigallena-main/backend/api/auth.php \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"register\",\"username\":\"test\",\"email\":\"test@test.com\",\"password\":\"123456\",\"full_name\":\"Test User\"}"

# Test: Login
curl -X POST http://localhost/Comidallena_barrigallena-main/backend/api/auth.php \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"login\",\"email\":\"demo@example.com\",\"password\":\"password\"}"

# Test: Obtener recetas
curl http://localhost/Comidallena_barrigallena-main/backend/api/recipes.php

# Test: Buscar recetas
curl "http://localhost/Comidallena_barrigallena-main/backend/api/recipes.php?query=enchiladas"
```

### Opción 2: Usar Postman

1. Importar colección o crear requests manualmente
2. Configurar base URL: `http://localhost/Comidallena_barrigallena-main/backend/api`

**Endpoints disponibles:**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth.php` | Register/Login/Logout |
| GET | `/auth.php` | Get current user |
| GET | `/recipes.php` | List recipes |
| GET | `/recipes.php?id=1` | Get recipe by ID |
| POST | `/recipes.php` | Create recipe |
| PUT | `/recipes.php?id=1` | Update recipe |
| DELETE | `/recipes.php?id=1` | Delete recipe |
| GET | `/favorites.php` | Get user favorites |
| POST | `/favorites.php` | Toggle favorite |

---

## 📝 Ejemplos de Uso

### Registro

```json
POST /backend/api/auth.php
{
  "action": "register",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "123456",
  "full_name": "John Doe"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": 2,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "avatar": "uploads/avatars/default.png",
    "created_at": "2025-11-27 10:00:00"
  }
}
```

### Login

```json
POST /backend/api/auth.php
{
  "action": "login",
  "email": "demo@example.com",
  "password": "password"
}
```

### Crear Receta

```json
POST /backend/api/recipes.php
{
  "title": "Tacos al Pastor",
  "description": "Deliciosos tacos con carne marinada",
  "ingredients": [
    "500g carne de cerdo",
    "Piña",
    "Tortillas",
    "Cilantro",
    "Cebolla"
  ],
  "instructions": [
    "Marinar la carne",
    "Asar en el trompo",
    "Servir en tortillas con piña"
  ],
  "prep_time": 30,
  "cook_time": 20,
  "servings": 4,
  "difficulty": "Intermedia",
  "category": "Mexicana",
  "is_public": true
}
```

### Buscar Recetas

```
GET /backend/api/recipes.php?query=tacos&category=Mexicana&difficulty=Fácil
```

### Toggle Favorito

```json
POST /backend/api/favorites.php
{
  "recipe_id": 1
}
```

---

## 🔒 Seguridad Implementada

- ✅ **Password Hashing**: bcrypt con cost 12
- ✅ **Prepared Statements**: Prevención de SQL injection
- ✅ **Input Validation**: Validación de todos los inputs
- ✅ **Input Sanitization**: Limpieza de HTML/scripts
- ✅ **Session Management**: Sesiones seguras con httponly
- ✅ **CORS**: Configurado para localhost
- ✅ **Error Handling**: Logs de errores sin exponer detalles

---

## 🐛 Troubleshooting

### Error: "Database connection failed"

- Verifica que MySQL esté corriendo
- Verifica credenciales en `backend/config/database.php`
- Verifica que la base de datos `comida_llena` exista

### Error: "CORS policy"

- Verifica que el frontend esté en `http://localhost`
- Ajusta `Access-Control-Allow-Origin` en `backend/config/config.php` si es necesario

### Error: "Session not working"

- Verifica que `session.save_path` en php.ini tenga permisos
- Verifica que las cookies estén habilitadas en el navegador

### Error: "JSON parse error"

- Verifica que estés enviando `Content-Type: application/json`
- Verifica que el JSON sea válido

---

## 📊 Estructura de la Base de Datos

```
users
├── id (PK)
├── username (UNIQUE)
├── email (UNIQUE)
├── password (HASHED)
├── full_name
├── avatar
└── timestamps

recipes
├── id (PK)
├── user_id (FK → users.id)
├── title
├── description
├── ingredients (JSON)
├── instructions (JSON)
├── prep_time
├── cook_time
├── servings
├── difficulty (ENUM)
├── category
├── image
├── is_public
├── views
└── timestamps

favorites
├── id (PK)
├── user_id (FK → users.id)
├── recipe_id (FK → recipes.id)
└── created_at

comments
├── id (PK)
├── user_id (FK → users.id)
├── recipe_id (FK → recipes.id)
├── comment
├── rating
└── timestamps

shares
├── id (PK)
├── recipe_id (FK → recipes.id)
├── shared_by (FK → users.id)
├── share_method
└── created_at
```

---

## 🔄 Siguiente Paso: Integrar con Frontend

Una vez que el backend esté funcionando, actualiza los archivos JavaScript del frontend para usar la API:

1. Actualizar `js/auth.js` para usar `/backend/api/auth.php`
2. Actualizar `js/recipes.js` para usar `/backend/api/recipes.php`
3. Actualizar `js/search.js` para usar los filtros de la API

Ver documentación de integración en el siguiente paso.
