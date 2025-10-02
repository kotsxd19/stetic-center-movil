import { apiGet } from './api.js';

async function login(correo, contrasena) {
const resp = await apiGet('/api/clientes/GetClientes');
  const data = resp.data || resp || [];
  const match = data.find(c =>
    (c.correo || c.CORREO || c.email) === correo &&
    (c.contrasenaCliente || c.CONTRASENACLIENTE || c.password) === contrasena
  );
  if (!match) throw new Error('Correo o contraseña incorrectos');
  localStorage.setItem('cliente', JSON.stringify(match));
  return match;
}

function logout() {
  localStorage.removeItem('cliente');
  window.location.href = 'IniciarSesion.html';
}

export { login, logout };