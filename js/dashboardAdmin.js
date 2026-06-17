document.addEventListener('DOMContentLoaded', () => {
 
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'login.html';
        });
    } else {
        console.warn('⚠️ dashboardAdmin.js: no se encontró #logoutBtn en esta página.');
    }
 
    try {
        const token         = localStorage.getItem('token');
        const usuarioSesion = JSON.parse(localStorage.getItem('user'));
 
        if (!token || !usuarioSesion) {
            window.location.href = 'login.html';
            return;
        }
    } catch (error) {
        console.error('❌ Error inicializando dashboardAdmin.js:', error);
    }
});