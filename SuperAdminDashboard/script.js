/**
 * 👑 SUPER ADMIN DASHBOARD
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
    if (form) form.addEventListener('submit', handleCreateAdmin);
    const editForm = document.getElementById('editAdminForm');
    if (editForm) editForm.addEventListener('submit', handleEditAdmin);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeEditModal();
            closeConfirmModal();
            closeInfraModal();
        }
    });
}

/* =========================================================
   CARGAR ADMINS
   ========================================================= */
async function loadAdmins() {
    Helpers.showLoading(true);
    try {
        const response = await Helpers.fetchGET(CONFIG.api.gestion);
        if (Array.isArray(response)) {
adminsData = response.map(function (row) {
    return {
        Usuario_Admin:  String(row.Usuario_Admin  || row.usuario  || ''),
        Email_Admin:    String(row.Email_Admin    || row.email    || ''),
        Pass_Admin:     String(row.Pass_Admin     || row.password || ''),
        Fecha_Alta:     String(row.Fecha_Alta     || ''),
        Estado:         String(row.Estado         || row.estado   || 'activo'),
        Pack_Status:    String(row.Pack_Status    || '').trim(),
        Empresa_Nombre: String(row.Empresa_Nombre || row.Name_Empresa || '').trim(),
        Logo_EmpresaLink: String(row.Logo_EmpresaLink || row.Logo_Empresa || '').trim(),
        API_usuarios:               String(row.API_usuarios               || '').trim(),
        API_respuestas:             String(row.API_respuestas             || '').trim(),
        API_visualizacionderespuestas: String(row.API_visualizacionderespuestas || '').trim()
    };
});
            filteredData = adminsData.slice();
            renderAdminsTable();
            updateStats();
        } else {
            Helpers.showAlert('Error: respuesta inesperada del servidor.', 'error');
        }
    } catch (error) {
        console.error('Error al cargar administradores:', error);
        Helpers.showAlert('Error de conexión al cargar la lista', 'error');
    } finally {
        Helpers.showLoading(false);
    }
}

/* =========================================================
   FILTRO
   ========================================================= */
function filterAdmins() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!query) {
        filteredData = [...adminsData];
    } else {
        filteredData = adminsData.filter(function (admin) {
            const usuario = (admin.Usuario_Admin  || '').toLowerCase();
            const email   = (admin.Email_Admin    || '').toLowerCase();
            const empresa = (admin.Empresa_Nombre || '').toLowerCase();
            return usuario.includes(query) || email.includes(query) || empresa.includes(query);
        });
    }
    renderAdminsTable();
}

/* =========================================================
   CREAR ADMIN
   ========================================================= */
async function handleCreateAdmin(e) {
    e.preventDefault();

    const usuario  = document.getElementById('adminUsuario').value.trim();
    const password = document.getElementById('adminPassword').value;
    const email    = document.getElementById('adminEmail').value.trim();
    const empresa  = document.getElementById('adminEmpresa').value.trim();
    const logo     = document.getElementById('adminLogo').value.trim();
    const chkGestion      = document.getElementById('chkGestionPaquetes');
    const packStatusValue = (chkGestion && chkGestion.checked) ? "01" : "";

    if (!usuario || !password || !email || !empresa) {
        Helpers.showAlert('Completá todos los campos obligatorios', 'error');
        return;
    }

    const existe = adminsData.some(function (a) {
        return (a.Usuario_Admin || '').toLowerCase() === usuario.toLowerCase();
    });
    if (existe) {
        showToast('El usuario "' + usuario + '" ya existe', 'error');
        return;
    }

    // ── Overlay inline ────────────────────────────────────────
    function _mostrarOverlay(msg, sub) {
        let el = document.getElementById('_createOverlay');
        if (!el) {
            el = document.createElement('div');
            el.id = '_createOverlay';
            el.style.cssText = [
                'position:fixed;inset:0;z-index:9999;',
                'background:rgba(0,0,0,0.78);',
                'backdrop-filter:blur(14px);',
                'display:flex;align-items:center;justify-content:center;',
                'flex-direction:column;gap:14px;',
                'opacity:0;transition:opacity .25s ease;pointer-events:none;'
            ].join('');
            el.innerHTML = `
                <div style="position:relative;width:90px;height:90px;">
                    <div style="position:absolute;inset:-10px;border-radius:50%;
                        background:radial-gradient(circle,rgba(225,123,215,0.2) 0%,transparent 70%);
                        animation:ovGlow 2s ease-in-out infinite;"></div>
                    <div style="position:absolute;inset:-4px;border-radius:50%;
                        border:2.5px solid transparent;
                        border-top-color:#e17bd7;
                        border-right-color:rgba(225,123,215,0.5);
                        animation:ovSpin .8s linear infinite;"></div>
                    <div style="position:absolute;inset:-4px;border-radius:50%;
                        border:2.5px solid transparent;
                        border-bottom-color:rgba(200,100,240,0.3);
                        animation:ovSpin 1.8s linear infinite reverse;"></div>
                    <div style="position:absolute;inset:-4px;border-radius:50%;
                        border:2.5px solid rgba(225,123,215,0.08);"></div>
                    <img src="../img/one-iconocolor.png" alt="ONE"
                        style="width:90px;height:90px;border-radius:50%;object-fit:cover;
                               position:relative;z-index:2;display:block;
                               filter:drop-shadow(0 0 8px rgba(225,123,215,0.25));"
                        onerror="this.src='../img/one-icononegro.png'">
                </div>
                <div style="text-align:center;">
                    <p id="_ovMsg" style="margin:0;font-size:.93rem;font-weight:600;
                        color:rgba(255,255,255,.9);font-family:'Exo 2',sans-serif;
                        letter-spacing:.02em;"></p>
                    <p id="_ovSub" style="margin:4px 0 0;font-size:.75rem;
                        color:rgba(225,123,215,.8);font-family:'Exo 2',sans-serif;
                        min-height:16px;"></p>
                </div>`;

            if (!document.getElementById('_ovStyles')) {
                const s = document.createElement('style');
                s.id = '_ovStyles';
                s.textContent = `
                    @keyframes ovSpin { to { transform:rotate(360deg); } }
                    @keyframes ovGlow {
                        0%,100% { opacity:.6; transform:scale(1); }
                        50%     { opacity:1;  transform:scale(1.1); }
                    }`;
                document.head.appendChild(s);
            }
            document.body.appendChild(el);
        }
        document.getElementById('_ovMsg').textContent = msg || '';
        document.getElementById('_ovSub').textContent = sub || '';
        el.getBoundingClientRect();
        requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
        });
    }

    function _ocultarOverlay() {
        const el = document.getElementById('_createOverlay');
        if (!el) return;
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        setTimeout(() => el?.parentNode?.removeChild(el), 300);
    }
    // ─────────────────────────────────────────────────────────

    showConfirmModal({
        title: 'Crear Administrador',
        message: '¿Crear al administrador <strong>' + sanitize(usuario) + '</strong> para <strong>' + sanitize(empresa) + '</strong>?',
        icon: 'create',
        btnClass: 'bg-gradient-to-r from-one-cyan/30 to-one-pink/30 border border-one-cyan/50',
        onConfirm: async function () {
            var btnCrear = document.querySelector('#newAdminForm button[type="submit"]');
            if (btnCrear) {
                btnCrear.disabled = true;
                btnCrear.textContent = 'Creando infraestructura...';
            }

            _mostrarOverlay(
                'Creando infraestructura para ' + empresa + '...',
                'Esto puede tardar un minuto, por favor esperá 🙏'
            );

            // 1. Guardar fila en Sheets vía túnel
            enviarViaTunel({
                fila: [
                    "superadmin@sistema.com",
                    usuario, password, email,
                    new Date().toISOString(),
                    "activo", packStatusValue, empresa, logo, "", "", ""
                ],
                nombreHoja: "Admins"
            }, null);

            // 2. Crear infraestructura vía GET
            try {
                const params = new URLSearchParams({
                    data: JSON.stringify({
                        accion:        'crearInfraestructura',
                        nombreEmpresa: empresa,
                        usuarioAdmin:  usuario
                    })
                });
                const res  = await fetch(CONFIG.api.gestion + '?' + params.toString());
                const data = await res.json();

                _ocultarOverlay();

                if (data.status === 'success') {
                    mostrarModalInfraestructura(data, usuario);
                } else {
                    showToast('Admin creado pero error en infraestructura: ' + data.message, 'error');
                }
            } catch (err) {
                _ocultarOverlay();
                showToast('Admin creado pero error al crear infraestructura: ' + err, 'error');
            } finally {
                if (btnCrear) {
                    btnCrear.disabled = false;
                    btnCrear.innerHTML = `
                        <span class="flex items-center justify-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Crear Administrador
                        </span>`;
                }
                e.target.reset();
                if (chkGestion) chkGestion.checked = false;
                setTimeout(loadAdmins, 2000);
            }
        }
    });
}

/* =========================================================
   MODAL INFRAESTRUCTURA
   ========================================================= */
function mostrarModalInfraestructura(data, usuario) {
    const linksContainer = document.getElementById('infraLinks');
    linksContainer.innerHTML = [
        { label: '📁 Carpeta en Drive',  url: data.carpetaUrl,         primary: false },
        { label: '📋 Planilla de datos', url: data.spreadsheetUrl,     primary: false },
        { label: '⚙️ Editor del Script', url: data.scriptEditorUrl,    primary: true  },
        { label: '📂 Carpeta Informes',  url: data.carpetaInformesUrl, primary: false }
    ].map(function(item) {
        if (!item.url) return '';
        var colorClass = item.primary
            ? 'border-one-cyan/40 bg-one-cyan/10 text-one-cyan hover:bg-one-cyan/20'
            : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10';
        return '<a href="' + item.url + '" target="_blank" class="flex items-center justify-between px-4 py-3 rounded-xl border ' + colorClass + ' transition-all text-sm font-semibold">' +
            '<span>' + item.label + '</span>' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
            '</a>';
    }).join('');

    document.getElementById('infraModal').dataset.usuario = usuario;
    const modal = document.getElementById('infraModal');
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    void modal.offsetHeight;
    modal.classList.add('modal-visible');
}

function closeInfraModal() {
    const modal = document.getElementById('infraModal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    setTimeout(function () {
        modal.classList.add('hidden');
        modal.style.display = '';
        loadAdmins(); // ← agregar esto
    }, 300);
}

/* =========================================================
   EDITAR ADMIN
   ========================================================= */
function openEditModal(usuario) {
    var admin = adminsData.find(function (a) { return a.Usuario_Admin === usuario; });
    if (!admin) return;

    document.getElementById('editOriginalUsuario').value    = usuario;
    document.getElementById('editUsuario').value            = admin.Usuario_Admin  || '';
    document.getElementById('editEmail').value              = admin.Email_Admin    || '';
    document.getElementById('editPassword').value           = '';
    document.getElementById('editEmpresa').value            = admin.Empresa_Nombre || '';
    document.getElementById('editApiUsuarios').value        = admin.API_usuarios               || '';
    document.getElementById('editApiRespuestas').value      = admin.API_respuestas             || '';
    document.getElementById('editApiVisualizacion').value   = admin.API_visualizacionderespuestas || '';

    // Logo + preview
    var logoUrl  = admin.Logo_EmpresaLink || '';
    var logoInput = document.getElementById('editLogo');
    var wrap      = document.getElementById('editLogoPreviewWrap');
    var img       = document.getElementById('editLogoPreview');
    if (logoInput) logoInput.value = logoUrl;
    if (wrap && img) {
        if (logoUrl && logoUrl.length > 10) {
            img.src            = logoUrl;
            img.style.display  = 'block';
            wrap.style.display = 'flex';
        } else {
            img.style.display  = 'none';
            wrap.style.display = 'none';
        }
    }

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
    setTimeout(function () { modal.classList.add('hidden'); modal.style.display = ''; }, 300);
}

function handleEditAdmin(e) {
    e.preventDefault();
    var originalUsuario = document.getElementById('editOriginalUsuario').value;
    var nuevoEmail   = document.getElementById('editEmail').value.trim();
    var nuevaPass    = document.getElementById('editPassword').value;
    var nuevaEmpresa = document.getElementById('editEmpresa').value.trim();
    var nuevoLogo    = document.getElementById('editLogo').value.trim();
    var nuevoApiUsuarios     = document.getElementById('editApiUsuarios').value.trim();
var nuevoApiRespuestas   = document.getElementById('editApiRespuestas').value.trim();
var nuevoApiVisualizacion = document.getElementById('editApiVisualizacion').value.trim();
    if (!nuevoEmail) { showToast('El Email es obligatorio', 'error'); return; }
    showConfirmModal({
        title: 'Guardar Cambios',
        message: '¿Confirmas los cambios para <strong>' + sanitize(originalUsuario) + '</strong>?',
        icon: 'edit',
        btnClass: 'bg-gradient-to-r from-one-cyan/30 to-one-pink/30 border border-one-cyan/50',
        onConfirm: function () {
            closeEditModal();
            Helpers.showLoading(true);
            var datos = {
                accion:       'editar',
                usuario:      originalUsuario,
                nuevoEmail:   nuevoEmail,
                nuevaEmpresa: nuevaEmpresa,
                nuevoLogo:    nuevoLogo,
                nuevoApiUsuarios:              nuevoApiUsuarios,
nuevoApiRespuestas:            nuevoApiRespuestas,
nuevoApiVisualizacion:         nuevoApiVisualizacion,
                nombreHoja:   'Admins'
            };
            if (nuevaPass) datos.nuevaPass = nuevaPass;
            enviarViaTunel(datos, 'Administrador "' + originalUsuario + '" actualizado correctamente');
        }
    });
}

/* =========================================================
   TOGGLE STATUS
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
            enviarViaTunel({
                accion: 'toggleStatus',
                usuario: usuario,
                nuevoEstado: nuevoEstado,
                nombreHoja: 'Admins'
            }, 'Estado de "' + usuario + '" cambiado a ' + nuevoEstado);
        }
    });
}

/* =========================================================
   ELIMINAR
   ========================================================= */
function deleteAdmin(usuario) {
    showConfirmModal({
        title: 'Eliminar Administrador',
        message: '¿Eliminar permanentemente a <strong>' + sanitize(usuario) + '</strong>? Esta acción no se puede deshacer.',
        icon: 'delete',
        btnClass: 'bg-red-500/30 border border-red-500/50 text-red-300',
        onConfirm: function () {
            Helpers.showLoading(true);
            enviarViaTunel({
                accion: 'borrar',
                usuario: usuario,
                nombreHoja: 'Admins'
            }, 'Administrador "' + usuario + '" eliminado');
        }
    });
}

/* =========================================================
   RESET PASSWORD
   ========================================================= */
function resetAdminPassword(usuario) {
    var nuevaPass = prompt('Ingresá la nueva contraseña para ' + usuario + ':');
    if (!nuevaPass) return;
    showConfirmModal({
        title: 'Resetear Contraseña',
        message: '¿Confirmas el cambio de contraseña para <strong>' + sanitize(usuario) + '</strong>?',
        icon: 'edit',
        btnClass: 'bg-yellow-500/30 border border-yellow-500/50 text-yellow-300',
        onConfirm: function () {
            Helpers.showLoading(true);
            enviarViaTunel({
                accion: 'resetPass',
                usuario: usuario,
                nuevaPass: nuevaPass,
                nombreHoja: 'Admins'
            }, 'Contraseña de "' + usuario + '" actualizada');
        }
    });
}

/* =========================================================
   TOGGLE PACK
   ========================================================= */
function toggleAdminPack(usuario, isEnabled) {
    const nuevoValor  = isEnabled ? "01" : "";
    const textoAccion = isEnabled ? "Habilitar gestión de Pack Líder" : "Restringir gestión de Pack Líder";
    showConfirmModal({
        title: 'Modificar Permisos',
        message: '¿Deseas <strong>' + textoAccion + '</strong> para <strong>' + sanitize(usuario) + '</strong>?',
        icon: isEnabled ? 'activate' : 'deactivate',
        onConfirm: function () {
            Helpers.showLoading(true);
            enviarViaTunel({
                accion: 'editarAdmin',
                usuario: usuario,
                columna: 'Pack_Status',
                valor: nuevoValor,
                nombreHoja: 'Admins'
            }, 'Permisos de "' + usuario + '" actualizados');
        },
        onCancel: function () { renderAdminsTable(); }
    });
}

/* =========================================================
   RENDER TABLA
   ========================================================= */
var currentPage = 1;
var PAGE_SIZE   = 20;

function renderAdminsTable() {
    var tbody = document.getElementById('adminsTableBody');
    if (!tbody) return;
    var data = filteredData && filteredData.length ? filteredData : (adminsData || []);

    if (data.length === 0) {
        var searchVal = document.getElementById('searchInput') ? document.getElementById('searchInput').value.trim() : '';
        var msg = searchVal ? 'No se encontraron resultados para "' + sanitize(searchVal) + '"' : 'Sin datos';
        tbody.innerHTML = '<tr><td colspan="9" class="px-6 py-8 text-center text-gray-400">' + msg + '</td></tr>';
        renderPagination(0);
        return;
    }

    var totalPages = Math.ceil(data.length / PAGE_SIZE);
    if (currentPage > totalPages) currentPage = 1;
    var start    = (currentPage - 1) * PAGE_SIZE;
    var pageData = data.slice(start, start + PAGE_SIZE);

    tbody.innerHTML = pageData.map(function (admin) {
        var usuario       = String(admin.Usuario_Admin  || '-');
        var email         = String(admin.Email_Admin    || '-');
        var password      = String(admin.Pass_Admin     || '');
        var estado        = String(admin.Estado         || 'activo').toLowerCase();
        var fecha         = admin.Fecha_Alta            || '';
        var empresa       = String(admin.Empresa_Nombre || '-');
        var logo          = String(admin.Logo_EmpresaLink || '').trim();
        var apiUsuarios      = String(admin.API_usuarios               || '').trim();
        var apiRespuestas    = String(admin.API_respuestas             || '').trim();
        var apiVisualizacion = String(admin.API_visualizacionderespuestas || '').trim();
        var hasAllAPIs       = apiUsuarios.length > 10 && apiRespuestas.length > 10 && apiVisualizacion.length > 10;
        var valPack       = String(admin.Pack_Status    || '').trim();
        var isPackEnabled = (valPack === "01" || valPack === "1");
        var escapedPass   = password.replace(/'/g, "\\'").replace(/"/g, '&quot;');

        return '<tr class="' + (estado === 'inactivo' ? 'opacity-60' : '') + ' hover:bg-white/5 transition-colors">' +

            // Usuario
            '<td class="px-3 py-3"><strong class="text-sm">' + sanitize(usuario) + '</strong></td>' +

            // Empresa + Logo
            '<td class="px-3 py-3">' +
                '<div class="flex items-center gap-2" style="min-width:120px;">' +
                    (logo.length > 10
                        ? '<div style="width:40px;height:40px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">' +
                          '<img src="' + logo + '" alt="" style="max-width:36px;max-height:36px;object-fit:contain;" onerror="this.parentElement.style.display=\'none\'">' +
                          '</div>'
                        : '<div style="width:40px;height:40px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);flex-shrink:0;"></div>') +
                    '<span class="text-sm text-white font-semibold truncate">' + sanitize(empresa) + '</span>' +
                '</div>' +
            '</td>' +

            // Email
            '<td class="px-3 py-3"><span class="text-sm text-gray-300 truncate block" style="max-width:180px;">' + sanitize(email) + '</span></td>' +

            // Pack
            '<td class="px-3 py-3">' +
                '<div class="flex items-center gap-2">' +
                    '<label class="relative inline-flex items-center cursor-pointer scale-90">' +
                        '<input type="checkbox" class="sr-only peer" ' + (isPackEnabled ? 'checked' : '') +
                        ' onchange="toggleAdminPack(\'' + sanitize(usuario) + '\', this.checked)">' +
                        '<div class="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-one-cyan"></div>' +
                    '</label>' +
                    '<span class="text-[10px] font-bold ' + (isPackEnabled ? 'text-one-cyan' : 'text-gray-500') + '">' +
                        (isPackEnabled ? 'ON' : 'OFF') +
                    '</span>' +
                '</div>' +
            '</td>' +

            // Platform
            '<td class="px-3 py-3">' +
                (hasAllAPIs
                    ? '<span class="text-[10px] font-bold text-one-cyan bg-one-cyan/10 px-2 py-1 rounded-full border border-one-cyan/30">✦ ACTIVADO</span>'
                    : '<span class="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">⚠ PENDIENTE</span>') +
            '</td>' +

            // Contraseña
            '<td class="px-3 py-3">' +
                '<div class="flex items-center gap-1">' +
                    '<span class="pass-text font-mono text-xs text-gray-300" data-visible="false">••••••</span>' +
                    '<button onclick="toggleTablePassword(this, \'' + escapedPass + '\')" class="text-gray-400 hover:text-one-cyan transition-colors p-1 rounded">' +
                        '<svg class="eye-open" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
                        '<svg class="eye-closed hidden" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>' +
                    '</button>' +
                '</div>' +
            '</td>' +

            // Fecha
            '<td class="px-3 py-3 text-xs text-gray-400">' + Helpers.formatDate(fecha || new Date()) + '</td>' +

            // Estado
            '<td class="px-3 py-3 text-center">' +
                '<span class="status-badge ' + (estado === 'activo' ? 'status-active' : 'status-inactive') + '">' +
                    estado.charAt(0).toUpperCase() + estado.slice(1) +
                '</span>' +
            '</td>' +

            // Acciones
            '<td class="px-3 py-3">' +
                '<div class="action-buttons">' +
                    '<button class="btn-action btn-action-edit" onclick="openEditModal(\'' + sanitize(usuario) + '\')" title="Editar">' +
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
                    '</button>' +
                    '<button class="btn-action ' + (estado === 'activo' ? 'btn-action-deactivate' : 'btn-action-activate') + '" onclick="toggleAdminStatus(\'' + sanitize(usuario) + '\', \'' + estado + '\')" title="' + (estado === 'activo' ? 'Inactivar' : 'Activar') + '">' +
                        (estado === 'activo'
                            ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
                            : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>') +
                    '</button>' +
                    '<button class="btn-action btn-action-reset" onclick="resetAdminPassword(\'' + sanitize(usuario) + '\')" title="Reset">' +
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
                    '</button>' +
                    '<button class="btn-action btn-action-delete" onclick="deleteAdmin(\'' + sanitize(usuario) + '\')" title="Eliminar">' +
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
                    '</button>' +
                '</div>' +
            '</td>' +
        '</tr>';
    }).join('');

    renderPagination(data.length);
}

function renderPagination(total) {
    var existing = document.getElementById('adminsPagination');
    if (existing) existing.remove();
    if (total <= PAGE_SIZE) return;

    var totalPages = Math.ceil(total / PAGE_SIZE);
    var wrap = document.createElement('div');
    wrap.id = 'adminsPagination';
    wrap.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:0.5rem;padding:1rem;border-top:1px solid rgba(255,255,255,0.08);flex-wrap:wrap;';

    var html = '<span style="font-size:0.75rem;color:#a4a8c0;margin-right:0.5rem;">Página ' + currentPage + ' de ' + totalPages + ' · ' + total + ' admins</span>';

    if (currentPage > 1) {
        html += '<button onclick="goToPage(' + (currentPage-1) + ')" style="padding:0.3rem 0.75rem;border-radius:9999px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.05);color:#fff;font-size:0.75rem;cursor:pointer;">← Anterior</button>';
    }

    for (var i = 1; i <= totalPages; i++) {
        var isActive = i === currentPage;
        html += '<button onclick="goToPage(' + i + ')" style="padding:0.3rem 0.65rem;border-radius:9999px;border:1px solid ' + (isActive ? 'rgba(107,225,227,0.5)' : 'rgba(255,255,255,0.15)') + ';background:' + (isActive ? 'rgba(107,225,227,0.15)' : 'rgba(255,255,255,0.05)') + ';color:' + (isActive ? '#6be1e3' : '#fff') + ';font-size:0.75rem;font-weight:' + (isActive ? '700' : '400') + ';cursor:pointer;">' + i + '</button>';
    }

    if (currentPage < totalPages) {
        html += '<button onclick="goToPage(' + (currentPage+1) + ')" style="padding:0.3rem 0.75rem;border-radius:9999px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.05);color:#fff;font-size:0.75rem;cursor:pointer;">Siguiente →</button>';
    }

    wrap.innerHTML = html;
    document.getElementById('adminsTableBody').closest('table').parentElement.appendChild(wrap);
}

function goToPage(page) {
    currentPage = page;
    renderAdminsTable();
    window.scrollTo({ top: document.querySelector('.table-responsive').offsetTop - 100, behavior: 'smooth' });
}

/* =========================================================
   ESTADÍSTICAS
   ========================================================= */
function updateStats() {
    var totalElem    = document.getElementById('totalAdmins');
    var activeElem   = document.getElementById('activeAdmins');
    var inactiveElem = document.getElementById('inactiveAdmins');
    if (totalElem) totalElem.textContent = adminsData.length;
    var activos = adminsData.filter(function (a) {
        return (a.Estado || 'activo').toLowerCase() === 'activo';
    }).length;
    if (activeElem)   activeElem.textContent   = activos;
    if (inactiveElem) inactiveElem.textContent = adminsData.length - activos;
}

/* =========================================================
   TÚNEL IFRAME
   ========================================================= */
function enviarViaTunel(obj, mensajeExito) {
    var form        = document.getElementById('hidden-form');
    var hiddenInput = document.getElementById('hidden-data');
    if (!form || !hiddenInput) { showToast('Error: No se encontró el túnel de envío', 'error'); return; }
    hiddenInput.value = JSON.stringify(obj);
    form.action = CONFIG.api.gestion;
    form.submit();
    if (mensajeExito) {
        setTimeout(function () { showToast(mensajeExito, 'success'); loadAdmins(); }, 2000);
    }
}

/* =========================================================
   VER/OCULTAR CONTRASEÑA
   ========================================================= */
function toggleTablePassword(btn, password) {
    var span      = btn.parentElement.querySelector('.pass-text');
    var eyeOpen   = btn.querySelector('.eye-open');
    var eyeClosed = btn.querySelector('.eye-closed');
    if (span.dataset.visible === 'false') {
        span.textContent = password; span.dataset.visible = 'true';
        eyeOpen.classList.add('hidden'); eyeClosed.classList.remove('hidden');
    } else {
        span.textContent = '••••••••'; span.dataset.visible = 'false';
        eyeOpen.classList.remove('hidden'); eyeClosed.classList.add('hidden');
    }
}

function toggleInputPassword(inputId, btn) {
    var input     = document.getElementById(inputId);
    var eyeOpen   = btn.querySelector('.eye-open');
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
   MODAL CONFIRMACIÓN
   ========================================================= */
var _confirmCallback = null;

function showConfirmModal(opts) {
    var modal         = document.getElementById('confirmModal');
    var iconContainer = document.getElementById('confirmIcon');
    var title         = document.getElementById('confirmTitle');
    var message       = document.getElementById('confirmMessage');
    var btn           = document.getElementById('confirmBtn');

    title.textContent = opts.title   || 'Confirmar';
    message.innerHTML = opts.message || '';
    btn.className     = 'flex-1 px-6 py-2.5 rounded-full transition-all font-bold text-sm cursor-pointer ' + (opts.btnClass || '');

    var iconMap = {
        create:     '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6be1e3" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
        edit:       '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6be1e3" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
        delete:     '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        deactivate: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        activate:   '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
    };
    var bgMap = {
        create: 'bg-one-cyan/20', edit: 'bg-one-cyan/20',
        delete: 'bg-red-500/20', deactivate: 'bg-red-500/20', activate: 'bg-green-500/20'
    };

    iconContainer.className = 'mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ' + (bgMap[opts.icon] || 'bg-white/10');
    iconContainer.innerHTML = iconMap[opts.icon] || '';
    _confirmCallback        = opts.onConfirm || null;

    var newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', function () {
        var cb = _confirmCallback; _confirmCallback = null;
        closeConfirmModal();
        if (typeof cb === 'function') cb();
    });

    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    void modal.offsetHeight;
    modal.classList.add('modal-visible');
}

function closeConfirmModal() {
    var modal = document.getElementById('confirmModal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    setTimeout(function () { modal.classList.add('hidden'); modal.style.display = ''; }, 300);
}

/* =========================================================
   TOASTS
   ========================================================= */
function showToast(message, type) {
    var container = document.getElementById('toastContainer');
    var toast     = document.createElement('div');
    toast.className = 'toast-item pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-xl shadow-2xl text-sm font-semibold transform translate-x-full transition-transform duration-300 ' +
        (type === 'success' ? 'bg-green-500/20 border-green-500/40 text-green-300' : 'bg-red-500/20 border-red-500/40 text-red-300');
    var icon = type === 'success'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    toast.innerHTML = icon + '<span>' + message + '</span>';
    container.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.remove('translate-x-full'); toast.classList.add('translate-x-0'); });
    setTimeout(function () {
        toast.classList.remove('translate-x-0'); toast.classList.add('translate-x-full');
        setTimeout(function () { toast.remove(); }, 300);
    }, 4000);
}

/* =========================================================
   UTILIDADES
   ========================================================= */
function sanitize(str) {
    if (typeof Helpers !== 'undefined' && Helpers.sanitizeHTML) return Helpers.sanitizeHTML(str);
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
}





