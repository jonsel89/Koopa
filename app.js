const form = document.getElementById("form");

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

    // 🔥 LLAMADA A TU BACKEND (VERCEL)
    const res = await fetch("/api/createPet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombreUsuario,
        email,
        telefono,
        nombreMascota,
        tipo,
        notas,
        estado
      })
    });

    if (!res.ok) {
      console.error("Error backend:", await res.text());
      return;
    }

    const data = await res.json();
    const petId = data.petId;

    // 🎯 GENERAR QR
    const url = `${window.location.origin}/pet.html?id=${petId}`;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${url}`;

    document.getElementById("qr").src = qrUrl;

    // (opcional) mostrar link
    const linkElement = document.getElementById("link");
    if (linkElement) {
      linkElement.innerText = url;
    }

    form.reset();

  } catch (error) {
    console.error("Error general:", error);
  }
});