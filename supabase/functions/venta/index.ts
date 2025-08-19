import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface Venta {
  id?: number;
  id_punto_venta: number;
  fecha_venta?: string;
  precio_total: number;
  id_cliente_externo?: string | null;
  observaciones?: string | null;
  estado?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
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
    const ventaId = pathSegments[pathSegments.length - 1];

    switch (req.method) {
      case "GET": {
        if (ventaId && !isNaN(Number(ventaId))) {
          // Get single venta by ID
          const { data, error } = await supabaseClient
            .from("venta")
            .select(`
              *,
              punto_venta:id_punto_venta (
                id,
                nombre,
                numero_documento
              )
            `)
            .eq("id", ventaId)
            .single();

          if (error) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 404,
                error: "Venta no encontrada",
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
              message: "Venta encontrada exitosamente",
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        } else {
          // List all ventas with pagination and filters
          const page = parseInt(url.searchParams.get("page") || "1");
          const limit = parseInt(url.searchParams.get("limit") || "10");
          const offset = (page - 1) * limit;
          const puntoVentaId = url.searchParams.get("punto_venta_id");
          const estado = url.searchParams.get("estado");
          const fechaDesde = url.searchParams.get("fecha_desde");
          const fechaHasta = url.searchParams.get("fecha_hasta");

          // Build query
          let query = supabaseClient
            .from("venta")
            .select(
              `
              *,
              punto_venta:id_punto_venta (
                id,
                nombre,
                numero_documento
              )
            `,
              { count: "exact" },
            );

          // Apply filters
          if (puntoVentaId) {
            query = query.eq("id_punto_venta", puntoVentaId);
          }
          if (estado) {
            query = query.eq("estado", estado);
          }
          if (fechaDesde) {
            query = query.gte("fecha_venta", fechaDesde);
          }
          if (fechaHasta) {
            query = query.lte("fecha_venta", fechaHasta);
          }

          // Apply pagination and ordering
          query = query
            .order("fecha_venta", { ascending: false })
            .range(offset, offset + limit - 1);

          const { data, error, count } = await query;

          if (error) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 500,
                error: "Error al obtener ventas: " + error.message,
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
              message: "Ventas obtenidas exitosamente",
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
      }

      case "POST": {
        const newVenta = await req.json() as Venta;

        // Validate required fields
        if (!newVenta.id_punto_venta || !newVenta.precio_total) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "Los campos id_punto_venta y precio_total son requeridos",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Set default values
        const ventaData = {
          id_punto_venta: newVenta.id_punto_venta,
          fecha_venta: newVenta.fecha_venta || new Date().toISOString(),
          precio_total: newVenta.precio_total,
          id_cliente_externo: newVenta.id_cliente_externo || null,
          observaciones: newVenta.observaciones || null,
          estado: newVenta.estado || "completada",
          created_by: newVenta.created_by || null,
          updated_by: newVenta.updated_by || null,
        };

        const { data, error } = await supabaseClient
          .from("venta")
          .insert(ventaData)
          .select(`
            *,
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
              error: "Error al crear la venta: " + error.message,
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
            message: "Venta creada exitosamente",
          }),
          {
            status: 201,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      case "PUT": {
        if (!ventaId || isNaN(Number(ventaId))) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "ID de venta requerido",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        const updateData = await req.json() as Partial<Venta>;

        // Set update timestamp
        updateData.updated_at = new Date().toISOString();

        const { data, error } = await supabaseClient
          .from("venta")
          .update(updateData)
          .eq("id", ventaId)
          .select(`
            *,
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
              error: "Error al actualizar la venta: " + error.message,
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
            message: "Venta actualizada exitosamente",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      case "DELETE": {
        if (!ventaId || isNaN(Number(ventaId))) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "ID de venta requerido",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        const { data, error } = await supabaseClient
          .from("venta")
          .delete()
          .eq("id", ventaId)
          .select()
          .single();

        if (error) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: "Error al eliminar la venta: " + error.message,
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
            message: "Venta eliminada exitosamente",
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
