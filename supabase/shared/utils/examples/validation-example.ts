// validation-example.ts - Ejemplos de validación de datos
import { http200, http400, withCors } from "../http.ts";
// Nota: Validator.ts necesita ser creado o importado desde la ubicación correcta

// EJEMPLO 1: Validación de datos peruanos básicos
export function peruvianValidationExample() {
    return withCors(async (req: Request) => {
        if (req.method !== "POST") {
            return http400("Solo se permite método POST");
        }

        try {
            const body = await req.json();
            const { dni, ruc, email, telefono, placa } = body;

            const results: any = {
                validations: {},
                errors: [],
            };

            // Validar DNI si se proporciona
            if (dni) {
                if (Validator.isValidDNI(dni)) {
                    results.validations.dni = { value: dni, status: "valid" };
                } else {
                    results.validations.dni = { value: dni, status: "invalid" };
                    results.errors.push("DNI debe tener exactamente 8 dígitos");
                }
            }

            // Validar RUC si se proporciona
            if (ruc) {
                if (Validator.isValidRUC(ruc)) {
                    results.validations.ruc = { value: ruc, status: "valid" };
                } else {
                    results.validations.ruc = { value: ruc, status: "invalid" };
                    results.errors.push(
                        "RUC debe tener exactamente 11 dígitos",
                    );
                }
            }

            // Validar email si se proporciona
            if (email) {
                if (Validator.isValidEmail(email)) {
                    results.validations.email = {
                        value: email,
                        status: "valid",
                    };
                } else {
                    results.validations.email = {
                        value: email,
                        status: "invalid",
                    };
                    results.errors.push("Email tiene formato inválido");
                }
            }

            // Validar teléfono si se proporciona
            if (telefono) {
                if (Validator.isValidPhone(telefono)) {
                    results.validations.telefono = {
                        value: telefono,
                        status: "valid",
                    };
                } else {
                    results.validations.telefono = {
                        value: telefono,
                        status: "invalid",
                    };
                    results.errors.push(
                        "Teléfono debe tener 9 dígitos y empezar por 9",
                    );
                }
            }

            // Validar placa si se proporciona
            if (placa) {
                if (Validator.isValidPlaca(placa)) {
                    results.validations.placa = {
                        value: placa,
                        status: "valid",
                    };
                } else {
                    results.validations.placa = {
                        value: placa,
                        status: "invalid",
                    };
                    results.errors.push(
                        "Placa debe tener formato ABC-123 o ABC1234",
                    );
                }
            }

            return http200(results);
        } catch (error) {
            return http400("JSON inválido", (error as Error).message);
        }
    });
}

// EJEMPLO 2: Validación estricta con excepciones
export function strictValidationExample() {
    return withCors(async (req: Request) => {
        if (req.method !== "POST") {
            return http400("Solo se permite método POST");
        }

        try {
            const body = await req.json();

            // Validaciones obligatorias que lanzan excepciones
            try {
                Validator.validateRequired(body.nombre, "nombre");
                Validator.validateRequired(body.dni, "dni");
                Validator.validateDNI(body.dni);
                Validator.validateEmail(body.email);

                // Si hay teléfono, validarlo
                if (body.telefono) {
                    Validator.validatePhone(body.telefono);
                }

                // Todas las validaciones pasaron
                return http200({
                    message: "Datos válidos",
                    data: {
                        nombre: body.nombre.trim(),
                        dni: body.dni,
                        email: body.email.toLowerCase(),
                        telefono: body.telefono || null,
                    },
                });
            } catch (validationError) {
                if (validationError instanceof ValidationError) {
                    return http400(validationError.message, {
                        field: validationError.field,
                    });
                }
                throw validationError; // Re-lanzar si no es ValidationError
            }
        } catch (error) {
            return http400(
                "Error procesando request",
                (error as Error).message,
            );
        }
    });
}

// EJEMPLO 3: Validación de múltiples registros
export function batchValidationExample() {
    return withCors(async (req: Request) => {
        if (req.method !== "POST") {
            return http400("Solo se permite método POST");
        }

        try {
            const body = await req.json();

            if (!Array.isArray(body.personas)) {
                return http400("Se esperaba un array 'personas'");
            }

            const results = body.personas.map((persona: any, index: number) => {
                const result: any = {
                    index,
                    data: persona,
                    valid: true,
                    errors: [],
                };

                try {
                    // Validar campos requeridos
                    if (!persona.nombre) {
                        result.errors.push("Nombre es requerido");
                    }
                    if (!persona.dni) result.errors.push("DNI es requerido");

                    // Validar DNI si existe
                    if (persona.dni && !Validator.isValidDNI(persona.dni)) {
                        result.errors.push("DNI inválido");
                    }

                    // Validar email si existe
                    if (
                        persona.email && !Validator.isValidEmail(persona.email)
                    ) {
                        result.errors.push("Email inválido");
                    }

                    // Validar teléfono si existe
                    if (
                        persona.telefono &&
                        !Validator.isValidPhone(persona.telefono)
                    ) {
                        result.errors.push("Teléfono inválido");
                    }

                    result.valid = result.errors.length === 0;
                } catch (error) {
                    result.valid = false;
                    result.errors.push(
                        `Error inesperado: ${(error as Error).message}`,
                    );
                }

                return result;
            });

            const summary = {
                total: results.length,
                valid: results.filter((r) => r.valid).length,
                invalid: results.filter((r) => !r.valid).length,
            };

            return http200({
                summary,
                results,
                message:
                    `Procesados ${summary.total} registros: ${summary.valid} válidos, ${summary.invalid} inválidos`,
            });
        } catch (error) {
            return http400(
                "Error procesando request",
                (error as Error).message,
            );
        }
    });
}

// EJEMPLO 4: Validación con normalización de datos
export function normalizationExample() {
    return withCors(async (req: Request) => {
        if (req.method !== "POST") {
            return http400("Solo se permite método POST");
        }

        try {
            const body = await req.json();
            const normalized: any = {};
            const errors: string[] = [];

            // Normalizar y validar nombre
            if (body.nombre) {
                normalized.nombre = body.nombre.toString().trim().toUpperCase();
                if (normalized.nombre.length < 2) {
                    errors.push("Nombre debe tener al menos 2 caracteres");
                }
            } else {
                errors.push("Nombre es requerido");
            }

            // Normalizar y validar DNI
            if (body.dni) {
                normalized.dni = body.dni.toString().replace(/\D/g, ""); // Solo números
                if (!Validator.isValidDNI(normalized.dni)) {
                    errors.push("DNI debe tener exactamente 8 dígitos");
                }
            }

            // Normalizar y validar email
            if (body.email) {
                normalized.email = body.email.toString().toLowerCase().trim();
                if (!Validator.isValidEmail(normalized.email)) {
                    errors.push("Email tiene formato inválido");
                }
            }

            // Normalizar teléfono (opcional)
            if (body.telefono) {
                // Remover espacios, guiones, paréntesis
                normalized.telefono = body.telefono.toString().replace(
                    /[\s\-\(\)]/g,
                    "",
                );
                if (!Validator.isValidPhone(normalized.telefono)) {
                    errors.push(
                        "Teléfono debe tener 9 dígitos y empezar por 9",
                    );
                }
            }

            // Normalizar placa (opcional)
            if (body.placa) {
                normalized.placa = body.placa.toString().toUpperCase().replace(
                    /\s/g,
                    "",
                );
                if (!Validator.isValidPlaca(normalized.placa)) {
                    errors.push("Placa debe tener formato ABC-123 o ABC1234");
                }
            }

            if (errors.length > 0) {
                return http400("Errores de validación", {
                    errors,
                    received: body,
                    normalized,
                });
            }

            return http200({
                message: "Datos normalizados y validados correctamente",
                original: body,
                normalized,
            });
        } catch (error) {
            return http400(
                "Error procesando request",
                (error as Error).message,
            );
        }
    });
}

/*
CÓMO USAR ESTOS EJEMPLOS:

1. VALIDACIÓN BÁSICA (sin excepciones):
   - Usa Validator.isValidDNI(), isValidEmail(), etc.
   - Maneja el resultado booleano manualmente

2. VALIDACIÓN ESTRICTA (con excepciones):
   - Usa Validator.validateDNI(), validateEmail(), etc.
   - Captura ValidationError para mensajes específicos

3. DATOS DE PRUEBA:

// Para validación básica
{
  "dni": "12345678",
  "ruc": "12345678901",
  "email": "test@example.com",
  "telefono": "987654321",
  "placa": "ABC-123"
}

// Para validación estricta
{
  "nombre": "Juan Pérez",
  "dni": "12345678",
  "email": "juan@example.com",
  "telefono": "987654321"
}

// Para validación por lotes
{
  "personas": [
    {"nombre": "Juan", "dni": "12345678", "email": "juan@test.com"},
    {"nombre": "María", "dni": "87654321", "telefono": "987654321"}
  ]
}

4. INTEGRAR EN TU FUNCIÓN:
import { Validator } from "shared/utils/Validator.ts";

const { dni } = await req.json();
if (!Validator.isValidDNI(dni)) {
  return http400("DNI inválido");
}
*/
