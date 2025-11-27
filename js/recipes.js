// ============================================
// RECIPES.JS - Recipe CRUD Operations
// ============================================

const Recipes = {
    recipes: [],
    favorites: [],

    init() {
        this.recipes = Storage.get('recipes', this.getSeedData());
        this.favorites = Storage.get('favorites', []);
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Create/Edit recipe form
        const recipeForm = document.getElementById('recipeForm');
        if (recipeForm) {
            recipeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveRecipe(e.target);
            });

            // Image upload
            const imageInput = document.getElementById('recipeImage');
            if (imageInput) {
                imageInput.addEventListener('change', (e) => {
                    this.handleImageUpload(e.target);
                });
            }

            // Dynamic ingredients
            document.getElementById('addIngredient')?.addEventListener('click', () => {
                this.addIngredientField();
            });

            // Dynamic instructions
            document.getElementById('addInstruction')?.addEventListener('click', () => {
                this.addInstructionField();
            });
        }

        // Delete recipe
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-delete-recipe]')) {
                const id = e.target.closest('[data-delete-recipe]').dataset.deleteRecipe;
                this.deleteRecipe(id);
            }
        });

        // Toggle favorite
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-toggle-favorite]')) {
                const id = e.target.closest('[data-toggle-favorite]').dataset.toggleFavorite;
                this.toggleFavorite(id);
            }
        });

        // Share recipe
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-share-recipe]')) {
                const id = e.target.closest('[data-share-recipe]').dataset.shareRecipe;
                this.shareRecipe(id);
            }
        });
    },

    // Get all recipes
    getAll() {
        return this.recipes;
    },

    // Get recipe by ID
    getById(id) {
        return this.recipes.find(r => r.id === id);
    },

    // Get recipes by user
    getByUser(userId) {
        return this.recipes.filter(r => r.userId === userId);
    },

    // Create recipe
    create(recipeData) {
        const recipe = {
            id: generateId(),
            ...recipeData,
            userId: Auth.getCurrentUser()?.id,
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.recipes.push(recipe);
        this.save();

        return recipe;
    },

    // Update recipe
    update(id, recipeData) {
        const index = this.recipes.findIndex(r => r.id === id);
        if (index === -1) return null;

        this.recipes[index] = {
            ...this.recipes[index],
            ...recipeData,
            updatedAt: new Date().toISOString()
        };

        this.save();
        return this.recipes[index];
    },

    // Delete recipe
    deleteRecipe(id) {
        Modal.confirm(
            'Eliminar Receta',
            '¿Estás seguro que deseas eliminar esta receta? Esta acción no se puede deshacer.',
            () => {
                const index = this.recipes.findIndex(r => r.id === id);
                if (index !== -1) {
                    this.recipes.splice(index, 1);
                    this.save();
                    Toast.success('Receta eliminada');

                    // Reload if on dashboard
                    if (window.location.pathname.includes('dashboard')) {
                        setTimeout(() => location.reload(), 1000);
                    }
                }
            }
        );
    },

    // Toggle favorite
    toggleFavorite(recipeId) {
        const userId = Auth.getCurrentUser()?.id;
        if (!userId) {
            Toast.warning('Debes iniciar sesión');
            return;
        }

        const index = this.favorites.findIndex(
            f => f.userId === userId && f.recipeId === recipeId
        );

        if (index === -1) {
            this.favorites.push({ userId, recipeId, createdAt: new Date().toISOString() });
            Toast.success('Agregado a favoritos');
        } else {
            this.favorites.splice(index, 1);
            Toast.info('Eliminado de favoritos');
        }

        Storage.set('favorites', this.favorites);

        // Update UI
        const btn = document.querySelector(`[data-toggle-favorite="${recipeId}"]`);
        if (btn) {
            btn.classList.toggle('active');
        }
    },

    // Check if recipe is favorite
    isFavorite(recipeId) {
        const userId = Auth.getCurrentUser()?.id;
        if (!userId) return false;

        return this.favorites.some(
            f => f.userId === userId && f.recipeId === recipeId
        );
    },

    // Get user favorites
    getFavorites(userId) {
        const favoriteIds = this.favorites
            .filter(f => f.userId === userId)
            .map(f => f.recipeId);

        return this.recipes.filter(r => favoriteIds.includes(r.id));
    },

    // Share recipe
    shareRecipe(id) {
        const recipe = this.getById(id);
        if (!recipe) return;

        const url = `${window.location.origin}/pages/recipe-detail.html?id=${id}`;
        const text = `¡Mira esta receta: ${recipe.title}!`;

        Modal.show({
            title: 'Compartir Receta',
            content: `
                <div style="text-align: center;">
                    <p style="margin-bottom: var(--space-lg);">${recipe.title}</p>
                    <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
                        <button class="btn btn-success" onclick="window.open('https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}', '_blank')">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </button>
                        <button class="btn btn-primary" onclick="window.open('https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}', '_blank')">
                            <i class="fab fa-facebook"></i> Facebook
                        </button>
                        <button class="btn btn-info" onclick="navigator.clipboard.writeText('${url}'); Toast.success('Enlace copiado')">
                            <i class="fas fa-link"></i> Copiar enlace
                        </button>
                    </div>
                </div>
            `,
            showCancel: false,
            confirmText: 'Cerrar'
        });
    },

    // Handle save recipe (create/update)
    async handleSaveRecipe(form) {
        const formData = FormHelpers.getFormData(form);
        const recipeId = form.dataset.recipeId;

        // Validate
        let isValid = true;

        if (!Validator.required(formData.title)) {
            FormHelpers.showError(form.title, 'El título es requerido');
            isValid = false;
        }

        if (!isValid) return;

        // Get ingredients
        const ingredients = [];
        form.querySelectorAll('[name="ingredients[]"]').forEach(input => {
            if (input.value.trim()) {
                ingredients.push(input.value.trim());
            }
        });

        // Get instructions
        const instructions = [];
        form.querySelectorAll('[name="instructions[]"]').forEach(input => {
            if (input.value.trim()) {
                instructions.push(input.value.trim());
            }
        });

        const recipeData = {
            title: formData.title,
            description: formData.description,
            ingredients,
            instructions,
            prepTime: parseInt(formData.prepTime) || 0,
            cookTime: parseInt(formData.cookTime) || 0,
            servings: parseInt(formData.servings) || 1,
            difficulty: formData.difficulty,
            category: formData.category,
            image: formData.image || 'img/logo.png',
            isPublic: formData.isPublic === 'on'
        };

        Loading.show(recipeId ? 'Actualizando...' : 'Guardando...');

        setTimeout(() => {
            if (recipeId) {
                this.update(recipeId, recipeData);
                Toast.success('Receta actualizada');
            } else {
                this.create(recipeData);
                Toast.success('Receta creada');
            }

            Loading.hide();

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }, 1000);
    },

    // Handle image upload
    handleImageUpload(input) {
        const preview = document.getElementById('imagePreview');
        const uploadArea = document.querySelector('.image-upload-area');

        if (ImageHelpers.previewImage(input, preview.querySelector('img'))) {
            uploadArea.classList.add('has-image');
            preview.style.display = 'block';

            // Store as base64 for demo
            ImageHelpers.getBase64(input.files[0]).then(base64 => {
                document.getElementById('imageBase64').value = base64;
            });
        }
    },

    // Add ingredient field
    addIngredientField() {
        const container = document.getElementById('ingredientsList');
        const div = document.createElement('div');
        div.className = 'dynamic-list-item';
        div.innerHTML = `
            <input type="text" name="ingredients[]" class="form-input" placeholder="Ej: 2 tazas de harina">
            <button type="button" class="dynamic-list-remove" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(div);
    },

    // Add instruction field
    addInstructionField() {
        const container = document.getElementById('instructionsList');
        const div = document.createElement('div');
        div.className = 'dynamic-list-item';
        div.innerHTML = `
            <textarea name="instructions[]" class="form-input" rows="2" placeholder="Describe el paso..."></textarea>
            <button type="button" class="dynamic-list-remove" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(div);
    },

    // Save to localStorage
    save() {
        Storage.set('recipes', this.recipes);
    },

    // Seed data
    getSeedData() {
        return [
            {
                id: 'recipe-1',
                userId: 'demo-user',
                title: 'Enchiladas Verdes',
                description: 'Deliciosas enchiladas bañadas en salsa verde con pollo deshebrado',
                ingredients: ['12 tortillas de maíz', '500g de pechuga de pollo', '1 kg de tomates verdes', '2 chiles serranos', 'Crema', 'Queso fresco'],
                instructions: ['Cocina el pollo y deshebra', 'Prepara la salsa verde', 'Calienta las tortillas', 'Rellena y enrolla', 'Baña con salsa y gratina'],
                prepTime: 20,
                cookTime: 30,
                servings: 6,
                difficulty: 'Intermedia',
                category: 'Mexicana',
                image: 'img/enchiladas.jpg',
                isPublic: true,
                views: 245,
                createdAt: '2025-11-20T10:00:00Z'
            },
            {
                id: 'recipe-2',
                userId: 'demo-user',
                title: 'Pasta Alfredo',
                description: 'Cremosa pasta con salsa alfredo casera',
                ingredients: ['400g de fettuccine', '200ml de crema', '100g de queso parmesano', 'Mantequilla', 'Ajo'],
                instructions: ['Cocina la pasta', 'Prepara la salsa alfredo', 'Mezcla todo', 'Sirve caliente'],
                prepTime: 10,
                cookTime: 20,
                servings: 4,
                difficulty: 'Fácil',
                category: 'Italiana',
                image: 'img/pasta.jpg',
                isPublic: true,
                views: 189,
                createdAt: '2025-11-22T14:30:00Z'
            }
        ];
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Recipes.init();
    });
} else {
    Recipes.init();
}

window.Recipes = Recipes;
