export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { nombreUsuario, email, telefono, nombreMascota, notas, estado } = req.body;

    const BASE_ID = "appbEqRXSQVE5bToX";
    const TOKEN = process.env.AIRTABLE_TOKEN;

    try {

        // 🔍 1. BUSCAR USUARIO POR EMAIL
        const searchRes = await fetch(
            `https://api.airtable.com/v0/${BASE_ID}/Usuarios?filterByFormula={Correo electrónico}='${email}'`,
            {
                headers: { Authorization: `Bearer ${TOKEN}` }
            }
        );

        const searchData = await searchRes.json();

        let userId;

        if (searchData.records.length > 0) {
            userId = searchData.records[0].id;
        } else {

            // 👤 CREAR USUARIO
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
            userId = userData.records[0].id;
        }

        // 🐶 2. CREAR MASCOTA
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

        // 🌐 3. GENERAR URL Y QR (IMPORTANTE: cambia tu dominio)
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000";

        const url = `${baseUrl}/pet.html?id=${petId}`;
        const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${url}`;

        // 💾 4. GUARDAR EN AIRTABLE
        await fetch(`https://api.airtable.com/v0/${BASE_ID}/Mascotas/${petId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fields: {
                    "URL": url,
                    "QR code": qr
                }
            })
        });

        // ✅ RESPUESTA
        res.status(200).json({ petId, url, qr });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creando mascota" });
    }
}