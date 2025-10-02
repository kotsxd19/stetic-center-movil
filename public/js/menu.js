const list = document.querySelectorAll('.list');
function activeLink() {
	list.forEach((item) =>
		item.classList.remove('active'));
	this.classList.add('active');
}
list.forEach((item) =>
	item.addEventListener('click',activeLink));

// Función para navegar con retardo
function navegarConRetardo(url) {
    // Agregar clase de carga/espera si es necesario
    document.body.style.opacity = '0.7';
    document.body.style.pointerEvents = 'none';
    
    // Esperar 1.5 segundos antes de redirigir
    setTimeout(function() {
        window.location.href = url;
    }, 1500); // 1500 milisegundos = 1.5 segundos
}


document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.list a');
    menuItems.forEach(function(item) {
        // Prevenir el comportamiento por defecto
        item.addEventListener('click', function(e) {
            e.preventDefault();   
            // Obtener el URL del enlace (puedes personalizar estos URLs)
            let url = '#';
            const text = item.querySelector('.text').textContent.toLowerCase();            
            // Asignar URLs según el texto del menú
            switch(text) {
                case 'inicio':
                    url = 'Dashboard.html';
                    break;
                case 'perfil':
                    url = 'perfil.html';
                    break;
                case 'citas':
                    url = 'MisCitas.html';
                    break;
                case 'pagos':
                    url = 'HistorialDePago.html';
                    break;
                case 'servicios':
                    url = 'Servicios.html';
                    break;
            }            
            navegarConRetardo(url);
        });
    });
});