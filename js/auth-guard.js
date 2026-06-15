(function() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const requiredRole = window.requiredRole;

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    if (requiredRole && userRole !== requiredRole) {
        alert('No tienes permisos para acceder a esta sección.');
        if (userRole === 'admin') window.location.href = 'dashboardAdmin.html';
        else if (userRole === 'coach') window.location.href = 'dashboardCoach.html';
        else window.location.href = 'dashboardUsuario.html';
        return;
    }
})();