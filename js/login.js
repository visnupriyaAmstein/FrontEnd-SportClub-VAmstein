const users = [
    // Roles de Clientes
    { user: "user1@sportclub.cl", fullname: "user user", password: "1234", role: "user" },
    { user: "user2@sportclub.cl", fullname: "Pedro Droguett", password: "1234", role: "user" }, 

    // Roles de Entrenadores 
    { user: "coach1@sportclub.cl", fullname: "coach coach", password: "1234", role: "coach" },
    { user: "coach2@sportclub.cl", fullname: "María González", password: "1234", role: "coach" }, 

    // Roles de Administración 
    { user: "admin1@sportclub.cl", fullname: "admin admin", password: "1234", role: "admin" },
    { user: "admin2@sportclub.cl", fullname: "Carlos Silva", password: "1234", role: "admin" } 
];

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    
    loginMessage.textContent = "";

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    const matchedUser = users.find(u => u.user === emailValue && u.password === passwordValue);

    if (matchedUser) {

        const sessionUser = {
            user: matchedUser.user,
            fullname: matchedUser.fullname,
            role: matchedUser.role
        };
        localStorage.setItem("user", JSON.stringify(sessionUser));

        // Ejecutar redirección según el rol correspondiente
        redirectByRole(matchedUser.role);
    } else {
        // mensaje error 
        loginMessage.textContent = "Credenciales incorrectas";
    }
});

// Función encargada de la redirección
function redirectByRole(role) {
    switch (role) {
        case "user":
            window.location.href = "dashboardUsuario.html";
            break;
        case "coach":
            window.location.href = "dashboardCoach.html";
            break;
        case "admin":
            window.location.href = "dashboardAdmin.html";
            break;
        default:
            loginMessage.textContent = "Error: Rol de usuario no reconocido.";
            break;
    }
};