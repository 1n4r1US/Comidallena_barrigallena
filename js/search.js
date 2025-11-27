// ============================================
// SEARCH.JS - Search & Filter Functionality
// ============================================

const Search = {
    currentFilters: {
        query: '',
        category: '',
        difficulty: '',
        maxTime: ''
    },

    init() {
        this.setupEventListeners();
        this.performSearch();
    },

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.currentFilters.query = e.target.value;
                this.performSearch();
            }, 300));
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.performSearch();
            });
        }

        // Difficulty filter
        const difficultyFilter = document.getElementById('difficultyFilter');
        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', (e) => {
                this.currentFilters.difficulty = e.target.value;
                this.performSearch();
            });
        }

        // Time filter
        const timeFilter = document.getElementById('timeFilter');
        if (timeFilter) {
            timeFilter.addEventListener('change', (e) => {
                this.currentFilters.maxTime = e.target.value;
                this.performSearch();
            });
        }

        // Clear filters
        const clearFilters = document.getElementById('clearFilters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    },

    performSearch() {
        let results = Recipes.getAll();

        // Filter by search query
        if (this.currentFilters.query) {
            const query = this.currentFilters.query.toLowerCase();
            results = results.filter(recipe =>
                recipe.title.toLowerCase().includes(query) ||
                recipe.description.toLowerCase().includes(query) ||
                recipe.ingredients.some(ing => ing.toLowerCase().includes(query))
            );
        }

        // Filter by category
        if (this.currentFilters.category) {
            results = results.filter(recipe =>
                recipe.category === this.currentFilters.category
            );
        }

        // Filter by difficulty
        if (this.currentFilters.difficulty) {
            results = results.filter(recipe =>
                recipe.difficulty === this.currentFilters.difficulty
            );
        }

        // Filter by max time
        if (this.currentFilters.maxTime) {
            const maxTime = parseInt(this.currentFilters.maxTime);
            results = results.filter(recipe =>
                (recipe.prepTime + recipe.cookTime) <= maxTime
            );
        }

        this.displayResults(results);
    },

    displayResults(recipes) {
        const container = document.getElementById('recipesGrid');
        if (!container) return;

        if (recipes.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>No se encontraron recetas</h3>
                    <p>Intenta con otros términos de búsqueda o filtros</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');
    },

    createRecipeCard(recipe) {
        const isFavorite = Recipes.isFavorite(recipe.id);
        const totalTime = recipe.prepTime + recipe.cookTime;

        return `
            <div class="recipe-card" onclick="window.location.href='pages/recipe-detail.html?id=${recipe.id}'">
                <div class="recipe-card-img-container">
                    <img src="${recipe.image}" alt="${recipe.title}" class="recipe-card-img">
                    <span class="recipe-card-badge">${recipe.category}</span>
                    <button class="recipe-card-favorite ${isFavorite ? 'active' : ''}" 
                            data-toggle-favorite="${recipe.id}"
                            onclick="event.stopPropagation()">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="recipe-card-body">
                    <h3 class="recipe-card-title">${recipe.title}</h3>
                    <p class="recipe-card-description">${recipe.description}</p>
                    <div class="recipe-card-meta">
                        <div class="recipe-card-meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${totalTime} min</span>
                        </div>
                        <div class="recipe-card-meta-item">
                            <i class="fas fa-signal"></i>
                            <span>${recipe.difficulty}</span>
                        </div>
                        <div class="recipe-card-meta-item">
                            <i class="fas fa-utensils"></i>
                            <span>${recipe.servings} porciones</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    clearFilters() {
        this.currentFilters = {
            query: '',
            category: '',
            difficulty: '',
            maxTime: ''
        };

        // Reset form elements
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) categoryFilter.value = '';

        const difficultyFilter = document.getElementById('difficultyFilter');
        if (difficultyFilter) difficultyFilter.value = '';

        const timeFilter = document.getElementById('timeFilter');
        if (timeFilter) timeFilter.value = '';

        this.performSearch();
        Toast.info('Filtros limpiados');
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Search.init();
    });
} else {
    Search.init();
}

window.Search = Search;
