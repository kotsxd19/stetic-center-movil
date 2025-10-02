// citasCalendar.js - Actualizado para trabajar con datos del backend

// Calendar functionality actualizado
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.today = new Date();
        this.months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        // Los appointments ahora vienen del backend
        this.appointments = [];
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        // Hacer disponible globalmente para que el controlador pueda actualizarlo
        window.calendar = this;
    }

    bindEvents() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        const todayBtn = document.getElementById('todayBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.render();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.render();
            });
        }

        if (todayBtn) {
            todayBtn.addEventListener('click', () => {
                this.currentDate = new Date();
                this.render();
            });
        }
    }

    render() {
        this.renderHeader();
        this.renderDays();
        // Solo renderizar la lista si NO existe ya el appointmentList manejado por el controlador
        if (!document.getElementById('appointmentList')) {
            this.renderAppointmentsList();
        }
    }

    renderHeader() {
        const monthYear = `${this.months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        const currentMonthElement = document.getElementById('currentMonth');
        if (currentMonthElement) {
            currentMonthElement.textContent = monthYear;
        }
    }

    renderDays() {
        const daysGrid = document.getElementById('daysGrid');
        if (!daysGrid) return;

        daysGrid.innerHTML = '';

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dayElement = document.createElement('div');
            dayElement.textContent = date.getDate();

            // Agregar clases según las condiciones
            if (date.getMonth() !== this.currentDate.getMonth()) {
                dayElement.classList.add('other-month');
            }

            if (this.isSameDay(date, this.today)) {
                dayElement.classList.add('current-day');
            }

            if (this.hasAppointment(date)) {
                dayElement.classList.add('has-appointment');
                // Agregar indicador visual de que hay cita
                const indicator = document.createElement('div');
                indicator.className = 'appointment-indicator';
                indicator.style.cssText = `
                    width: 6px; 
                    height: 6px; 
                    background: #007bff; 
                    border-radius: 50%; 
                    position: absolute; 
                    bottom: 2px; 
                    right: 2px;
                `;
                dayElement.style.position = 'relative';
                dayElement.appendChild(indicator);
            }

            dayElement.addEventListener('click', () => {
                // Remover selección previa
                document.querySelectorAll('.days-grid div').forEach(d => d.classList.remove('selected'));
                dayElement.classList.add('selected');
                
                // Mostrar detalles si hay cita
                if (this.hasAppointment(date)) {
                    this.showAppointmentDetails(date);
                } else {
                    this.selectDate(date);
                }
            });

            daysGrid.appendChild(dayElement);
        }
    }

    renderAppointmentsList() {
        // Esta función ya no se usa porque el controlador maneja la lista
        console.log('Lista de citas manejada por el controlador');
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    hasAppointment(date) {
        return this.appointments.some(appointment => {
            const appointmentDate = new Date(appointment.fecha_cita);
            return this.isSameDay(date, appointmentDate);
        });
    }

    getAppointment(date) {
        return this.appointments.find(appointment => {
            const appointmentDate = new Date(appointment.fecha_cita);
            return this.isSameDay(date, appointmentDate);
        });
    }

    selectDate(date) {
        console.log('Fecha seleccionada:', date);
        // Aquí puedes agregar lógica adicional para cuando se selecciona una fecha sin citas
    }

    showAppointmentDetails(date) {
        const appointment = this.getAppointment(date);
        if (!appointment) return;

        // Crear modal de detalles
        const modal = document.createElement('div');
        modal.className = 'appointment-detail-modal';
        modal.style.cssText = `
            display: flex;
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            align-items: center;
            justify-content: center;
        `;

        // Usar las funciones del controlador si están disponibles, sino usar funciones seguras
        const serviceName = (window.obtenerNombreServicio && window.serviciosData && window.serviciosData.length > 0) 
            ? window.obtenerNombreServicio(appointment.idServicio)
            : this.obtenerNombreServicioSeguro(appointment.idServicio);
            
        const timeSlot = (window.obtenerDescripcionHorario && window.horariosData && window.horariosData.length > 0)
            ? window.obtenerDescripcionHorario(appointment.idHorario)
            : this.obtenerDescripcionHorarioSeguro(appointment.idHorario);
            
        const doctorName = (window.obtenerNombreUsuario && window.usuariosData && window.usuariosData.length > 0)
            ? window.obtenerNombreUsuario(appointment.idUsuario)
            : this.obtenerNombreUsuarioSeguro(appointment.idUsuario);
            
        const formattedDate = (window.formatearFecha)
            ? window.formatearFecha(appointment.fecha_cita)
            : this.formatearFechaSegura(appointment.fecha_cita);

        modal.innerHTML = `
            <div class="appointment-detail-content" style="
                background-color: white;
                padding: 0;
                border-radius: 8px;
                width: 90%;
                max-width: 600px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            ">
                <div class="appointment-detail-header" style="
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3><i class="fas fa-calendar-check"></i> Detalles de la Cita</h3>
                    <button class="close-detail-modal" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #999;
                    ">&times;</button>
                </div>
                <div class="appointment-detail-body" style="padding: 20px;">
                    <div class="detail-item" style="display: flex; align-items: center; margin-bottom: 15px; gap: 15px;">
                        <i class="fas fa-tooth" style="width: 20px; color: #007bff;"></i>
                        <div>
                            <strong style="display: block; margin-bottom: 5px; color: #333;">Servicio:</strong>
                            <span>${serviceName}</span>
                        </div>
                    </div>
                    <div class="detail-item" style="display: flex; align-items: center; margin-bottom: 15px; gap: 15px;">
                        <i class="fas fa-user-md" style="width: 20px; color: #007bff;"></i>
                        <div>
                            <strong style="display: block; margin-bottom: 5px; color: #333;">Doctor:</strong>
                            <span>${doctorName}</span>
                        </div>
                    </div>
                    <div class="detail-item" style="display: flex; align-items: center; margin-bottom: 15px; gap: 15px;">
                        <i class="fas fa-clock" style="width: 20px; color: #007bff;"></i>
                        <div>
                            <strong style="display: block; margin-bottom: 5px; color: #333;">Hora:</strong>
                            <span>${timeSlot}</span>
                        </div>
                    </div>
                    <div class="detail-item" style="display: flex; align-items: center; margin-bottom: 15px; gap: 15px;">
                        <i class="fas fa-calendar" style="width: 20px; color: #007bff;"></i>
                        <div>
                            <strong style="display: block; margin-bottom: 5px; color: #333;">Fecha:</strong>
                            <span>${formattedDate}</span>
                        </div>
                    </div>
                    <div class="detail-item" style="display: flex; align-items: center; margin-bottom: 15px; gap: 15px;">
                        <i class="fas fa-info-circle" style="width: 20px; color: #007bff;"></i>
                        <div>
                            <strong style="display: block; margin-bottom: 5px; color: #333;">Estado:</strong>
                            <span class="status-badge estado-${appointment.estado.toLowerCase()}" style="
                                padding: 4px 8px;
                                border-radius: 4px;
                                font-size: 12px;
                                font-weight: 500;
                                text-transform: uppercase;
                                ${this.getStatusStyles(appointment.estado)}
                            ">${appointment.estado}</span>
                        </div>
                    </div>
                </div>
                <div class="appointment-detail-actions" style="
                    padding: 20px;
                    border-top: 1px solid #eee;
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                ">
                    ${appointment.estado === 'PENDIENTE' ? `
                        <button class="btn btn-primary" onclick="window.editarCita && window.editarCita(${appointment.idCita}); this.closest('.appointment-detail-modal').remove();" style="
                            padding: 10px 20px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            background-color: #007bff;
                            color: white;
                        ">
                            <i class="fas fa-edit"></i> Modificar
                        </button>
                    ` : ''}
                    <button class="btn btn-cancel" onclick="this.closest('.appointment-detail-modal').remove();" style="
                            padding: 10px 20px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            background-color: #6c757d;
                            color: white;
                        ">
                        <i class="fas fa-times"></i> Cerrar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Eventos del modal
        const closeBtn = modal.querySelector('.close-detail-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Cerrar con Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    // Funciones seguras que no dependen de variables globales externas
    obtenerNombreServicioSeguro(idServicio) {
        // Primer intento: usar datos globales del controlador
        if (window.serviciosData && window.serviciosData.length > 0) {
            const servicio = window.serviciosData.find(s => s.idServicio === parseInt(idServicio));
            if (servicio && servicio.nombre) {
                return servicio.nombre;
            }
        }
        
        // Segundo intento: usar función global del controlador
        if (window.obtenerNombreServicio && typeof window.obtenerNombreServicio === 'function') {
            try {
                const nombre = window.obtenerNombreServicio(idServicio);
                if (nombre && nombre !== 'Servicio desconocido') {
                    return nombre;
                }
            } catch (e) {
                console.warn('Error al obtener nombre del servicio:', e);
            }
        }
        
        // Fallback con servicios comunes
        const servicios = {
            1: 'Limpieza Dental',
            2: 'Blanqueamiento Dental',
            3: 'Ortodoncia',
            4: 'Extracción Dental'
        };
        return servicios[parseInt(idServicio)] || `Servicio ID ${idServicio}`;
    }

    obtenerDescripcionHorarioSeguro(idHorario) {
        // Primer intento: usar datos globales del controlador
        if (window.horariosData && window.horariosData.length > 0) {
            const horario = window.horariosData.find(h => h.idHorario === parseInt(idHorario));
            if (horario && horario.descripcion) {
                return horario.descripcion;
            }
        }
        
        // Segundo intento: usar función global del controlador
        if (window.obtenerDescripcionHorario && typeof window.obtenerDescripcionHorario === 'function') {
            try {
                const descripcion = window.obtenerDescripcionHorario(idHorario);
                if (descripcion && descripcion !== 'Horario no disponible') {
                    return descripcion;
                }
            } catch (e) {
                console.warn('Error al obtener descripción del horario:', e);
            }
        }
        
        // Fallback con horarios comunes
        const horarios = {
            1: '09:00 AM',
            2: '10:00 AM',
            3: '11:00 AM',
            4: '02:00 PM',
            5: '03:00 PM',
            6: '04:00 PM'
        };
        return horarios[parseInt(idHorario)] || `Horario ID ${idHorario}`;
    }

    obtenerNombreUsuarioSeguro(idUsuario) {
        // Primer intento: usar datos globales del controlador
        if (window.usuariosData && window.usuariosData.length > 0) {
            const usuario = window.usuariosData.find(u => u.idUsuario === parseInt(idUsuario));
            if (usuario && usuario.nombre && usuario.apellido) {
                return `Dr. ${usuario.nombre} ${usuario.apellido}`;
            }
        }
        
        // Segundo intento: usar función global del controlador
        if (window.obtenerNombreUsuario && typeof window.obtenerNombreUsuario === 'function') {
            try {
                const nombre = window.obtenerNombreUsuario(idUsuario);
                if (nombre && nombre !== 'Usuario desconocido') {
                    return `Dr. ${nombre}`;
                }
            } catch (e) {
                console.warn('Error al obtener nombre del usuario:', e);
            }
        }
        
        return `Doctor ID ${idUsuario}`;
    }

    formatearFechaSegura(fecha) {
        if (!fecha) return '';
        try {
            const d = new Date(fecha);
            return d.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'Fecha no válida';
        }
    }

    getStatusStyles(estado) {
        switch(estado.toUpperCase()) {
            case 'PENDIENTE':
                return 'background-color: #fff3cd; color: #856404;';
            case 'CONFIRMADA':
                return 'background-color: #d4edda; color: #155724;';
            case 'CANCELADA':
                return 'background-color: #f8d7da; color: #721c24;';
            case 'COMPLETADA':
                return 'background-color: #d1ecf1; color: #0c5460;';
            default:
                return 'background-color: #e2e3e5; color: #383d41;';
        }
    }
}

// Appointment actions - Estas funciones manejan las acciones de confirmar/cancelar
class AppointmentManager {
    constructor() {
        this.init();
    }

    init() {
        // Las funciones están definidas globalmente en citasController.js
        // Solo agregamos funcionalidad adicional aquí si es necesario
        this.addButtonAnimations();
    }

    addButtonAnimations() {
        // Agregar animaciones a los botones cuando se crean dinámicamente
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-confirm, .btn-cancel, .btn-edit')) {
                if (!e.target.disabled) {
                    e.target.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        e.target.style.transform = 'scale(1)';
                    }, 150);
                }
            }
        });
    }
}

// Utilidades responsivas
class ResponsiveUtils {
    constructor() {
        this.init();
    }

    init() {
        this.handleResize();
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            this.adjustCalendarForMobile();
        } else {
            this.adjustCalendarForDesktop();
        }
    }

    adjustCalendarForMobile() {
        const daysGrid = document.getElementById('daysGrid');
        if (daysGrid) {
            daysGrid.style.gap = '3px';
        }
        
        // Hacer que las acciones de citas se apilen verticalmente en móvil
        document.querySelectorAll('.appointment-actions').forEach(actions => {
            if (window.innerWidth <= 480) {
                actions.style.flexDirection = 'column';
                actions.style.width = '100%';
                actions.style.gap = '5px';
            }
        });
    }

    adjustCalendarForDesktop() {
        const daysGrid = document.getElementById('daysGrid');
        if (daysGrid) {
            daysGrid.style.gap = '8px';
        }
        
        // Resetear acciones de citas para escritorio
        document.querySelectorAll('.appointment-actions').forEach(actions => {
            actions.style.flexDirection = 'row';
            actions.style.width = 'auto';
            actions.style.gap = '10px';
        });
    }
}

// Función para actualizar las citas del calendario desde el controlador
function actualizarCitasCalendario(nuevasCitas) {
    if (window.calendar) {
        window.calendar.appointments = nuevasCitas || [];
        window.calendar.render();
        console.log('Calendario actualizado con', nuevasCitas ? nuevasCitas.length : 0, 'citas');
    }
}

// Función para actualizar los datos globales y refrescar el calendario
function actualizarDatosGlobalesCalendario(usuarios, horarios, servicios) {
    if (usuarios) window.usuariosData = usuarios;
    if (horarios) window.horariosData = horarios;
    if (servicios) window.serviciosData = servicios;
    
    console.log('Datos globales actualizados:', {
        usuarios: window.usuariosData ? window.usuariosData.length : 0,
        horarios: window.horariosData ? window.horariosData.length : 0,
        servicios: window.serviciosData ? window.serviciosData.length : 0
    });
}

// Inicializar solo cuando el DOM esté listo y después del controlador
function inicializarCalendario() {
    // Solo inicializar si no existe ya una instancia y si el DOM está listo
    if (!window.calendar && document.readyState === 'complete' || document.readyState === 'interactive') {
        try {
            window.calendar = new Calendar();
            
            // Inicializar gestores adicionales
            new AppointmentManager();
            new ResponsiveUtils();
            
            // Agregar scroll suave a enlaces de anclaje
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Agregar animación a botones
            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (!this.disabled) {
                        this.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            this.style.transform = 'scale(1)';
                        }, 150);
                    }
                });
            });

            // Agregar observer de intersección para animaciones de aparición
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observar todas las tarjetas y secciones
            document.querySelectorAll('.card, .calendar-container, .appointments').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });

            console.log('Calendar y componentes inicializados correctamente');
        } catch (error) {
            console.error('Error al inicializar el calendario:', error);
        }
    }
}

// Usar diferentes estrategias para inicializar según el estado del DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarCalendario);
} else {
    // Si el DOM ya está cargado, inicializar inmediatamente
    inicializarCalendario();
}

// También hacer disponible la función globalmente por si se necesita inicializar manualmente
window.inicializarCalendario = inicializarCalendario;