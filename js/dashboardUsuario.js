document.addEventListener('DOMContentLoaded', () => {

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'login.html';
        });
    } else {
        console.warn('⚠️ dashboardUsuario.js: no se encontró #logoutBtn en el HTML.');
    }

    try {
        const token         = localStorage.getItem('token');
        const usuarioSesion = JSON.parse(localStorage.getItem('user'));
 
        if (!token || !usuarioSesion) {
            window.location.href = 'login.html';
            return;
        }
 
        const nombreHeader = document.getElementById('nombreUsuarioHeader');
        if (nombreHeader) {
            const nombre = usuarioSesion.full_name || 'Deportista';
            nombreHeader.textContent = nombre
                .toLowerCase()
                .replace(/(^\w|\s\w)/g, m => m.toUpperCase())
                .split(' ')[0];
        }
 
    } catch (error) {
        console.error('❌ Error inicializando dashboardUsuario.js:', error);
    }
});