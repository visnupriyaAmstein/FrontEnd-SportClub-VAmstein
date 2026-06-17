document.addEventListener('DOMContentLoaded', () => {

    const btnLogout = document.getElementById('btnCerrarSesion');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'login.html';
        });
    } else {
        console.warn('⚠️ dashboardCoach.js: no se encontró #btnCerrarSesion en esta página.');
    }

    try {
        const token         = localStorage.getItem('token');
        const usuarioSesion = JSON.parse(localStorage.getItem('user'));
 
        if (!token || !usuarioSesion) {
            window.location.href = 'login.html';
            return;
        }
    } catch (error) {
        console.error('❌ Error inicializando dashboardCoach.js:', error);
    }
});