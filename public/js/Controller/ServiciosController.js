import {
  getServicios,
  getPaquetes,
  getProductos
} from "../services/Servicios.js";

/*
async function fetchUser() {
  try {
    const res = await fetch("http://localhost:8080/auth/cliente/me", {
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

document.addEventListener("DOMContentLoaded", async () => {
  const Servicio = document.getElementById("ServiciosList");
  
  /*const user = await fetchUser();
  
  if (!user) {
    console.error("Usuario no autenticado");
    Servicio.innerHTML = `
      <div class="error-state" style="text-align: center; padding: 60px 20px; color: #f72585;">
        <i class="fas fa-exclamation-circle" style="font-size: 4rem; margin-bottom: 20px;"></i>
        <p style="font-size: 1.2rem;">Debes iniciar sesión para ver los servicios</p>
        <button onclick="window.location.href='IniciarSesion.html'" style="margin-top: 20px; padding: 10px 20px; background: #00CED1; color: white; border: none; border-radius: 25px; cursor: pointer;">
          Iniciar Sesión
        </button>
      </div>
    `;
    return;
  }*/

  async function mostrarServicios() {
    if (!Servicio) return;
    
    try {
      let serviciosData = await getServicios();
      let servicios = serviciosData.content || [];
      
      console.log('Servicios obtenidos:', servicios);
      
      if (!servicios || servicios.length === 0) {
        Servicio.innerHTML = `
          <div class="empty-state" style="text-align: center; padding: 60px 20px; color: #6c757d;">
            <i class="fas fa-spa" style="font-size: 4rem; color: #B0E0E6; margin-bottom: 20px;"></i>
            <p style="font-size: 1.2rem;">No hay servicios disponibles</p>
          </div>
        `;
        return;
      }
      
      // IMPORTANTE: Primero crear el HTML sin eventos inline
      Servicio.innerHTML = servicios
        .map(s => `
          <div class="card servicio" 
               data-servicio-id="${s.idServicio}" 
               data-servicio-nombre="${s.nombre.replace(/"/g, '&quot;')}"
               style="cursor: pointer;">
            <img src="${s.imgUrl || 'https://via.placeholder.com/300x200?text=Servicio'}" 
                 alt="${s.nombre}" 
                 onerror="this.src='https://via.placeholder.com/300x200?text=Servicio'">
            <h3>${s.nombre}</h3>
            <p class="servicio-descripcion">${s.descripcion || 'Servicio de calidad'}</p>
            <p class="servicio-precio"><strong>Precio:</strong> $${parseFloat(s.precio).toFixed(2)}</p>
            <p class="servicio-duracion"><strong>Duración:</strong> ${s.duracion_min} min</p>
          </div>
        `).join("");
        
      // AHORA agregar eventos DESPUÉS de que el HTML esté en el DOM
      setTimeout(() => {
        const tarjetas = document.querySelectorAll('.card.servicio');
        console.log('Tarjetas encontradas:', tarjetas.length);
        
        tarjetas.forEach((tarjeta, index) => {
          // Animación de entrada
          tarjeta.style.opacity = '0';
          tarjeta.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            tarjeta.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            tarjeta.style.opacity = '1';
            tarjeta.style.transform = 'translateY(0)';
          }, index * 100);
          
          // EVENTO CLICK - Este es el que faltaba funcionar
          tarjeta.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const servicioId = this.getAttribute('data-servicio-id');
            const servicioNombre = this.getAttribute('data-servicio-nombre');
            
            console.log('Click en servicio:', servicioId, servicioNombre);
            
            // Efecto visual
            this.style.transform = 'scale(0.95)';
            
            // Navegar después del efecto
            setTimeout(() => {
              console.log('Navegando a:', `MisCitas.html?servicio=${servicioId}`);
              window.location.href = `MisCitas.html?servicio=${servicioId}`;
            }, 200);
          });
          
          // Efectos hover
          tarjeta.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 40px rgba(0, 206, 209, 0.3)';
          });
          
          tarjeta.addEventListener('mouseleave', function() {
            if (this.style.transform !== 'scale(0.95)') {
              this.style.boxShadow = '0 8px 25px rgba(0, 206, 209, 0.1)';
            }
          });
        });
      }, 100); // Pequeño delay para asegurar que el DOM esté listo
      
    } catch (error) {
      console.error("Error al cargar servicios:", error);
      Servicio.innerHTML = `
        <div class="error-state" style="text-align: center; padding: 60px 20px; color: #f72585;">
          <i class="fas fa-exclamation-triangle" style="font-size: 4rem; margin-bottom: 20px;"></i>
          <p style="font-size: 1.2rem;">Error al cargar los servicios</p>
          <p style="color: #666; margin-top: 10px;">${error.message}</p>
          <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #00CED1; color: white; border: none; border-radius: 25px; cursor: pointer;">
            Reintentar
          </button>
        </div>
      `;
    }
  }

  await mostrarServicios();
});