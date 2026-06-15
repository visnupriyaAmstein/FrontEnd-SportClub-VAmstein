document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api/users'; 
    const TOKEN = localStorage.getItem('token');

    // Elementos de la interfaz (DOM)
    const tablaBody = document.getElementById('tablaUsuariosBody');
    const crudMessageContainer = document.getElementById('crudMessageContainer');
    
    // Elementos del Modal y Formulario
    const usuarioModal = document.getElementById('usuarioModal');
    const usuarioForm = document.getElementById('usuarioForm');
    const modalTitulo = document.getElementById('modalTitulo');
    const btnAbrirCrear = document.getElementById('btnAbrirCrear');
    const btnCerrarModal = document.getElementById('btnCerrarModal');
    
    // Inputs del Formulario
    const idInput = document.getElementById('crudUserId');
    const nameInput = document.getElementById('crudFullName');
    const emailInput = document.getElementById('crudEmail');
    const roleSelect = document.getElementById('crudRole');
    const passwordInput = document.getElementById('crudPassword');
    const confirmPasswordInput = document.getElementById('crudConfirmPassword');

    // Grupos de contraseña (para ocultar/mostrar según corresponda)
    const grupoPassword = document.getElementById('grupoPassword');
    const grupoConfirmPassword = document.getElementById('grupoConfirmPassword');

    
    obtenerUsuarios();

    btnAbrirCrear.addEventListener('click', () => {
        limpiarFormulario();
        modalTitulo.textContent = '➕ Registrar Nuevo Usuario';
        idInput.value = ''; 
        grupoPassword.style.display = 'block';
        grupoConfirmPassword.style.display = 'block';
        
        usuarioModal.classList.remove('modal-oculto');
    });

    
    btnCerrarModal.addEventListener('click', () => {
        usuarioModal.classList.add('modal-oculto');
    });

    
    window.addEventListener('click', (e) => {
        if (e.target === usuarioModal) {
            usuarioModal.classList.add('modal-oculto');
        }
    });

    async function obtenerUsuarios() {
        try {
            const respuesta = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!respuesta.ok) throw new Error('No se pudo cargar el listado de usuarios.');

            const resultadoAPI = await respuesta.json();
            
          
            console.log("=== RESPUESTA ORIGINAL DE TU API DE USUARIOS ===");
            console.log(resultadoAPI);

            
            let arregloUsuarios = [];

            if (Array.isArray(resultadoAPI)) {
                
                arregloUsuarios = resultadoAPI;
            } else if (resultadoAPI.users && Array.isArray(resultadoAPI.users)) {
                
                arregloUsuarios = resultadoAPI.users;
            } else if (resultadoAPI.data && Array.isArray(resultadoAPI.data)) {
                
                arregloUsuarios = resultadoAPI.data;
            } else {
            
                console.error("No se detectó un formato de arreglo válido. Revisa la consola.");
                throw new Error('Estructura de respuesta inesperada de la API.');
            }

            renderizarTabla(arregloUsuarios);

        } catch (error) {
            notificacionGlobal(error.message, 'error');
        }
    }

    function renderizarTabla(usuarios) {
        tablaBody.innerHTML = '';

        if (usuarios.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay usuarios registrados.</td></tr>`;
            return;
        }

        usuarios.forEach(user => {
            const tr = document.createElement('tr');

            let fechaFormateada = 'Sin registro';
            if (user.created_at || user.birth_date) { 
                const fechaBase = new Date(user.created_at || user.birth_date);
                if (!isNaN(fechaBase)) {
                    const d = String(fechaBase.getDate()).padStart(2, '0');
                    const m = String(fechaBase.getMonth() + 1).padStart(2, '0');
                    const a = fechaBase.getFullYear();
                    fechaFormateada = `${d}/${m}/${a}`;
                }
            }

            tr.innerHTML = `
                <td><strong>${user.id}</strong></td>
                <td>${user.full_name || user.nombre}</td>
                <td>${user.email}</td>
                <td><span class="badge ${user.role}">${user.role}</span></td>
                <td>${fechaFormateada}</td>
                <td>
                    <button class="btn-accion btn-editar" data-id="${user.id}">✏️</button>
                    <button class="btn-accion btn-eliminar" data-id="${user.id}">🗑️</button>
                </td>
            `;

            tr.querySelector('.btn-editar').addEventListener('click', () => abrirEditar(user));
            tr.querySelector('.btn-eliminar').addEventListener('click', () => eliminarUsuario(user.id));

            tablaBody.appendChild(tr);
        });
    }

    function abrirEditar(user) {
        limpiarFormulario();
        modalTitulo.textContent = '✏️ Editar Usuario';
        
        // Rellenar los campos con los datos actuales
        idInput.value = user.id;
        nameInput.value = user.full_name || user.nombre;
        emailInput.value = user.email;
        roleSelect.value = user.role;

        grupoPassword.style.display = 'none';
        grupoConfirmPassword.style.display = 'none';

        usuarioModal.classList.remove('modal-oculto');
    }

    //Guardar cambios del formulario
    usuarioForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Si las validaciones visuales fallan, detenemos el envío
        if (!validarFormulario()) return;

        const isEditing = idInput.value !== '';
        const urlFinal = isEditing ? `${API_URL}/${idInput.value}` : API_URL;
        const metodo = isEditing ? 'PUT' : 'POST';

        // Construir Payload
        const payload = {
            full_name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            role: roleSelect.value
        };

        // Solo agregar contraseña si estamos creando
        if (!isEditing) {
            payload.password = passwordInput.value.trim();
        }

        try {
            const respuesta = await fetch(urlFinal, {
                method: metodo,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) throw new Error(resultado.message || 'Error al procesar la solicitud.');

            notificacionGlobal(isEditing ? '✨ Usuario actualizado con éxito' : '✨ Usuario creado con éxito', 'success');
            usuarioModal.classList.add('modal-oculto');
            obtenerUsuarios(); 

        } catch (error) {
            notificacionGlobal(error.message, 'error');
        }
    });

    // Eliminar usuario
    async function eliminarUsuario(id) {
        if (!confirm('¿Estás completamente seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;

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

            notificacionGlobal('🗑️ Usuario eliminado correctamente.', 'success');
            obtenerUsuarios(); 

        } catch (error) {
            notificacionGlobal(error.message, 'error');
        }
    }

    function validarFormulario() {
        let esValido = true;
        const isEditing = idInput.value !== '';

        // Limpiar estilos de error anteriores antes de evaluar de nuevo
        limpiarErroresVisuales();

        // Validación Nombre
        if (nameInput.value.trim() === '') {
            marcarError(nameInput, 'errorFullName', 'El nombre completo es obligatorio');
            esValido = false;
        }

        // Validación Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            marcarError(emailInput, 'errorEmail', 'El email es obligatorio');
            esValido = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            marcarError(emailInput, 'errorEmail', 'Ingresa un formato de correo válido');
            esValido = false;
        }

        // Validación Rol
        if (roleSelect.value === '') {
            marcarError(roleSelect, 'errorRole', 'Debes asignar un rol al usuario');
            esValido = false;
        }

        // Validaciones Contraseña 
        if (!isEditing) {
            if (passwordInput.value.trim() === '') {
                marcarError(passwordInput, 'errorPassword', 'La contraseña es obligatoria');
                esValido = false;
            } else if (passwordInput.value.trim().length < 8) {
                marcarError(passwordInput, 'errorPassword', 'Contraseña mínima de 8 caracteres');
                esValido = false;
            }

            if (confirmPasswordInput.value.trim() === '') {
                marcarError(confirmPasswordInput, 'errorConfirmPassword', 'Debes confirmar la contraseña');
                esValido = false;
            } else if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
                marcarError(confirmPasswordInput, 'errorConfirmPassword', 'Las contraseñas no coinciden');
                esValido = false;
            }
        }

        return esValido;
    }

    function marcarError(inputElement, spanId, mensaje) {
        inputElement.classList.add('is-invalid'); 
        const spanError = document.getElementById(spanId);
        if (spanError) {
            spanError.textContent = mensaje; 
        }
    }

    function limpiarErroresVisuales() {
        const inputs = usuarioForm.querySelectorAll('input, select');
        inputs.forEach(input => input.classList.remove('is-invalid'));

        const feedbacks = usuarioForm.querySelectorAll('.field-feedback');
        feedbacks.forEach(fb => fb.textContent = '');
    }

    function limpiarFormulario() {
        usuarioForm.reset();
        limpiarErroresVisuales();
    }

    // Mensajes flotantes informativos en el módulo
    function notificacionGlobal(mensaje, tipo) {
        crudMessageContainer.innerHTML = `
            <div class="alert alert-${tipo === 'success' ? 'success' : 'error'} visible">
                ${mensaje}
            </div>
        `;
        
        setTimeout(() => {
            crudMessageContainer.innerHTML = '';
        }, 4000);
    }
});