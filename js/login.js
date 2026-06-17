document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageContainer = document.getElementById('loginMessage');

    if (!loginForm || !emailInput || !passwordInput || !messageContainer) {
        console.error("⚠️ Error: No se encontraron los elementos del formulario en el HTML.");
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        messageContainer.textContent = '';
        messageContainer.className = '';

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (email === '' || password === '') {
            mostrarError('⚠️ Por favor, ingresa tu correo y contraseña.');
            return;
        }

        try {
            const respuesta = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.message || 'Credenciales incorrectas.');
            }

            let token = null;
            let role = null;
            let displayName = null; 

            if (datos.data) {
                token = datos.data.token;
                if (datos.data.user) {
                    role = datos.data.user.role;
                    displayName = datos.data.user.full_name || 
                                  datos.data.user.fullName || 
                                  datos.data.user.name || 
                                  email || 
                                  'Usuario';
                }
            }

            if (!token || !role) {
                console.error("Revisión interna de datos:", datos);
                throw new Error('El servidor no devolvió el token o el rol esperado.');
            }

            localStorage.clear(); 
            
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', role.toLowerCase().trim());
            localStorage.setItem('userName', displayName);
            localStorage.setItem('userEmail', email); 

            const userObj = {
                id: (datos.data.user && datos.data.user.id) ? datos.data.user.id : "generico-123",
                full_name: displayName,
                email: email,
                role: role.toLowerCase().trim(),
                birth_date: (datos.data.user && datos.data.user.birth_date) ? datos.data.user.birth_date : "2000-01-01"
            };
            localStorage.setItem('user', JSON.stringify(userObj));

            mostrarExito('✨ Ingreso exitoso. Redirigiendo a tu panel...');

            setTimeout(() => {
                const userRole = role.toLowerCase().trim();

                if (userRole === 'admin') {
                    window.location.href = 'dashboardAdmin.html';
                } else if (userRole === 'coach') {
                    window.location.href = 'dashboardCoach.html';
                } else if (userRole === 'user') {
                    window.location.href = 'dashboardUsuario.html';
                } else {
                    mostrarError(`Rol no reconocido en el sistema: "${userRole}"`);
                }
            }, 1500);

        } catch (error) {
            mostrarError(error.message);
        }
    });

    function mostrarError(mensaje) {
        messageContainer.textContent = mensaje;
        messageContainer.className = 'alert alert-error visible';
        messageContainer.style.color = '#dc3545';
    }

    function mostrarExito(mensaje) {
        messageContainer.textContent = mensaje;
        messageContainer.className = 'alert alert-success visible';
        messageContainer.style.color = '#28a745';
    }
});