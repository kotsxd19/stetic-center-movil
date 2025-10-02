import { 
    obtenerTodasLasCitas,
    obtenerUsuarios,
    obtenerHorarios,
    obtenerServicios,
    crearCita,
    actualizarCita,
    eliminarCita,
    verificarConflictoHorario,
    actualizarEstadisticasCitas
} from '../services/citasServices.js';

import url from '../config.js';
// Variables globales
let citasData = [];
let usuariosData = [];
let horariosData = [];
let serviciosData = [];
let usuarioActual = null;

// ===== FUNCIONES DE UTILIDAD =====
function obtenerNombreUsuario(idUsuario) {
    const usuario = usuariosData.find(u => u.idUsuario === idUsuario);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario desconocido';
}

function obtenerDescripcionHorario(idHorario) {
    const horario = horariosData.find(h => h.idHorario === idHorario);
    return horario ? horario.descripcion : 'Horario desconocido';
}

function obtenerNombreServicio(idServicio) {
    const servicio = serviciosData.find(s => s.idServicio === idServicio);
    return servicio ? servicio.nombre : 'Servicio desconocido';
}

function formatearFecha(fecha) {
    const date = new Date(fecha);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', opciones);
}

async function fetchUser() {
    try {
        const res = await fetch(`${url}/auth/cliente/me`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json", "Accept": "application/json" }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.user || data.cliente || data;
    } catch (err) {
        console.error("Error obteniendo usuario:", err);
        return null;
    }
}

function actualizarInfoUsuario() {
    if (!usuarioActual) return;
    const nombreElement = document.getElementById('clienteNombre');
    const emailElement = document.getElementById('clienteEmail');
    const avatarElement = document.getElementById('avatar');
    if (nombreElement) nombreElement.textContent = `Bienvenido, ${usuarioActual.nombre}`;
    if (emailElement) emailElement.textContent = usuarioActual.correo || usuarioActual.email || '';
    if (avatarElement && usuarioActual.nombre) avatarElement.textContent = usuarioActual.nombre.charAt(0).toUpperCase();
}

function renderizarListaCitas(citas) {
    const appointmentList = document.getElementById('appointmentList');
    if (!appointmentList) return;
    const citasDelUsuario = citas.filter(cita => cita.idCliente === usuarioActual.id && cita.estado !== 'CANCELADA' && cita.estado !== 'COMPLETADA');
    const citasOrdenadas = citasDelUsuario.sort((a, b) => new Date(a.fecha_cita) - new Date(b.fecha_cita));
    appointmentList.innerHTML = '';
    if (citasOrdenadas.length === 0) {
        appointmentList.innerHTML = `<li class="appointment-item no-appointments"><div class="appointment-info text-center"><p><i class="far fa-calendar"></i> No tienes citas programadas</p></div></li>`;
        return;
    }
    citasOrdenadas.forEach(cita => {
        const li = document.createElement('li');
        li.className = `appointment-item status-${cita.estado.toLowerCase()}`;
        const estadoBadge = `<span class="badge badge-${cita.estado.toLowerCase()}">${cita.estado}</span>`;
        li.innerHTML = `
            <div class="appointment-date"><div class="date-box"><span class="day">${new Date(cita.fecha_cita).getDate()}</span><span class="month">${new Date(cita.fecha_cita).toLocaleDateString('es-ES', { month: 'short' })}</span></div></div>
            <div class="appointment-info"><h4>${obtenerNombreServicio(cita.idServicio)}</h4><p><i class="fas fa-user-md"></i> ${obtenerNombreUsuario(cita.idUsuario)}</p><p><i class="fas fa-clock"></i> ${obtenerDescripcionHorario(cita.idHorario)}</p><p><i class="fas fa-calendar"></i> ${formatearFecha(cita.fecha_cita)}</p>${estadoBadge}</div>
            <div class="appointment-actions">${cita.estado === 'PENDIENTE' ? `<button class="btn btn-success btn-sm" onclick="confirmarCita(${cita.idCita})" title="Confirmar"><i class="fas fa-check"></i></button><button class="btn btn-warning btn-sm" onclick="editarCita(${cita.idCita})" title="Editar"><i class="fas fa-edit"></i></button>` : ''}${cita.estado !== 'CANCELADA' && cita.estado !== 'COMPLETADA' ? `<button class="btn btn-danger btn-sm" onclick="cancelarCita(${cita.idCita})" title="Cancelar"><i class="fas fa-times"></i></button>` : ''}</div>
        `;
        appointmentList.appendChild(li);
    });
}

function poblarDropdownUsuarios() {
    const BoxEmpleado = document.getElementById('usuario');
    if (!BoxEmpleado) return;
    BoxEmpleado.innerHTML = '<option value="">Seleccionar doctor</option>';
    usuariosData.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario.idUsuario;
        option.textContent = `${usuario.nombre} ${usuario.apellido}`;
        BoxEmpleado.appendChild(option);
    });
}

function poblarDropdownHorarios() {
    const BoxHorario = document.getElementById('horario');
    if (!BoxHorario) return;
    BoxHorario.innerHTML = '<option value="">Seleccionar horario</option>';
    horariosData.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario.idHorario;
        option.textContent = horario.descripcion;
        BoxHorario.appendChild(option);
    });
}

function poblarDropdownServicios() {
    const BoxServicio = document.getElementById('servicio');
    if (!BoxServicio) return;
    BoxServicio.innerHTML = '<option value="">Seleccionar servicio</option>';
    serviciosData.forEach(servicio => {
        const option = document.createElement('option');
        option.value = servicio.idServicio;
        option.textContent = servicio.nombre;
        BoxServicio.appendChild(option);
    });
}

async function cargarDatosIniciales() {
    try {
        showLoader(true);
        const [citas, usuarios, horarios, servicios] = await Promise.all([
            obtenerTodasLasCitas(),
            obtenerUsuarios(),
            obtenerHorarios(),
            obtenerServicios()
        ]);
        citasData = citas;
        usuariosData = usuarios;
        horariosData = horarios;
        serviciosData = servicios;
        poblarDropdownUsuarios();
        poblarDropdownHorarios();
        poblarDropdownServicios();
        window.usuariosData = usuarios;
        window.horariosData = horarios;
        window.serviciosData = servicios;
        window.citasData = citas;
        window.obtenerNombreUsuario = obtenerNombreUsuario;
        window.obtenerDescripcionHorario = obtenerDescripcionHorario;
        window.obtenerNombreServicio = obtenerNombreServicio;
        window.formatearFecha = formatearFecha;
        actualizarInfoUsuario();
        const todasLasCitasDelUsuario = citas.filter(cita => parseInt(cita.idCliente) === parseInt(usuarioActual.id));
        await actualizarEstadisticasCitas(todasLasCitasDelUsuario);
        renderizarListaCitas(citas);
        if (window.calendar) {
            const citasActivasDelUsuario = todasLasCitasDelUsuario.filter(c => c.estado !== 'CANCELADA');
            window.calendar.appointments = citasActivasDelUsuario;
            window.calendar.render();
        }
        if (window.actualizarDatosGlobalesCalendario) {
            window.actualizarDatosGlobalesCalendario(usuarios, horarios, servicios);
        }
        // IMPORTANTE: Verificar servicio preseleccionado DESPUÉS de cargar los datos
        verificarServicioPreseleccionado();
    } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        mostrarError('Error al cargar los datos iniciales');
    } finally {
        showLoader(false);
    }
}

// ===== VERIFICAR SERVICIO PRESELECCIONADO - VERSIÓN CORREGIDA =====
function verificarServicioPreseleccionado() {
    const urlParams = new URLSearchParams(window.location.search);
    const servicioId = urlParams.get('servicio');
    console.log('[DEBUG] URL actual:', window.location.href);
    console.log('[DEBUG] Parámetro servicio:', servicioId);
    if (servicioId) {
        setTimeout(() => {
            const modal = document.getElementById('appointment-modal');
            const servicioSelect = document.getElementById('servicio');
            console.log('[DEBUG] Modal encontrado:', !!modal);
            console.log('[DEBUG] Select encontrado:', !!servicioSelect);
            if (modal && servicioSelect) {
                servicioSelect.value = servicioId;
                console.log('[DEBUG] Servicio seleccionado:', servicioSelect.value);
                modal.style.display = 'flex';
                console.log('[DEBUG] Modal abierto');
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                console.error('[ERROR] No se encontró el modal o el select');
            }
        }, 800);
    }
}

window.confirmarCita = async function(idCita) {
    const confirmado = await window.confirmarGuardado('¿Confirmar esta cita?');
    if (!confirmado) return;
    try {
        showLoader(true);
        const cita = citasData.find(c => c.idCita === idCita);
        if (!cita) throw new Error('Cita no encontrada');
        const citaActualizada = { ...cita, estado: 'CONFIRMADA' };
        await actualizarCita(idCita, citaActualizada);
        mostrarExito('Cita confirmada exitosamente');
        await cargarDatosIniciales();
    } catch (error) {
        mostrarError('Error al confirmar la cita: ' + error.message);
    } finally {
        showLoader(false);
    }
};

window.cancelarCita = async function(idCita) {
    const confirmado = await window.confirmarCancelacion();
    if (!confirmado) return;
    try {
        showLoader(true);
        const cita = citasData.find(c => c.idCita === idCita);
        if (!cita) throw new Error('Cita no encontrada');
        const citaActualizada = { ...cita, estado: 'CANCELADA' };
        await actualizarCita(idCita, citaActualizada);
        mostrarExito('Cita cancelada exitosamente');
        await cargarDatosIniciales();
    } catch (error) {
        mostrarError('Error al cancelar la cita: ' + error.message);
    } finally {
        showLoader(false);
    }
};

window.editarCita = function(idCita) {
    const cita = citasData.find(c => c.idCita === idCita);
    if (!cita) return;
    const modal = document.getElementById('appointment-modal');
    document.getElementById('IdCita').value = cita.idCita;
    document.getElementById('usuario').value = cita.idUsuario;
    document.getElementById('servicio').value = cita.idServicio;
    document.getElementById('date').value = new Date(cita.fecha_cita).toISOString().split('T')[0];
    document.getElementById('horario').value = cita.idHorario;
    modal.style.display = 'flex';
};

async function manejarSubmitFormulario(e) {
    e.preventDefault();
    const idCita = document.getElementById('IdCita').value;
    const idUsuario = parseInt(document.getElementById('usuario').value);
    const idServicio = parseInt(document.getElementById('servicio').value);
    const fecha_cita = document.getElementById('date').value;
    const idHorario = parseInt(document.getElementById('horario').value);
    if (!idUsuario || !idServicio || !fecha_cita || !idHorario) {
        mostrarError('Por favor complete todos los campos');
        return;
    }
    if (verificarConflictoHorario(citasData, fecha_cita, idUsuario, idHorario, idCita || null)) {
        mostrarError('Ya existe una cita para este doctor en el horario seleccionado');
        return;
    }
    const citaData = { idUsuario, idServicio, idCliente: usuarioActual.id, fecha_cita, idHorario, estado: 'PENDIENTE' };
    try {
        showLoader(true);
        if (idCita) {
            await actualizarCita(parseInt(idCita), { ...citaData, idCita: parseInt(idCita) });
            mostrarExito('Cita actualizada exitosamente');
        } else {
            await crearCita(citaData);
            mostrarExito('Cita creada exitosamente');
        }
        document.getElementById('appointment-modal').style.display = 'none';
        document.getElementById('appointment-form').reset();
        await cargarDatosIniciales();
    } catch (error) {
        mostrarError(error.message || 'Error al procesar la cita');
    } finally {
        showLoader(false);
    }
}

function mostrarExito(mensaje) { mostrarNotificacion(mensaje, 'success'); }
function mostrarError(mensaje) { mostrarNotificacion(mensaje, 'error'); }
function mostrarNotificacion(mensaje, tipo = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo === 'error' ? 'danger' : tipo === 'success' ? 'success' : 'info'}`;
    alertDiv.textContent = mensaje;
    alertDiv.style.cssText = `position: fixed; top: 20px; right: 20px; z-index: 10000; min-width: 300px; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideInRight 0.3s ease;`;
    document.body.appendChild(alertDiv);
    setTimeout(() => { if (alertDiv.parentNode) alertDiv.remove(); }, 5000);
}

function showLoader(show) {
    let loader = document.getElementById('citas-loader');
    if (show && !loader) {
        loader = document.createElement('div');
        loader.id = 'citas-loader';
        loader.innerHTML = `<div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;"><div style="background: white; padding: 20px; border-radius: 8px; text-align: center;"><div style="border: 4px solid #f3f3f3; border-top: 4px solid #00CED1; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 0 auto 10px;"></div><p>Procesando...</p></div></div><style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}</style>`;
        document.body.appendChild(loader);
    } else if (!show && loader) {
        loader.remove();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    usuarioActual = await fetchUser();
    if (!usuarioActual) {
        mostrarError('No se pudo obtener la información del usuario');
        return;
    }
    const form = document.getElementById('appointment-form');
    const modal = document.getElementById('appointment-modal');
    const btnAdd = document.getElementById('new-appointment-btn');
    const closeBtns = document.querySelectorAll('.close-modal');
    if (btnAdd) {
        btnAdd.addEventListener('click', () => {
            form.reset();
            document.getElementById('IdCita').value = "";
            modal.style.display = 'flex';
        });
    }
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => { modal.style.display = 'none'; });
    });
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
    if (form) form.addEventListener('submit', manejarSubmitFormulario);
    await cargarDatosIniciales();
});