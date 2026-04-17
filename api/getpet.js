export default async function handler(req, res) {

  const { id } = req.query;

  const BASE_ID = "appbEqRXSQVE5bToX";
  const TOKEN = process.env.AIRTABLE_TOKEN;

  try {

    const petRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Mascotas/${id}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    const petData = await petRes.json();

    if (!petData.fields) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    const mascota = petData.fields;

    const userId = mascota["Propietario"]?.[0];

    let telefono = null;

    if (userId) {
      const userRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Usuarios/${userId}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      });

      const userData = await userRes.json();
      telefono = userData.fields?.["telefono"];
    }

    res.status(200).json({
      nombre: mascota["Nombre de la mascota"],
      notas: mascota["Notas"],
      telefono
    });

  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
}