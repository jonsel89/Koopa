export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { nombreUsuario, email, telefono, nombreMascota, notas, estado } = req.body;

  const BASE_ID = "appbEqRXSQVE5bToX";
  const TOKEN = process.env.AIRTABLE_TOKEN;

  try {
    // Crear usuario
    const userRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Usuarios`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
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

    const userData = await userRes.json();
    const userId = userData.records[0].id;

    // Crear mascota
    const petRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Mascotas`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              "Nombre de la mascota": nombreMascota,
              "Propietario": [userId],
              "Notas": notas,
              "Estado": estado || "Activo"
            }
          }
        ]
      })
    });

    const petData = await petRes.json();
    const petId = petData.records[0].id;

    res.status(200).json({ petId });

  } catch (error) {
    res.status(500).json({ error: "Error creando mascota" });
  }
}