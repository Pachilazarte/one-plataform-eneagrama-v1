/**
 * 🏠 LÓGICA DE PÁGINA DE INICIO
 * Maneja la navegación hacia los diferentes roles
 */

// Función para redirigir al login con el rol seleccionado
function goToLogin(role) {
    // Guardar el rol seleccionado temporalmente
    sessionStorage.setItem('selectedRole', role);
    
    // Redirigir al login principal
    window.location.href = '../index.html';
}

// Al cargar la página, verificar si ya hay sesión activa
document.addEventListener('DOMContentLoaded', function() {
    // Si ya hay una sesión activa, redirigir al dashboard correspondiente
    if (Auth.isAuthenticated()) {
        Auth.redirectToDashboard();
    }
});
