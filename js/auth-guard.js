(function() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const requiredRole = window.requiredRole;

    // 1. Si no hay token, para afuera inmediatamente
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Si hay token, pero la página exige un rol específico y el usuario no lo tiene
    if (requiredRole && userRole !== requiredRole) {
        alert('No tienes permisos para acceder a esta sección.');
        
        // Lo redirigimos a SU dashboard correcto según el rol que sí tiene
        if (userRole === 'admin') window.location.href = 'dashboardAdmin.html';
        else if (userRole === 'coach') window.location.href = 'dashboardCoach.html';
        else window.location.href = 'dashboardUsuario.html';
        return;
    }
})();