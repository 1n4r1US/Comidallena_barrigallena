# DOCUMENTACIÓN TÉCNICA
## Sistema Web de Gestión de Recetas "Comida Llena, Barriga Llena"

---

## RESUMEN

El presente documento describe el desarrollo de un sistema web completo para la gestión, publicación y compartición de recetas culinarias denominado "Comida Llena, Barriga Llena". El sistema permite a los usuarios registrarse, crear, editar, eliminar y compartir recetas, así como marcar favoritos y realizar búsquedas avanzadas. 

La aplicación fue desarrollada utilizando tecnologías web modernas incluyendo HTML5, CSS3, JavaScript ES6+ en el frontend, y PHP 7.4+ con MySQL en el backend, implementando una arquitectura MVC (Modelo-Vista-Controlador) que garantiza escalabilidad, mantenibilidad y seguridad.

El proyecto abarca desde el análisis de requerimientos hasta la implementación completa, incluyendo diseño de base de datos, desarrollo de interfaces de usuario responsivas con soporte para modo oscuro, implementación de API RESTful, y medidas de seguridad robustas como hashing de contraseñas con bcrypt, prepared statements para prevención de SQL injection, y validación exhaustiva de inputs.

**Palabras clave:** Sistema web, recetas, PHP, MySQL, JavaScript, MVC, API RESTful, seguridad web

---

## ABSTRACT

This document describes the development of a complete web system for the management, publication and sharing of culinary recipes called "Comida Llena, Barriga Llena" (Full Meal, Full Belly). The system allows users to register, create, edit, delete and share recipes, as well as mark favorites and perform advanced searches.

The application was developed using modern web technologies including HTML5, CSS3, JavaScript ES6+ on the frontend, and PHP 7.4+ with MySQL on the backend, implementing an MVC (Model-View-Controller) architecture that ensures scalability, maintainability and security.

The project covers from requirements analysis to complete implementation, including database design, development of responsive user interfaces with dark mode support, RESTful API implementation, and robust security measures such as password hashing with bcrypt, prepared statements for SQL injection prevention, and comprehensive input validation.

**Keywords:** Web system, recipes, PHP, MySQL, JavaScript, MVC, RESTful API, web security

---

## INTRODUCCIÓN

### Contexto

En la era digital actual, la cocina y la gastronomía han encontrado un espacio importante en internet. Millones de personas buscan, comparten y crean recetas diariamente. Sin embargo, muchas plataformas existentes son complejas, están saturadas de publicidad, o no ofrecen una experiencia de usuario óptima.

### Problemática

Se identificó la necesidad de crear una plataforma simple, intuitiva y funcional que permita a los usuarios:
- Crear y gestionar sus propias recetas de manera sencilla
- Buscar recetas por diversos criterios (categoría, dificultad, tiempo)
- Compartir recetas con la comunidad
- Guardar recetas favoritas para acceso rápido
- Acceder desde cualquier dispositivo (responsive design)

### Justificación

El desarrollo de este sistema se justifica por:

1. **Necesidad educativa**: Aplicación práctica de conocimientos en desarrollo web full-stack
2. **Demanda del mercado**: Creciente interés en plataformas de recetas personalizables
3. **Innovación técnica**: Implementación de tecnologías modernas y mejores prácticas
4. **Escalabilidad**: Arquitectura que permite crecimiento futuro

### Alcance

El sistema desarrollado incluye:

**Frontend:**
- Página principal con búsqueda y filtros
- Sistema de autenticación (login/registro)
- Dashboard de usuario
- Formularios de creación/edición de recetas
- Sistema de favoritos
- Modo oscuro
- Diseño responsive

**Backend:**
- API RESTful en PHP
- Base de datos MySQL con 5 tablas relacionadas
- Sistema de autenticación con sesiones
- CRUD completo de recetas
- Búsqueda avanzada con filtros
- Medidas de seguridad robustas

---

## OBJETIVOS

### Objetivo General

Desarrollar un sistema web completo y funcional para la gestión y compartición de recetas culinarias, implementando tecnologías modernas de desarrollo web y aplicando mejores prácticas de programación, seguridad y diseño de interfaces.

### Objetivos Específicos

1. **Análisis y Diseño**
   - Analizar los requerimientos funcionales y no funcionales del sistema
   - Diseñar la arquitectura de la aplicación siguiendo el patrón MVC
   - Diseñar el modelo de base de datos relacional
   - Crear prototipos de interfaces de usuario

2. **Desarrollo Frontend**
   - Implementar interfaces de usuario responsivas con HTML5 y CSS3
   - Desarrollar funcionalidad interactiva con JavaScript ES6+
   - Crear un sistema de diseño consistente con CSS Variables
   - Implementar modo oscuro y temas personalizables
   - Desarrollar validación de formularios del lado del cliente

3. **Desarrollo Backend**
   - Implementar API RESTful con PHP siguiendo arquitectura MVC
   - Diseñar e implementar base de datos MySQL normalizada
   - Desarrollar sistema de autenticación seguro
   - Implementar CRUD completo para entidades principales
   - Crear sistema de búsqueda y filtrado avanzado

4. **Seguridad**
   - Implementar hashing de contraseñas con bcrypt
   - Prevenir inyección SQL mediante prepared statements
   - Validar y sanitizar todos los inputs del usuario
   - Configurar sesiones seguras
   - Implementar control de acceso basado en roles

5. **Pruebas y Documentación**
   - Realizar pruebas funcionales de todos los módulos
   - Documentar el código fuente
   - Crear documentación técnica completa
   - Generar manual de usuario

---

## PROGRAMA DE TRABAJO

### Fase 1: Análisis (Semana 1)
- Definición de requerimientos funcionales y no funcionales
- Análisis de procesos del sistema
- Identificación de actores y casos de uso
- Elaboración de diagramas de flujo

### Fase 2: Diseño (Semana 2)
- Diseño de base de datos (modelo entidad-relación)
- Diseño de arquitectura del sistema (MVC)
- Diseño de interfaces de usuario (wireframes y mockups)
- Definición de API endpoints

### Fase 3: Desarrollo Frontend (Semana 3-4)
- Implementación de sistema de diseño CSS
- Desarrollo de páginas HTML
- Implementación de JavaScript modular
- Integración de Font Awesome
- Pruebas de responsividad

### Fase 4: Desarrollo Backend (Semana 5-6)
- Creación de base de datos MySQL
- Implementación de modelos
- Desarrollo de controladores
- Creación de API endpoints
- Implementación de seguridad

### Fase 5: Integración (Semana 7)
- Conexión frontend-backend
- Pruebas de integración
- Corrección de errores
- Optimización de rendimiento

### Fase 6: Pruebas y Documentación (Semana 8)
- Pruebas funcionales completas
- Pruebas de seguridad
- Elaboración de documentación técnica
- Creación de manual de usuario

---

## MARCO TEÓRICO

### Tecnologías Web

#### HTML5 (HyperText Markup Language 5)
HTML5 es la quinta revisión del lenguaje HTML, utilizado para estructurar y presentar contenido en la World Wide Web. Introduce nuevos elementos semánticos como `<header>`, `<nav>`, `<section>`, `<article>`, que mejoran la accesibilidad y el SEO.

**Características utilizadas:**
- Elementos semánticos para mejor estructura
- Formularios con validación nativa
- Atributos de accesibilidad (ARIA)

#### CSS3 (Cascading Style Sheets 3)
CSS3 es la última evolución del lenguaje de hojas de estilo en cascada. Permite la creación de diseños complejos y responsivos.

**Características utilizadas:**
- CSS Variables (Custom Properties) para theming
- Flexbox y Grid para layouts responsivos
- Media Queries para diseño adaptativo
- Transiciones y animaciones
- Pseudo-clases y pseudo-elementos

#### JavaScript ES6+
JavaScript es el lenguaje de programación del lado del cliente que permite crear páginas web interactivas. ES6+ introduce características modernas como arrow functions, destructuring, modules, etc.

**Características utilizadas:**
- Módulos ES6 para organización del código
- Arrow functions
- Template literals
- Async/await para operaciones asíncronas
- Destructuring y spread operator
- Classes

### Tecnologías Backend

#### PHP (Hypertext Preprocessor)
PHP es un lenguaje de scripting del lado del servidor diseñado específicamente para desarrollo web. Es ampliamente utilizado y soportado.

**Características utilizadas:**
- Programación orientada a objetos
- PDO (PHP Data Objects) para acceso a base de datos
- Manejo de sesiones
- Funciones de hashing de contraseñas
- Manejo de excepciones

#### MySQL
MySQL es un sistema de gestión de bases de datos relacional de código abierto. Es uno de los sistemas de bases de datos más populares del mundo.

**Características utilizadas:**
- Tablas InnoDB con soporte transaccional
- Foreign keys para integridad referencial
- Índices para optimización de consultas
- Fulltext search para búsqueda de texto
- JSON data type para datos complejos

### Arquitectura y Patrones

#### Arquitectura MVC (Modelo-Vista-Controlador)

El patrón MVC separa la aplicación en tres componentes principales:

1. **Modelo**: Representa los datos y la lógica de negocio
   - Clases: User, Recipe, Favorite
   - Responsabilidad: Acceso a base de datos, validación de datos

2. **Vista**: Presenta los datos al usuario
   - Archivos: HTML, CSS
   - Responsabilidad: Interfaz de usuario, presentación

3. **Controlador**: Maneja la lógica de la aplicación
   - Clases: AuthController, RecipeController
   - Responsabilidad: Procesar requests, coordinar modelo y vista

**Ventajas:**
- Separación de responsabilidades
- Facilita el mantenimiento
- Permite desarrollo paralelo
- Reutilización de código

#### API RESTful (Representational State Transfer)

REST es un estilo arquitectónico para diseñar servicios web. Utiliza los métodos HTTP estándar.

**Principios aplicados:**
- Recursos identificados por URIs
- Uso de métodos HTTP (GET, POST, PUT, DELETE)
- Stateless (sin estado)
- Respuestas en formato JSON
- Códigos de estado HTTP apropiados

**Endpoints implementados:**
```
POST   /api/auth.php          - Registro/Login
GET    /api/auth.php          - Usuario actual
GET    /api/recipes.php       - Listar recetas
POST   /api/recipes.php       - Crear receta
PUT    /api/recipes.php?id=1  - Actualizar receta
DELETE /api/recipes.php?id=1  - Eliminar receta
POST   /api/favorites.php     - Toggle favorito
```

### Seguridad Web

#### Hashing de Contraseñas

El hashing es un proceso unidireccional que convierte una contraseña en una cadena de caracteres fija.

**Implementación:**
```php
// Crear hash
password_hash($password, PASSWORD_BCRYPT, ['cost' => 12])

// Verificar
password_verify($password, $hash)
```

**Características:**
- Algoritmo bcrypt (Blowfish)
- Cost factor de 12 (4096 iteraciones)
- Salt automático
- Resistente a ataques de fuerza bruta

#### SQL Injection Prevention

La inyección SQL es una técnica de ataque donde se insertan comandos SQL maliciosos.

**Prevención con Prepared Statements:**
```php
$stmt = $db->prepare("SELECT * FROM users WHERE email = :email");
$stmt->bindValue(':email', $email);
$stmt->execute();
```

**Ventajas:**
- Separación de código y datos
- Validación automática de tipos
- Protección contra inyección SQL

#### Cross-Site Scripting (XSS) Prevention

XSS permite a atacantes inyectar scripts maliciosos en páginas web.

**Prevención:**
```php
htmlspecialchars($input, ENT_QUOTES, 'UTF-8')
```

- Escape de caracteres especiales HTML
- Prevención de ejecución de scripts
- Sanitización de inputs

### Diseño Responsive

El diseño responsive permite que las interfaces se adapten a diferentes tamaños de pantalla.

**Técnicas utilizadas:**

1. **Mobile-First Approach**
   - Diseño inicial para móviles
   - Progressive enhancement para pantallas grandes

2. **Media Queries**
```css
@media (max-width: 768px) {
    /* Estilos para móvil */
}
```

3. **Flexbox y Grid**
   - Layouts flexibles
   - Distribución automática de elementos

4. **Unidades Relativas**
   - rem, em para tipografía
   - % para anchos
   - vh, vw para alturas

---

## METODOLOGÍA

### Metodología de Desarrollo

Se utilizó una metodología ágil adaptada, combinando elementos de Scrum y desarrollo iterativo incremental.

#### Fases del Desarrollo

1. **Análisis de Requerimientos**
   - Identificación de necesidades
   - Definición de funcionalidades
   - Priorización de características

2. **Diseño**
   - Diseño de base de datos
   - Diseño de arquitectura
   - Diseño de interfaces

3. **Implementación**
   - Desarrollo frontend
   - Desarrollo backend
   - Integración continua

4. **Pruebas**
   - Pruebas unitarias
   - Pruebas de integración
   - Pruebas de usuario

5. **Documentación**
   - Documentación de código
   - Documentación técnica
   - Manual de usuario

### Herramientas Utilizadas

#### Desarrollo
- **Editor de código**: Visual Studio Code
- **Control de versiones**: Git
- **Navegadores**: Chrome, Firefox, Edge
- **Servidor local**: WAMP (Windows, Apache, MySQL, PHP)

#### Diseño
- **Wireframes**: Figma / Sketch
- **Iconos**: Font Awesome 6.4
- **Paleta de colores**: Coolors.co

#### Testing
- **API Testing**: Postman, cURL
- **Browser DevTools**: Chrome DevTools
- **Database**: phpMyAdmin

#### Documentación
- **Formato**: Markdown
- **Diagramas**: Draw.io, Mermaid

### Estándares de Codificación

#### PHP
- PSR-12: Extended Coding Style
- Nombres de clases en PascalCase
- Nombres de métodos en camelCase
- Comentarios PHPDoc

#### JavaScript
- ES6+ features
- Nombres de variables en camelCase
- Nombres de clases en PascalCase
- JSDoc para documentación

#### CSS
- BEM (Block Element Modifier) naming
- Mobile-first approach
- Uso de CSS Variables
- Comentarios descriptivos

#### SQL
- Nombres de tablas en minúsculas
- Nombres de columnas en snake_case
- Uso de foreign keys
- Índices en campos frecuentemente consultados

---

*Continúa en la siguiente sección...*
