document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:3000/api/users';
    const TOKEN   = localStorage.getItem('token');

    // dom
    const tablaBody            = document.getElementById('tablaUsuariosBody');
    const crudMessageContainer = document.getElementById('crudMessageContainer');
    const usuarioModal         = document.getElementById('usuarioModal');
    const usuarioForm          = document.getElementById('usuarioForm');
    const modalTitulo          = document.getElementById('modalTitulo');
    const btnAbrirCrear        = document.getElementById('btnAbrirCrear');
    const btnCerrarModal       = document.getElementById('btnCerrarModal');
    const btnCancelarModal     = document.getElementById('btnCancelarModal');

    // Inputs formulario
    const idInput              = document.getElementById('crudUserId');
    const nameInput            = document.getElementById('crudFullName');
    const emailInput           = document.getElementById('crudEmail');
    const roleSelect           = document.getElementById('crudRole');
    const birthInput           = document.getElementById('crudBirthDate');
    const passwordInput        = document.getElementById('crudPassword');
    const confirmPasswordInput = document.getElementById('crudConfirmPassword');
    const grupoPassword        = document.getElementById('grupoPassword');
    const grupoConfirmPassword = document.getElementById('grupoConfirmPassword');

  const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }

    if (!tablaBody || !usuarioModal || !usuarioForm || !btnAbrirCrear) {
        console.error('❌ crudUsuarios.js: Faltan elementos esenciales en el HTML (tablaUsuariosBody, usuarioModal, usuarioForm o btnAbrirCrear). Revisa que estés usando crudUsuarios.html correcto.');
        return; 
    }

    obtenerUsuarios();

    btnAbrirCrear.addEventListener('click', () => {
        limpiarFormulario();
        if (modalTitulo) modalTitulo.textContent = '➕ Registrar Nuevo Usuario';
        idInput.value = '';
        if (grupoPassword)        grupoPassword.style.display        = 'block';
        if (grupoConfirmPassword) grupoConfirmPassword.style.display = 'block';
        abrirModal();
    });

    if (btnCerrarModal)   btnCerrarModal.addEventListener('click', cerrarModal);
    if (btnCancelarModal) btnCancelarModal.addEventListener('click', cerrarModal);

    usuarioModal.addEventListener('click', (e) => {
        if (e.target === usuarioModal) cerrarModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !usuarioModal.classList.contains('modal-oculto')) {
            cerrarModal();
        }
    });

    function abrirModal() {
        usuarioModal.classList.remove('modal-oculto');
        document.body.style.overflow = 'hidden';
    }

    function cerrarModal() {
        usuarioModal.classList.add('modal-oculto');
        document.body.style.overflow = '';
    }

    // obtengo y renderizo
    async function obtenerUsuarios() {
        try {
            const respuesta = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!respuesta.ok) throw new Error('No se pudo cargar el listado de usuarios (HTTP ' + respuesta.status + ').');

            const resultado = await respuesta.json();

            let usuarios = [];
            if (Array.isArray(resultado))                    usuarios = resultado;
            else if (Array.isArray(resultado.users))         usuarios = resultado.users;
            else if (Array.isArray(resultado.data))          usuarios = resultado.data;
            else throw new Error('Formato de respuesta inesperado de la API.');

            renderizarTabla(usuarios);

        } catch (error) {
            notificacion(error.message, 'error');
        }
    }

    function renderizarTabla(usuarios) {
        tablaBody.innerHTML = '';

        if (usuarios.length === 0) {
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; padding:2rem; color:#9ca3af;">
                        No hay usuarios registrados.
                    </td>
                </tr>`;
            return;
        }

        usuarios.forEach(user => {
            const tr = document.createElement('tr');

            let fechaFormateada = 'Sin registro';
            const fechaBase = user.created_at ? new Date(user.created_at) : null;
            if (fechaBase && !isNaN(fechaBase)) {
                const d = String(fechaBase.getDate()).padStart(2, '0');
                const m = String(fechaBase.getMonth() + 1).padStart(2, '0');
                const a = fechaBase.getFullYear();
                fechaFormateada = `${d}/${m}/${a}`;
            }

            const rol = user.role || 'user';

            tr.innerHTML = `
                <td><strong>#${user.id}</strong></td>
                <td>${user.full_name || user.nombre || '-'}</td>
                <td>${user.email || '-'}</td>
                <td><span class="badge ${rol}">${rol}</span></td>
                <td>${fechaFormateada}</td>
                <td>
                    <button class="btn-accion btn-editar" title="Editar" data-id="${user.id}">✏️ Editar</button>
                    <button class="btn-accion btn-eliminar" title="Eliminar" data-id="${user.id}">🗑️ Eliminar</button>
                </td>
            `;

            tr.querySelector('.btn-editar').addEventListener('click', () => abrirEditar(user));
            tr.querySelector('.btn-eliminar').addEventListener('click', () => eliminarUsuario(user.id, user.full_name));

            tablaBody.appendChild(tr);
        });
    }

    function abrirEditar(user) {
        limpiarFormulario();
        if (modalTitulo) modalTitulo.textContent = '✏️ Editar Usuario';

        idInput.value    = user.id;
        nameInput.value  = user.full_name || user.nombre || '';
        emailInput.value = user.email || '';
        roleSelect.value = user.role || 'user';
        if (birthInput) birthInput.value = user.birth_date ? user.birth_date.substring(0, 10) : '';

        if (grupoPassword)        grupoPassword.style.display        = 'none';
        if (grupoConfirmPassword) grupoConfirmPassword.style.display = 'none';

        abrirModal();
    }

    usuarioForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        const isEditing = idInput.value !== '';
        const url       = isEditing ? `${API_URL}/${idInput.value}` : API_URL;
        const metodo    = isEditing ? 'PUT' : 'POST';

        const payload = {
            full_name:  nameInput.value.trim(),
            email:      emailInput.value.trim().toLowerCase(),
            role:       roleSelect.value,
            birth_date: birthInput ? (birthInput.value || null) : null
        };

        if (!isEditing) {
            payload.password = passwordInput.value.trim();
        }

        try {
            const respuesta = await fetch(url, {
                method: metodo,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const resultado = await respuesta.json();
            console.log('Respuesta del backend al guardar usuario:', resultado);

            if (!respuesta.ok) {
                const mensajeError = resultado.message
                    || resultado.error
                    || (Array.isArray(resultado.errors) ? resultado.errors.join(', ') : null)
                    || 'Error al procesar la solicitud.';
                throw new Error(mensajeError);
            }

            notificacion(
                isEditing ? '✨ Usuario actualizado con éxito' : '✨ Usuario creado con éxito',
                'success'
            );
            cerrarModal();
            obtenerUsuarios();

        } catch (error) {
            notificacion(error.message, 'error');
        }
    });

    // eliminar
    async function eliminarUsuario(id, nombre) {
        const confirmar = confirm(`¿Eliminar a "${nombre || 'este usuario'}"?\nEsta acción no se puede deshacer.`);
        if (!confirmar) return;

        try {
            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            const resultado = await respuesta.json();
            if (!respuesta.ok) throw new Error(resultado.message || 'No se pudo eliminar el usuario.');

            notificacion('🗑️ Usuario eliminado correctamente.', 'success');
            obtenerUsuarios();

        } catch (error) {
            notificacion(error.message, 'error');
        }
    }

    // validación
    function validarFormulario() {
        limpiarErroresVisuales();
        let esValido = true;
        const isEditing = idInput.value !== '';

        if (nameInput.value.trim() === '') {
            marcarError('crudFullName', 'errorFullName', 'El nombre completo es obligatorio');
            esValido = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            marcarError('crudEmail', 'errorEmail', 'El email es obligatorio');
            esValido = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            marcarError('crudEmail', 'errorEmail', 'Formato de correo inválido');
            esValido = false;
        }

        if (roleSelect.value === '') {
            marcarError('crudRole', 'errorRole', 'Debes asignar un rol');
            esValido = false;
        }

        if (!isEditing) {
            if (passwordInput.value.trim().length < 8) {
                marcarError('crudPassword', 'errorPassword', 'Mínimo 8 caracteres');
                esValido = false;
            }
            if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
                marcarError('crudConfirmPassword', 'errorConfirmPassword', 'Las contraseñas no coinciden');
                esValido = false;
            }
        }

        return esValido;
    }

    function marcarError(inputId, errorId, mensaje) {
        const input = document.getElementById(inputId);
        const span  = document.getElementById(errorId);
        if (input) input.classList.add('modal-input-error');
        if (span)  span.textContent = mensaje;
    }

    function limpiarErroresVisuales() {
        usuarioForm.querySelectorAll('.modal-input').forEach(i => i.classList.remove('modal-input-error'));
        usuarioForm.querySelectorAll('.modal-error-msg').forEach(e => e.textContent = '');
    }

    function limpiarFormulario() {
        usuarioForm.reset();
        limpiarErroresVisuales();
    }

    function notificacion(mensaje, tipo) {
        if (!crudMessageContainer) {
            console.log(`[${tipo}] ${mensaje}`);
            return;
        }
        const esExito = tipo === 'success';
        crudMessageContainer.innerHTML = `
            <div style="
                padding: 12px 16px;
                margin-bottom: 1rem;
                border-radius: 10px;
                font-weight: 600;
                text-align: center;
                background: ${esExito ? '#e6f7ed' : '#fde8e8'};
                color: ${esExito ? '#1e7e34' : '#721c24'};
                border: 1px solid ${esExito ? '#c3e6cb' : '#f8b4b4'};
            ">
                ${mensaje}
            </div>`;
        setTimeout(() => { crudMessageContainer.innerHTML = ''; }, 4500);
    }

});
