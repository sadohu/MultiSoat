import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface AsignacionCertificado {
  id?: number;
  id_certificado: number;
  id_distribuidor?: number | null;
  id_punto_venta?: number | null;
  tipo_asignacion: string;
  fecha_asignacion?: string;
  usuario_asignacion?: string | null;
  estado?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const asignacionId = pathSegments[pathSegments.length - 1];

    switch (req.method) {
      case "GET": {
        if (asignacionId && !isNaN(Number(asignacionId))) {
          // Get single asignacion by ID
          const { data, error } = await supabaseClient
            .from("asignacion_certificado")
            .select(`
              *,
              certificado:id_certificado (
                id,
                numero_serie,
                estado
              ),
              distribuidor:id_distribuidor (
                id,
                nombre,
                email
              ),
              punto_venta:id_punto_venta (
                id,
                nombre,
                numero_documento
              )
            `)
            .eq("id", asignacionId)
            .single();

          if (error) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 404,
                error: "Asignación no encontrada",
              }),
              {
                status: 404,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              },
            );
          }

          return new Response(
            JSON.stringify({
              success: true,
              status: 200,
              data,
              message: "Asignación encontrada exitosamente",
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        } else {
          // List all asignaciones with pagination and filters
          const page = parseInt(url.searchParams.get("page") || "1");
          const limit = parseInt(url.searchParams.get("limit") || "10");
          const offset = (page - 1) * limit;
          const certificadoId = url.searchParams.get("certificado_id");
          const distribuidorId = url.searchParams.get("distribuidor_id");
          const puntoVentaId = url.searchParams.get("punto_venta_id");
          const tipoAsignacion = url.searchParams.get("tipo_asignacion");
          const estado = url.searchParams.get("estado");

          // Build query
          let query = supabaseClient
            .from("asignacion_certificado")
            .select(
              `
              *,
              certificado:id_certificado (
                id,
                numero_serie,
                estado
              ),
              distribuidor:id_distribuidor (
                id,
                nombre,
                email
              ),
              punto_venta:id_punto_venta (
                id,
                nombre,
                numero_documento
              )
            `,
              { count: "exact" },
            );

          // Apply filters
          if (certificadoId) {
            query = query.eq("id_certificado", certificadoId);
          }
          if (distribuidorId) {
            query = query.eq("id_distribuidor", distribuidorId);
          }
          if (puntoVentaId) {
            query = query.eq("id_punto_venta", puntoVentaId);
          }
          if (tipoAsignacion) {
            query = query.eq("tipo_asignacion", tipoAsignacion);
          }
          if (estado) {
            query = query.eq("estado", estado);
          }

          // Apply pagination and ordering
          query = query
            .order("fecha_asignacion", { ascending: false })
            .range(offset, offset + limit - 1);

          const { data, error, count } = await query;

          if (error) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 500,
                error: "Error al obtener asignaciones: " + error.message,
              }),
              {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              },
            );
          }

          return new Response(
            JSON.stringify({
              success: true,
              status: 200,
              data,
              pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
              },
              message: "Asignaciones obtenidas exitosamente",
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
      }

      case "POST": {
        const newAsignacion = await req.json() as AsignacionCertificado;

        // Validate required fields
        if (!newAsignacion.id_certificado || !newAsignacion.tipo_asignacion) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error:
                "Los campos id_certificado y tipo_asignacion son requeridos",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Set default values
        const asignacionData = {
          id_certificado: newAsignacion.id_certificado,
          id_distribuidor: newAsignacion.id_distribuidor || null,
          id_punto_venta: newAsignacion.id_punto_venta || null,
          tipo_asignacion: newAsignacion.tipo_asignacion,
          fecha_asignacion: new Date().toISOString(),
          usuario_asignacion: newAsignacion.usuario_asignacion || null,
          estado: newAsignacion.estado || "activo",
        };

        const { data, error } = await supabaseClient
          .from("asignacion_certificado")
          .insert(asignacionData)
          .select(`
            *,
            certificado:id_certificado (
              id,
              numero_serie,
              estado
            ),
            distribuidor:id_distribuidor (
              id,
              nombre,
              email
            ),
            punto_venta:id_punto_venta (
              id,
              nombre,
              numero_documento
            )
          `)
          .single();

        if (error) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: "Error al crear la asignación: " + error.message,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            status: 201,
            data,
            message: "Asignación creada exitosamente",
          }),
          {
            status: 201,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      case "PUT": {
        if (!asignacionId || isNaN(Number(asignacionId))) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "ID de asignación requerido",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        const updateData = await req.json() as Partial<AsignacionCertificado>;

        // Set update timestamp
        updateData.updated_at = new Date().toISOString();

        const { data, error } = await supabaseClient
          .from("asignacion_certificado")
          .update(updateData)
          .eq("id", asignacionId)
          .select(`
            *,
            certificado:id_certificado (
              id,
              numero_serie,
              estado
            ),
            distribuidor:id_distribuidor (
              id,
              nombre,
              email
            ),
            punto_venta:id_punto_venta (
              id,
              nombre,
              numero_documento
            )
          `)
          .single();

        if (error) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: "Error al actualizar la asignación: " + error.message,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            status: 200,
            data,
            message: "Asignación actualizada exitosamente",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      // TODO: No existe logica clara de que realiza
      case "DELETE": {
        if (!asignacionId || isNaN(Number(asignacionId))) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "ID de asignación requerido",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        const { data, error } = await supabaseClient
          .from("asignacion_certificado")
          .delete()
          .eq("id", asignacionId)
          .select()
          .single();

        if (error) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: "Error al eliminar la asignación: " + error.message,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            status: 200,
            data,
            message: "Asignación eliminada exitosamente",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      default:
        return new Response(
          JSON.stringify({
            success: false,
            status: 405,
            error: "Método no permitido",
          }),
          {
            status: 405,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        status: 500,
        error: "Error interno del servidor: " + (error as Error).message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
