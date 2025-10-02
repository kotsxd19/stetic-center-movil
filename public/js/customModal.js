// customModal.js - Sistema de modales de confirmación personalizados

class CustomConfirm {
    constructor() {
        this.modal = null;
        this.createModal();
    }

    createModal() {
        // Crear el modal si no existe
        if (!document.getElementById('custom-confirm-modal')) {
            const modalHTML = `
                <div id="custom-confirm-modal" class="custom-confirm-modal">
                    <div class="custom-confirm-content">
                        <div class="custom-confirm-header">
                            <i class="fas fa-question-circle"></i>
                            <h3 id="custom-confirm-title">Confirmar Acción</h3>
                        </div>
                        <div class="custom-confirm-body">
                            <p id="custom-confirm-message">¿Está seguro de realizar esta acción?</p>
                        </div>
                        <div class="custom-confirm-footer">
                            <button class="custom-confirm-btn custom-confirm-btn-cancel" id="custom-confirm-cancel">
                                Cancelar
                            </button>
                            <button class="custom-confirm-btn custom-confirm-btn-confirm" id="custom-confirm-ok">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
        this.modal = document.getElementById('custom-confirm-modal');
    }

    show(options = {}) {
        return new Promise((resolve) => {
            const {
                title = 'Confirmar Acción',
                message = '¿Está seguro de realizar esta acción?',
                icon = 'fa-question-circle',
                confirmText = 'Confirmar',
                cancelText = 'Cancelar',
                type = 'confirm'
            } = options;

            // Actualizar contenido
            document.getElementById('custom-confirm-title').textContent = title;
            document.getElementById('custom-confirm-message').textContent = message;
            
            // Actualizar icono
            const iconElement = this.modal.querySelector('.custom-confirm-header i');
            iconElement.className = `fas ${icon}`;
            
            // Actualizar botones
            const confirmBtn = document.getElementById('custom-confirm-ok');
            const cancelBtn = document.getElementById('custom-confirm-cancel');
            
            confirmBtn.textContent = confirmText;
            cancelBtn.textContent = cancelText;
            
            // Remover clases previas del botón confirmar
            confirmBtn.className = 'custom-confirm-btn';
            
            // Agregar clase según el tipo
            if (type === 'danger') {
                confirmBtn.classList.add('custom-confirm-btn-danger');
            } else {
                confirmBtn.classList.add('custom-confirm-btn-confirm');
            }
            
            // Mostrar modal
            this.modal.classList.add('show');
            
            // Manejadores de eventos
            const handleConfirm = () => {
                this.hide();
                cleanup();
                resolve(true);
            };
            
            const handleCancel = () => {
                this.hide();
                cleanup();
                resolve(false);
            };
            
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    this.hide();
                    cleanup();
                    resolve(false);
                }
            };
            
            const cleanup = () => {
                confirmBtn.removeEventListener('click', handleConfirm);
                cancelBtn.removeEventListener('click', handleCancel);
                document.removeEventListener('keydown', handleEscape);
            };
            
            confirmBtn.addEventListener('click', handleConfirm);
            cancelBtn.addEventListener('click', handleCancel);
            document.addEventListener('keydown', handleEscape);
            
            // Cerrar al hacer clic fuera
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    handleCancel();
                }
            });
        });
    }

    hide() {
        if (this.modal) {
            this.modal.classList.remove('show');
        }
    }
}

// Instancia global
const customConfirm = new CustomConfirm();

// Funciones de utilidad globales
window.mostrarConfirmacion = async (options) => {
    return await customConfirm.show(options);
};

window.confirmarAccion = async (message) => {
    return await customConfirm.show({
        title: 'Confirmar Acción',
        message: message,
        icon: 'fa-question-circle',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        type: 'confirm'
    });
};

window.confirmarCancelacion = async (message) => {
    return await customConfirm.show({
        title: '¿Cancelar Cita?',
        message: message || '¿Está seguro que desea cancelar esta cita?',
        icon: 'fa-exclamation-triangle',
        confirmText: 'Sí, cancelar',
        cancelText: 'No, mantener',
        type: 'danger'
    });
};

window.confirmarEliminacion = async (message) => {
    return await customConfirm.show({
        title: '¿Eliminar?',
        message: message || '¿Está seguro de eliminar este elemento? Esta acción no se puede deshacer.',
        icon: 'fa-trash-alt',
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
    });
};

window.confirmarGuardado = async (message) => {
    return await customConfirm.show({
        title: 'Confirmar Cita',
        message: message || '¿Confirmar esta cita?',
        icon: 'fa-check-circle',
        confirmText: 'Sí, confirmar',
        cancelText: 'Cancelar',
        type: 'success'
    });
};

console.log('Custom Modal System cargado correctamente');