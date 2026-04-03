/**
 * 👑 LÓGICA DEL DASHBOARD DE SUPER ADMINISTRADOR (VERSIÓN COMPLETA CORREGIDA)
 */

let adminsData = [];
let filteredData = [];

document.addEventListener('DOMContentLoaded', function () {
    loadUserInfo();
    loadAdmins();
    setupEventListeners();
});

function loadUserInfo() {
    const session = Auth.getSession();
    if (session) {
        document.getElementById('userInfo').textContent = `${session.userName} (${session.userEmail})`;
    }
}

function setupEventListeners() {
    const form = document.getElementById('newAdminForm');
    if (form) {
        form.addEventListener('submit', handleCreateAdmin);
    }

    const editForm = document.getElementById('editAdminForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditAdmin);
    }

    // Cerrar modales con Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeEditModal();
            closeConfirmModal();
        }
    });
}

/* =========================================================
   LECTURA: Cargar lista (GET simple)
   ========================================================= */
async function loadAdmins() {
    Helpers.showLoading(true);

    try {
        // 1. Obtenemos la respuesta cruda de Google Sheets
        const response = await Helpers.fetchGET(CONFIG.api.gestion);

        if (Array.isArray(response)) {
            // 2. CREAMOS EL PUENTE: Aquí forzamos que el JS reconozca la columna G
            adminsData = response.map(function (row) {
                return {
                    // Mantenemos tus campos originales
                    Usuario_Admin: String(row.Usuario_Admin || row.usuario || ''),
                    Email_Admin: String(row.Email_Admin || row.email || ''),
                    Pass_Admin: String(row.Pass_Admin || row.password || ''),
                    Fecha_Alta: String(row.Fecha_Alta || ''),
                    Estado: String(row.Estado || row.estado || 'activo'),
                    
                    // ✅ LA PIEZA CLAVE: Mapeamos la columna "Pack_Status"
                    // Usamos .trim() para quitar espacios rebeldes y String() por seguridad
                    Pack_Status: String(row.Pack_Status || '').trim() 
                };
            });

            filteredData = adminsData.slice();
            
            // 3. Renderizamos la tabla (ahora sí con datos en Pack_Status)
            renderAdminsTable();
            updateStats();
        } else {
            Helpers.showAlert('Error: La respuesta del servidor no tiene el formato esperado.', 'error');
        }

    } catch (error) {
        console.error('Error al cargar administradores:', error);
        Helpers.showAlert('Error de conexión al cargar la lista', 'error');
    } finally {
        Helpers.showLoading(false);
    }
}
/* =========================================================
   BÚSQUEDA / FILTRO
   ========================================================= */
function filterAdmins() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!query) {
        filteredData = [...adminsData];
    } else {
        filteredData = adminsData.filter(function (admin) {
            const usuario = (admin.Usuario_Admin || admin.usuario || '').toLowerCase();
            const email = (admin.Email_Admin || admin.email || '').toLowerCase();
            return usuario.includes(query) || email.includes(query);
        });
    }
    renderAdminsTable();
}

/* =========================================================
   ESCRITURA: Crear nuevo administrador (Túnel Iframe)
   Actualizado con Pack Líder (Columna G)
   ========================================================= */
async function handleCreateAdmin(e) {
    e.preventDefault();

    const usuario = document.getElementById('adminUsuario').value.trim();
    const password = document.getElementById('adminPassword').value;
    const email = document.getElementById('adminEmail').value.trim();
    
    // ✅ CAPTURA DEL PERMISO: Verificamos el nuevo checkbox
    const chkGestion = document.getElementById('chkGestionPaquetes');
    const packStatusValue = (chkGestion && chkGestion.checked) ? "01" : "";

    if (!usuario || !password || !email) {
        Helpers.showAlert('Completa todos los campos', 'error');
        return;
    }

    // Verificar duplicado
    const existe = adminsData.some(function (a) {
        return (a.Usuario_Admin || a.usuario || '').toLowerCase() === usuario.toLowerCase();
    });
    if (existe) {
        showToast('El usuario "' + usuario + '" ya existe', 'error');
        return;
    }

    showConfirmModal({
        title: 'Crear Administrador',
        message: '¿Estás seguro de crear al administrador <strong>' + sanitize(usuario) + '</strong>?',
        icon: 'create',
        btnClass: 'bg-gradient-to-r from-one-cyan/30 to-one-pink/30 border border-one-cyan/50',
        onConfirm: function () {
            Helpers.showLoading(true);
            var datos = {
                fila: [
                    "superadmin@sistema.com", // Col A
                    usuario,                  // Col B
                    password,                 // Col C
                    email,                    // Col D
                    new Date().toISOString(), // Col E
                    "activo",                 // Col F
                    packStatusValue           // Col G: NUEVO (Valor "01" o "")
                ],
                nombreHoja: "Admins"
            };

            // Enviamos los datos
            enviarViaTunel(datos, 'Administrador "' + usuario + '" creado exitosamente');
            
            // Limpiamos el formulario y el checkbox
            e.target.reset();
            if (chkGestion) chkGestion.checked = false;
        }
    });
}

/* =========================================================
   EDITAR: Abrir modal de edición
   ========================================================= */
function openEditModal(usuario) {
    var admin = adminsData.find(function (a) {
        return (a.Usuario_Admin || a.usuario) === usuario;
    });
    if (!admin) return;

    document.getElementById('editOriginalUsuario').value = usuario;
    document.getElementById('editUsuario').value = admin.Usuario_Admin || admin.usuario || '';
    document.getElementById('editEmail').value = admin.Email_Admin || admin.email || '';
    document.getElementById('editPassword').value = '';

    var modal = document.getElementById('editModal');
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    void modal.offsetHeight;
    modal.classList.add('modal-visible');
}

function closeEditModal() {
    var modal = document.getElementById('editModal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    setTimeout(function () {
        modal.classList.add('hidden');
        modal.style.display = '';
    }, 300);
}

function handleEditAdmin(e) {
    e.preventDefault();

    var originalUsuario = document.getElementById('editOriginalUsuario').value;
    var nuevoEmail = document.getElementById('editEmail').value.trim();
    var nuevaPass = document.getElementById('editPassword').value;

    if (!nuevoEmail) {
        showToast('El Email es obligatorio', 'error');
        return;
    }

    showConfirmModal({
        title: 'Guardar Cambios',
        message: '¿Confirmas los cambios para <strong>' + sanitize(originalUsuario) + '</strong>?',
        icon: 'edit',
        btnClass: 'bg-gradient-to-r from-one-cyan/30 to-one-pink/30 border border-one-cyan/50',
        onConfirm: function () {
            closeEditModal();
            Helpers.showLoading(true);

            var datos = {
                accion: "editar",
                usuario: originalUsuario,
                nuevoEmail: nuevoEmail,
                nombreHoja: "Admins"
            };
            if (nuevaPass) {
                datos.nuevaPass = nuevaPass;
            }

            enviarViaTunel(datos, 'Administrador "' + originalUsuario + '" actualizado correctamente');
        }
    });
}

/* =========================================================
   INACTIVAR / ACTIVAR
   ========================================================= */
function toggleAdminStatus(usuario, estadoActual) {
    var nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    var accionTexto = nuevoEstado === 'inactivo' ? 'inactivar' : 'activar';

    showConfirmModal({
        title: (nuevoEstado === 'inactivo' ? 'Inactivar' : 'Activar') + ' Administrador',
        message: '¿Deseas <strong>' + accionTexto + '</strong> al administrador <strong>' + sanitize(usuario) + '</strong>?',
        icon: nuevoEstado === 'inactivo' ? 'deactivate' : 'activate',
        btnClass: nuevoEstado === 'inactivo'
            ? 'bg-red-500/30 border border-red-500/50 text-red-300'
            : 'bg-green-500/30 border border-green-500/50 text-green-300',
        onConfirm: function () {
            Helpers.showLoading(true);
            var datos = {
                accion: "toggleStatus",
                usuario: usuario,
                nuevoEstado: nuevoEstado,
                nombreHoja: "Admins"
            };
            enviarViaTunel(datos, 'Estado de "' + usuario + '" cambiado a ' + nuevoEstado);
        }
    });
}

/* =========================================================
   ELIMINAR
   ========================================================= */
function deleteAdmin(usuario) {
    showConfirmModal({
        title: 'Eliminar Administrador',
        message: '¿Estás seguro de eliminar permanentemente a <strong>' + sanitize(usuario) + '</strong>? Esta acción no se puede deshacer.',
        icon: 'delete',
        btnClass: 'bg-red-500/30 border border-red-500/50 text-red-300',
        onConfirm: function () {
            Helpers.showLoading(true);
            var datos = {
                accion: "borrar",
                usuario: usuario,
                nombreHoja: "Admins"
            };
            enviarViaTunel(datos, 'Administrador "' + usuario + '" eliminado');
        }
    });
}

/* =========================================================
   RESET PASSWORD
   ========================================================= */
function resetAdminPassword(usuario) {
    var nuevaPass = prompt('Ingresa la nueva contraseña para ' + usuario + ':');
    if (!nuevaPass) return;

    showConfirmModal({
        title: 'Resetear Contraseña',
        message: '¿Confirmas el cambio de contraseña para <strong>' + sanitize(usuario) + '</strong>?',
        icon: 'edit',
        btnClass: 'bg-yellow-500/30 border border-yellow-500/50 text-yellow-300',
        onConfirm: function () {
            Helpers.showLoading(true);
            var datos = {
                accion: "resetPass",
                usuario: usuario,
                nuevaPass: nuevaPass,
                nombreHoja: "Admins"
            };
            enviarViaTunel(datos, 'Contraseña de "' + usuario + '" actualizada');
        }
    });
}

/* =========================================================
   MOTOR DE ENVÍO (TÚNEL IFRAME)
   ========================================================= */
function enviarViaTunel(obj, mensajeExito) {
    var form = document.getElementById('hidden-form');
    var hiddenInput = document.getElementById('hidden-data');

    if (!form || !hiddenInput) {
        showToast('Error: No se encontró el túnel de envío', 'error');
        return;
    }

    hiddenInput.value = JSON.stringify(obj);
    form.action = CONFIG.api.gestion;
    form.submit();

    setTimeout(function () {
        showToast(mensajeExito, 'success');
        loadAdmins();
    }, 2000);
}

/* =========================================================
   VER / OCULTAR CONTRASEÑA EN TABLA
   ========================================================= */
function toggleTablePassword(btn, password) {
    var span = btn.parentElement.querySelector('.pass-text');
    var eyeOpen = btn.querySelector('.eye-open');
    var eyeClosed = btn.querySelector('.eye-closed');

    if (span.dataset.visible === 'false') {
        span.textContent = password;
        span.dataset.visible = 'true';
        eyeOpen.classList.add('hidden');
        eyeClosed.classList.remove('hidden');
    } else {
        span.textContent = '••••••••';
        span.dataset.visible = 'false';
        eyeOpen.classList.remove('hidden');
        eyeClosed.classList.add('hidden');
    }
}

/* Toggle password visibility en inputs del formulario */
function toggleInputPassword(inputId, btn) {
    var input = document.getElementById(inputId);
    var eyeOpen = btn.querySelector('.eye-open');
    var eyeClosed = btn.querySelector('.eye-closed');

    if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.classList.add('hidden');
        eyeClosed.classList.remove('hidden');
    } else {
        input.type = 'password';
        eyeOpen.classList.remove('hidden');
        eyeClosed.classList.add('hidden');
    }
}

/* =========================================================
   RENDER: Tabla con todas las acciones (Corregida)
   ========================================================= */
function renderAdminsTable() {
    var tbody = document.getElementById('adminsTableBody');
    if (!tbody) return;

    var data = filteredData && filteredData.length ? filteredData : (adminsData || []);

    if (data.length === 0) {
        var searchVal = document.getElementById('searchInput') ? document.getElementById('searchInput').value.trim() : '';
        var mensaje = searchVal ? 'No se encontraron resultados para "' + sanitize(searchVal) + '"' : 'Sin datos';
        // Colspan 7 para cubrir todas las columnas nuevas
        tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-gray-400">' + mensaje + '</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(function (admin) {
        // 1. Definición clara de variables desde el objeto 'admin'
        var usuario = String(admin.Usuario_Admin || admin.usuario || '-');
        var email = String(admin.Email_Admin || admin.email || '-');
        var password = String(admin.Pass_Admin || admin.password || '');
        var estado = String(admin.Estado || admin.estado || 'activo').toLowerCase();
        var fecha = admin.Fecha_Alta || admin.fechaAlta || '';
        
        // 2. ✅ CORRECCIÓN: Extraer el valor real de la propiedad mapeada
        var valPack = String(admin.Pack_Status || "").trim();
        
        // 3. ✅ VALIDACIÓN: Definir si está habilitado (soporta "01" o "1")
        var isPackEnabled = (valPack === "01" || valPack === "1");

        var escapedPass = password.replace(/'/g, "\\'").replace(/"/g, '&quot;');

        return '<tr class="' + (estado === 'inactivo' ? 'opacity-60' : '') + ' hover:bg-white/5 transition-colors">' +
            '<td class="px-6 py-4"><strong>' + sanitize(usuario) + '</strong></td>' +
            '<td class="px-6 py-4">' + sanitize(email) + '</td>' +
            
            // ✅ COLUMNA: Pack Líder (Toggle Interactivo)
            '<td class="px-6 py-4">' +
                '<div class="flex items-center gap-3">' +
                    '<label class="relative inline-flex items-center cursor-pointer scale-90">' +
                        '<input type="checkbox" class="sr-only peer" ' + (isPackEnabled ? 'checked' : '') + 
                        ' onchange="toggleAdminPack(\'' + sanitize(usuario) + '\', this.checked)">' +
                        '<div class="w-10 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-one-cyan"></div>' +
                    '</label>' +
                    '<span class="text-[10px] font-bold tracking-tighter ' + (isPackEnabled ? 'text-one-cyan' : 'text-gray-500') + '">' + 
                        (isPackEnabled ? 'HABILITADO' : 'LIMITADO') + 
                    '</span>' +
                '</div>' +
            '</td>' +

            '<td class="px-6 py-4">' +
                '<div class="flex items-center gap-2">' +
                    '<span class="pass-text font-mono text-sm text-gray-300" data-visible="false">••••••••</span>' +
                    '<button onclick="toggleTablePassword(this, \'' + escapedPass + '\')" ' +
                        'class="text-gray-400 hover:text-one-cyan transition-colors p-1 rounded-lg hover:bg-white/5" title="Ver/Ocultar contraseña">' +
                        '<svg class="eye-open" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                            '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' +
                        '</svg>' +
                        '<svg class="eye-closed hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                            '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>' +
                            '<line x1="1" y1="1" x2="23" y2="23"/>' +
                        '</svg>' +
                    '</button>' +
                '</div>' +
            '</td>' +
            '<td class="px-6 py-4 text-sm text-gray-400">' + Helpers.formatDate(fecha || new Date()) + '</td>' +
            '<td class="px-6 py-4 text-center">' +
                '<span class="status-badge ' + (estado === 'activo' ? 'status-active' : 'status-inactive') + '">' +
                    estado.charAt(0).toUpperCase() + estado.slice(1) +
                '</span>' +
            '</td>' +
            '<td class="px-6 py-4">' +
                '<div class="action-buttons">' +
                    '<button class="btn-action btn-action-edit" onclick="openEditModal(\'' + sanitize(usuario) + '\')" title="Editar">' +
                        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                            '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>' +
                            '<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>' +
                        '</svg>' +
                    '</button>' +
                    '<button class="btn-action ' + (estado === 'activo' ? 'btn-action-deactivate' : 'btn-action-activate') + '" ' +
                        'onclick="toggleAdminStatus(\'' + sanitize(usuario) + '\', \'' + estado + '\')" ' +
                        'title="' + (estado === 'activo' ? 'Inactivar' : 'Activar') + '">' +
                        (estado === 'activo'
                            ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
                            : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
                        ) +
                    '</button>' +
                    '<button class="btn-action btn-action-reset" onclick="resetAdminPassword(\'' + sanitize(usuario) + '\')" title="Reset Password">' +
                        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                            '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' +
                        '</svg>' +
                    '</button>' +
                '</div>' +
            '</td>' +
        '</tr>';
    }).join('');
}

/* =========================================================
   ESTADÍSTICAS
   ========================================================= */
function updateStats() {
    var totalElem = document.getElementById('totalAdmins');
    var activeElem = document.getElementById('activeAdmins');
    var inactiveElem = document.getElementById('inactiveAdmins');

    if (totalElem) totalElem.textContent = adminsData.length;

    var activos = adminsData.filter(function (a) {
        return (a.Estado || a.estado || 'activo').toLowerCase() === 'activo';
    }).length;

    var inactivos = adminsData.length - activos;

    if (activeElem) activeElem.textContent = activos;
    if (inactiveElem) inactiveElem.textContent = inactivos;
}

/* =========================================================
   MODAL DE CONFIRMACIÓN
   ========================================================= */
var _confirmCallback = null;

function showConfirmModal(opts) {
    var modal = document.getElementById('confirmModal');
    var iconContainer = document.getElementById('confirmIcon');
    var title = document.getElementById('confirmTitle');
    var message = document.getElementById('confirmMessage');
    var btn = document.getElementById('confirmBtn');

    title.textContent = opts.title || 'Confirmar';
    message.innerHTML = opts.message || '';
    btn.className = 'flex-1 px-6 py-2.5 rounded-full transition-all font-bold text-sm cursor-pointer ' + (opts.btnClass || '');

    // Iconos según tipo
    var iconMap = {
        create: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6be1e3" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
        edit: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6be1e3" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
        delete: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        deactivate: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        activate: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
    };

    var bgMap = {
        create: 'bg-one-cyan/20',
        edit: 'bg-one-cyan/20',
        delete: 'bg-red-500/20',
        deactivate: 'bg-red-500/20',
        activate: 'bg-green-500/20'
    };

    iconContainer.className = 'mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ' + (bgMap[opts.icon] || 'bg-white/10');
    iconContainer.innerHTML = iconMap[opts.icon] || '';

    _confirmCallback = opts.onConfirm || null;

    // Clonar botón para eliminar listeners previos
    var newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', function () {
        var cb = _confirmCallback;
        _confirmCallback = null;
        closeConfirmModal();
        if (typeof cb === 'function') cb();
    });

    // Mostrar modal: quitar hidden, luego activar transición
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    // Forzar reflow para que la transición se aplique
    void modal.offsetHeight;
    modal.classList.add('modal-visible');
}

function closeConfirmModal() {
    var modal = document.getElementById('confirmModal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    setTimeout(function () {
        modal.classList.add('hidden');
        modal.style.display = '';
    }, 300);
}

/* =========================================================
   TOAST NOTIFICATIONS
   ========================================================= */
function showToast(message, type) {
    var container = document.getElementById('toastContainer');
    var toast = document.createElement('div');
    toast.className = 'toast-item pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-xl shadow-2xl text-sm font-semibold transform translate-x-full transition-transform duration-300 ' +
        (type === 'success'
            ? 'bg-green-500/20 border-green-500/40 text-green-300'
            : 'bg-red-500/20 border-red-500/40 text-red-300');

    var icon = type === 'success'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

    toast.innerHTML = icon + '<span>' + message + '</span>';
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(function () {
        toast.classList.remove('translate-x-full');
        toast.classList.add('translate-x-0');
    });

    // Animate out after 4s
    setTimeout(function () {
        toast.classList.remove('translate-x-0');
        toast.classList.add('translate-x-full');
        setTimeout(function () { toast.remove(); }, 300);
    }, 4000);
}

/* =========================================================
   UTILIDADES
   ========================================================= */
function sanitize(str) {
    if (typeof Helpers !== 'undefined' && Helpers.sanitizeHTML) {
        return Helpers.sanitizeHTML(str);
    }
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
}


function toggleAdminPack(usuario, isEnabled) {
    const nuevoValor = isEnabled ? "01" : "";
    const textoAccion = isEnabled ? "Habilitar gestión de Pack Líder" : "Restringir gestión de Pack Líder";

    showConfirmModal({
        title: 'Modificar Permisos',
        message: '¿Deseas <strong>' + textoAccion + '</strong> para el administrador <strong>' + usuario + '</strong>?',
        icon: isEnabled ? 'activate' : 'deactivate',
        onConfirm: function () {
            Helpers.showLoading(true);
            
            // Enviamos la actualización vía túnel (Asegúrate de que tu .gs acepte editarAdmin)
            var datos = {
                accion: 'editarAdmin',
                usuario: usuario,
                columna: 'Pack_Status',
                valor: nuevoValor,
                nombreHoja: 'Admins'
            };

            enviarViaTunel(datos, 'Permisos de "' + usuario + '" actualizados correctamente');
        },
        onCancel: function() {
            // Si cancela, volvemos a renderizar para que el switch no quede en la posición falsa
            renderAdminsTable();
        }
    });
}