// basic-response.ts - Ejemplos básicos de respuestas HTTP
import { http200, http400, http404, http500, withCors } from "../http.ts";

// EJEMPLO 1: Endpoint que responde con diferentes códigos según el parámetro
export function basicResponseExample() {
    return withCors(async (req: Request) => {
        const url = new URL(req.url);
        const type = url.searchParams.get("type");

        switch (type) {
            case "success":
                return http200(
                    {
                        message: "Operación exitosa",
                        timestamp: new Date().toISOString(),
                    },
                    "Todo salió bien",
                );

            case "error":
                return http400("Tipo de request inválido", { received: type });

            case "notfound":
                return http404("Recurso no encontrado");

            case "crash":
                // Simular error interno
                try {
                    throw new Error("Algo salió mal en el servidor");
                } catch (error) {
                    return http500("Error simulado", (error as Error).message);
                }

            default:
                return http200({
                    availableTypes: ["success", "error", "notfound", "crash"],
                    usage: "?type=success",
                });
        }
    });
}

// EJEMPLO 2: Endpoint que procesa JSON y valida datos
export function jsonProcessingExample() {
    return withCors(async (req: Request) => {
        // Solo permitir POST
        if (req.method !== "POST") {
            return http400("Solo se permite método POST");
        }

        try {
            const body = await req.json();

            // Validar campos requeridos
            if (!body.name || typeof body.name !== "string") {
                return http400("Campo 'name' es requerido y debe ser string");
            }

            if (!body.email || typeof body.email !== "string") {
                return http400("Campo 'email' es requerido");
            }

            // Procesamiento exitoso
            return http200({
                processed: {
                    name: body.name.trim(),
                    email: body.email.toLowerCase(),
                    processedAt: new Date().toISOString(),
                },
            }, "Datos procesados correctamente");
        } catch (error) {
            return http400("JSON inválido", (error as Error).message);
        }
    });
}

// EJEMPLO 3: Endpoint con diferentes formatos de respuesta
export function responseFormatsExample() {
    return withCors(async (req: Request) => {
        const url = new URL(req.url);
        const format = url.searchParams.get("format") || "standard";

        const sampleData = {
            users: [
                { id: 1, name: "Juan", active: true },
                { id: 2, name: "María", active: false },
            ],
        };

        switch (format) {
            case "minimal":
                // Solo datos esenciales
                return http200(
                    sampleData.users.map((u) => ({ id: u.id, name: u.name })),
                );

            case "detailed":
                // Con metadatos adicionales
                return http200({
                    data: sampleData.users,
                    meta: {
                        total: sampleData.users.length,
                        active: sampleData.users.filter((u) => u.active).length,
                        generated: new Date().toISOString(),
                    },
                });

            case "standard":
            default:
                return http200(sampleData);
        }
    });
}

/*
CÓMO USAR ESTOS EJEMPLOS:

1. Copia el ejemplo que necesites a tu Edge Function
2. Importa las funciones desde shared/utils/http.ts
3. Usa Deno.serve() con el handler:

// En tu index.ts
import { basicResponseExample } from "shared/utils/examples/basic-response.ts";
Deno.serve(basicResponseExample());

// O combina directamente:
Deno.serve(withCors(async (req) => {
  // Tu lógica aquí
  return http200({ message: "Hello World!" });
}));
*/
