import { getClientes, getServicios, getCitas, getFacturas } from "../services/dashboardService.js";

import url from '../config.js';

/*async function fetchUser() {
  try {
    const res = await fetch(`${url}/auth/cliente/me`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json", "Accept": "application/json" }
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch (err) {
    console.error("Error obteniendo usuario:", err);
    return null;
  }
}*/

function formatFecha(fechaStr) {
  const fecha = new Date(fechaStr);
  const day = String(fecha.getDate()).padStart(2, '0');
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const year = fecha.getFullYear();
  const hours = String(fecha.getHours()).padStart(2, '0');
  const minutes = String(fecha.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

document.addEventListener('DOMContentLoaded', async () => {
  const citasList = document.getElementById("citasList-citas");
  const historialList = document.getElementById("historial-citas");
  const serviciosList = document.getElementById("serviciosList");
  const facturasList = document.getElementById("facturasList");
  const clienteNombre = document.getElementById("clienteNombre");
  const clienteEmail = document.getElementById("clienteEmail");

  /*const user = await fetchUser();
  if (!user) return;*/

  /*if (clienteNombre) clienteNombre.textContent = user.nombre;
  if (clienteEmail) clienteEmail.textContent = user.correo;*/

  async function mostrarServicios() {
    if (!serviciosList) return;
    let serviciosData = await getServicios();
    let servicios = serviciosData.content || [];
    if (!servicios || servicios.length === 0) {
      serviciosList.innerHTML = `<p>No hay servicios disponibles</p>`;
      return;
    }
    serviciosList.innerHTML = servicios
      .map(s => `
        <div class="card servicio">
          <img src="${s.imgUrl || 'https://via.placeholder.com/150'}" alt="${s.nombre}" style="width:100%; border-radius:8px; margin-bottom:8px;">
          <h3>${s.nombre}</h3>
          <p>Precio: $${s.precio}</p>
          <p>Duración: ${s.duracion_min} min</p>
        </div>
      `).join("");
  }

  async function mostrarCitas() {
    if (!citasList || !historialList) return;
    try {
      const citasData = await getCitas();
      const citas = citasData.content || [];
      const proximas = citas.filter(c => c.idCliente === Number(user.id) && c.estado === "PENDIENTE");
      const completadas = citas.filter(c => c.idCliente === Number(user.id) && c.estado === "COMPLETADA");
      citasList.innerHTML = proximas.length
        ? proximas.map(ci => `
            <div class="card cita pendiente" style="background-color:#E0F7FA; color:#006064; padding:12px; border-radius:8px; margin-bottom:8px;">
              <strong>Fecha:</strong> ${formatFecha(ci.fecha_cita)}<br>
              <strong>Estado:</strong> ${ci.estado}
            </div>
          `).join("")
        : `<p style="font-size:16px; color:#555;">No hay próximas citas</p>`;
      historialList.innerHTML = completadas.length
        ? completadas.map(ci => `
            <div class="card cita completada" style="background-color:#E8F5E9; color:#2E7D32; padding:12px; border-radius:8px; margin-bottom:8px;">
              <strong>Fecha:</strong> ${formatFecha(ci.fecha_cita)}<br>
              <strong>Estado:</strong> ${ci.estado}
            </div>
          `).join("")
        : `<p style="font-size:16px; color:#555;">No hay historial de citas</p>`;
    } catch (error) {
      console.error("Error cargando citas:", error);
      citasList.innerHTML = `<p style="color:red;">Error al cargar próximas citas</p>`;
      historialList.innerHTML = `<p style="color:red;">Error al cargar historial de citas</p>`;
    }
  }

  async function mostrarFacturas() {
    if (!facturasList) return;
    try {
      const facturasData = await getFacturas();
      const facturas = facturasData.content || [];
      const filtradas = facturas.filter(f => f.idCliente === Number(user.id));
      if (!filtradas || filtradas.length === 0) {
        facturasList.innerHTML = `<p style="font-size:16px; color:#555;">No hay facturas</p>`;
        return;
      }
      facturasList.innerHTML = filtradas
        .map(f => `
          <div class="card factura" style="background-color:#FFF3E0; color:#E65100; padding:12px; border-radius:8px; margin-bottom:8px;">
            <strong>Factura #${f.idFactura}</strong><br>
            <strong>Total:</strong> $${f.total}<br>
            <strong>Fecha:</strong> ${formatFecha(f.fecha)}<br>
            <strong>Estado:</strong> ${f.estado}
          </div>
        `).join("");
    } catch (error) {
      console.error("Error cargando facturas:", error);
      facturasList.innerHTML = `<p style="color:red;">Error al cargar facturas</p>`;
    }
  }

  await mostrarServicios();
  await mostrarCitas();
  await mostrarFacturas();
});
