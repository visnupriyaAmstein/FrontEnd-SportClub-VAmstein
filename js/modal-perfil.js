(function () {

    const API_BASE = 'http://localhost:3000/api/auth';
    const MODAL_HTML = `
    <div id="modalPerfilOverlay" class="modal-overlay modal-oculto" role="dialog" aria-modal="true" aria-labelledby="modalPerfilTitulo">
        <div class="modal-card">

            <header class="modal-header">
                <h2 id="modalPerfilTitulo">👤 Mi Perfil</h2>
                <span class="btn-modal-close" id="btnCerrarModalPerfil" title="Cerrar">&times;</span>
            </header>

            <div class="modal-body">

                <div id="modalPerfilFeedback"></div>

                <div id="modalPerfilViewBlock">
                    <div class="modal-perfil-avatar-row">
                        <div class="modal-perfil-avatar">👤</div>
                        <div>
                            <h3 id="modalViewFullName" class="modal-perfil-nombre">-</h3>
                            <span id="modalViewRoleBadge" class="badge">-</span>
                        </div>
                    </div>

                    <p class="modal-perfil-dato"><strong>📧 Email:</strong> <span id="modalViewEmail">-</span></p>
                    <p class="modal-perfil-dato"><strong>📅 Nacimiento:</strong> <span id="modalViewBirthDate">-</span></p>

                    <button type="button" id="modalBtnEnableEdit" class="btn-primary modal-btn-full">✏️ Editar Perfil</button>
                </div>

                <form id="modalPerfilForm" class="hidden" novalidate>

                    <p class="modal-seccion-titulo">📝 Datos Personales</p>

                    <div class="modal-form-group">
                        <label class="modal-label">Nombre Completo</label>
                        <input type="text" id="modalInputName" class="modal-input" placeholder="Tu nombre completo">
                        <small id="modalErrorName" class="modal-error-msg"></small>
                    </div>

                    <div class="modal-form-group">
                        <label class="modal-label">Correo Electrónico <span class="modal-opcional">(no editable)</span></label>
                        <input type="email" id="modalInputEmailDisabled" class="modal-input modal-input-disabled" disabled>
                    </div>

                    <div class="modal-form-group">
                        <label class="modal-label">Fecha de Nacimiento</label>
                        <input type="date" id="modalInputBirthDate" class="modal-input">
                        <small id="modalErrorBirth" class="modal-error-msg"></small>
                    </div>

                    <hr class="modal-divider">
                    <p class="modal-seccion-titulo">🔒 Cambiar Contraseña <span class="modal-opcional">(opcional)</span></p>

                    <div class="modal-form-group">
                        <label class="modal-label">Contraseña Actual</label>
                        <input type="password" id="modalInputCurrentPass" class="modal-input" placeholder="Tu contraseña actual">
                    </div>

                    <div class="modal-form-group">
                        <label class="modal-label">Nueva Contraseña <span class="modal-opcional">(mín. 8 caracteres)</span></label>
                        <input type="password" id="modalInputNewPass" class="modal-input" placeholder="Nueva contraseña">
                        <small id="modalErrorNewPass" class="modal-error-msg"></small>
                    </div>

                    <div class="modal-form-group">
                        <label class="modal-label">Confirmar Contraseña</label>
                        <input type="password" id="modalInputConfirmPass" class="modal-input" placeholder="Repite la nueva contraseña">
                        <small id="modalErrorConfirmPass" class="modal-error-msg"></small>
                    </div>

                    <div class="modal-footer-btns">
                        <button type="submit" class="btn-primary modal-btn-guardar">💾 Guardar Cambios</button>
                        <button type="button" id="modalBtnCancelEdit" class="btn-modal-cancel">Cancelar</button>
                    </div>

                </form>
            </div>

        </div>
    </div>
    `;

    function init() {
        document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

        const overlay          = document.getElementById('modalPerfilOverlay');
        const btnCerrar        = document.getElementById('btnCerrarModalPerfil');
        const feedback         = document.getElementById('modalPerfilFeedback');
        const viewBlock        = document.getElementById('modalPerfilViewBlock');
        const form             = document.getElementById('modalPerfilForm');
        const btnEnableEdit    = document.getElementById('modalBtnEnableEdit');
        const btnCancelEdit    = document.getElementById('modalBtnCancelEdit');
        const titulo           = document.getElementById('modalPerfilTitulo');

        const viewName  = document.getElementById('modalViewFullName');
        const viewEmail = document.getElementById('modalViewEmail');
        const viewBirth = document.getElementById('modalViewBirthDate');
        const viewRole  = document.getElementById('modalViewRoleBadge');

        const inputName          = document.getElementById('modalInputName');
        const inputEmailDisabled = document.getElementById('modalInputEmailDisabled');
        const inputBirth         = document.getElementById('modalInputBirthDate');
        const inputCurrentPass   = document.getElementById('modalInputCurrentPass');
        const inputNewPass       = document.getElementById('modalInputNewPass');
        const inputConfirmPass   = document.getElementById('modalInputConfirmPass');

        const errorName        = document.getElementById('modalErrorName');
        const errorBirth       = document.getElementById('modalErrorBirth');
        const errorNewPass     = document.getElementById('modalErrorNewPass');
        const errorConfirmPass = document.getElementById('modalErrorConfirmPass');
        const token = localStorage.getItem('token');

        function capitalizar(txt) {
            if (!txt) return '';
            return txt.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase());
        }

        function formatearFecha(str) {
            if (!str) return 'No registrada';
            const soloFecha = str.split('T')[0];
            const p = soloFecha.split('-');
            if (p.length !== 3) return str;
            return `${p[2]}/${p[1]}/${p[0]}`;
        }

        function tituloSegunRol(rol) {
            const titulos = {
                admin: '🛡️ Mi Perfil — Administrador',
                coach: '🏋️ Mi Perfil — Coach',
                user:  '👤 Mi Perfil — Usuario'
            };
            return titulos[rol] || '👤 Mi Perfil';
        }

        function mostrarFeedback(mensaje, tipo = 'success') {
            const colores = {
                success: { bg: '#e6f7ed', color: '#1e7e34', border: '#c3e6cb' },
                error:   { bg: '#fde8e8', color: '#721c24', border: '#f8b4b4' }
            };
            const c = colores[tipo];
            feedback.innerHTML = `
                <div style="padding:10px 14px; margin-bottom:14px; border-radius:8px;
                            background:${c.bg}; color:${c.color}; border:1px solid ${c.border};
                            font-weight:600; text-align:center;">
                    ${mensaje}
                </div>`;
            setTimeout(() => { feedback.innerHTML = ''; }, 4000);
        }

        function limpiarErrores() {
            [inputName, inputBirth, inputNewPass, inputConfirmPass].forEach(i => {
                i.classList.remove('modal-input-error');
            });
            [errorName, errorBirth, errorNewPass, errorConfirmPass].forEach(e => {
                e.textContent = '';
            });
        }

        function marcarError(input, spanError, mensaje) {
            input.classList.add('modal-input-error');
            spanError.textContent = mensaje;
        }

        let perfilActual = null;

        async function cargarPerfilDesdeAPI() {
            if (!token) {
                console.error('❌ modal-perfil.js: No hay token en localStorage. El usuario no inició sesión correctamente.');
                perfilActual = null;
                return;
            }

            try {
                const respuesta = await fetch(`${API_BASE}/me`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!respuesta.ok) throw new Error('No se pudo obtener el perfil (HTTP ' + respuesta.status + ')');

                const resultado = await respuesta.json();
                perfilActual = resultado.user || resultado.data || resultado;

                localStorage.setItem('user', JSON.stringify(perfilActual));

            } catch (error) {
                console.warn('⚠️ No se pudo conectar a /api/auth/me:', error.message, '— intentando usar localStorage como respaldo.');
                const respaldoLocal = localStorage.getItem('user');
                perfilActual = respaldoLocal ? JSON.parse(respaldoLocal) : null;

                if (!perfilActual) {
                    console.error('❌ modal-perfil.js: Tampoco hay datos en localStorage.user. No hay nada que mostrar.');
                }
            }
        }

        function renderizarVista() {
            if (!perfilActual) return;

            const nombre = capitalizar(perfilActual.full_name || 'Usuario');
            const email  = (perfilActual.email || '').toLowerCase();
            const rol    = (perfilActual.role || 'user').toLowerCase().trim();

            titulo.textContent    = tituloSegunRol(rol);
            viewName.textContent  = nombre;
            viewEmail.textContent = email;
            viewBirth.textContent = formatearFecha(perfilActual.birth_date);
            viewRole.textContent  = rol;
            viewRole.className    = `badge ${rol}`;

            inputName.value          = nombre;
            inputEmailDisabled.value = email;
            inputBirth.value         = perfilActual.birth_date ? perfilActual.birth_date.split('T')[0] : '';
        }

        async function abrirModal() {
            feedback.innerHTML = '<div style="text-align:center; padding:1rem; color:#888;">Cargando perfil...</div>';
            overlay.classList.remove('modal-oculto');
            document.body.style.overflow = 'hidden';

            await cargarPerfilDesdeAPI();
            feedback.innerHTML = '';

            if (!perfilActual) {
                mostrarFeedback('No se pudo cargar tu perfil. Verifica tu sesión.', 'error');
                return;
            }

            renderizarVista();
            viewBlock.classList.remove('hidden');
            form.classList.add('hidden');
            limpiarErrores();
        }

        function cerrarModal() {
            overlay.classList.add('modal-oculto');
            document.body.style.overflow = '';
        }

        const botonesApertura = [
            'btnMiPerfilHeader',
            'btnMiPerfilAdminHeader',
            'btnMiPerfilCoachHeader'
        ];

        let botonEncontrado = false;
        botonesApertura.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                botonEncontrado = true;
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    abrirModal();
                });
            }
        });

        if (!botonEncontrado) {
            console.warn('⚠️ modal-perfil.js: No se encontró ningún botón de apertura en esta página.');
        }

        btnCerrar.addEventListener('click', cerrarModal);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) cerrarModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !overlay.classList.contains('modal-oculto')) {
                cerrarModal();
            }
        });

        btnEnableEdit.addEventListener('click', () => {
            viewBlock.classList.add('hidden');
            form.classList.remove('hidden');
            limpiarErrores();
            inputCurrentPass.value = '';
            inputNewPass.value     = '';
            inputConfirmPass.value = '';
        });

        btnCancelEdit.addEventListener('click', () => {
            form.classList.add('hidden');
            viewBlock.classList.remove('hidden');
            limpiarErrores();
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            limpiarErrores();
            let valido = true;

            if (inputName.value.trim() === '') {
                marcarError(inputName, errorName, 'El nombre es obligatorio');
                valido = false;
            }

            if (inputBirth.value === '') {
                marcarError(inputBirth, errorBirth, 'La fecha de nacimiento es obligatoria');
                valido = false;
            }

            const quiereCambiarPass = inputCurrentPass.value.length > 0
                                    || inputNewPass.value.length > 0
                                    || inputConfirmPass.value.length > 0;

            if (quiereCambiarPass) {
                if (inputNewPass.value.length < 8) {
                    marcarError(inputNewPass, errorNewPass, 'Mínimo 8 caracteres');
                    valido = false;
                }
                if (inputNewPass.value !== inputConfirmPass.value) {
                    marcarError(inputConfirmPass, errorConfirmPass, 'Las contraseñas no coinciden');
                    valido = false;
                }
            }

            if (!valido) return;

            if (!perfilActual) {
                mostrarFeedback('No hay datos de perfil cargados. Cierra y vuelve a abrir el modal.', 'error');
                return;
            }

            const payloadDatos = {
                full_name:  inputName.value.trim(),
                birth_date: inputBirth.value
            };

            try {
                const respuesta = await fetch(`${API_BASE}/me`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payloadDatos)
                });

                const resultado = await respuesta.json();
                if (!respuesta.ok) throw new Error(resultado.message || 'No se pudo actualizar el perfil');

                perfilActual.full_name  = payloadDatos.full_name;
                perfilActual.birth_date = payloadDatos.birth_date;

            } catch (err) {
                console.warn('⚠️ Falló PUT /api/auth/me, guardando solo localmente:', err.message);
                perfilActual.full_name  = payloadDatos.full_name;
                perfilActual.birth_date = payloadDatos.birth_date;
            }

            localStorage.setItem('user', JSON.stringify(perfilActual));

            if (quiereCambiarPass) {
                try {
                    const respuestaPass = await fetch(`${API_BASE}/me/password`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            current_password: inputCurrentPass.value,
                            new_password: inputNewPass.value,
                            confirm_password: inputConfirmPass.value
                        })
                    });

                    const resultadoPass = await respuestaPass.json();
                    console.log('Respuesta del backend al cambiar contraseña:', resultadoPass);

                    if (!respuestaPass.ok) {
                        mostrarFeedback(resultadoPass.message || resultadoPass.error || 'No se pudo cambiar la contraseña', 'error');
                        inputCurrentPass.value = '';
                        return;
                    }

                } catch (err) {
                    console.error('Error de red al cambiar contraseña:', err);
                    mostrarFeedback('No se pudo conectar para cambiar la contraseña', 'error');
                    return;
                }
            }

            inputCurrentPass.value = '';
            inputNewPass.value     = '';
            inputConfirmPass.value = '';

            form.classList.add('hidden');
            viewBlock.classList.remove('hidden');
            renderizarVista();

            const headerNombre = document.getElementById('nombreUsuarioHeader');
            if (headerNombre) headerNombre.textContent = capitalizar(perfilActual.full_name).split(' ')[0];

            mostrarFeedback('✨ Perfil actualizado correctamente');
        });

    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
