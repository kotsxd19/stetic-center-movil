const API_URL = "http://localhost:8080/";

// ===== GET METHODS =====

export async function obtenerTodasLasCitas() {
    try {
        const response = await fetch(`${API_URL}ApiCitas/GetCitas`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Error al obtener citas");
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error en obtenerTodasLasCitas:", error);
        return [];
    }
}

export async function obtenerUsuarios() {
    try {
        const response = await fetch(`${API_URL}api/Usuario/GetUsers`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Error al obtener Usuarios");
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error en obtenerUsuarios:", error);
        return [];
    }
}

export async function obtenerClientes() {
    try {
        const response = await fetch(`${API_URL}api/clientes/GetClientes`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Error al obtener Clientes");
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error en obtenerClientes:", error);
        return [];
    }
}

export async function obtenerHorarios() {
    try {
        const response = await fetch(`${API_URL}ApiHorario/GetHorario`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Error al obtener Horario");
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error en obtenerHorarios:", error);
        return [];
    }
}

export async function obtenerServicios() {
    try {
        const response = await fetch(`${API_URL}ApiServicios/ConsultarServicios`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Error al obtener Servicios");
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error en obtenerServicios:", error);
        return [];
    }
}

// ===== POST METHOD =====

export async function crearCita(citaData) {
    try {
        console.log('Datos originales de la cita:', citaData);

        const response = await fetch(`${API_URL}ApiCitas/PostCitas`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(citaData)
        });
        
        const data = await response.json();
        console.log('Respuesta del servidor (status ' + response.status + '):', data);
        
        if (!response.ok) {
            if (response.status === 400) {
                if (typeof data === 'object' && !data.message && !data.detail) {
                    const errores = Object.entries(data)
                        .map(([campo, mensaje]) => `${campo}: ${mensaje}`)
                        .join('\n');
                    throw new Error('Errores de validación:\n' + errores);
                }
            }
            
            if (data.message) throw new Error(data.message);
            if (data.detail) throw new Error(data.detail);
            throw new Error("Error al crear la cita");
        }
        
        return data;
    } catch (error) {
        console.error("Error en crearCita:", error);
        throw error;
    }
}

// ===== PUT METHOD =====

export async function actualizarCita(id, citaData) {
    try {
        console.log('Actualizando cita ID ' + id + ':', citaData);

        const response = await fetch(`${API_URL}ApiCitas/PutCitas/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(citaData)
        });
        
        const data = await response.json();
        console.log('Respuesta del servidor (status ' + response.status + '):', data);
        
        if (!response.ok) {
            if (response.status === 400) {
                if (typeof data === 'object' && !data.message && !data.detail) {
                    const errores = Object.entries(data)
                        .map(([campo, mensaje]) => `${campo}: ${mensaje}`)
                        .join('\n');
                    throw new Error('Errores de validación:\n' + errores);
                }
            }
            
            if (data.message) throw new Error(data.message);
            if (data.detail) throw new Error(data.detail);
            if (data.error) throw new Error(data.error);
            throw new Error("Error al actualizar la cita");
        }
        
        return data;
    } catch (error) {
        console.error("Error en actualizarCita:", error);
        throw error;
    }
}

// ===== DELETE METHOD =====

export async function eliminarCita(id) {
    try {
        const response = await fetch(`${API_URL}ApiCitas/DeleteCitas/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (data.message) throw new Error(data.message);
            throw new Error("Error al eliminar la cita");
        }
        
        return data;
    } catch (error) {
        console.error("Error en eliminarCita:", error);
        throw error;
    }
}

// ===== FUNCIONES DE UTILIDAD =====

export function verificarConflictoHorario(citas, fechaCita, idUsuario, idHorario, idCitaExcluir = null) {
    const fechaStr = new Date(fechaCita).toDateString();
    
    return citas.some(cita => {
        if (idCitaExcluir && cita.idCita === idCitaExcluir) return false;
        
        const citaFechaStr = new Date(cita.fecha_cita).toDateString();
        return citaFechaStr === fechaStr && 
               cita.idUsuario === idUsuario &&
               cita.idHorario === idHorario && 
               cita.estado !== 'CANCELADA';
    });
}

export function actualizarEstadisticasCitas(citas) {
    try {
        
        const totals = obtenerTotalesCitas(citas);
        
        console.log('Totales calculados:', totals);
        
        // Actualizar por ID directo (lo más confiable)
        const idsPendientes = ['citasPendientes', 'pendiente'];
        const idsCompletadas = ['citasCompletadas', 'Completados'];
        const idsCanceladas = ['citasCanceladas', 'Canceladas'];
        const idsConfirmadas = ['Confirmadas'];
        
        idsPendientes.forEach(id => {
            const elem = document.getElementById(id);
            if (elem) {
                elem.textContent = totals.pendientes;
                console.log(`✓ Actualizado ${id}: ${totals.pendientes}`);
            }
        });
        
        idsCompletadas.forEach(id => {
            const elem = document.getElementById(id);
            if (elem) {
                elem.textContent = totals.completadas;
                console.log(`✓ Actualizado ${id}: ${totals.completadas}`);
            }
        });
        
        idsCanceladas.forEach(id => {
            const elem = document.getElementById(id);
            if (elem) {
                elem.textContent = totals.canceladas;
                console.log(`✓ Actualizado ${id}: ${totals.canceladas}`);
            }
        });
        
        idsConfirmadas.forEach(id => {
            const elem = document.getElementById(id);
            if (elem) {
                elem.textContent = totals.confirmadas;
                console.log(`✓ Actualizado ${id}: ${totals.confirmadas}`);
            }
        });
        
        
    } catch (error) {
        console.error('Error actualizando estadísticas:', error);
    }
}


export function obtenerTotalesCitas(citas) {
    if (!Array.isArray(citas)) {
        console.error('Se esperaba un array de citas');
        return { completadas: 0, pendientes: 0, canceladas: 0, confirmadas: 0 };
    }


    let completadas = 0;
    let pendientes = 0;
    let canceladas = 0;
    let confirmadas = 0;

    citas.forEach((cita, index) => {
        const estado = String(cita.estado || "").toUpperCase().trim();
        
        
        if (estado === "COMPLETADA") completadas++;
        else if (estado === "PENDIENTE") pendientes++;
        else if (estado === "CANCELADA") canceladas++;
        else if (estado === "CONFIRMADA") confirmadas++;
    });

    
    return { completadas, pendientes, canceladas, confirmadas };
}

export function generarReporteEstadisticas(citas) {
    const totalCitas = citas.length;
    const totalesPorEstado = obtenerTotalesCitas(citas);
    const citasDelMes = obtenerCitasDelMes(citas);
    const proximasCitas = obtenerProximasCitas(citas);
    
    return {
        total: totalCitas,
        porEstado: totalesPorEstado,
        delMesActual: citasDelMes.length,
        proximasSemana: proximasCitas.length,
        tasaConfirmacion: totalCitas > 0 ? ((totalesPorEstado.confirmadas + totalesPorEstado.completadas) / totalCitas * 100).toFixed(1) : 0,
        tasaCancelacion: totalCitas > 0 ? (totalesPorEstado.canceladas / totalCitas * 100).toFixed(1) : 0
    };
}

export function obtenerCitasDelMes(citas) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return citas.filter(cita => {
        const citaDate = new Date(cita.fecha_cita);
        return citaDate.getMonth() === currentMonth && citaDate.getFullYear() === currentYear;
    });
}

export function obtenerProximasCitas(citas) {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    return citas
        .filter(cita => {
            const citaDate = new Date(cita.fecha_cita);
            return citaDate >= now && citaDate <= nextWeek && cita.estado !== 'CANCELADA';
        })
        .sort((a, b) => new Date(a.fecha_cita) - new Date(b.fecha_cita));
}

export function obtenerCitasPorEstado(citas, estado) {
    return citas.filter(cita => 
        cita.estado.toUpperCase() === estado.toUpperCase()
    );
}