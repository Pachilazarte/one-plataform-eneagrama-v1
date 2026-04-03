/**
 * 🛠️ FUNCIONES AUXILIARES GLOBALES
 * Utilidades reutilizables en todo el sistema
 */

const Helpers = {
    /**
     * Formatea una fecha
     * @param {Date|string} fecha
     * @returns {string}
     */
    formatDate(fecha) {
        const date = new Date(fecha);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    },

    /**
     * Formatea fecha y hora
     * @param {Date|string} fecha
     * @returns {string}
     */
    formatDateTime(fecha) {
        const date = new Date(fecha);
        const dateStr = this.formatDate(date);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${dateStr} ${hours}:${minutes}`;
    },

    /**
     * Muestra un mensaje de alerta
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo: success, error, warning, info
     * @param {string} containerId - ID del contenedor donde mostrar la alerta
     */
    showAlert(message, type = 'info', containerId = 'alertContainer') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Contenedor ${containerId} no encontrado`);
            return;
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        container.innerHTML = '';
        container.appendChild(alertDiv);

        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            alertDiv.style.transition = 'opacity 0.5s';
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 500);
        }, 5000);
    },

    /**
     * Muestra/oculta spinner de carga
     * @param {boolean} show - true para mostrar, false para ocultar
     * @param {string} containerId - ID del contenedor
     */
    showLoading(show, containerId = 'loadingContainer') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (show) {
            container.innerHTML = '<div class="spinner"></div>';
            container.classList.remove('hidden');
        } else {
            container.innerHTML = '';
            container.classList.add('hidden');
        }
    },

    /**
     * Valida un email
     * @param {string} email
     * @returns {boolean}
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Valida que un campo no esté vacío
     * @param {string} value
     * @returns {boolean}
     */
    validateRequired(value) {
        return value && value.trim() !== '';
    },

    /**
     * Genera un ID único
     * @returns {string}
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Realiza una llamada POST a Google Apps Script
     * @param {string} url - URL del WebApp
     * @param {Object} data - Datos a enviar
     * @returns {Promise}
     */
    async fetchAPI(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en fetchAPI:', error);
            throw error;
        }
    },

    /**
     * Realiza una llamada GET a Google Apps Script
     * @param {string} url - URL del WebApp
     * @param {Object} params - Parámetros query
     * @returns {Promise}
     */
    async fetchGET(url, params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const fullUrl = queryString ? `${url}?${queryString}` : url;
            
            const response = await fetch(fullUrl, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en fetchGET:', error);
            throw error;
        }
    },

    /**
     * Descarga un archivo
     * @param {string} url - URL del archivo
     * @param {string} filename - Nombre del archivo
     */
    downloadFile(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Copia texto al portapapeles
     * @param {string} text
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showAlert('Copiado al portapapeles', 'success');
        } catch (error) {
            console.error('Error al copiar:', error);
            // Fallback para navegadores antiguos
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showAlert('Copiado al portapapeles', 'success');
        }
    },

    /**
     * Confirma una acción
     * @param {string} message - Mensaje de confirmación
     * @returns {boolean}
     */
    confirm(message) {
        return window.confirm(message);
    },

    /**
     * Sanitiza HTML para prevenir XSS
     * @param {string} str
     * @returns {string}
     */
    sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Debounce function para optimizar eventos
     * @param {Function} func
     * @param {number} wait
     * @returns {Function}
     */
    debounce(func, wait = 300) {
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
};

// Hacer Helpers disponible globalmente
window.Helpers = Helpers;
