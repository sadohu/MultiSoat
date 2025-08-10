
# Uso de supabase.ts

Esta guía explica cómo utilizar el archivo `supabase.ts` para interactuar de forma segura y tipada con tu base de datos Supabase en proyectos TypeScript/Deno/Node.js.

---

## 1. Instalación y configuración del cliente tipado

Instala el SDK de Supabase:

```bash
npm install @supabase/supabase-js
```

Importa y crea el cliente tipado:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert, TablesUpdate } from './supabase';

const SUPABASE_URL = 'https://<your-project>.supabase.co';
const SUPABASE_KEY = '<your-anon-or-service-role-key>';

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

// Ejemplo de uso de los tipos generados
type Proveedor = Tables<'proveedor'>;
type NuevoProveedor = TablesInsert<'proveedor'>;
type ActualizarProveedor = TablesUpdate<'proveedor'>;
```

---

## 2. Ejemplos CRUD usando los tipos generados

### a) Consultar registros (SELECT)

```typescript
async function obtenerProveedores() {
  const { data, error } = await supabase
    .from('proveedor')
    .select('*');
  // data es de tipo Proveedor[] automáticamente
  if (error) throw error;
  return data;
}
```

### b) Insertar registros (INSERT)

```typescript
const nuevoProveedor: NuevoProveedor = {
  tipo_documento: 'ruc',
  numero_documento: '12345678901',
  nombre: 'Proveedor 1',
  // ...otros campos
};

const { data, error } = await supabase
  .from('proveedor')
  .insert([nuevoProveedor])
  .select();
```

### c) Actualizar registros (UPDATE)

```typescript
const { data, error } = await supabase
  .from('proveedor')
  .update({ nombre: 'Proveedor Actualizado' })
  .eq('id', 1)
  .select();
```

### d) Eliminar registros (DELETE)

```typescript
const { error } = await supabase
  .from('proveedor')
  .delete()
  .eq('id', 1);
```

---


## 3. Relaciones y joins

Puedes hacer joins usando `.select('campo,relacion(campo)')`:

```typescript
const { data, error } = await supabase
  .from('venta')
  .select('*, punto_venta(nombre), proveedor(nombre)');
```

---

begin

## 4. Transacciones (funciones RPC)

Supabase no soporta transacciones SQL multi-query nativas desde el cliente, pero puedes:
- Usar funciones RPC (Postgres Functions) para lógica transaccional.
- O manejar la lógica en el backend y asegurar atomicidad desde ahí.

### Ejemplo de función RPC (en SQL):

```sql
create or replace function crear_venta_y_certificado(
  datos_venta jsonb,
  datos_certificado jsonb
) returns void as $$

  -- Tu lógica aquí
end;
$$ language plpgsql;
```

Y llamarla desde el cliente:

```typescript
const { data, error } = await supabase.rpc('crear_venta_y_certificado', {
  datos_venta: { /* ... */ },
  datos_certificado: { /* ... */ }
});
```
---


## 5. Tipos útiles

- `Tables<'tabla'>`: tipo de fila de la tabla (lectura/consulta).
- `TablesInsert<'tabla'>`: tipo para inserción.
- `TablesUpdate<'tabla'>`: tipo para actualización.

Estos tipos ayudan a tener autocompletado y validación de tipos en tiempo de desarrollo.

---


## 6. Notas

- Los campos de fecha/hora (`timestamp`, `date`) llegan como string ISO (ejemplo: "2025-08-10T12:34:56.789Z").
- Convierte a `Date` en JS si lo necesitas: `new Date(row.created_at)`.
- Usa los tipos para máxima seguridad y autocompletado en tu editor.

---


## 7. Recursos
- [Supabase JS Docs](https://supabase.com/docs/reference/javascript)
- [Supabase TypeScript Codegen](https://supabase.com/docs/guides/api/generating-types)
- [Ejemplo de funciones RPC](https://supabase.com/docs/guides/functions)
