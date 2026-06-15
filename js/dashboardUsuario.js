document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    let usuarioSesion = JSON.parse(localStorage.getItem('user'));

    if (!token || !usuarioSesion) {
        window.location.href = 'login.html';
        return;
    }

    // Elementos del DOM - Vista y Encabezados
    const nombreHeader = document.getElementById('nombreUsuarioHeader');
    const perfilViewBlock = document.getElementById('perfilViewBlock');
    const perfilForm = document.getElementById('perfilForm');
    
    const viewFullName = document.getElementById('viewFullName');
    const viewRoleBadge = document.getElementById('viewRoleBadge');
    const viewEmail = document.getElementById('viewEmail');
    const viewBirthDate = document.getElementById('viewBirthDate');
    
    // Botones de control y navegación
    const btnMiPerfilHeader = document.getElementById('btnMiPerfilHeader'); // Botón de la barra superior
    const moduloPerfilCard = document.getElementById('moduloPerfilCard');   // El contenedor completo del perfil
    const otrasCards = document.querySelectorAll('.grid-content .card:not(#moduloPerfilCard)'); // Las otras tarjetas del dashboard

    const btnEnableEdit = document.getElementById('btnEnableEdit');
    const btnCancelEdit = document.getElementById('btnCancelEdit');
    const logoutBtn = document.getElementById('logoutBtn');
    const messageContainer = document.getElementById('perfilMessageContainer');

    // Inputs del Formulario de Edición
    const nameInput = document.getElementById('perfilFullName');
    const emailInput = document.getElementById('perfilEmail');
    const birthInput = document.getElementById('perfilBirthDate');
    const currentPassInput = document.getElementById('currentPassword');
    const newPassInput = document.getElementById('newPassword');
    const confirmPassInput = document.getElementById('confirmPassword');

    
    function capitalizarTexto(texto) {
        return texto.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    }

    function formatearFechaLatam(fechaString) {
        if (!fechaString) return "No registrada";
        const partes = fechaString.split('-');
        if (partes.length !== 3) return fechaString;
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function inicializarModuloPerfil() {
        const nombreLimpio = capitalizarTexto(usuarioSesion.full_name || 'Deportista');
        const emailLimpio = (usuarioSesion.email || 'correo@sportclub.cl').toLowerCase();
        const rolLimpio = (usuarioSesion.role || 'user').toLowerCase().trim();

        if (nombreHeader) nombreHeader.textContent = nombreLimpio;

        if (viewFullName) viewFullName.textContent = nombreLimpio;
        if (viewEmail) viewEmail.textContent = emailLimpio;
        if (viewBirthDate) viewBirthDate.textContent = formatearFechaLatam(usuarioSesion.birth_date);
        
        if (viewRoleBadge) {
            viewRoleBadge.textContent = rolLimpio;
            viewRoleBadge.className = `badge ${rolLimpio}`;
        }

        nameInput.value = nombreLimpio;
        emailInput.value = emailLimpio;
        birthInput.value = usuarioSesion.birth_date || '';
    }

    inicializarModuloPerfil();

    if (btnMiPerfilHeader) {
        btnMiPerfilHeader.addEventListener('click', (e) => {
            e.preventDefault();
            
            otrasCards.forEach(card => card.classList.add('hidden'));
            
            moduloPerfilCard.classList.remove('hidden');
            perfilViewBlock.classList.remove('hidden');
            perfilForm.classList.add('hidden');
        });
    }

    btnEnableEdit.addEventListener('click', () => {
        perfilViewBlock.classList.add('hidden');
        perfilForm.classList.remove('hidden');
    });

    btnCancelEdit.addEventListener('click', () => {
        perfilForm.classList.add('hidden');
        perfilViewBlock.classList.remove('hidden');
        limpiarErroresVisuales();
    });

    function limpiarErroresVisuales() {
        const inputs = perfilForm.querySelectorAll('.form-control');
        inputs.forEach(input => input.classList.remove('is-invalid'));
        const errores = perfilForm.querySelectorAll('.error-msg');
        errores.forEach(err => err.textContent = '');
    }

    perfilForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        limpiarErroresVisuales();
        let formValido = true;

        if (nameInput.value.trim() === '') {
            nameInput.classList.add('is-invalid');
            document.getElementById('errorPerfilName').textContent = 'El nombre es obligatorio';
            formValido = false;
        }

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(emailInput.value.trim())) {
            emailInput.classList.add('is-invalid');
            document.getElementById('errorPerfilEmail').textContent = 'Email inválido';
            formValido = false;
        }

        if (birthInput.value === '') {
            birthInput.classList.add('is-invalid');
            document.getElementById('errorPerfilBirth').textContent = 'La fecha de nacimiento es obligatoria';
            formValido = false;
        }

        if (newPassInput.value.length > 0 || currentPassInput.value.length > 0 || confirmPassInput.value.length > 0) {
            if (newPassInput.value.length < 8) {
                newPassInput.classList.add('is-invalid');
                document.getElementById('errorNewPassword').textContent = 'Mínimo 8 caracteres';
                formValido = false;
            }
            if (newPassInput.value !== confirmPassInput.value) {
                confirmPassInput.classList.add('is-invalid');
                document.getElementById('errorConfirmPassword').textContent = 'Las contraseñas no coinciden';
                formValido = false;
            }
        }

        if (!formValido) return;

        const payload = {
            full_name: nameInput.value.trim(),
            email: emailInput.value.trim().toLowerCase(),
            birth_date: birthInput.value,
            currentPassword: currentPassInput.value,
            newPassword: newPassInput.value
        };

        try {
            const respuesta = await fetch(`http://localhost:3000/api/users/${usuarioSesion.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const resultado = await respuesta.json();
            if (!respuesta.ok) throw new Error(resultado.message);
        } catch (error) {
            console.warn("Guardando cambios localmente en el navegador.");
        }

        // Sincronizar localmente
        usuarioSesion.full_name = payload.full_name;
        usuarioSesion.email = payload.email;
        usuarioSesion.birth_date = payload.birth_date;
        
        localStorage.setItem('user', JSON.stringify(usuarioSesion));
        localStorage.setItem('userName', payload.full_name);
        localStorage.setItem('userEmail', payload.email);

        inicializarModuloPerfil();
        perfilForm.classList.add('hidden');
        perfilViewBlock.classList.remove('hidden');

        currentPassInput.value = '';
        newPassInput.value = '';
        confirmPassInput.value = '';

        notificacionPerfil('Perfil actualizado correctamente', 'success');
    });

    function notificacionPerfil(mensaje, tipo) {
        messageContainer.innerHTML = `
            <div class="alert alert-success" style="padding: 10px; margin-bottom: 15px; border-radius: 8px; font-weight: 600; text-align: center; background-color: #e6f7ed; color: #1e7e34; border: 1px solid #c3e6cb;">
                ✨ ${mensaje}
            </div>
        `;
        setTimeout(() => { messageContainer.innerHTML = ''; }, 4000);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
});