import { ActualizarCliente, ObtenerClientes } from '../services/PerfilService.js';
import urlApi from '../config.js';

// Función para obtener datos del usuario autenticado
/*async function fetchUser() {
  try {
    
    const res = await fetch(`${urlApi}/auth/cliente/me`, {
      method: "GET",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json" 
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch (err) {
    console.error("Error obteniendo usuario:", err);
    return null;
  }
}*/

// Función para cerrar sesión
async function logout() {
  try {
    const res = await fetch(`${urlApi}/auth/cliente/logout`, {
      method: "POST",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json" 
      }
    });

    if (res.ok) {
      // Limpiar cualquier dato almacenado localmente
      localStorage.removeItem('cliente');
      sessionStorage.clear();
      
      // Mostrar mensaje de éxito con SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión exitosamente',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#667eea',
        timer: 2000,
        timerProgressBar: true
      }).then(() => {
        // Redirigir al login o página principal
        window.location.href = 'IniciarSesion.html'; // Ajusta según tu página de login
      });
    } else {
      throw new Error('Error al cerrar sesión');
    }
  } catch (err) {
    console.error("Error cerrando sesión:", err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cerrar sesión. Por favor intenta de nuevo.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#f5576c'
    });
  }
}

// Funciones auxiliares
function el(selector) {
  return document.querySelector(selector);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function apiSend(method, url, payload) {
  const res = await fetch(`http://localhost:8080${url}`, {
    method: method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Error ${method} ${url}`);
  return res.json();
}

function setForm(c) {
  el('#fnombre').value = c.nombreCompleto || c.NOMBRECOMPLETO || '';
  el('#fcorreo').value = c.correo || c.CORREO || '';
  el('#fdireccion').value = c.direccion || c.DIRECCION || '';
}

// Event Listener principal
document.addEventListener('DOMContentLoaded', async() => {
  const nombre = document.getElementById("nombre");
  const correo = document.getElementById("correo");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  
  // Obtener usuario actual
  /*const user = await fetchUser();
  
  if (!user) {
    // Si no hay usuario autenticado, redirigir al login
    window.location.href = 'IniciarSesion.html';
    return;
  }
    
  
  const c = user;
  

   if (nombre) nombre.textContent = user.nombre;
  if (correo) correo.textContent = user.correo;
  */
  
  
  
  // Mostrar información del usuario
 
  
  // Event listener para cerrar sesión
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', async () => {
      const confirmLogout = await mostrarConfirmacion({
        title: 'Cerrar Sesión',
        message: '¿Estás seguro que deseas cerrar sesión?',
        icon: 'fa-sign-out-alt',
        confirmText: 'Sí, cerrar sesión',
        cancelText: 'Cancelar',
        type: 'danger'
      });
      
      if (confirmLogout) {
        await logout();
      }
    });
  }
  
  // Event listener para editar perfil
  el('#btnEditar')?.addEventListener('click', () => {
    setForm(c);
    el('#editModal').showModal();
  });
  
  // Event listener para cambiar contraseña
  el('#btnChangePass')?.addEventListener('click', () => {
    el('#pcorreo').value = '';
    el('#pnueva').value = '';
    el('#passModal').showModal();
  });
  
  // Guardar cambios de perfil
  el('#saveEdit')?.addEventListener('click', async () => {
    const nombre = el('#fnombre').value.trim();
    const correo = el('#fcorreo').value.trim();
    const dir = el('#fdireccion').value.trim();
    
    if (!nombre || !correo || !dir) {
      alert('Completa todos los campos');
      return;
    }
    
    if (!validateEmail(correo)) {
      alert('Correo inválido');
      return;
    }
    
    const id = c.idCliente || c.IDCLIENTE;
    const payload = {
      idCliente: id,
      nombreCompleto: nombre,
      correo: correo,
      direccion: dir,
      contrasenaCliente: c.contrasenaCliente || c.CONTRASENACLIENTE || null
    };
    
    try {
      await apiSend('PUT', `/api/clientes/PutClientes/${id}`, payload);
      const updated = { ...c, ...payload };
      localStorage.setItem('cliente', JSON.stringify(updated));
      el('#editModal').close();
      alert('Perfil actualizado');
      
      // Actualizar UI
      if (nombre) nombre.textContent = updated.nombreCompleto;
      if (correo) correo.textContent = updated.correo;
    } catch(e) { 
      console.error(e); 
      alert('No se pudo actualizar'); 
    }
  });
  
  // Guardar cambio de contraseña
  el('#savePass')?.addEventListener('click', async () => {
    const email = el('#pcorreo').value.trim();
    const nueva = el('#pnueva').value.trim();
    
    if (!validateEmail(email)) {
      alert('Correo inválido');
      return;
    }
    
    const currentEmail = c.correo || c.CORREO || '';
    if (email.toLowerCase() !== currentEmail.toLowerCase()) {
      alert('El correo debe coincidir con el de tu cuenta');
      return;
    }
    
    if (nueva.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    const id = c.idCliente || c.IDCLIENTE;
    const payload = {
      idCliente: id,
      nombreCompleto: c.nombreCompleto || c.NOMBRECOMPLETO,
      correo: currentEmail,
      direccion: c.direccion || c.DIRECCION,
      contrasenaCliente: nueva
    };
    
    try {
      await apiSend('PUT', `/api/clientes/PutClientes/${id}`, payload);
      const updated = { ...c, contrasenaCliente: nueva };
      localStorage.setItem('cliente', JSON.stringify(updated));
      el('#passModal').close();
      alert('Contraseña actualizada');
    } catch(e) { 
      console.error(e); 
      alert('No se pudo cambiar la contraseña'); 
    }
  });
});