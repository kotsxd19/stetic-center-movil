import url from './config.js';
document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('btn-login');
    const passwordInput = document.getElementById('password');
    const ForgotPasswordButton = document.getElementById('btn-contraseñaOlvidada');

    if (ForgotPasswordButton) {
        ForgotPasswordButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'RecuperarContraseña.html';
        });



    if (loginButton) {
        loginButton.addEventListener('click', async function(e) {
            
            e.preventDefault();
            
            const usernameInput = document.getElementById('usuario');

            if (!usernameInput || !passwordInput) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Interfaz',
                    text: 'Error en la interfaz. Por favor, recarga la página.',
                });
                return;
            }

            const correo = usernameInput.value.trim();
            const contrasena = passwordInput.value.trim();

            // Validación de campos vacíos
            if (!correo || !contrasena) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos Vacíos',
                    text: 'Por favor, ingresa tus credenciales completas (correo y contraseña).',
                });
                return;
            }

           
            try {
                
                const response = await fetch(`${url}/auth/cliente/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include', // Importante para que la cookie authToken se guarde
                    body: JSON.stringify({ correo, contrasena })
                });

                // El backend debe enviar la cookie authToken si las credenciales son correctas
                if (response.ok) {
                    // Puedes mostrar mensaje de éxito o redirigir
                    Swal.fire({
                        icon: 'success',
                        title: 'Inicio de sesión exitoso',
                        text: 'Bienvenido al sistema.',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = 'Dashboard.html';
                    });
                } else {
                    const errorText = await response.text();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de inicio de sesión',
                        text: errorText.includes('Credenciales') ? 'Credenciales incorrectas.' : errorText,
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Conexión',
                    text: 'No se pudo conectar con el servidor. Intenta más tarde.',
                });
            }
        });
    } else {
        console.error("Error: Botón de inicio de sesión no encontrado.");
    }

    
}});