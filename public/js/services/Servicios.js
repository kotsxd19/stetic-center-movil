const API_URLS = "http://localhost:8080/";


export async function getServicios(page = 0, size = 8) {
  try {
      const res = await fetch(`${API_URLS}ApiServicios/GetServiciosPaginados?page=${page}&size=${size}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Error al obtener servicios");
      const data = await res.json();
      return Array.isArray(data.content) ? data : { content: [] };
  } catch (error) {
      console.error(error);
      return { content: [] };
  }
}

export async function getPaquetes(page = 0, size = 8) {
  try {
      const res = await fetch(`${API_URLS}api/paquetes/GetServiciosPaginados?page=${page}&size=${size}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Error al obtener Paquetes");
      const data = await res.json();
      return Array.isArray(data.content) ? data : { content: [] };
  } catch (error) {
      console.error(error);
      return { content: [] };
  }
}

export async function getProductos(page = 0, size = 8) {
  try {
      const res = await fetch(`${API_URLS}api/productos/GetProductosPaginado?page=${page}&size=${size}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Error al obtener Productos");
      const data = await res.json();
      return Array.isArray(data.content) ? data : { content: [] };
  } catch (error) {
      console.error(error);
      return { content: [] };
  }
}