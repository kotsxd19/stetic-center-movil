const API_BASE = "http://localhost:8080";

export async function getClientes() {
    try {
        const res = await fetch(`${API_BASE}/api/clientes/GetClientes`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error("Error al obtener clientes");
        const data = await res.json();
        return Array.isArray(data) ? data : data.content || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getServicios(page = 0, size = 8) {
    try {
        const res = await fetch(`${API_BASE}/ApiServicios/GetServiciosPaginados?page=${page}&size=${size}`, {
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

export async function getCitas(page = 0, size = 8) {
    try {
        const res = await fetch(`${API_BASE}/ApiCitas/GetCitasPaginadas?page=${page}&size=${size}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error("Error al obtener citas");
        const data = await res.json();
        return Array.isArray(data.content) ? data : { content: [] };
    } catch (error) {
        console.error(error);
        return { content: [] };
    }
}


export async function getFacturas(page = 0, size = 8) {
    try {
        const res = await fetch(`${API_BASE}/api/GetFacturasPaginadas?page=${page}&size=${size}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error("Error al obtener facturas");
        const data = await res.json();
        return Array.isArray(data.content) ? data : { content: [] };
    } catch (error) {
        console.error(error);
        return { content: [] };
    }
}
