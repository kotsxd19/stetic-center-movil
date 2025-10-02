import {getFacturas } from "../services/PagoService.js";

import url from '../config.js';
async function fetchUser() {
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
}

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
  const facturasList = document.getElementById("facturasList");

  const user = await fetchUser();
  if (!user) return;

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

  await mostrarFacturas();
});
