/**
 * 📊 DASHBOARD DE ADMINISTRADOR — ONE Platform Eneagrama
 * ─────────────────────────────────────────────────────
 * Mejoras v3:
 *   1. Caché en localStorage: carga instantánea desde la 2da visita
 *   2. Refresco en segundo plano: actualiza sin bloquear la UI
 *   3. Overlay visual de carga con spinner y mensajes de estado
 *   4. Botón "Actualizar" fuerza recarga limpia y borra caché
 *   5. Validación de contraseña con mensaje claro
 */

Auth.protectPage(CONFIG.roles.ADMIN);

let usersData         = [];
let filteredData      = [];
let completedUsersMap = {};

// ─── Clave de caché por admin (cada admin tiene su propio caché) ───────────
function getCacheKey() {
    const session = Auth.getSession();
    return 'one_admin_users_' + (session ? session.userName : 'unknown');
}
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos: si el caché tiene más de esto, se refresca igual

// ─── Overlay de carga ─────────────────────────────────────────────────────
const OVERLAY_ID = 'oneLoadingOverlay';

function showOverlay(mensaje) {
    let el = document.getElementById(OVERLAY_ID);
    if (!el) {
        el = document.createElement('div');
        el.id = OVERLAY_ID;
        el.innerHTML = `
            <div class="overlay-inner">
                <div class="overlay-logo-wrap">
                    <div class="overlay-glow"></div>
                    <div class="overlay-arc-outer"></div>
                    <div class="overlay-arc-inner"></div>
                    <div class="overlay-arc-base"></div>
                    <img src="../img/one-iconocolor.png" alt="ONE" class="overlay-logo"
                         onerror="this.src='../img/one-icononegro.png'">
                </div>
                <div class="overlay-text">
                    <p class="overlay-msg" id="overlayMsg">Cargando...</p>
                    <p class="overlay-sub" id="overlaySub"></p>
                </div>
            </div>`;
        document.body.appendChild(el);

        if (!document.getElementById('oneOverlayStyles')) {
            const style = document.createElement('style');
            style.id = 'oneOverlayStyles';
            style.textContent = `
                #oneLoadingOverlay {
                    position: fixed; inset: 0; z-index: 9999;
                    background: rgba(0, 0, 0, 0.78);
                    backdrop-filter: blur(14px) saturate(1.3);
                    -webkit-backdrop-filter: blur(14px) saturate(1.3);
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0; transition: opacity .25s ease;
                    pointer-events: none;
                }
                #oneLoadingOverlay.visible {
                    opacity: 1; pointer-events: auto;
                }

                .overlay-inner {
                    display: flex; flex-direction: column;
                    align-items: center; gap: 14px;
                }

                /* ── Logo wrap: el efecto va SOBRE el logo ── */
                .overlay-logo-wrap {
                    position: relative;
                    width: 90px; height: 90px;
                }

                /* Glow pulsante de fondo */
                .overlay-glow {
                    position: absolute; inset: -10px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(225,123,215,0.2) 0%, transparent 70%);
                    animation: ovGlow 2s ease-in-out infinite;
                    pointer-events: none;
                }

                /* Arco principal — gira pegado al borde del logo */
                .overlay-arc-outer {
                    position: absolute; inset: -4px;
                    border-radius: 50%;
                    border: 2.5px solid transparent;
                    border-top-color: #e17bd7;
                    border-right-color: rgba(225, 123, 215, 0.5);
                    animation: ovSpin .8s linear infinite;
                }

                /* Arco secundario contra-rotante */
                .overlay-arc-inner {
                    position: absolute; inset: -4px;
                    border-radius: 50%;
                    border: 2.5px solid transparent;
                    border-bottom-color: rgba(200, 100, 240, 0.3);
                    animation: ovSpin 1.8s linear infinite reverse;
                }

                /* Anillo base tenue */
                .overlay-arc-base {
                    position: absolute; inset: -4px;
                    border-radius: 50%;
                    border: 2.5px solid rgba(225, 123, 215, 0.08);
                }

                /* Logo: llena el contenedor, circular */
                .overlay-logo {
                    width: 90px; height: 90px;
                    border-radius: 50%;
                    object-fit: cover;
                    position: relative; z-index: 2;
                    display: block;
                    filter: drop-shadow(0 0 8px rgba(225, 123, 215, 0.25));
                }

                /* ── Texto compacto ── */
                .overlay-text { text-align: center; line-height: 1.4; }

                .overlay-msg {
                    margin: 0; font-size: .93rem; font-weight: 600;
                    color: rgba(255, 255, 255, .9);
                    font-family: 'Exo 2', system-ui, sans-serif;
                    letter-spacing: .02em;
                }
                .overlay-sub {
                    margin: 3px 0 0; font-size: .75rem;
                    color: rgba(225, 123, 215, .72);
                    font-family: 'Exo 2', system-ui, sans-serif;
                    letter-spacing: .03em;
                    min-height: 16px;
                }

                @keyframes ovSpin  { to { transform: rotate(360deg); } }
                @keyframes ovGlow  {
                    0%, 100% { opacity: .6; transform: scale(1); }
                    50%      { opacity: 1;  transform: scale(1.1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    document.getElementById('overlayMsg').textContent = mensaje || 'Cargando...';
    document.getElementById('overlaySub').textContent = '';

    el.getBoundingClientRect(); // forzar reflow
    requestAnimationFrame(() => el.classList.add('visible'));
}

function updateOverlay(sub) {
    const el = document.getElementById('overlaySub');
    if (el) el.textContent = sub || '';
}

function hideOverlay() {
    const el = document.getElementById(OVERLAY_ID);
    if (!el) return;
    el.classList.remove('visible');
    setTimeout(() => el?.parentNode?.removeChild(el), 300);
}
// ─── Caché helpers ─────────────────────────────────────────────────────────
function saveCache(data) {
    try {
        localStorage.setItem(getCacheKey(), JSON.stringify({
            ts:   Date.now(),
            data: data
        }));
    } catch (e) {
        // localStorage lleno o bloqueado — ignorar silenciosamente
    }
}

function loadCache() {
    try {
        const raw = localStorage.getItem(getCacheKey());
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.data)) return null;
        return parsed; // { ts, data }
    } catch (e) {
        return null;
    }
}

function clearCache() {
    try { localStorage.removeItem(getCacheKey()); } catch (e) {}
}

function isCacheFresh(cached) {
    return cached && (Date.now() - cached.ts) < CACHE_TTL;
}

// ─── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    loadUserInfo();
    initWithCache();
    setupEventListeners();
});

/* =========================================================
   CARGA CON CACHÉ
   =========================================================
   Estrategia:
   - Si hay caché fresco → mostrar inmediatamente, refrescar en bg silencioso
   - Si hay caché viejo  → mostrar inmediatamente, refrescar con overlay liviano
   - Si no hay caché     → overlay completo, cargar todo
   ========================================================= */
async function initWithCache() {
    const cached = loadCache();

    if (cached && Array.isArray(cached.data) && cached.data.length > 0) {
        // ✅ Mostrar datos cacheados al instante
        usersData    = cached.data;
        filteredData = usersData.slice();
        renderUsersTable();
        updateStats();

        if (isCacheFresh(cached)) {
            // Caché fresco → refrescar en bg sin overlay
            refreshInBackground();
        } else {
            // Caché viejo → refrescar con overlay liviano
            showOverlay('Actualizando datos...');
            await loadUsers(true);
        }
    } else {
        // Sin caché → carga completa con overlay
        showOverlay('Cargando panel...');
        await loadUsers(false);
    }
}

/* =========================================================
   REFRESCO EN SEGUNDO PLANO (silencioso, sin overlay)
   ========================================================= */
async function refreshInBackground() {
    try {
        const session  = Auth.getSession();
        const response = await Helpers.fetchGET(CONFIG.api.gestionAdmin);
        if (!Array.isArray(response)) return;

        const newData = response
            .filter(row =>
                String(row.Usuario_Admin || '').trim() === String(session.userName).trim()
                && row.User && String(row.User).trim() !== '')
            .map(row => ({
                usuario:        String(row.User || ''),
                password:       String(row.Pass_User || ''),
                email:          String(row.Email_User || ''),
                nombre:         String(row.Nombre_User || ''),
                estado:         String(row.Estado_User || 'activo').toLowerCase(),
                packStatus:     String(row.Pack_Status || '').trim(),
                testCompletado: false
            }));

        // Verificar tests en paralelo (silencioso)
        await checkTestCompletionForUsers(newData);

        // ¿Cambió algo respecto al caché? → actualizar UI
        const prevJSON = JSON.stringify(usersData.map(u => ({ u: u.usuario, tc: u.testCompletado, e: u.estado })));
        const nextJSON = JSON.stringify(newData.map(u => ({ u: u.usuario, tc: u.testCompletado, e: u.estado })));

        if (prevJSON !== nextJSON) {
            usersData    = newData;
            filteredData = usersData.slice();
            renderUsersTable();
            updateStats();
            showToast('Panel actualizado', 'success');
        }

        saveCache(newData);

    } catch (e) {
        console.warn('Refresco en background falló:', e);
    }
}

/* =========================================================
   CARGAR USUARIOS (con overlay activo)
   ========================================================= */
async function loadUsers(silentOverlay = false) {
    if (!silentOverlay) showOverlay('Cargando panel...');
    const session = Auth.getSession();

    try {
        updateOverlay('Obteniendo usuarios...');
        const response = await Helpers.fetchGET(CONFIG.api.gestionAdmin);

        if (!Array.isArray(response)) {
            Helpers.showAlert('Error al cargar usuarios', 'error');
            return;
        }

        usersData = response
            .filter(row =>
                String(row.Usuario_Admin || '').trim() === String(session.userName).trim()
                && row.User && String(row.User).trim() !== '')
            .map(row => ({
                usuario:        String(row.User || ''),
                password:       String(row.Pass_User || ''),
                email:          String(row.Email_User || ''),
                nombre:         String(row.Nombre_User || ''),
                estado:         String(row.Estado_User || 'activo').toLowerCase(),
                packStatus:     String(row.Pack_Status || '').trim(),
                testCompletado: false
            }));

        updateOverlay('Verificando tests (' + usersData.length + ' usuarios)...');
        await checkTestCompletionForUsers(usersData);

        filteredData = usersData.slice();
        renderUsersTable();
        updateStats();
        saveCache(usersData);

    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        Helpers.showAlert('Error de conexión al cargar usuarios', 'error');
    } finally {
        hideOverlay();
    }
}

/* =========================================================
   VERIFICAR TESTS — acepta cualquier array de usuarios
   ========================================================= */
async function checkTestCompletionForUsers(users) {
    completedUsersMap = {};
    const promises = users.map(user => checkSingleUserTest(user.usuario));
    try {
        await Promise.all(promises);
    } catch (err) {
        console.warn('Error parcial verificando tests:', err);
    }
    users.forEach(user => {
        user.testCompletado = !!completedUsersMap[user.usuario.trim().toLowerCase()];
    });
}

// Alias para compatibilidad interna
async function checkTestCompletionForAllUsers() {
    return checkTestCompletionForUsers(usersData);
}

async function checkSingleUserTest(userName) {
    try {
        const response = await fetch(CONFIG.api.informes + '?user=' + encodeURIComponent(userName));
        if (!response.ok) return;
        const result = await response.json();
        if (result.success && result.data && result.data.Respuestas && String(result.data.Respuestas).trim() !== '') {
            completedUsersMap[userName.trim().toLowerCase()] = true;
        }
    } catch (err) {
        console.warn('Error verificando test para ' + userName + ':', err);
    }
}

/* =========================================================
   INFO DEL ADMIN LOGUEADO
   ========================================================= */
function loadUserInfo() {
    const session = Auth.getSession();
    if (session) {
        document.getElementById('userInfo').textContent = session.userName + ' (' + session.userEmail + ')';
        const packContainer = document.getElementById('packLiderContainer');
        if (packContainer) {
            if (session.packStatus === "01" || session.packStatus === "1") {
                packContainer.classList.remove('hidden');
            } else {
                packContainer.classList.add('hidden');
            }
        }
    }
}

/* =========================================================
   EVENT LISTENERS
   ========================================================= */
function setupEventListeners() {
    const form = document.getElementById('newUserForm');
    if (form) form.addEventListener('submit', handleCreateUser);

    const editForm = document.getElementById('editUserForm');
    if (editForm) editForm.addEventListener('submit', handleEditUser);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeEditModal(); closeConfirmModal(); }
    });

    const btn  = document.getElementById('btnCrearUsuario');
    const txtN = document.getElementById('btnCrearTexto');
    const txtL = document.getElementById('btnCrearLoading');
    const lc   = document.getElementById('loadingContainer');

    function setCrearLoading(on) {
        if (btn)  btn.disabled = on;
        if (txtN) txtN.classList.toggle('hidden', on);
        if (txtL) txtL.classList.toggle('hidden', !on);
    }

    if (form) {
        form.addEventListener('submit', () => setCrearLoading(true));
        form.addEventListener('submit', () => setTimeout(() => setCrearLoading(false), 15000));
    }
    if (lc) {
        new MutationObserver(() => {
            if (lc.classList.contains('hidden')) setCrearLoading(false);
        }).observe(lc, { attributes: true, attributeFilter: ['class'] });
    }
}

/* =========================================================
   BÚSQUEDA / FILTRO
   ========================================================= */
function filterUsers() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    filteredData = !query ? usersData.slice() : usersData.filter(u =>
        u.usuario.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)   ||
        u.nombre.toLowerCase().includes(query)
    );
    renderUsersTable();
}

/* =========================================================
   ACTUALIZAR MANUAL (borra caché y recarga todo)
   ========================================================= */
// La función loadUsers() ya existe y es llamada por el botón "Actualizar"
// del HTML con onclick="loadUsers()". Solo le agregamos limpieza de caché:
const _originalLoadUsers = loadUsers;
window.loadUsers = async function (silentOverlay = false) {
    clearCache();
    return _originalLoadUsers(silentOverlay);
};

/* =========================================================
   CREAR USUARIO
   ========================================================= */
async function handleCreateUser(e) {
    e.preventDefault();

    const usuario  = document.getElementById('userUsuario').value.trim();
    const password = document.getElementById('userPassword').value;
    const email    = document.getElementById('userEmail').value.trim();
    const nombre   = document.getElementById('userNombre').value.trim();
    const session  = Auth.getSession();
    const chkPack  = document.getElementById('chkPackLider');
    const packValue = (chkPack && chkPack.checked) ? '01' : '';

    if (!usuario || !password || !email || !nombre) {
        Helpers.showAlert('Todos los campos son obligatorios', 'error'); return;
    }
    if (!Helpers.validateEmail(email)) {
        Helpers.showAlert('El email ingresado no es válido', 'error'); return;
    }
    if (password.length < 6) {
        Helpers.showAlert('La contraseña debe tener al menos 6 caracteres', 'error'); return;
    }
    if (!session || !session.userName || !session.userEmail) {
        Helpers.showAlert('Error de sesión. Volvé a iniciar sesión.', 'error'); return;
    }

    const existe = usersData.some(u => u.usuario.toLowerCase() === usuario.toLowerCase());
    if (existe) { showToast('El usuario "' + usuario + '" ya existe', 'error'); return; }

    showConfirmModal({
        title:    'Crear Usuario',
        message:  '¿Estás seguro de crear al usuario <strong>' + sanitize(usuario) + '</strong>?',
        icon:     'create',
        btnClass: 'bg-gradient-to-r from-one-cyan/30 to-one-pink/30 border border-one-cyan/50',
        onConfirm: () => doCreateUser(usuario, password, email, nombre, session, e.target, packValue)
    });
}

async function doCreateUser(usuario, password, email, nombre, session, form, packValue) {
    Helpers.showLoading(true);
    try {
        const payload  = { fila: [session.userName, session.userEmail, usuario, password, email, nombre, 'activo', packValue] };
        const formData = new URLSearchParams();
        formData.append('data', JSON.stringify(payload));
        const response = await fetch(CONFIG.api.gestionAdmin, { method: 'POST', body: formData });
        const result   = await response.json();

        if (result && result.status === 'success') {
            showToast('Usuario "' + usuario + '" creado exitosamente', 'success');
            form.reset();
            const chkPack = document.getElementById('chkPackLider');
            if (chkPack) chkPack.checked = false;
            showCredentialsModal(usuario, password, email);
            clearCache(); // Invalidar caché al crear usuario
            setTimeout(() => loadUsers(true), 1500);
        } else {
            const msg = (result && result.message) ? result.message : 'Respuesta inválida del servidor';
            Helpers.showAlert('Error al crear usuario: ' + msg, 'error');
        }
    } catch (error) {
        console.error('Error al crear usuario:', error);
        Helpers.showAlert('Error de conexión al crear usuario', 'error');
    } finally {
        Helpers.showLoading(false);
        const btn  = document.getElementById('btnCrearUsuario');
        const txtN = document.getElementById('btnCrearTexto');
        const txtL = document.getElementById('btnCrearLoading');
        if (btn)  btn.disabled = false;
        if (txtN) txtN.classList.remove('hidden');
        if (txtL) txtL.classList.add('hidden');
    }
}

/* =========================================================
   EDITAR USUARIO
   ========================================================= */
function openEditModal(usuario) {
    const user = usersData.find(u => u.usuario === usuario);
    if (!user) return;
    document.getElementById('editOriginalUsuario').value = usuario;
    document.getElementById('editUsuario').value         = user.usuario;
    document.getElementById('editEmail').value           = user.email;
    document.getElementById('editNombre').value          = user.nombre;
    document.getElementById('editPassword').value        = '';
    const modal = document.getElementById('editModal');
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    void modal.offsetHeight;
    modal.classList.add('modal-visible');
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    setTimeout(() => { modal.classList.add('hidden'); modal.style.display = ''; }, 300);
}

function handleEditUser(e) {
    e.preventDefault();
    const originalUsuario = document.getElementById('editOriginalUsuario').value;
    const nuevoEmail      = document.getElementById('editEmail').value.trim();
    const nuevoNombre     = document.getElementById('editNombre').value.trim();
    const nuevaPass       = document.getElementById('editPassword').value;
    if (!nuevoEmail) { showToast('El Email es obligatorio', 'error'); return; }

    showConfirmModal({
        title:    'Guardar Cambios',
        message:  '¿Confirmás los cambios para <strong>' + sanitize(originalUsuario) + '</strong>?',
        icon:     'edit',
        btnClass: 'bg-gradient-to-r from-one-cyan/30 to-one-pink/30 border border-one-cyan/50',
        onConfirm: () => { closeEditModal(); doEditUser(originalUsuario, nuevoEmail, nuevoNombre, nuevaPass); }
    });
}

async function doEditUser(usuario, nuevoEmail, nuevoNombre, nuevaPass) {
    Helpers.showLoading(true);
    try {
        const payload = { accion: 'editarUser', usuario, adminId: Auth.getSession().userName, nuevoEmail, nuevoNombre, nombreHoja: 'Users' };
        if (nuevaPass) payload.nuevaPass = nuevaPass;
        const formData = new URLSearchParams();
        formData.append('data', JSON.stringify(payload));
        const response = await fetch(CONFIG.api.gestionAdmin, { method: 'POST', body: formData });
        const result   = await response.json();
        if (result && result.status === 'success') {
            showToast('Usuario "' + usuario + '" actualizado correctamente', 'success');
            clearCache();
            loadUsers(true);
        } else {
            Helpers.showAlert('Error: ' + (result.message || 'Error desconocido'), 'error');
        }
    } catch (error) {
        Helpers.showAlert('Error de conexión', 'error');
    } finally {
        Helpers.showLoading(false);
    }
}

/* =========================================================
   INACTIVAR / ACTIVAR USUARIO
   ========================================================= */
function toggleUserStatus(usuario, estadoActual) {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    const accionTexto = nuevoEstado === 'inactivo' ? 'inactivar' : 'activar';
    showConfirmModal({
        title:    (nuevoEstado === 'inactivo' ? 'Inactivar' : 'Activar') + ' Usuario',
        message:  '¿Deseás <strong>' + accionTexto + '</strong> al usuario <strong>' + sanitize(usuario) + '</strong>?',
        icon:     nuevoEstado === 'inactivo' ? 'deactivate' : 'activate',
        btnClass: nuevoEstado === 'inactivo'
            ? 'bg-red-500/30 border border-red-500/50 text-red-300'
            : 'bg-green-500/30 border border-green-500/50 text-green-300',
        onConfirm: () => doToggleUserStatus(usuario, nuevoEstado)
    });
}

async function doToggleUserStatus(usuario, nuevoEstado) {
    Helpers.showLoading(true);
    try {
        const payload = { accion: 'toggleUserStatus', usuario, adminId: Auth.getSession().userName, nuevoEstado, nombreHoja: 'Users' };
        const formData = new URLSearchParams();
        formData.append('data', JSON.stringify(payload));
        const response = await fetch(CONFIG.api.gestionAdmin, { method: 'POST', body: formData });
        const result   = await response.json();
        if (result && result.status === 'success') {
            showToast('Estado de "' + usuario + '" cambiado a ' + nuevoEstado, 'success');
            clearCache();
            loadUsers(true);
        } else {
            Helpers.showAlert('Error: ' + (result.message || 'Error desconocido'), 'error');
        }
    } catch (error) {
        Helpers.showAlert('Error de conexión', 'error');
    } finally {
        Helpers.showLoading(false);
    }
}

/* =========================================================
   RESET PASSWORD
   ========================================================= */
function resetUserPassword(usuario) {
    const nuevaPass = prompt('Ingresá la nueva contraseña para ' + usuario + ':');
    if (!nuevaPass) return;
    if (nuevaPass.length < 6) { showToast('La contraseña debe tener al menos 6 caracteres', 'error'); return; }
    showConfirmModal({
        title:    'Resetear Contraseña',
        message:  '¿Confirmás el cambio de contraseña para <strong>' + sanitize(usuario) + '</strong>?',
        icon:     'edit',
        btnClass: 'bg-yellow-500/30 border border-yellow-500/50 text-yellow-300',
        onConfirm: () => doResetUserPassword(usuario, nuevaPass)
    });
}

async function doResetUserPassword(usuario, nuevaPass) {
    Helpers.showLoading(true);
    try {
        const payload = { accion: 'resetUserPass', usuario, adminId: Auth.getSession().userName, nuevaPass, nombreHoja: 'Users' };
        const formData = new URLSearchParams();
        formData.append('data', JSON.stringify(payload));
        const response = await fetch(CONFIG.api.gestionAdmin, { method: 'POST', body: formData });
        const result   = await response.json();
        if (result && result.status === 'success') {
            showToast('Contraseña de "' + usuario + '" actualizada', 'success');
            clearCache();
            loadUsers(true);
        } else {
            Helpers.showAlert('Error: ' + (result.message || 'Error desconocido'), 'error');
        }
    } catch (error) {
        Helpers.showAlert('Error de conexión', 'error');
    } finally {
        Helpers.showLoading(false);
    }
}

/* =========================================================
   RENDER: Tabla de Usuarios
   ========================================================= */
function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    const session      = Auth.getSession();
    const isAdminLider = session && (session.packStatus === "01" || session.packStatus === "1");
    const thPack       = document.querySelector('thead th:nth-child(5)');
    if (thPack) thPack.style.display = isAdminLider ? '' : 'none';

    const data = filteredData && filteredData.length ? filteredData : [];

    if (data.length === 0) {
        const searchVal = document.getElementById('searchInput')?.value.trim() || '';
        const msg = searchVal
            ? 'No se encontraron resultados para "' + sanitize(searchVal) + '"'
            : 'No has creado usuarios aún.';
        tbody.innerHTML = `<tr><td colspan="8" class="px-6 py-8 text-center text-gray-400">${msg}</td></tr>`;
        return;
    }

tbody.innerHTML = data.map(user => {
    const estado        = user.estado || 'activo';
    const escapedPass   = user.password.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const isPackEnabled = user.packStatus === "01" || user.packStatus === "1";
    const badgeLider    = isPackEnabled
        ? '<span class="ml-1.5 px-1.5 py-0.5 text-[9px] bg-one-gold/20 text-one-gold border border-one-gold/30 rounded-full font-bold tracking-tight">LÍDER</span>'
        : '';
    const testBadge = user.testCompletado
        ? '<span class="status-badge status-completed">Completado</span>'
        : '<span class="status-badge status-pending">Pendiente</span>';
    const packCell = isAdminLider ? `
        <td class="px-3 py-2.5">
            <div class="flex items-center justify-center gap-2">
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" ${isPackEnabled ? 'checked' : ''}
                           onchange="toggleUserPack('${sanitize(user.usuario)}', this.checked)">
                    <div class="w-9 h-5 bg-white/10 border border-white/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-one-cyan"></div>
                </label>
                <span class="text-[9px] font-bold uppercase tracking-wider ${isPackEnabled ? 'text-one-cyan' : 'text-gray-500'}">
                    ${isPackEnabled ? 'Habilitado' : 'No'}
                </span>
            </div>
        </td>` : '<td class="hidden"></td>';

    return `
        <tr class="${estado === 'inactivo' ? 'opacity-50' : ''} transition-all hover:bg-white/[0.02]">
            <td class="px-3 py-2.5 truncate max-w-0">
                <div class="flex items-center gap-1 truncate">
                    <strong class="truncate text-sm">${sanitize(user.usuario)}</strong>${badgeLider}
                </div>
            </td>
            <td class="px-3 py-2.5 truncate max-w-0">
                <span class="text-sm text-gray-300 truncate block">${sanitize(user.email)}</span>
            </td>
            <td class="px-3 py-2.5">
                <div class="flex items-center gap-1">
                    <span class="pass-text font-mono text-xs text-gray-400" data-visible="false">••••••••</span>
                    <button onclick="toggleTablePassword(this, '${escapedPass}')" class="text-gray-500 hover:text-one-cyan p-0.5 rounded flex-shrink-0">
                        <svg class="eye-open" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                </div>
            </td>
            <td class="px-3 py-2.5 truncate max-w-0">
                <span class="text-sm text-gray-300 truncate block">${sanitize(user.nombre || '---')}</span>
            </td>
            ${packCell}
            <td class="px-3 py-2.5 text-center">
                <span class="status-badge ${estado === 'activo' ? 'status-active' : 'status-inactive'}">
                    ${estado.charAt(0).toUpperCase() + estado.slice(1)}
                </span>
            </td>
            <td class="px-3 py-2.5 text-center">${testBadge}</td>
            <td class="px-3 py-2.5">
                <div class="action-buttons justify-center">
                    <button class="btn-action btn-action-edit" onclick="openEditModal('${sanitize(user.usuario)}')" title="Editar">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="btn-action ${estado === 'activo' ? 'btn-action-deactivate' : 'btn-action-activate'}"
                            onclick="toggleUserStatus('${sanitize(user.usuario)}', '${estado}')">
                        ${estado === 'activo' ? '🚫' : '✅'}
                    </button>
                </div>
            </td>
        </tr>`;
}).join('');
}

/* =========================================================
   ESTADÍSTICAS
   ========================================================= */
function updateStats() {
    const total       = usersData.length;
    const activos     = usersData.filter(u => u.estado === 'activo').length;
    const completados = usersData.filter(u => u.estado === 'activo' && u.testCompletado).length;
    const pendientes  = activos - completados;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = String(val); };
    set('totalUsers',    total);
    set('activeUsers',   activos);
    set('pendingUsers',  pendientes);
    set('completedTests',completados);
}

/* =========================================================
   VER / OCULTAR CONTRASEÑA
   ========================================================= */
function toggleTablePassword(btn, password) {
    const span      = btn.parentElement.querySelector('.pass-text');
    const eyeOpen   = btn.querySelector('.eye-open');
    const eyeClosed = btn.querySelector('.eye-closed');
    if (span.dataset.visible === 'false') {
        span.textContent = password; span.dataset.visible = 'true';
        eyeOpen?.classList.add('hidden'); eyeClosed?.classList.remove('hidden');
    } else {
        span.textContent = '••••••••'; span.dataset.visible = 'false';
        eyeOpen?.classList.remove('hidden'); eyeClosed?.classList.add('hidden');
    }
}

function toggleInputPassword(inputId, btn) {
    const input     = document.getElementById(inputId);
    const eyeOpen   = btn.querySelector('.eye-open');
    const eyeClosed = btn.querySelector('.eye-closed');
    if (input.type === 'password') {
        input.type = 'text';
        eyeOpen?.classList.add('hidden'); eyeClosed?.classList.remove('hidden');
    } else {
        input.type = 'password';
        eyeOpen?.classList.remove('hidden'); eyeClosed?.classList.add('hidden');
    }
}

/* =========================================================
   MODAL DE CREDENCIALES
   ========================================================= */
function showCredentialsModal(usuario, password, email) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:9999;animation:fadeIn .2s ease';
    overlay.innerHTML =
        '<div style="background:linear-gradient(145deg,#1e1b23,#2a2730);border:1px solid rgba(107,225,227,0.2);border-radius:20px;padding:32px;max-width:480px;width:92%;box-shadow:0 30px 80px rgba(0,0,0,0.6);animation:scaleIn .25s ease">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">' +
                '<div style="width:40px;height:40px;border-radius:50%;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);display:flex;align-items:center;justify-content:center;">' +
                    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' +
                '</div>' +
                '<h3 style="margin:0;font-family:\'Exo 2\',sans-serif;font-size:1.3rem;font-weight:800;color:#fff;">Usuario Creado</h3>' +
            '</div>' +
            '<div style="background:rgba(107,225,227,0.04);border:1.5px dashed rgba(107,225,227,0.2);border-radius:14px;padding:4px 18px;">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06);">' +
                    '<span style="font-weight:600;color:#a4a8c0;font-size:.9rem;">Usuario</span>' +
                    '<code style="font-family:monospace;background:rgba(0,0,0,0.5);padding:5px 14px;border-radius:8px;color:#6be1e3;border:1px solid rgba(107,225,227,0.15);font-size:.9rem;">' + sanitize(usuario) + '</code>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06);">' +
                    '<span style="font-weight:600;color:#a4a8c0;font-size:.9rem;">Contraseña</span>' +
                    '<code style="font-family:monospace;background:rgba(0,0,0,0.5);padding:5px 14px;border-radius:8px;color:#e17bd7;border:1px solid rgba(225,123,215,0.15);font-size:.9rem;">' + sanitize(password) + '</code>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;">' +
                    '<span style="font-weight:600;color:#a4a8c0;font-size:.9rem;">Email</span>' +
                    '<code style="font-family:monospace;background:rgba(0,0,0,0.5);padding:5px 14px;border-radius:8px;color:#e4c76a;border:1px solid rgba(228,199,106,0.15);font-size:.9rem;">' + sanitize(email) + '</code>' +
                '</div>' +
            '</div>' +
            '<p style="color:#a4a8c0;font-size:.85rem;margin:18px 0 22px;line-height:1.5;">⚠️ Guardá estas credenciales. El usuario las necesitará para acceder al sistema.</p>' +
            '<button onclick="this.closest(\'[style*=fixed]\').remove()" style="width:100%;padding:13px;border:1px solid rgba(107,225,227,0.35);background:linear-gradient(135deg,rgba(107,225,227,0.12),rgba(225,123,215,0.12));color:#fff;font-family:\'Exo 2\',sans-serif;font-weight:700;font-size:.95rem;border-radius:9999px;cursor:pointer;">Entendido</button>' +
        '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

/* =========================================================
   MODAL DE CONFIRMACIÓN
   ========================================================= */
var _confirmCallback = null;

function showConfirmModal(opts) {
    const modal         = document.getElementById('confirmModal');
    const iconContainer = document.getElementById('confirmIcon');
    const title         = document.getElementById('confirmTitle');
    const message       = document.getElementById('confirmMessage');
    let   btn           = document.getElementById('confirmBtn');

    title.textContent = opts.title   || 'Confirmar';
    message.innerHTML = opts.message || '';
    btn.className     = 'flex-1 px-6 py-2.5 rounded-full transition-all font-bold text-sm cursor-pointer ' + (opts.btnClass || '');

    const iconMap = {
        create:     '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6be1e3" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
        edit:       '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6be1e3" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
        delete:     '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        deactivate: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        activate:   '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
    };
    const bgMap = { create:'bg-one-cyan/20', edit:'bg-one-cyan/20', delete:'bg-red-500/20', deactivate:'bg-red-500/20', activate:'bg-green-500/20' };

    iconContainer.className = 'mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ' + (bgMap[opts.icon] || 'bg-white/10');
    iconContainer.innerHTML = iconMap[opts.icon] || '';
    _confirmCallback        = opts.onConfirm || null;

    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', () => {
        const cb = _confirmCallback; _confirmCallback = null;
        closeConfirmModal();
        if (typeof cb === 'function') cb();
    });

    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    void modal.offsetHeight;
    modal.classList.add('modal-visible');
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    setTimeout(() => { modal.classList.add('hidden'); modal.style.display = ''; }, 300);
}

/* =========================================================
   TOAST NOTIFICATIONS
   ========================================================= */
function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    const toast     = document.createElement('div');
    const isSuccess = type === 'success';
    toast.className = 'toast-item pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-xl shadow-2xl text-sm font-semibold transform translate-x-full transition-transform duration-300 ' +
        (isSuccess ? 'bg-green-500/20 border-green-500/40 text-green-300' : 'bg-red-500/20 border-red-500/40 text-red-300');
    const icon = isSuccess
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    toast.innerHTML = icon + '<span>' + message + '</span>';
    container.appendChild(toast);
    requestAnimationFrame(() => { toast.classList.remove('translate-x-full'); toast.classList.add('translate-x-0'); });
    setTimeout(() => {
        toast.classList.remove('translate-x-0'); toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* =========================================================
   UTILIDADES
   ========================================================= */
function sanitize(str) {
    if (typeof Helpers !== 'undefined' && Helpers.sanitizeHTML) return Helpers.sanitizeHTML(str);
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
}

/* =========================================================
   CAMBIAR PACK LÍDER PARA USUARIO FINAL
   ========================================================= */
async function toggleUserPack(usuarioUser, isEnabled) {
    const session    = Auth.getSession();
    const nuevoValor = isEnabled ? "1" : "";
    showToast('Actualizando permisos...', 'success');
    try {
        const payload = { accion: 'editarUserPack', usuario: usuarioUser, adminId: session.userName, valor: nuevoValor };
        const formData = new URLSearchParams();
        formData.append('data', JSON.stringify(payload));
        const response = await fetch(CONFIG.api.gestionAdmin, { method: 'POST', body: formData });
        const result   = await response.json();
        if (result && result.status === 'success') {
            showToast('Permisos actualizados correctamente', 'success');
            const user = usersData.find(u => u.usuario === usuarioUser);
            if (user) { user.packStatus = nuevoValor; saveCache(usersData); }
        } else {
            throw new Error(result.message || 'Error en el servidor');
        }
    } catch (error) {
        Helpers.showAlert('No se pudo actualizar: ' + error.message, 'error');
        renderUsersTable();
    }
}