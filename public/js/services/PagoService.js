import API_URL from "../config.js";

export async function getFacturas(page = 0, size = 8) {
    try {
        const res = await fetch(`${API_URL}/api/GetFacturasPaginadas?page=${page}&size=${size}`, {
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
