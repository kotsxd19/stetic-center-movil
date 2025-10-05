document.addEventListener('DOMContentLoaded', function () {
    var nuevaContraseña = document.getElementById('nuevaContraseña');
    var confirmarContraseña = document.getElementById('confirmarContraseña');
    var btn = document.getElementById('btn-cambiar');
    var form = document.getElementById('formNuevaContraseña');
    var errorMsg = document.getElementById('errorMsg');
    
    // Obtener el email de la URL
    var urlParams = new URLSearchParams(window.location.search);
    var email = urlParams.get('email');
    
    // Si no hay email, redirigir
    if (!email) {
        window.location.href = 'RecuperarContraseña.html';
        return;
    }
    
    if (!nuevaContraseña || !confirmarContraseña || !btn || !form) return;

    function showError(msg) {
        if (errorMsg) {
            errorMsg.textContent = msg;
            errorMsg.style.color = '#f72585';
            errorMsg.style.backgroundColor = 'rgba(247, 37, 133, 0.1)';
            errorMsg.style.display = 'block';
        }
    }
    
    function clearError() {
        if (errorMsg) {
            errorMsg.textContent = '';
            errorMsg.style.display = 'none';
        }
    }

    function showSuccess(msg) {
        if (errorMsg) {
            errorMsg.textContent = msg;
            errorMsg.style.color = '#00CED1';
            errorMsg.style.backgroundColor = 'rgba(0, 206, 209, 0.1)';
            errorMsg.style.display = 'block';
        }
    }

    // Función para cambiar la contraseña en la base de datos
    async function cambiarContraseña(email, contraseña) {
        try {
            // Aquí debes hacer una petición a tu backend para cambiar la contraseña
            // Ejemplo con fetch:
            /*
            const response = await fetch('tu-api/cambiar-contraseña', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email, 
                    nuevaContraseña: contraseña 
                })
            });
            const data = await response.json();
            return data.success;
            */
            
            // Por ahora simulo que funciona
            // IMPORTANTE: Reemplaza esto con tu lógica real de base de datos
            return true;
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            return false;
        }
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        var contraseña = nuevaContraseña.value.trim();
        var confirmar = confirmarContraseña.value.trim();
        
        // Validaciones
        if (contraseña.length < 6) {
            showError('La contraseña debe tener al menos 6 caracteres');
            nuevaContraseña.focus();
            return;
        }
        
        if (contraseña !== confirmar) {
            showError('Las contraseñas no coinciden');
            confirmarContraseña.focus();
            return;
        }
        
        // Cambiar contraseña
        clearError();
        btn.disabled = true;
        btn.textContent = 'Cambiando...';
        
        const exito = await cambiarContraseña(email, contraseña);
        
        if (exito) {
            showSuccess('¡Contraseña cambiada exitosamente!');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        } else {
            showError('Error al cambiar la contraseña. Intenta nuevamente');
            btn.disabled = false;
            btn.textContent = 'Cambiar Contraseña';
        }
    });

    // Limpiar errores al escribir
    nuevaContraseña.addEventListener('input', clearError);
    confirmarContraseña.addEventListener('input', clearError);
});