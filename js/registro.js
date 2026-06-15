document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('fullName'); 
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const messageContainer = document.getElementById('registerMessage');

    // Captura de los nuevos inputs numéricos de fecha
    const birthDayInput = document.getElementById('birthDay');
    const birthMonthInput = document.getElementById('birthMonth');
    const birthYearInput = document.getElementById('birthYear');

    if (!registerForm || !messageContainer) {
        console.error("⚠️ Error: No se encontraron los elementos esenciales del registro en el HTML.");
        return;
    }

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        messageContainer.textContent = '';
        messageContainer.className = '';

        const full_name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (full_name === '' || email === '' || password === '') {
            mostrarError('⚠️ Por favor, completa todos los campos obligatorios.');
            return;
        }

        if (password.length < 8) {
            mostrarError('⚠️ La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            mostrarError('⚠️ Las contraseñas no coinciden. Revisa la confirmación.');
            return;
        }

        const d = birthDayInput.value.trim().padStart(2, '0');   
        const m = birthMonthInput.value.trim().padStart(2, '0'); 
        const a = birthYearInput.value.trim();

        if (!d || !m || !a || d === '00' || m === '00') {
            mostrarError('⚠️ Por favor, ingresa una fecha de nacimiento válida.');
            return;
        }

        const fechaFormateada = `${a}-${m}-${d}`; 

        try {
            const datosRegistro = {
                full_name,
                email,
                password,
                birth_date: fechaFormateada,
                role: 'user' 
            };

            const respuesta = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosRegistro)
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.message || 'Error al intentar registrar el usuario.');
            }

            mostrarExito('✨ Registro exitoso. Redirigiendo al Login...');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

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