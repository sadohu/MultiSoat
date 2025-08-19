import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface PuntoVenta {
  id?: number;
  tipo_documento: string;
  numero_documento: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email: string;
  id_externo_db_data?: number;
  estado?: string;
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
    const puntoVentaId = pathSegments[pathSegments.length - 1];

    switch (req.method) {
      case "GET": {
        if (puntoVentaId && !isNaN(Number(puntoVentaId))) {
          // Get specific punto_venta
          const { data, error } = await supabaseClient
            .from("punto_venta")
            .select("*")
            .eq("id", puntoVentaId)
            .single();

          if (error) {
            if (error.code === "PGRST116") {
              return new Response(
                JSON.stringify({
                  success: false,
                  status: 404,
                  error: "Punto de venta no encontrado",
                }),
                {
                  status: 404,
                  headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                  },
                },
              );
            }
            throw error;
          }

          return new Response(
            JSON.stringify({
              success: true,
              status: 200,
              data,
              message: "Punto de venta encontrado exitosamente",
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        } else {
          // List all puntos_venta with pagination
          const page = parseInt(url.searchParams.get("page") || "1");
          const limit = parseInt(url.searchParams.get("limit") || "10");
          const offset = (page - 1) * limit;

          // Get total count
          const { count } = await supabaseClient
            .from("punto_venta")
            .select("*", { count: "exact", head: true });

          // Get data with pagination
          const { data, error } = await supabaseClient
            .from("punto_venta")
            .select("*")
            .order("id", { ascending: false })
            .range(offset, offset + limit - 1);

          if (error) throw error;

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
              message: "Puntos de venta obtenidos exitosamente",
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
      }

      case "POST": {
        const newPuntoVenta = await req.json() as PuntoVenta;

        // Validate required fields
        if (
          !newPuntoVenta.tipo_documento || !newPuntoVenta.numero_documento ||
          !newPuntoVenta.email || !newPuntoVenta.nombre
        ) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error:
                "Los campos tipo_documento, numero_documento, nombre y email son requeridos",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Validate tipo_documento exists in catalog
        const { data: tipoDocumento, error: tipoDocError } =
          await supabaseClient
            .from("cat_tipos_documento")
            .select("codigo")
            .eq("codigo", newPuntoVenta.tipo_documento)
            .single();

        if (tipoDocError || !tipoDocumento) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "El tipo de documento especificado no es válido",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Check if numero_documento already exists
        const { data: existingDoc } = await supabaseClient
          .from("punto_venta")
          .select("id")
          .eq("numero_documento", newPuntoVenta.numero_documento)
          .single();

        if (existingDoc) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "Ya existe un punto de venta con este número de documento",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Check if email already exists
        const { data: existingEmail } = await supabaseClient
          .from("punto_venta")
          .select("id")
          .eq("email", newPuntoVenta.email)
          .single();

        if (existingEmail) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "Ya existe un punto de venta con este email",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Set default values
        const puntoVentaData = {
          ...newPuntoVenta,
          estado: newPuntoVenta.estado || "PENDIENTE_USUARIO",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabaseClient
          .from("punto_venta")
          .insert(puntoVentaData)
          .select("*")
          .single();

        if (error) {
          console.error("Error creating punto_venta:", error);
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: {
                message: "Error al crear punto de venta",
                details: error.message,
              },
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
            data: {
              success: true,
              data,
              message: "Punto de venta creado exitosamente",
            },
          }),
          {
            status: 201,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      case "PUT": {
        if (!puntoVentaId || isNaN(Number(puntoVentaId))) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "ID de punto de venta requerido",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        const updateData = await req.json() as Partial<PuntoVenta>;

        // Check if punto_venta exists
        const { data: existingPuntoVenta } = await supabaseClient
          .from("punto_venta")
          .select("id, numero_documento, email")
          .eq("id", puntoVentaId)
          .single();

        if (!existingPuntoVenta) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 404,
              error: "Punto de venta no encontrado",
            }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Check numero_documento uniqueness if being updated
        if (
          updateData.numero_documento &&
          updateData.numero_documento !== existingPuntoVenta.numero_documento
        ) {
          const { data: docExists } = await supabaseClient
            .from("punto_venta")
            .select("id")
            .eq("numero_documento", updateData.numero_documento)
            .neq("id", puntoVentaId)
            .single();

          if (docExists) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 400,
                error:
                  "Ya existe un punto de venta con este número de documento",
              }),
              {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              },
            );
          }
        }

        // Check email uniqueness if being updated
        if (updateData.email && updateData.email !== existingPuntoVenta.email) {
          const { data: emailExists } = await supabaseClient
            .from("punto_venta")
            .select("id")
            .eq("email", updateData.email)
            .neq("id", puntoVentaId)
            .single();

          if (emailExists) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 400,
                error: "Ya existe un punto de venta con este email",
              }),
              {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              },
            );
          }
        }

        // Validate tipo_documento if being updated
        if (updateData.tipo_documento) {
          const { data: tipoDocumento, error: tipoDocError } =
            await supabaseClient
              .from("cat_tipos_documento")
              .select("codigo")
              .eq("codigo", updateData.tipo_documento)
              .single();

          if (tipoDocError || !tipoDocumento) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 400,
                error: "El tipo de documento especificado no es válido",
              }),
              {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              },
            );
          }
        }

        const updatedPuntoVentaData = {
          ...updateData,
          updated_at: new Date().toISOString(),
        };

        const { data: updatedData, error: updateError } = await supabaseClient
          .from("punto_venta")
          .update(updatedPuntoVentaData)
          .eq("id", puntoVentaId)
          .select("*")
          .single();

        if (updateError) {
          console.error("Error updating punto_venta:", updateError);
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: {
                message: "Error al actualizar punto de venta",
                details: updateError.message,
              },
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
            data: updatedData,
            message: "Punto de venta actualizado exitosamente",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      case "DELETE": {
        if (!puntoVentaId || isNaN(Number(puntoVentaId))) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "ID de punto de venta requerido",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Check if punto_venta exists
        const { data: puntoVentaToDelete } = await supabaseClient
          .from("punto_venta")
          .select("id")
          .eq("id", puntoVentaId)
          .single();

        if (!puntoVentaToDelete) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 404,
              error: "Punto de venta no encontrado",
            }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Soft delete - update estado to INACTIVO
        const { data: deletedData, error: deleteError } = await supabaseClient
          .from("punto_venta")
          .update({
            estado: "INACTIVO",
            updated_at: new Date().toISOString(),
          })
          .eq("id", puntoVentaId)
          .select("*")
          .single();

        if (deleteError) {
          console.error("Error deleting punto_venta:", deleteError);
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: {
                message: "Error al eliminar punto de venta",
                details: deleteError.message,
              },
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
            data: deletedData,
            message: "Punto de venta eliminado exitosamente",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      default: {
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
    }
  } catch (error) {
    console.error("Error in punto_venta function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        status: 500,
        error: {
          message: "Error interno del servidor",
          details: error instanceof Error ? error.message : "Error desconocido",
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
