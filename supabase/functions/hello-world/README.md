# Edge Function: hello-world

Esta función es un ejemplo básico de Supabase Edge Function usando Deno, con cliente Supabase tipado y sin requerir autorización.

## Despliegue

Asegúrate de tener el CLI de Supabase instalado y autenticado:

```bash
supabase login
```

Despliega la función:

```bash
supabase functions deploy hello-world
```

## Uso y prueba

### Endpoint

El endpoint estará disponible en tu proyecto Supabase, por ejemplo:

```
https://<project-ref>.functions.supabase.co/hello-world
```

### Ejemplo de petición con Postman o curl

- Método: POST
- URL: [tu endpoint]/hello-world
- Headers:
  - Content-Type: application/json
- Body (raw, JSON):

```json
{
  "name": "Cheems"
}
```

#### Ejemplo con curl

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Cheems"}' \
  https://<project-ref>.functions.supabase.co/hello-world
```

### Respuesta esperada

```json
{
  "message": "Hello Cheems!"
}
```

- Si no envías un campo `name`, responderá con `Hello World!`.
- No requiere header Authorization (autorización desactivada para este ejemplo).

## Notas técnicas

- El cliente Supabase se instancia tipado usando el import alias `shared/`.
- El import map está centralizado en `supabase/functions/import_map.json`.
- Puedes usar este template para nuevas funciones, solo copia el deno.json y usa el alias para imports compartidos.

---

¿Dudas? Consulta la documentación oficial de [Supabase Edge Functions](https://supabase.com/docs/guides/functions) o revisa el código fuente de este ejemplo.
