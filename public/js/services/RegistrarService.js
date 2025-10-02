import API_URL from '../config.js';
export async function createCliente(data) {
    try {
        const response = await fetch(`${API_URL}/api/clientes/PostClientes`, {
            method: "POST",
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


