//Se crea el DOM para esperar a que cargue todo el HTML
document.addEventListener('DOMContentLoaded', function () {
    //Se crea una variable llamada codigo que obtiene el elemento con el id 'codigoVerificacion'
    var codigo = document.getElementById('codigoVerificacion');
    //Se crea una variable llamada btn que obtiene el elemento con el id 'btn-login'
    var btn = document.getElementById('btn-login');
    //Se crea una variable llamada form que obtiene el elemento con el id 'formLogin'
    var form = document.getElementById('formLogin');
    //Se valida si las variables codigo, btn y form existen
    var usuario = document.getElementById('usuario');
    // Variable para mostrar mensajes de error
    var errorMsg = document.getElementById('errorMsg');
    
    // Variable para almacenar el código generado
    var codigoGenerado = '';
    
    //Se crea una condición que valida si alguna de las variables es nula
    if (!codigo || !btn || !form || !usuario) return;

    //Función para mostrar mensajes de error
    function showError(msg) {
        if (errorMsg) {
            errorMsg.textContent = msg;
            errorMsg.style.color = '#f72585';
            errorMsg.style.backgroundColor = 'rgba(247, 37, 133, 0.1)';
            errorMsg.style.display = 'block';
        }
    }
    
    //Función para limpiar mensajes de error
    function clearError() {
        if (errorMsg) {
            errorMsg.textContent = '';
            errorMsg.style.display = 'none';
        }
    }

    //Función para mostrar mensajes de éxito
    function showSuccess(msg) {
        if (errorMsg) {
            errorMsg.textContent = msg;
            errorMsg.style.color = '#00CED1';
            errorMsg.style.backgroundColor = 'rgba(0, 206, 209, 0.1)';
            errorMsg.style.display = 'block';
        }
    }

    //Función para generar código de 6 dígitos
    function generarCodigo() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    //Función para enviar email usando EmailJS
    function enviarCodigoEmail(email, codigoVerificacion) {
        btn.disabled = true;
        btn.textContent = 'Enviando...';

        // Parámetros para la plantilla de EmailJS
        var templateParams = {
            to_email: email,
            verification_code: codigoVerificacion,
            to_name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
        };

        // Enviar email con EmailJS - YA CONFIGURADO CON TUS CREDENCIALES
        emailjs.send('service_fdup0s6', 'template_dkiy89k', templateParams)
            .then(function(response) {
                console.log('Email enviado exitosamente!', response.status, response.text);
                showSuccess('¡Código enviado! Revisa tu correo electrónico');
                codigo.style.display = 'block';
                codigo.focus();
                btn.textContent = 'Verificar código';
                btn.disabled = false;
            }, function(error) {
                console.error('Error completo:', error);
                console.error('Status:', error.status);
                console.error('Text:', error.text);
                
                // Mensajes de error más específicos
                if (error.status === 422) {
                    showError('Error de configuración. Verifica tu servicio de EmailJS');
                } else if (error.status === 400) {
                    showError('Datos inválidos. Verifica el template');
                } else {
                    showError('Error al enviar el código. Intenta nuevamente');
                }
                
                btn.disabled = false;
                btn.textContent = 'Código verificación';
            });
    }

    //Al evento btn se le agrega un escuchador de eventos para el evento 'click'
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        
        //Si el input de codigo está oculto, validamos el correo y enviamos código
        if (codigo.style.display === 'none' || window.getComputedStyle(codigo).display === 'none') {
            var email = usuario.value.trim();
            
            // Validación simple de formato de correo
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showError('Introduce un correo electrónico con formato válido');
                usuario.focus();
                return;
            }
            
            // Generar código y enviarlo
            clearError();
            codigoGenerado = generarCodigo();
            enviarCodigoEmail(email, codigoGenerado);
            
        } else {
            // Si el código ya está visible, verificamos el código ingresado
            var codigoIngresado = codigo.value.trim();
            
            if (codigoIngresado.length !== 6) {
                showError('El código debe tener 6 dígitos');
                codigo.focus();
                return;
            }
            
            // Verificar si el código es correcto
            if (codigoIngresado === codigoGenerado) {
                showSuccess('¡Código verificado correctamente!');
                // Aquí puedes redirigir a la página para crear nueva contraseña
                setTimeout(() => {
                    var email = usuario.value.trim();
                    window.location.href = 'NuevaContraseña.html?email=' + encodeURIComponent(email);
                }, 1500);
            } else {
                showError('Código incorrecto. Intenta nuevamente');
                codigo.value = '';
                codigo.focus();
            }
        }
    });

    // Limpiar el mensaje de error al escribir en el campo de correo
    usuario.addEventListener('input', function () {
        if (errorMsg && errorMsg.style.display !== 'none') {
            clearError();
        }
    });

    // Limpiar el mensaje de error al escribir en el campo de código
    codigo.addEventListener('input', function () {
        if (errorMsg && errorMsg.style.display !== 'none') {
            clearError();
        }
    });
});