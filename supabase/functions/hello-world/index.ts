// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { http200, http500, withCors } from "shared/utils/http.ts";
import { getSupabaseClient } from "shared/utils/supabase.ts";
// import { withAuth } from "shared/utils/supabase.ts"; // Descomenta y envuelve el handler si quieres exigir auth

console.log("Hello from Functions!");

// Endpoint PUBLICO por defecto. Para protegerlo:
//   Deno.serve(withCors(withAuth(async (req, { user, supabase }) => { ... })));
// Y configura en el dashboard que la función requiera verificación JWT si aplica.

Deno.serve(withCors(async (req: Request) => {
  try {
    const supabase = getSupabaseClient(req);
    const body = await req.json().catch(() => ({}));
    const name = typeof body?.name === "string" ? body.name : "World";
    await supabase.from("proveedor").select("id").limit(0);
    return http200({ message: `Hello ${name}!` });
  } catch (e) {
    return http500("Unhandled error", String(e));
  }
}));

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
