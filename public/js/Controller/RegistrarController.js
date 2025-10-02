import { 
  createCliente 
} from "../services/RegistrarService.js";



  async function fetchUser() {
  try {
    const res = await fetch("http://localhost:8080/auth/cliente/me", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", "Accept": "application/json" }
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch (err) {
    console.error("Error al Ingresar usuario:", err);
    return null;
  }
}


document.addEventListener("DOMContentLoaded", () => {
    const Form = document.getElementById("formRegistro");
    const Registrar = document.getElementById("btnRegistrar");

    Form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = Form.idCliente.value;

    const data = {
      nombreCompleto: Form.Nombre.value.trim(),
      direccion: Form.Dirección.value.trim(),
      correo: Form.Email.value.trim(),
      contrasenaCliente: Form.Contraseña.value.trim(),
    };

    try {
            await createCliente(data);
            alert("Registro exitoso");
            window.location.href = 'IniciarSesion.html';
        } catch (error) {
            console.error("Error en registro:", error);
            alert("Error en el registro: " + error.message);
        }

        const user = await fetchUser();
  if (!user) return;
  });
  });


