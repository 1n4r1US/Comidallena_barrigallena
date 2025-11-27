// ============================================
// UTILS.JS - Utility Functions & Helpers
// ============================================

// ========== TOAST NOTIFICATIONS ==========
const Toast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 3000) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type]} toast-icon"></i>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.container.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    },

    success(message, duration) {
        return this.show(message, 'success', duration);
    },

    error(message, duration) {
        return this.show(message, 'error', duration);
    },

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    },

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
};

// ========== MODAL DIALOGS ==========
const Modal = {
    show(options) {
        const {
            title = 'Modal',
            content = '',
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            onConfirm = () => { },
            onCancel = () => { },
            showCancel = true
        } = options;

        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                ${showCancel ? `<button class="btn btn-outline modal-cancel">${cancelText}</button>` : ''}
                <button class="btn btn-primary modal-confirm">${confirmText}</button>
            </div>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(modal);

        // Show with animation
        setTimeout(() => {
            backdrop.classList.add('show');
            modal.classList.add('show');
        }, 10);

        // Close function
        const close = () => {
            backdrop.classList.remove('show');
            modal.classList.remove('show');
            setTimeout(() => {
                backdrop.remove();
                modal.remove();
            }, 300);
        };

        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            close();
            onCancel();
        });

        backdrop.addEventListener('click', () => {
            close();
            onCancel();
        });

        if (showCancel) {
            modal.querySelector('.modal-cancel').addEventListener('click', () => {
                close();
                onCancel();
            });
        }

        modal.querySelector('.modal-confirm').addEventListener('click', () => {
            close();
            onConfirm();
        });

        // ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                close();
                onCancel();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        return { close };
    },

    confirm(title, message, onConfirm) {
        return this.show({
            title,
            content: `<p>${message}</p>`,
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            onConfirm,
            showCancel: true
        });
    },

    alert(title, message) {
        return this.show({
            title,
            content: `<p>${message}</p>`,
            confirmText: 'Aceptar',
            showCancel: false
        });
    }
};

// ========== LOADING OVERLAY ==========
const Loading = {
    overlay: null,

    init() {
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'loading-overlay';
            this.overlay.innerHTML = `
                <div>
                    <div class="spinner"></div>
                    <p style="margin-top: var(--space-lg); color: var(--text-primary);">Cargando...</p>
                </div>
            `;
            document.body.appendChild(this.overlay);
        }
    },

    show(message = 'Cargando...') {
        this.init();
        if (message) {
            this.overlay.querySelector('p').textContent = message;
        }
        this.overlay.classList.add('show');
    },

    hide() {
        if (this.overlay) {
            this.overlay.classList.remove('show');
        }
    }
};

// ========== LOCAL STORAGE HELPERS ==========
const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    }
};

// ========== FORM VALIDATION ==========
const Validator = {
    email(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    password(password, minLength = 6) {
        return password.length >= minLength;
    },

    passwordStrength(password) {
        let strength = 0;

        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) return 'weak';
        if (strength <= 4) return 'medium';
        return 'strong';
    },

    required(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },

    minLength(value, min) {
        return value.toString().length >= min;
    },

    maxLength(value, max) {
        return value.toString().length <= max;
    },

    number(value) {
        return !isNaN(value) && isFinite(value);
    },

    url(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};

// ========== FORM HELPERS ==========
const FormHelpers = {
    showError(input, message) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        // Remove existing error
        this.clearError(input);

        // Add error class
        input.classList.add('error');
        input.classList.remove('success');

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    },

    showSuccess(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        // Remove error
        this.clearError(input);

        // Add success class
        input.classList.add('success');
        input.classList.remove('error');
    },

    clearError(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        input.classList.remove('error', 'success');

        const errorDiv = formGroup.querySelector('.form-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    },

    getFormData(form) {
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    },

    resetForm(form) {
        form.reset();

        // Clear all errors
        form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
            this.clearError(input);
        });
    }
};

// ========== IMAGE HELPERS ==========
const ImageHelpers = {
    previewImage(input, previewElement) {
        const file = input.files[0];

        if (file) {
            if (!file.type.startsWith('image/')) {
                Toast.error('Por favor selecciona una imagen válida');
                return false;
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                Toast.error('La imagen no debe superar 5MB');
                return false;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                if (previewElement.tagName === 'IMG') {
                    previewElement.src = e.target.result;
                } else {
                    previewElement.style.backgroundImage = `url(${e.target.result})`;
                }
            };
            reader.readAsDataURL(file);

            return true;
        }

        return false;
    },

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
};

// ========== DATE HELPERS ==========
const DateHelpers = {
    formatDate(date, format = 'DD/MM/YYYY') {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    },

    timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        const intervals = {
            año: 31536000,
            mes: 2592000,
            semana: 604800,
            día: 86400,
            hora: 3600,
            minuto: 60,
            segundo: 1
        };

        for (let [name, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval >= 1) {
                return `Hace ${interval} ${name}${interval > 1 ? 's' : ''}`;
            }
        }

        return 'Justo ahora';
    }
};

// ========== DARK MODE ==========
const DarkMode = {
    init() {
        const isDark = Storage.get('darkMode', false);
        if (isDark) {
            document.body.classList.add('dark-mode');
        }

        // Listen for toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dark-mode-toggle')) {
                this.toggle();
            }
        });
    },

    toggle() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        Storage.set('darkMode', isDark);

        // Update icon if exists
        const icon = document.querySelector('.dark-mode-toggle i');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    },

    enable() {
        document.body.classList.add('dark-mode');
        Storage.set('darkMode', true);
    },

    disable() {
        document.body.classList.remove('dark-mode');
        Storage.set('darkMode', false);
    }
};

// ========== DEBOUNCE ==========
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== THROTTLE ==========
function throttle(func, limit = 300) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========== GENERATE ID ==========
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ========== SLUGIFY ==========
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

// ========== TRUNCATE TEXT ==========
function truncate(text, length = 100, suffix = '...') {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + suffix;
}

// ========== ESCAPE HTML ==========
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== INIT ON DOM READY ==========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        DarkMode.init();
    });
} else {
    DarkMode.init();
}

// Export for use in other files
window.Toast = Toast;
window.Modal = Modal;
window.Loading = Loading;
window.Storage = Storage;
window.Validator = Validator;
window.FormHelpers = FormHelpers;
window.ImageHelpers = ImageHelpers;
window.DateHelpers = DateHelpers;
window.DarkMode = DarkMode;
window.debounce = debounce;
window.throttle = throttle;
window.generateId = generateId;
window.slugify = slugify;
window.truncate = truncate;
window.escapeHtml = escapeHtml;
