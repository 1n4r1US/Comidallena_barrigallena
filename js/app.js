// ============================================
// APP.JS - Main Application Logic
// ============================================

const App = {
    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.updateUserUI();
        this.initPageSpecific();
    },

    // Setup navigation
    setupNavigation() {
        // Update active nav links
        const currentPath = window.location.pathname;
        document.querySelectorAll('.dashboard-nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPath.split('/').pop()) {
                link.classList.add('active');
            }
        });

        // User menu dropdown
        document.addEventListener('click', (e) => {
            if (e.target.closest('.user-menu-toggle')) {
                const menu = document.querySelector('.user-menu-dropdown');
                if (menu) {
                    menu.classList.toggle('show');
                }
            }
        });
    },

    // Setup mobile menu
    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.dashboard-sidebar');
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-menu-backdrop';

        if (toggle && sidebar) {
            document.body.appendChild(backdrop);

            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('show');
                backdrop.classList.toggle('show');
            });

            backdrop.addEventListener('click', () => {
                sidebar.classList.remove('show');
                backdrop.classList.remove('show');
            });
        }
    },

    // Update user UI
    updateUserUI() {
        const user = Auth.getCurrentUser();

        // Update user info in dashboard
        const userAvatar = document.querySelector('.dashboard-user-avatar');
        const userName = document.querySelector('.dashboard-user-info h4');
        const userEmail = document.querySelector('.dashboard-user-info p');

        if (user) {
            if (userAvatar) userAvatar.src = user.avatar;
            if (userName) userName.textContent = user.fullName;
            if (userEmail) userEmail.textContent = user.email;
        }

        // Update header user menu
        const headerAvatar = document.querySelector('.header-user-avatar');
        const headerName = document.querySelector('.header-user-name');

        if (user) {
            if (headerAvatar) headerAvatar.src = user.avatar;
            if (headerName) headerName.textContent = user.fullName;
        }
    },

    // Initialize page-specific functionality
    initPageSpecific() {
        const path = window.location.pathname;

        // Dashboard
        if (path.includes('dashboard.html')) {
            this.initDashboard();
        }

        // Recipe detail
        if (path.includes('recipe-detail.html')) {
            this.initRecipeDetail();
        }

        // Create/Edit recipe
        if (path.includes('create-recipe.html')) {
            this.initRecipeForm();
        }

        // Home page
        if (path.includes('index.html') || path.endsWith('/')) {
            this.initHomePage();
        }
    },

    // Initialize dashboard
    initDashboard() {
        if (!Auth.requireAuth()) return;

        const user = Auth.getCurrentUser();
        const userRecipes = Recipes.getByUser(user.id);
        const favorites = Recipes.getFavorites(user.id);

        // Update stats
        document.getElementById('totalRecipes').textContent = userRecipes.length;
        document.getElementById('totalFavorites').textContent = favorites.length;

        const totalViews = userRecipes.reduce((sum, r) => sum + r.views, 0);
        document.getElementById('totalViews').textContent = totalViews;

        // Display user recipes
        this.displayUserRecipes(userRecipes);

        // Display favorites
        this.displayFavorites(favorites);
    },

    // Display user recipes in dashboard
    displayUserRecipes(recipes) {
        const container = document.getElementById('userRecipesTable');
        if (!container) return;

        if (recipes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-utensils"></i>
                    </div>
                    <h3>No tienes recetas aún</h3>
                    <p>Crea tu primera receta y compártela con la comunidad</p>
                    <a href="create-recipe.html" class="btn btn-primary mt-lg">
                        <i class="fas fa-plus"></i> Crear Receta
                    </a>
                </div>
            `;
            return;
        }

        const tbody = container.querySelector('tbody');
        tbody.innerHTML = recipes.map(recipe => `
            <tr>
                <td>
                    <img src="${recipe.image}" alt="${recipe.title}" class="recipe-table-img">
                </td>
                <td>
                    <div class="recipe-table-title">${recipe.title}</div>
                    <div class="recipe-table-category">${recipe.category}</div>
                </td>
                <td><span class="badge badge-${recipe.difficulty === 'Fácil' ? 'success' : recipe.difficulty === 'Intermedia' ? 'warning' : 'error'}">${recipe.difficulty}</span></td>
                <td>${recipe.views}</td>
                <td>${DateHelpers.formatDate(recipe.createdAt)}</td>
                <td>
                    <div class="recipe-table-actions">
                        <button class="recipe-table-action-btn" onclick="window.location.href='recipe-detail.html?id=${recipe.id}'" title="Ver">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="recipe-table-action-btn" onclick="window.location.href='create-recipe.html?id=${recipe.id}'" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="recipe-table-action-btn delete" data-delete-recipe="${recipe.id}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    // Display favorites
    displayFavorites(favorites) {
        const container = document.getElementById('favoritesGrid');
        if (!container) return;

        if (favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <h3>No tienes favoritos</h3>
                    <p>Explora recetas y guarda tus favoritas</p>
                </div>
            `;
            return;
        }

        container.innerHTML = favorites.slice(0, 4).map(recipe => Search.createRecipeCard(recipe)).join('');
    },

    // Initialize recipe detail
    initRecipeDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get('id');

        if (!recipeId) {
            Toast.error('Receta no encontrada');
            setTimeout(() => window.location.href = '../index.html', 1500);
            return;
        }

        const recipe = Recipes.getById(recipeId);
        if (!recipe) {
            Toast.error('Receta no encontrada');
            setTimeout(() => window.location.href = '../index.html', 1500);
            return;
        }

        this.displayRecipeDetail(recipe);
    },

    // Display recipe detail
    displayRecipeDetail(recipe) {
        document.getElementById('recipeTitle').textContent = recipe.title;
        document.getElementById('recipeDescription').textContent = recipe.description;
        document.getElementById('recipeImage').src = recipe.image;

        // Meta info
        document.getElementById('recipePrepTime').textContent = `${recipe.prepTime} min`;
        document.getElementById('recipeCookTime').textContent = `${recipe.cookTime} min`;
        document.getElementById('recipeServings').textContent = recipe.servings;
        document.getElementById('recipeDifficulty').textContent = recipe.difficulty;
        document.getElementById('recipeCategory').textContent = recipe.category;

        // Ingredients
        const ingredientsList = document.getElementById('ingredientsList');
        ingredientsList.innerHTML = recipe.ingredients.map(ing => `<li>${ing}</li>`).join('');

        // Instructions
        const instructionsList = document.getElementById('instructionsList');
        instructionsList.innerHTML = recipe.instructions.map((inst, i) => `
            <div class="recipe-step">
                <div class="recipe-step-number">${i + 1}</div>
                <div class="recipe-step-content">
                    <p>${inst}</p>
                </div>
            </div>
        `).join('');

        // Favorite button
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (favoriteBtn) {
            favoriteBtn.classList.toggle('active', Recipes.isFavorite(recipe.id));
            favoriteBtn.dataset.toggleFavorite = recipe.id;
        }

        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.dataset.shareRecipe = recipe.id;
        }

        // Edit/Delete buttons (only for owner)
        const user = Auth.getCurrentUser();
        if (user && user.id === recipe.userId) {
            const actions = document.getElementById('recipeActions');
            if (actions) {
                actions.innerHTML = `
                    <a href="create-recipe.html?id=${recipe.id}" class="btn btn-outline">
                        <i class="fas fa-edit"></i> Editar
                    </a>
                    <button class="btn btn-danger" data-delete-recipe="${recipe.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                `;
            }
        }
    },

    // Initialize recipe form
    initRecipeForm() {
        if (!Auth.requireAuth()) return;

        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get('id');

        if (recipeId) {
            const recipe = Recipes.getById(recipeId);
            if (recipe) {
                this.populateRecipeForm(recipe);
            }
        }
    },

    // Populate recipe form for editing
    populateRecipeForm(recipe) {
        const form = document.getElementById('recipeForm');
        if (!form) return;

        form.dataset.recipeId = recipe.id;
        form.title.value = recipe.title;
        form.description.value = recipe.description;
        form.prepTime.value = recipe.prepTime;
        form.cookTime.value = recipe.cookTime;
        form.servings.value = recipe.servings;
        form.difficulty.value = recipe.difficulty;
        form.category.value = recipe.category;
        form.isPublic.checked = recipe.isPublic;

        // Set image
        if (recipe.image) {
            const preview = document.getElementById('imagePreview');
            preview.querySelector('img').src = recipe.image;
            preview.style.display = 'block';
            document.querySelector('.image-upload-area').classList.add('has-image');
        }

        // Populate ingredients
        const ingredientsList = document.getElementById('ingredientsList');
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ing => {
            const div = document.createElement('div');
            div.className = 'dynamic-list-item';
            div.innerHTML = `
                <input type="text" name="ingredients[]" class="form-input" value="${ing}">
                <button type="button" class="dynamic-list-remove" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            ingredientsList.appendChild(div);
        });

        // Populate instructions
        const instructionsList = document.getElementById('instructionsList');
        instructionsList.innerHTML = '';
        recipe.instructions.forEach(inst => {
            const div = document.createElement('div');
            div.className = 'dynamic-list-item';
            div.innerHTML = `
                <textarea name="instructions[]" class="form-input" rows="2">${inst}</textarea>
                <button type="button" class="dynamic-list-remove" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            instructionsList.appendChild(div);
        });

        // Update page title
        document.querySelector('h1').textContent = 'Editar Receta';
    },

    // Initialize home page
    initHomePage() {
        const recipes = Recipes.getAll();
        const container = document.getElementById('recipesGrid');

        if (container && recipes.length > 0) {
            container.innerHTML = recipes.slice(0, 6).map(recipe => Search.createRecipeCard(recipe)).join('');
        }
    }
};

// Initialize app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
} else {
    App.init();
}

window.App = App;
