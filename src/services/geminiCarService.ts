import * as FileSystem from "expo-file-system/legacy";

export interface CarAIResult {
  marca: string;
  modelo: string;
  color: string;
  anio: string;
  tipoReporte: string;
  observaciones: string;
}

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim() || "";

const limpiarJson = (text: string): string => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

export const geminiCarService = {
  analyzeCarImage: async (imageUri: string): Promise<CarAIResult> => {
    if (!GEMINI_API_KEY) {
      throw new Error(
        "No se encontró EXPO_PUBLIC_GEMINI_API_KEY. Revisa tu archivo .env."
      );
    }

    console.log("Gemini API KEY inicio:", GEMINI_API_KEY.substring(0, 8));
    console.log("Imagen URI:", imageUri);

    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("Tamaño base64:", base64Image.length);

    if (!base64Image || base64Image.length < 500) {
      throw new Error("La imagen no se convirtió correctamente a base64.");
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Analiza la fotografía del carro y responde solamente con JSON válido.
No uses markdown ni explicación.

Devuelve exactamente:

{
  "marca": "",
  "modelo": "",
  "color": "",
  "anio": "",
  "tipoReporte": "",
  "observaciones": ""
}

Reglas:
- Identifica principalmente marca, modelo, color y año aproximado.
- Si no sabes marca o modelo, deja el campo vacío.
- El color debe ser el color principal visible.
- El año puede ser aproximado, por ejemplo "2010-2015".
- No inventes placa, propietario, teléfono ni ubicación.
- tipoReporte debe ser uno de estos:
  "Mantenimiento", "Accidente", "Daño mecánico", "Daño eléctrico", "Revisión", "Reporte general".
- observaciones debe describir brevemente lo visible en la foto.
                  `,
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Image,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("HTTP STATUS GEMINI:", response.status);
    console.log("RESPUESTA GEMINI:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(
        data?.error?.message || "Error desconocido al llamar a Gemini."
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("TEXTO GEMINI:", text);

    if (!text) {
      throw new Error("Gemini respondió, pero no devolvió texto.");
    }

    const parsed = JSON.parse(limpiarJson(text));

    return {
      marca: parsed.marca || "",
      modelo: parsed.modelo || "",
      color: parsed.color || "",
      anio: parsed.anio || "",
      tipoReporte: parsed.tipoReporte || "Reporte general",
      observaciones: parsed.observaciones || "",
    };
  },
};