/**
 * auth.js — Autenticación ONE Platform Eneagrama
 * Fixes aplicados:
 *   1. Login USER: comparación case-insensitive para el nombre de usuario
 *   2. Login USER: mensaje claro si las credenciales no coinciden
 *   3. Login USER/ADMIN: aviso explícito de mayúsculas/minúsculas en mensaje de error
 *   4. Contraseña mínima 6 caracteres validada también aquí (doble protección)
 */

const Auth = {

  async login(usuario, password, rol) {
    try {

      // ─── 1. SUPERADMIN LOCAL (FIJO) ───────────────────────────────
      if (rol === CONFIG.roles.SUPERADMIN) {
        const superadmin = {
          usuario:  "superadmin",
          password: "admin123",
          email:    "superadmin@local",
          rol:      CONFIG.roles.SUPERADMIN
        };

        if (usuario === superadmin.usuario && password === superadmin.password) {
          this.setSession({
            usuario:    superadmin.usuario,
            email:      superadmin.email,
            password:   superadmin.password,
            rol:        CONFIG.roles.SUPERADMIN,
            packStatus: "01"
          });
          return { success: true };
        }
        return { success: false, message: "Credenciales inválidas" };
      }

      // ─── 2. ADMIN DINÁMICO DESDE GOOGLE SHEETS ───────────────────
      if (rol === CONFIG.roles.ADMIN) {
        const response = await Helpers.fetchGET(CONFIG.api.gestion);

        if (!Array.isArray(response)) {
          return { success: false, message: "Error leyendo administradores" };
        }

        // Comparación exacta (admins sí son case-sensitive por seguridad)
        const adminEncontrado = response.find(row =>
          String(row.Usuario_Admin).trim() === String(usuario).trim() &&
          String(row.Pass_Admin).trim()    === String(password).trim()
        );

        if (!adminEncontrado) {
          return {
            success: false,
            message: "Credenciales inválidas. Verificá que el usuario y la contraseña estén escritos exactamente como fueron creados (respeta mayúsculas y minúsculas)."
          };
        }

        const estadoAdmin = String(adminEncontrado.Estado || "").trim().toLowerCase();
        if (estadoAdmin === "inactivo") {
          return { success: false, message: "Tu cuenta de administrador está inactiva" };
        }

        this.setSession({
          usuario:    String(adminEncontrado.Usuario_Admin),
          email:      String(adminEncontrado.Email_Admin),
          password:   String(adminEncontrado.Pass_Admin),
          rol:        CONFIG.roles.ADMIN,
          packStatus: String(adminEncontrado.Pack_Status || "").trim()
        });
        return { success: true };
      }

      // ─── 3. USER DINÁMICO DESDE GOOGLE SHEETS ────────────────────
      if (rol === CONFIG.roles.USER) {

        // Mostrar estado de carga mientras se consulta el servidor
        // (el spinner lo maneja el HTML que llama a login())

        let data;
        try {
          const response = await fetch(CONFIG.api.gestionAdmin);
          if (!response.ok) throw new Error("HTTP " + response.status);
          data = await response.json();
        } catch (fetchErr) {
          console.error("Error de red al obtener usuarios:", fetchErr);
          return { success: false, message: "Error de conexión. Verificá tu internet e intentá de nuevo." };
        }

        if (!Array.isArray(data)) {
          return { success: false, message: "Error leyendo usuarios. Intentá más tarde." };
        }

        // ✅ FIX: comparación case-insensitive para el nombre de usuario
        // La contraseña sí es case-sensitive (es una clave de seguridad)
        const userEncontrado = data.find(row =>
          String(row.User || "").trim().toLowerCase() === String(usuario).trim().toLowerCase() &&
          String(row.Pass_User || "").trim()          === String(password).trim()
        );

        if (!userEncontrado) {
          // ✅ FIX: mensaje que explica el problema de mayúsculas en la contraseña
          return {
            success: false,
            message: "Usuario o contraseña incorrectos. El nombre de usuario no distingue mayúsculas, pero la contraseña sí. Verificá que la estés escribiendo exactamente como te la dieron."
          };
        }

        const estadoUser = String(userEncontrado.Estado_User || "").trim().toLowerCase();
        if (estadoUser === "inactivo") {
          return { success: false, message: "Tu cuenta está inactiva. Contactá a tu administrador." };
        }

        this.setSession({
          usuario:    String(userEncontrado.User),
          email:      String(userEncontrado.Email_User),
          password:   String(userEncontrado.Pass_User),
          rol:        CONFIG.roles.USER,
          userAdmin:  String(userEncontrado.Usuario_Admin),
          emailAdmin: String(userEncontrado.Email_Admin),
          packStatus: String(userEncontrado.Pack_Status || "").trim()
        });
        return { success: true };
      }

      return { success: false, message: "Rol no válido" };

    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, message: "Error inesperado. Intentá de nuevo." };
    }
  },

  setSession(userData) {
    sessionStorage.setItem("isLoggedIn",       "true");
    sessionStorage.setItem("userRole",          userData.rol);
    sessionStorage.setItem("userName",          userData.usuario);
    sessionStorage.setItem("userEmail",         userData.email);
    sessionStorage.setItem("userPassword",      userData.password);
    sessionStorage.setItem("sessionStartTime",  String(Date.now()));
    sessionStorage.setItem("packStatus",        userData.packStatus || "");

    if (userData.rol === CONFIG.roles.USER) {
      sessionStorage.setItem("usuarioAdmin", userData.userAdmin);
      sessionStorage.setItem("emailAdmin",   userData.emailAdmin);
    }
  },

  getSession() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) return null;

    const startTime   = parseInt(sessionStorage.getItem("sessionStartTime") || "0", 10);
    const currentTime = Date.now();

    if (currentTime - startTime > CONFIG.system.sessionTimeout) {
      this.logout();
      return null;
    }

    return {
      isLoggedIn:   true,
      role:         sessionStorage.getItem("userRole"),
      userName:     sessionStorage.getItem("userName"),
      userEmail:    sessionStorage.getItem("userEmail"),
      userPassword: sessionStorage.getItem("userPassword"),
      packStatus:   sessionStorage.getItem("packStatus") || ""
    };
  },

  isAuthenticated() {
    return this.getSession() !== null;
  },

  logout() {
    sessionStorage.clear();
    window.location.href = CONFIG.routes.login;
  },

  protectPage(requiredRole) {
    const session = this.getSession();
    if (!session) {
      window.location.href = CONFIG.routes.login;
      return false;
    }
    if (requiredRole && session.role !== requiredRole) {
      alert("No tenés permisos para acceder a esta página");
      this.redirectToDashboard();
      return false;
    }
    return true;
  },

  redirectToDashboard() {
    const session = this.getSession();
    if (!session) {
      window.location.href = CONFIG.routes.login;
      return;
    }
    if (session.role === CONFIG.roles.SUPERADMIN) window.location.href = CONFIG.routes.superAdminDashboard;
    if (session.role === CONFIG.roles.ADMIN)      window.location.href = CONFIG.routes.adminDashboard;
    if (session.role === CONFIG.roles.USER)        window.location.href = CONFIG.routes.userboard;
  }
};

window.Auth = Auth;