import API_URL from "../config.js";

export async function ActualizarCliente(data) {
    try {
        const response = await fetch(`${API_URL}/PutClientes/{id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error en el registro: ${errorMessage}`);
        }

        const result = await response.json();  // Si el backend responde con JSON
        return result;
    } catch (error) {
        console.error("Error al registrar cliente:", error);
        throw error;  // Lanza el error para que sea capturado en el formulario
    }
}

export async function ObtenerClientes() {
    try {
        const res = await fetch(`${API_URL}/api/clientes/GetClientes`, {
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
