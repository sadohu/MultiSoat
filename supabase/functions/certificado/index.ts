import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface Certificado {
  id?: number;
  id_proveedor: number;
  numero_serie: string;
  categoria?: string; // Opcional - se asigna durante la venta
  foto_url?: string;
  datos_vehiculo_externo?: string;
  estado?: string;
  fecha_registro?: string;
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
    const certificadoId = pathSegments[pathSegments.length - 1];

    switch (req.method) {
      case "GET": {
        if (certificadoId && !isNaN(Number(certificadoId))) {
          // Get single certificado by ID
          const { data, error } = await supabaseClient
            .from("certificado")
            .select(`
              *,
              proveedor:id_proveedor (
                id,
                razon_social,
                numero_documento
              )
            `)
            .eq("id", certificadoId)
            .single();

          if (error) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 404,
                error: "Certificado no encontrado",
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
              message: "Certificado encontrado exitosamente",
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        } else {
          // List all certificados with pagination and filters
          const page = parseInt(url.searchParams.get("page") || "1");
          const limit = parseInt(url.searchParams.get("limit") || "10");
          const offset = (page - 1) * limit;
          const proveedorId = url.searchParams.get("proveedor_id");
          const estado = url.searchParams.get("estado");
          const categoria = url.searchParams.get("categoria");
          const numeroSerie = url.searchParams.get("numero_serie");

          // Build query
          let query = supabaseClient
            .from("certificado")
            .select(
              `
              *,
              proveedor:id_proveedor (
                id,
                razon_social,
                numero_documento
              )
            `,
              { count: "exact" },
            );

          // Apply filters
          if (proveedorId) {
            query = query.eq("id_proveedor", proveedorId);
          }
          if (estado) {
            query = query.eq("estado", estado);
          }
          if (categoria) {
            query = query.eq("categoria", categoria);
          }
          if (numeroSerie) {
            query = query.ilike("numero_serie", `%${numeroSerie}%`);
          }

          // Apply pagination and ordering
          query = query
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

          const { data, error, count } = await query;

          if (error) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 500,
                error: "Error al obtener certificados: " + error.message,
              }),
              {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              },
            );
          }

          const totalPages = Math.ceil((count || 0) / limit);

          return new Response(
            JSON.stringify({
              success: true,
              status: 200,
              data,
              pagination: {
                page,
                limit,
                total: count || 0,
                totalPages,
              },
              message: "Certificados obtenidos exitosamente",
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
      }

      case "POST": {
        const newCertificado = await req.json() as Certificado;

        // Validate required fields
        if (!newCertificado.id_proveedor || !newCertificado.numero_serie) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "Los campos id_proveedor y numero_serie son requeridos",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Verify proveedor exists
        const { data: proveedor, error: proveedorError } = await supabaseClient
          .from("proveedor")
          .select("id")
          .eq("id", newCertificado.id_proveedor)
          .single();

        if (proveedorError || !proveedor) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "El proveedor especificado no existe",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Verify categoria exists if provided
        if (newCertificado.categoria) {
          const { data: categoria, error: categoriaError } =
            await supabaseClient
              .from("cat_categorias_certificado")
              .select("codigo")
              .eq("codigo", newCertificado.categoria)
              .eq("activo", true)
              .single();

          if (categoriaError || !categoria) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 400,
                error: "La categoría especificada no existe o no está activa",
              }),
              {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              },
            );
          }
        }

        // Check if numero_serie already exists
        const { data: existingCertificado } = await supabaseClient
          .from("certificado")
          .select("id")
          .eq("numero_serie", newCertificado.numero_serie)
          .single();

        if (existingCertificado) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "Ya existe un certificado con este número de serie",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Set default values
        const certificadoData = {
          ...newCertificado,
          estado: newCertificado.estado || "DISPONIBLE",
          fecha_registro: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabaseClient
          .from("certificado")
          .insert(certificadoData)
          .select(`
            *,
            proveedor:id_proveedor (
              id,
              razon_social,
              numero_documento
            ),
            categoria_info:categoria (
              codigo,
              descripcion,
              servicio,
              clase
            )
          `)
          .single();

        if (error) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: "Error al crear certificado: " + error.message,
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
            message: "Certificado creado exitosamente",
          }),
          {
            status: 201,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      case "PUT": {
        if (!certificadoId || isNaN(Number(certificadoId))) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "ID de certificado inválido",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        const updateData = await req.json() as Partial<Certificado>;

        // Check if certificado exists
        const { data: existingCertificado, error: existingError } =
          await supabaseClient
            .from("certificado")
            .select("id, estado, numero_serie")
            .eq("id", certificadoId)
            .single();

        if (existingError || !existingCertificado) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 404,
              error: "Certificado no encontrado",
            }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Verify categoria exists if provided
        if (updateData.categoria) {
          const { data: categoria, error: categoriaError } =
            await supabaseClient
              .from("cat_categorias_certificado")
              .select("codigo")
              .eq("codigo", updateData.categoria)
              .eq("activo", true)
              .single();

          if (categoriaError || !categoria) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 400,
                error: "La categoría especificada no existe o no está activa",
              }),
              {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              },
            );
          }
        }

        // Check if numero_serie already exists (if being updated)
        if (
          updateData.numero_serie &&
          updateData.numero_serie !== existingCertificado.numero_serie
        ) {
          const { data: duplicateCertificado } = await supabaseClient
            .from("certificado")
            .select("id")
            .eq("numero_serie", updateData.numero_serie)
            .neq("id", certificadoId)
            .single();

          if (duplicateCertificado) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 400,
                error: "Ya existe otro certificado con este número de serie",
              }),
              {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              },
            );
          }
        }

        // Validate estado transitions
        if (updateData.estado) {
          const validEstados = [
            "DISPONIBLE",
            "ASIGNADO_DIST",
            "ASIGNADO_PV",
            "VENDIDO",
            "ANULADO",
          ];
          if (!validEstados.includes(updateData.estado)) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 400,
                error: "Estado de certificado inválido",
              }),
              {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              },
            );
          }

          // Prevent certain state transitions
          if (
            existingCertificado.estado === "VENDIDO" &&
            updateData.estado !== "ANULADO"
          ) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 400,
                error:
                  "No se puede cambiar el estado de un certificado vendido (solo se puede anular)",
              }),
              {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              },
            );
          }
        }

        const certificadoUpdateData = {
          ...updateData,
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabaseClient
          .from("certificado")
          .update(certificadoUpdateData)
          .eq("id", certificadoId)
          .select(`
            *,
            proveedor:id_proveedor (
              id,
              razon_social,
              numero_documento
            ),
            categoria_info:categoria (
              codigo,
              descripcion,
              servicio,
              clase
            )
          `)
          .single();

        if (error) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: "Error al actualizar certificado: " + error.message,
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
            message: "Certificado actualizado exitosamente",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      case "DELETE": {
        if (!certificadoId || isNaN(Number(certificadoId))) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: "ID de certificado inválido",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Check if certificado exists and can be deleted
        const { data: existingCertificado, error: existingError } =
          await supabaseClient
            .from("certificado")
            .select("id, estado")
            .eq("id", certificadoId)
            .single();

        if (existingError || !existingCertificado) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 404,
              error: "Certificado no encontrado",
            }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Prevent deletion of sold certificates
        if (existingCertificado.estado === "VENDIDO") {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error:
                "No se puede eliminar un certificado vendido. Use anulación en su lugar.",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Check if certificate is assigned (has asignacion_certificado records)
        const { data: asignaciones } = await supabaseClient
          .from("asignacion_certificado")
          .select("id")
          .eq("id_certificado", certificadoId)
          .eq("estado", "activo");

        if (asignaciones && asignaciones.length > 0) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error:
                "No se puede eliminar un certificado que tiene asignaciones activas",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Soft delete: change estado to ANULADO
        const { data, error } = await supabaseClient
          .from("certificado")
          .update({
            estado: "ANULADO",
            updated_at: new Date().toISOString(),
          })
          .eq("id", certificadoId)
          .select(`
            *,
            proveedor:id_proveedor (
              id,
              razon_social,
              numero_documento
            ),
            categoria_info:categoria (
              codigo,
              descripcion,
              servicio,
              clase
            )
          `)
          .single();

        if (error) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: "Error al anular certificado: " + error.message,
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
            message: "Certificado anulado exitosamente",
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
