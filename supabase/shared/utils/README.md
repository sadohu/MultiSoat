# Documentación de Utilidades Compartidas (`shared/utils`)

Esta carpeta contiene utilidades reutilizables para Edge Functions de Supabase, organizadas en módulos especializados que aprovechan los tipos oficiales del dashboard.

## 📁 Estructura Optimizada

```
shared/utils/
├── README.md           # Esta documentación  
├── http.ts            # Respuestas HTTP y CORS
├── client-auth.ts     # Cliente Supabase + Auth helpers
├── Validator.ts       # Validaciones peruanas
└── examples/          # Ejemplos de uso
    ├── basic-response.ts
    ├── auth-example.ts
    └── validation-example.ts
```

## ✨ Cambios Recientes (Optimización)

**Eliminado:** `client.ts` - Su funcionalidad se integró en `client-auth.ts`  
**Renombrado:** `supabase.ts` → `client-auth.ts` (evitar confusión con dashboard)  
**Integrado:** Types oficiales del dashboard (`../config/supabase.ts`)  
**Mejorado:** Cliente Supabase con tipado completo desde el dashboard  
**Simplificado:** Un solo archivo para cliente y autenticación

## 🌐 HTTP Utils (`http.ts`)

### Funciones de Respuesta Estandarizadas

Todas las respuestas siguen el formato:
```json
{
  "data": {},           // Contenido (en éxito)
  "success": boolean,   // true/false
  "status": number,     // Código HTTP
  "message": "...",     // Mensaje opcional
  "error": {            // Solo en errores
    "message": "...",
    "code": "...",
    "details": {}
  }
}
```

#### Respuestas de Éxito
```typescript
import { http200, http201 } from "shared/utils/http.ts";

// Respuesta básica con datos
return http200({ users: [...] });

// Con mensaje personalizado
return http201({ id: 123 }, "Usuario creado exitosamente");
```

#### Respuestas de Error
```typescript
import { http400, http401, http404, http500 } from "shared/utils/http.ts";

// Error de validación
return http400("Email inválido", { field: "email" });

// No autorizado
return http401("Token expirado");

// No encontrado
return http404("Usuario no encontrado");

// Error interno
return http500("Error de base de datos", error.message);
```

#### CORS Automático
```typescript
import { withCors } from "shared/utils/http.ts";

// Envuelve tu handler para CORS automático
Deno.serve(withCors(async (req) => {
  // Tu lógica aquí
  return http200({ message: "Hello!" });
}));
```

## 🔐 Supabase Client + Auth (`client-auth.ts`)

### Crear Cliente Tipado
```typescript
import { getSupabaseClient } from "shared/utils/client-auth.ts";

// En tu Edge Function
const supabase = getSupabaseClient(req);

// Ahora tienes tipado completo desde el dashboard
const { data, error } = await supabase
  .from("usuarios")
  .select("*")
  .limit(10);
```

**Características:**
- Usa types `Database` del dashboard de Supabase
- Forwarding de Authorization header automático
- Manejo de variables de entorno automático

### Verificación Manual
```typescript
import { requireAuth } from "shared/utils/client-auth.ts";

const authResult = await requireAuth(req);
if (!authResult.success) {
  return http401("Token inválido");
}
// authResult.user contiene la info del usuario autenticado
```

### Middleware de Autenticación
```typescript
import { withAuth } from "shared/utils/client-auth.ts";

// Protege toda la función
Deno.serve(withCors(withAuth(async (req, { user, supabase }) => {
  // user y supabase ya están disponibles
  return http200({ userId: user.id });
})));
```

## ✅ Validaciones (`Validator.ts`)

### Validaciones Peruanas
```typescript
import { Validator } from "shared/utils/Validator.ts";

// Validar DNI
if (!Validator.isValidDNI("12345678")) {
  return http400("DNI inválido");
}

// Validar RUC
if (!Validator.isValidRUC("12345678901")) {
  return http400("RUC inválido");
}

// Validar con excepción
try {
  Validator.validateEmail("user@domain.com");
  Validator.validatePhone("987654321");
} catch (error) {
  return http400(error.message);
}
```

## 🔧 Configuración (`../config/config.ts`)

### CORS Dinámico
```typescript
import { corsConfig } from "shared/config/config.ts";

// CORS se configura desde aquí y se aplica automáticamente
export const corsConfig = {
  allowedOrigins: ["*"],  // Cambiar en producción
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "apikey"],
};
```

### Utilitarios de Tiempo
```typescript
import { timeUtils } from "shared/config/config.ts";

const now = timeUtils.getCurrentTimestamp();
const tomorrow = timeUtils.addDays(1);
```

## 📖 Ejemplos Prácticos

### 1. Función Pública Simple
```typescript
import { withCors, http200 } from "shared/utils/http.ts";

Deno.serve(withCors(async (req) => {
  const body = await req.json().catch(() => ({}));
  return http200({ echo: body });
}));
```

### 2. Función con Base de Datos
```typescript
import { withCors, http200, http500 } from "shared/utils/http.ts";
import { getSupabaseClient } from "shared/utils/client-auth.ts";

Deno.serve(withCors(async (req) => {
  try {
    const supabase = getSupabaseClient(req);
    const { data } = await supabase.from("usuarios").select("*");
    return http200({ usuarios: data });
  } catch (error) {
    return http500("Error de consulta", error.message);
  }
}));
```

### 3. Función Protegida
```typescript
import { withCors, withAuth, http200 } from "shared/utils/http.ts";

Deno.serve(withCors(withAuth(async (req, { user, supabase }) => {
  const { data } = await supabase
    .from("mis_datos")
    .select("*")
    .eq("user_id", user.id);
  
  return http200({ profile: data[0] });
})));
```

## 🚀 Tips de Uso

1. **Siempre usa withCors** para Edge Functions públicas
2. **Combina middlewares**: `withCors(withAuth(handler))`
3. **Usa el patrón http200/400/500** para consistencia
4. **El cliente se crea por request** (no global)
5. **Valida datos de entrada** con Validator antes de procesar

## 🔄 Migración desde Código Anterior

### Antes (manual):
```typescript
return new Response(JSON.stringify({ data }), {
  headers: { "Content-Type": "application/json" }
});
```

### Ahora (estándar):
```typescript
return http200(data);
```

### Antes (CORS manual):
```typescript
if (req.method === "OPTIONS") {
  return new Response("ok", { headers: corsHeaders });
}
```

### Ahora (automático):
```typescript
Deno.serve(withCors(handler)); // CORS incluido
```
