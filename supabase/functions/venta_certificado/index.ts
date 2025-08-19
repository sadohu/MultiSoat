import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface VentaCertificado {
  id?: number
  id_venta: number
  id_certificado: number
  precio_venta: number
  monto_fijo_proveedor?: number | null
  descuento_aplicado?: number
  ganancia_pv?: number | null
  estado?: string
  created_at?: string
  updated_at?: string
  created_by?: string | null
  updated_by?: string | null
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const ventaCertificadoId = pathSegments[pathSegments.length - 1]

    switch (req.method) {
      case 'GET': {
        if (ventaCertificadoId && !isNaN(Number(ventaCertificadoId))) {
          // Get single venta_certificado by ID
          const { data, error } = await supabaseClient
            .from('venta_certificado')
            .select(`
              *,
              venta:id_venta (
                id,
                fecha_venta,
                precio_total,
                punto_venta:id_punto_venta (
                  id,
                  nombre
                )
              ),
              certificado:id_certificado (
                id,
                numero_certificado,
                proveedor:id_proveedor (
                  id,
                  nombre
                )
              )
            `)
            .eq('id', ventaCertificadoId)
            .single()

          if (error) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 404,
                error: 'Venta de certificado no encontrada'
              }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          return new Response(
            JSON.stringify({
              success: true,
              status: 200,
              data,
              message: 'Venta de certificado encontrada exitosamente'
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          // List all venta_certificado with pagination and filters
          const page = parseInt(url.searchParams.get('page') || '1')
          const limit = parseInt(url.searchParams.get('limit') || '10')
          const offset = (page - 1) * limit
          const ventaId = url.searchParams.get('venta_id')
          const certificadoId = url.searchParams.get('certificado_id')
          const estado = url.searchParams.get('estado')

          // Build query
          let query = supabaseClient
            .from('venta_certificado')
            .select(`
              *,
              venta:id_venta (
                id,
                fecha_venta,
                precio_total,
                punto_venta:id_punto_venta (
                  id,
                  nombre
                )
              ),
              certificado:id_certificado (
                id,
                numero_certificado,
                proveedor:id_proveedor (
                  id,
                  nombre
                )
              )
            `, { count: 'exact' })

          // Apply filters
          if (ventaId) {
            query = query.eq('id_venta', ventaId)
          }
          if (certificadoId) {
            query = query.eq('id_certificado', certificadoId)
          }
          if (estado) {
            query = query.eq('estado', estado)
          }

          // Apply pagination and ordering
          query = query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

          const { data, error, count } = await query

          if (error) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 500,
                error: 'Error al obtener ventas de certificados: ' + error.message
              }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
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
                totalPages: Math.ceil((count || 0) / limit)
              },
              message: 'Ventas de certificados obtenidas exitosamente'
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      case 'POST': {
        const newVentaCertificado = await req.json() as VentaCertificado

        // Validate required fields
        if (!newVentaCertificado.id_venta || !newVentaCertificado.id_certificado || !newVentaCertificado.precio_venta) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: 'Los campos id_venta, id_certificado y precio_venta son requeridos'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Set default values
        const ventaCertificadoData = {
          id_venta: newVentaCertificado.id_venta,
          id_certificado: newVentaCertificado.id_certificado,
          precio_venta: newVentaCertificado.precio_venta,
          monto_fijo_proveedor: newVentaCertificado.monto_fijo_proveedor || null,
          descuento_aplicado: newVentaCertificado.descuento_aplicado || 0,
          ganancia_pv: newVentaCertificado.ganancia_pv || null,
          estado: newVentaCertificado.estado || 'vendido',
          created_by: newVentaCertificado.created_by || null,
          updated_by: newVentaCertificado.updated_by || null
        }

        const { data, error } = await supabaseClient
          .from('venta_certificado')
          .insert(ventaCertificadoData)
          .select(`
            *,
            venta:id_venta (
              id,
              fecha_venta,
              precio_total,
              punto_venta:id_punto_venta (
                id,
                nombre
              )
            ),
            certificado:id_certificado (
              id,
              numero_certificado,
              proveedor:id_proveedor (
                id,
                nombre
              )
            )
          `)
          .single()

        if (error) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: 'Error al crear la venta de certificado: ' + error.message
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({
            success: true,
            status: 201,
            data,
            message: 'Venta de certificado creada exitosamente'
          }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'PUT': {
        if (!ventaCertificadoId || isNaN(Number(ventaCertificadoId))) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: 'ID de venta de certificado requerido'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const updateData = await req.json() as Partial<VentaCertificado>

        // Set update timestamp
        updateData.updated_at = new Date().toISOString()

        const { data, error } = await supabaseClient
          .from('venta_certificado')
          .update(updateData)
          .eq('id', ventaCertificadoId)
          .select(`
            *,
            venta:id_venta (
              id,
              fecha_venta,
              precio_total,
              punto_venta:id_punto_venta (
                id,
                nombre
              )
            ),
            certificado:id_certificado (
              id,
              numero_certificado,
              proveedor:id_proveedor (
                id,
                nombre
              )
            )
          `)
          .single()

        if (error) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: 'Error al actualizar la venta de certificado: ' + error.message
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({
            success: true,
            status: 200,
            data,
            message: 'Venta de certificado actualizada exitosamente'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'DELETE': {
        if (!ventaCertificadoId || isNaN(Number(ventaCertificadoId))) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: 'ID de venta de certificado requerido'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { data, error } = await supabaseClient
          .from('venta_certificado')
          .delete()
          .eq('id', ventaCertificadoId)
          .select()
          .single()

        if (error) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: 'Error al eliminar la venta de certificado: ' + error.message
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({
            success: true,
            status: 200,
            data,
            message: 'Venta de certificado eliminada exitosamente'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({
            success: false,
            status: 405,
            error: 'Método no permitido'
          }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        status: 500,
        error: 'Error interno del servidor: ' + (error as Error).message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
