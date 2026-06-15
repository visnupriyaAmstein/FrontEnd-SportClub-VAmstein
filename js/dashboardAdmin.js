document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ El script dashboardAdmin.js se cargó correctamente");
    const token = localStorage.getItem('token');
    let usuarioSesion = JSON.parse(localStorage.getItem('user'));

    if (!token || !usuarioSesion) {
        window.location.href = 'login.html';
        return;
    }

    // Elementos del DOM del módulo de Perfil Admin e Intercambio de Vistas
    const btnMiPerfilAdminHeader = document.getElementById('btnMiPerfilAdminHeader');
    const cardListadoMaestro = document.getElementById('cardListadoMaestro'); 
    const moduloPerfilAdminCard = document.getElementById('moduloPerfilAdminCard'); 
    
    const perfilAdminViewBlock = document.getElementById('perfilAdminViewBlock');
    const perfilAdminForm = document.getElementById('perfilAdminForm');
    const btnAdminEnableEdit = document.getElementById('btnAdminEnableEdit');
    const btnAdminCancelEdit = document.getElementById('btnAdminCancelEdit');
    const feedbackPerfilAdmin = document.getElementById('perfilAdminMessageContainer');

    // Inputs del Formulario
    const adminNameInput = document.getElementById('perfilAdminFullName');
    const adminEmailInput = document.getElementById('perfilAdminEmail');
    const adminBirthInput = document.getElementById('perfilAdminBirthDate');
    const adminCurrentPass = document.getElementById('currentAdminPassword');
    const adminNewPass = document.getElementById('newAdminPassword');
    const adminConfirmPass = document.getElementById('confirmAdminPassword');

    // Funciones de formateo y renderizado de datos
    function perfilAdminCapitalizar(txt) {
        if (!txt) return '';
        return txt.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    }

    function perfilAdminFormatearFecha(fechaString) {
        if (!fechaString) return "No registrada";
        const partes = fechaString.split('-');
        if (partes.length !== 3) return fechaString;
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function inicializarPantallaPerfilAdmin() {
        if (!usuarioSesion) return;
        
        const nombreLimpio = perfilAdminCapitalizar(usuarioSesion.full_name || 'Administrador');
        const emailLimpio = (usuarioSesion.email || 'admin@sportclub.com').toLowerCase();

        // Cargar los textos en la vista de lectura 
        if (document.getElementById('viewAdminFullName')) {
            document.getElementById('viewAdminFullName').textContent = nombreLimpio;
        }
        if (document.getElementById('viewAdminEmail')) {
            document.getElementById('viewAdminEmail').textContent = emailLimpio;
        }
        if (document.getElementById('viewAdminBirthDate')) {
            document.getElementById('viewAdminBirthDate').textContent = perfilAdminFormatearFecha(usuarioSesion.birth_date);
        }

        // Dejar los valores listos precargados en el formulario de edición
        if (adminNameInput) adminNameInput.value = nombreLimpio;
        if (adminEmailInput) adminEmailInput.value = emailLimpio;
        if (adminBirthInput) adminBirthInput.value = usuarioSesion.birth_date || '';
    }

    inicializarPantallaPerfilAdmin();

    if (btnMiPerfilAdminHeader) {
        btnMiPerfilAdminHeader.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("🖱️ Botón Perfil presionado");

            if (cardListadoMaestro) {
                console.log("✅ Ocultando listado maestro");
                cardListadoMaestro.classList.add('hidden');
            } else {
                console.error("❌ ERROR: No se encontró cardListadoMaestro");
            }
            
            if (moduloPerfilAdminCard) {
                console.log("✅ Mostrando perfil administrador");
                moduloPerfilAdminCard.classList.remove('hidden');
            } else {
                console.error("❌ ERROR: No se encontró moduloPerfilAdminCard");
            }

        });
    }

    if (btnAdminEnableEdit) {
        btnAdminEnableEdit.addEventListener('click', () => {
            perfilAdminViewBlock.classList.add('hidden');
            perfilAdminForm.classList.remove('hidden');
        });
    }

    if (btnAdminCancelEdit) {
        btnAdminCancelEdit.addEventListener('click', () => {
            perfilAdminForm.classList.add('hidden');
            perfilAdminViewBlock.classList.remove('hidden');
            limpiarErroresVisualesAdmin();
        });
    }

    function limpiarErroresVisualesAdmin() {
        if (!perfilAdminForm) return;
        perfilAdminForm.querySelectorAll('input').forEach(input => input.style.border = '1px solid #ccc');
        perfilAdminForm.querySelectorAll('.error-text').forEach(error => error.textContent = '');
    }

    // Envío y validación del formulario de cambios 
    if (perfilAdminForm) {
        perfilAdminForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            limpiarErroresVisualesAdmin();
            let esValido = true;

            // Validación de Nombre Obligatorio
            if (adminNameInput.value.trim() === '') {
                adminNameInput.style.border = '1px solid #dc3545';
                document.getElementById('errorAdminPerfilName').textContent = 'El nombre es obligatorio';
                esValido = false;
            }

            // Validación de Formato de Email
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(adminEmailInput.value.trim())) {
                adminEmailInput.style.border = '1px solid #dc3545';
                document.getElementById('errorAdminPerfilEmail').textContent = 'Email inválido';
                esValido = false;
            }

            // Validación de Fecha de Nacimiento
            if (adminBirthInput.value === '') {
                adminBirthInput.style.border = '1px solid #dc3545';
                document.getElementById('errorAdminPerfilBirth').textContent = 'La fecha de nacimiento es obligatoria';
                esValido = false;
            }

            // Validación opcional de contraseñas
            if (adminNewPass.value.length > 0 || adminCurrentPass.value.length > 0 || adminConfirmPass.value.length > 0) {
                if (adminNewPass.value.length < 8) {
                    adminNewPass.style.border = '1px solid #dc3545';
                    document.getElementById('errorAdminNewPassword').textContent = 'Mínimo 8 caracteres';
                    esValido = false;
                }
                if (adminNewPass.value !== adminConfirmPass.value) {
                    adminConfirmPass.style.border = '1px solid #dc3545';
                    document.getElementById('errorAdminConfirmPassword').textContent = 'Las contraseñas no coinciden';
                    esValido = false;
                }
            }

            if (!esValido) return;

            const payload = {
                full_name: adminNameInput.value.trim(),
                email: adminEmailInput.value.trim().toLowerCase(),
                birth_date: adminBirthInput.value
            };

            try {
                const url = `http://localhost:3000/api/users/${usuarioSesion.id}`;
                await fetch(url, {
                    method: 'PUT',
                    headers: { 
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(payload)
                });
            } catch (err) { 
                console.warn("Modo Desconectado: Respaldo de persistencia local en ejecución."); 
            }

            // Sincronizar el objeto de sesión para mantener la consistencia en el navegador
            usuarioSesion.full_name = payload.full_name;
            usuarioSesion.email = payload.email;
            usuarioSesion.birth_date = payload.birth_date;
            localStorage.setItem('user', JSON.stringify(usuarioSesion));

            // Refrescar los elementos de la interfaz de manera reactiva
            inicializarPantallaPerfilAdmin();
            perfilAdminForm.classList.add('hidden');
            perfilAdminViewBlock.classList.remove('hidden');

            // Limpiar los valores de contraseñas por seguridad
            adminCurrentPass.value = '';
            adminNewPass.value = '';
            adminConfirmPass.value = '';

            // Mostrar notificación visual exitosa temporal
            if (feedbackPerfilAdmin) {
                feedbackPerfilAdmin.innerHTML = `
                    <div style="padding:10px; margin-bottom:15px; background-color:#e6f7ed; color:#1e7e34; border:1px solid #c3e6cb; border-radius:4px; text-align:center; font-weight:bold;">
                        ✨ Perfil de administrador actualizado correctamente
                    </div>
                `;
                setTimeout(() => feedbackPerfilAdmin.innerHTML = '', 4000);
            }
        });
    }

    //Cerrar Sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }

    const linkPanelGlobal = document.querySelector('a[href="dashboardAdmin.html"]');
    if (linkPanelGlobal) {
        linkPanelGlobal.addEventListener('click', (e) => {
            if (!moduloPerfilAdminCard.classList.contains('hidden')) {
                e.preventDefault(); 
                moduloPerfilAdminCard.classList.add('hidden');
                cardListadoMaestro.classList.remove('hidden');
            }
        });
    }
});