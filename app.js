const form = document.getElementById("form");

const BASE_ID = "appbEqRXSQVE5bToX";
const TOKEN = "TU_TOKEN"; // 🔴 PON TU TOKEN AQUÍ

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 👤 DATOS USUARIO
  const nombreUsuario = document.getElementById("nombreUsuario").value;
  const email = document.getElementById("email").value;
  const telefono = document.getElementById("telefono").value;

  // 🐶 DATOS MASCOTA
  const nombreMascota = document.getElementById("nombreMascota").value;
  const tipo = document.getElementById("tipo").value;
  const notas = document.getElementById("notas").value;
  const estado = document.getElementById("estado").value;

  try {

    // 1. CREAR USUARIO
    const userRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Usuarios`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              "Nombre": nombreUsuario,
              "Correo electrónico": email,
              "telefono": telefono
            }
          }
        ]
      })
    });

    if (!userRes.ok) {
      console.error("Error usuario:", await userRes.text());
      return;
    }

    const userData = await userRes.json();
    const userId = userData.records[0].id;

    // 2. CREAR MASCOTA
    const petRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Mascotas`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              "Nombre de la mascota": nombreMascota,
              "Propietario": [userId],
              "Notas": notas,
              "Estado": estado
            }
          }
        ]
      })
    });

    if (!petRes.ok) {
      console.error("Error mascota:", await petRes.text());
      return;
    }

    const petData = await petRes.json();
    const petId = petData.records[0].id;

    // 3. GENERAR QR
    const url = `${window.location.origin}/pet.html?id=${petId}`;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${url}`;

    document.getElementById("qr").src = qrUrl;
    document.getElementById("link").innerText = url;

    form.reset();

  } catch (error) {
    console.error("Error general:", error);
  }
});