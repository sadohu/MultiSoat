# Documentación: hello-world-noauth

## Descripción
Function de ejemplo sin autenticación que demuestra el uso básico de los utilitarios unificados del sistema. Esta función está configurada para **no requerir autenticación JWT** y sirve como template para endpoints públicos.

## Configuración
- **Autenticación**: Deshabilitada en el dashboard de Supabase
- **CORS**: Habilitado automáticamente via utilitarios
- **Métodos HTTP**: GET y POST soportados
- **Tipo**: Edge Function pública

## Código Actual

```typescript
import { withCors, http200, http400 } from "../../shared/utils/http.ts";

Deno.serve(withCors(async (req: Request) => {
  if (req.method === "GET") {
    return http200({
      message: "Hello from Supabase Edge Functions!",
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    });
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      return http200({
        message: "Data received successfully",
        received: body,
        timestamp: new Date().toISOString()
      });
    } catch {
      return http400("Invalid JSON data");
    }
  }

  return http400(`Method ${req.method} not allowed`);
}));
```

## Características del Diseño

### 1. **Sin Autenticación**
```typescript
// ❌ NO USES en funciones públicas:
import { requireAuth, withAuth } from "../../shared/utils/supabase.ts";

// ✅ USA directamente los utilitarios HTTP:
import { withCors, http200, http400 } from "../../shared/utils/http.ts";
```

### 2. **CORS Automático**
```typescript
// El wrapper withCors() maneja automáticamente:
// - Preflight OPTIONS requests
// - Headers de CORS según configuración
// - Responses consistentes
Deno.serve(withCors(async (req: Request) => {
  // Tu lógica aquí
}));
```

### 3. **Responses Unificadas**
```typescript
// Todas las responses usan el patrón unificado:
return http200(data);           // Status 200 + JSON
return http400(message, error); // Status 400 + error details
```

## Casos de Uso

### Webhook Público
```typescript
import { withCors, http200, http400 } from "../../shared/utils/http.ts";

Deno.serve(withCors(async (req: Request) => {
  if (req.method !== "POST") {
    return http400("Solo se permite POST");
  }

  try {
    const webhook = await req.json();
    
    // Procesar webhook sin autenticación
    console.log("Webhook recibido:", webhook);
    
    return http200({
      status: "processed",
      id: webhook.id || "unknown"
    });
  } catch {
    return http400("Webhook inválido");
  }
}));
```

### API de Información Pública
```typescript
import { withCors, http200, http404 } from "../../shared/utils/http.ts";

const PUBLIC_DATA = {
  company: "MultiSoat",
  version: "1.0.0",
  endpoints: ["/info", "/health", "/status"]
};

Deno.serve(withCors(async (req: Request) => {
  const url = new URL(req.url);
  
  switch (url.pathname) {
    case "/info":
      return http200(PUBLIC_DATA);
    
    case "/health":
      return http200({ status: "healthy", timestamp: new Date().toISOString() });
    
    case "/status":
      return http200({ status: "online", uptime: process.uptime() });
    
    default:
      return http404("Endpoint no encontrado");
  }
}));
```

### Formulario de Contacto
```typescript
import { withCors, http200, http400 } from "../../shared/utils/http.ts";
import { Validator } from "../../shared/utils/Validator.ts";

Deno.serve(withCors(async (req: Request) => {
  if (req.method !== "POST") {
    return http400("Solo se permite POST");
  }

  try {
    const { nombre, email, mensaje } = await req.json();
    
    // Validar datos sin autenticación
    if (!nombre || !email || !mensaje) {
      return http400("Todos los campos son requeridos");
    }
    
    if (!Validator.isValidEmail(email)) {
      return http400("Email inválido");
    }
    
    // Aquí enviarías el email o guardas en DB
    console.log("Contacto recibido:", { nombre, email, mensaje });
    
    return http200({
      message: "Mensaje enviado correctamente",
      id: crypto.randomUUID()
    });
    
  } catch {
    return http400("Datos inválidos");
  }
}));
```

## Testing

### Petición GET
```bash
curl https://your-project.supabase.co/functions/v1/hello-world-noauth
```

### Petición POST
```bash
curl -X POST https://your-project.supabase.co/functions/v1/hello-world-noauth \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "data": "example"}'
```

### Desde JavaScript
```javascript
// GET request
const response = await fetch('/functions/v1/hello-world-noauth');
const data = await response.json();

// POST request
const response = await fetch('/functions/v1/hello-world-noauth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Test', data: 'example' })
});
const data = await response.json();
```

## Configuración del Dashboard

1. **Función creada**: ✅ hello-world-noauth
2. **JWT verification**: ❌ Deshabilitado
3. **CORS enabled**: ✅ Manejado por código
4. **Public access**: ✅ Habilitado

## Comparación con hello-world

| Aspecto | hello-world | hello-world-noauth |
|---------|-------------|-------------------|
| **Autenticación** | JWT requerido | Sin autenticación |
| **Dashboard config** | JWT enabled | JWT disabled |
| **Imports** | Incluye supabase.ts | Solo http.ts |
| **Uso típico** | APIs privadas | Webhooks públicos |
| **Testing** | Requiere auth header | Acceso directo |

## Migración y Evolución

### Para convertir a función autenticada:
```typescript
// 1. Cambiar imports
import { withCors, http200, http400, http401 } from "../../shared/utils/http.ts";
import { requireAuth } from "../../shared/utils/supabase.ts";

// 2. Agregar validación de auth
Deno.serve(withCors(async (req: Request) => {
  // Validar autenticación
  const authResult = await requireAuth(req);
  if (!authResult.success) {
    return http401("Authentication required");
  }
  
  // Tu lógica aquí...
}));

// 3. Habilitar JWT en dashboard
```

### Para agregar validaciones:
```typescript
import { Validator } from "../../shared/utils/Validator.ts";

// Dentro de tu función
if (data.dni && !Validator.isValidDNI(data.dni)) {
  return http400("DNI inválido");
}
```

## Buenas Prácticas

1. **Validación de entrada**: Siempre valida los datos recibidos
2. **Error handling**: Usa try-catch para JSON parsing
3. **Logging**: Usa console.log para debugging (visible en dashboard)
4. **Responses consistentes**: Siempre usa las funciones http200, http400, etc.
5. **Method checking**: Valida el método HTTP permitido

## Troubleshooting

### Error: "Module not found"
```typescript
// ❌ Incorrecto
import { http200 } from "shared/utils/http.ts";

// ✅ Correcto
import { http200 } from "../../shared/utils/http.ts";
```

### CORS Issues
```typescript
// ❌ No manejar CORS manualmente
return new Response(data, { headers: { "Access-Control-Allow-Origin": "*" } });

// ✅ Usar withCors wrapper
Deno.serve(withCors(async (req) => { ... }));
```

### Response Format Issues
```typescript
// ❌ Response inconsistente
return new Response(JSON.stringify({data}));

// ✅ Response unificada
return http200(data);
```

Esta función sirve como template perfecto para cualquier endpoint público que necesites en tu aplicación MultiSoat.
