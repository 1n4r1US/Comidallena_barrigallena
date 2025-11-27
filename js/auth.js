// ============================================
// AUTH.JS - Authentication Logic
// ============================================

const Auth = {
    // Current user session
    currentUser: null,

    // Initialize
    init() {
        this.currentUser = Storage.get('currentUser', null);
        this.setupEventListeners();
    },

    // Setup event listeners
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e.target);
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(e.target);
            });
        }

        // Password toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.password-toggle-btn')) {
                this.togglePassword(e.target.closest('.password-toggle-btn'));
            }
        });

        // Password strength
        const passwordInput = document.getElementById('password');
        if (passwordInput && document.querySelector('.password-strength')) {
            passwordInput.addEventListener('input', (e) => {
                this.updatePasswordStrength(e.target.value);
            });
        }

        // Logout
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-logout]')) {
                e.preventDefault();
                this.logout();
            }
        });
    },

    // Handle login
    async handleLogin(form) {
        const email = form.email.value.trim();
        const password = form.password.value;
        const remember = form.remember?.checked || false;

        // Validate
        let isValid = true;

        if (!Validator.email(email)) {
            FormHelpers.showError(form.email, 'Email inválido');
            isValid = false;
        } else {
            FormHelpers.showSuccess(form.email);
        }

        if (!Validator.required(password)) {
            FormHelpers.showError(form.password, 'La contraseña es requerida');
            isValid = false;
        } else {
            FormHelpers.showSuccess(form.password);
        }

        if (!isValid) return;

        Loading.show('Iniciando sesión...');

        // Simulate API call
        setTimeout(() => {
            const users = Storage.get('users', []);
            const user = users.find(u => u.email === email);

            if (!user || user.password !== password) {
                Loading.hide();
                Toast.error('Email o contraseña incorrectos');
                FormHelpers.showError(form.password, 'Credenciales inválidas');
                return;
            }

            // Login successful
            this.currentUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar
            };

            Storage.set('currentUser', this.currentUser);

            Loading.hide();
            Toast.success('¡Bienvenido de vuelta!');

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'pages/dashboard.html';
            }, 1000);
        }, 1500);
    },

    // Handle register
    async handleRegister(form) {
        const fullName = form.fullName.value.trim();
        const username = form.username.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const terms = form.terms?.checked || false;

        // Validate
        let isValid = true;

        if (!Validator.required(fullName) || !Validator.minLength(fullName, 3)) {
            FormHelpers.showError(form.fullName, 'El nombre debe tener al menos 3 caracteres');
            isValid = false;
        } else {
            FormHelpers.showSuccess(form.fullName);
        }

        if (!Validator.required(username) || !Validator.minLength(username, 3)) {
            FormHelpers.showError(form.username, 'El usuario debe tener al menos 3 caracteres');
            isValid = false;
        } else {
            FormHelpers.showSuccess(form.username);
        }

        if (!Validator.email(email)) {
            FormHelpers.showError(form.email, 'Email inválido');
            isValid = false;
        } else {
            FormHelpers.showSuccess(form.email);
        }

        if (!Validator.password(password, 6)) {
            FormHelpers.showError(form.password, 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        } else {
            FormHelpers.showSuccess(form.password);
        }

        if (password !== confirmPassword) {
            FormHelpers.showError(form.confirmPassword, 'Las contraseñas no coinciden');
            isValid = false;
        } else {
            FormHelpers.showSuccess(form.confirmPassword);
        }

        if (!terms) {
            Toast.error('Debes aceptar los términos y condiciones');
            isValid = false;
        }

        if (!isValid) return;

        Loading.show('Creando cuenta...');

        // Simulate API call
        setTimeout(() => {
            const users = Storage.get('users', []);

            // Check if email exists
            if (users.find(u => u.email === email)) {
                Loading.hide();
                Toast.error('Este email ya está registrado');
                FormHelpers.showError(form.email, 'Email ya existe');
                return;
            }

            // Check if username exists
            if (users.find(u => u.username === username)) {
                Loading.hide();
                Toast.error('Este nombre de usuario ya está en uso');
                FormHelpers.showError(form.username, 'Usuario ya existe');
                return;
            }

            // Create user
            const newUser = {
                id: generateId(),
                fullName,
                username,
                email,
                password, // In real app, this would be hashed
                avatar: 'img/logo.png',
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            Storage.set('users', users);

            // Auto login
            this.currentUser = {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                fullName: newUser.fullName,
                avatar: newUser.avatar
            };

            Storage.set('currentUser', this.currentUser);

            Loading.hide();
            Toast.success('¡Cuenta creada exitosamente!');

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'pages/dashboard.html';
            }, 1000);
        }, 1500);
    },

    // Logout
    logout() {
        Modal.confirm(
            'Cerrar Sesión',
            '¿Estás seguro que deseas cerrar sesión?',
            () => {
                this.currentUser = null;
                Storage.remove('currentUser');
                Toast.success('Sesión cerrada');

                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1000);
            }
        );
    },

    // Toggle password visibility
    togglePassword(button) {
        const input = button.closest('.password-toggle').querySelector('input');
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    },

    // Update password strength indicator
    updatePasswordStrength(password) {
        const strength = Validator.passwordStrength(password);
        const bar = document.querySelector('.password-strength-bar');
        const text = document.querySelector('.password-strength-text');

        if (!bar || !text) return;

        bar.className = `password-strength-bar ${strength}`;

        const messages = {
            weak: 'Débil',
            medium: 'Media',
            strong: 'Fuerte'
        };

        text.textContent = password ? `Seguridad: ${messages[strength]}` : '';
    },

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    },

    // Require authentication
    requireAuth() {
        if (!this.isLoggedIn()) {
            Toast.warning('Debes iniciar sesión primero');
            setTimeout(() => {
                window.location.href = '../pages/login.html';
            }, 1500);
            return false;
        }
        return true;
    },

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Auth.init();
    });
} else {
    Auth.init();
}

// Export
window.Auth = Auth;
