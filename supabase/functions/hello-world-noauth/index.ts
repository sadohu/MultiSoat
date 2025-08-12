
import "@supabase/functions-js/edge-runtime.d.ts";
import { http200, http400 } from "@utils/httpResponse.ts";

console.log("Hello from hello-world-noauth!");

Deno.serve(async (req) => {
  let name = "World";
  try {
    const body = await req.json();
    if (body?.name && typeof body.name === "string") {
      name = body.name;
    }
    return http200({ message: `Hello ${name}!` });
  } catch (err) {
    // Ejemplo de respuesta de error por body inválido
    return http400("Body inválido o no-JSON", { error: err?.message });
  }
});
