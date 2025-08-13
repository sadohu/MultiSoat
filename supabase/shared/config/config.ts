// Configuración y utilidades compartidas

// Configuración de CORS
export const corsConfig = {
  allowedOrigins: ["*"], // En producción, especificar dominios exactos
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "apikey"],
};

// IDs del sistema para auditoría
export const systemConfig = {
  systemUserId: "00000000-0000-0000-0000-000000000000",
  adminUserId: "11111111-1111-1111-1111-111111111111",
};

// Utilitarios de tiempo
export const timeUtils = {
  getCurrentTimestamp: (): string => new Date().toISOString(),
  getCurrentDate: (): string => new Date().toISOString().split("T")[0],
  addDays: (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  },
};

// Validar config mínima (opcional)
export function validateConfig(
  required: string[] = ["SUPABASE_URL", "SUPABASE_ANON_KEY"],
) {
  const missing = required.filter((k) => !Deno.env.get(k));
  if (missing.length) {
    throw new Error(`Faltan variables: ${missing.join(", ")}`);
  }
}
