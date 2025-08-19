import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface Afiliacion {
  id?: number
  id_proveedor: number
  id_distribuidor?: number
  id_punto_venta: number
  estado?: string
  fecha_aprobacion?: string
  usuario_aprobador?: string
  observaciones?: string
  created_at?: string
  updated_at?: string
  created_by?: string
  updated_by?: string
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
    const afiliacionId = pathSegments[pathSegments.length - 1]

    switch (req.method) {
      case 'GET': {
        if (afiliacionId && !isNaN(Number(afiliacionId))) {
          // Get specific afiliacion
          const { data, error } = await supabaseClient
            .from('afiliacion_pv_proveedor')
            .select(`
              *,
              proveedor:id_proveedor (
                id,
                razon_social,
                numero_documento,
                email
              ),
              distribuidor:id_distribuidor (
                id,
                nombre,
                email
              ),
              punto_venta:id_punto_venta (
                id,
                nombre,
                numero_documento,
                email
              )
            `)
            .eq('id', afiliacionId)
            .single()

          if (error) {
            if (error.code === 'PGRST116') {
              return new Response(
                JSON.stringify({
                  success: false,
                  status: 404,
                  error: 'Afiliación no encontrada'
                }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              )
            }
            throw error
          }

          return new Response(
            JSON.stringify({
              success: true,
              status: 200,
              data,
              message: 'Afiliación encontrada exitosamente'
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          // List all afiliaciones with pagination and filters
          const page = parseInt(url.searchParams.get('page') || '1')
          const limit = parseInt(url.searchParams.get('limit') || '10')
          const offset = (page - 1) * limit
          const proveedorId = url.searchParams.get('proveedor_id')
          const puntoVentaId = url.searchParams.get('punto_venta_id')
          const estado = url.searchParams.get('estado')

          // Build query
          let query = supabaseClient
            .from('afiliacion_pv_proveedor')
            .select(`
              *,
              proveedor:id_proveedor (
                id,
                razon_social,
                numero_documento
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
            `, { count: 'exact' })

          // Apply filters
          if (proveedorId) {
            query = query.eq('id_proveedor', proveedorId)
          }
          if (puntoVentaId) {
            query = query.eq('id_punto_venta', puntoVentaId)
          }
          if (estado) {
            query = query.eq('estado', estado)
          }

          // Get total count
          const { count } = await query

          // Get data with pagination
          const { data, error } = await query
            .order('id', { ascending: false })
            .range(offset, offset + limit - 1)

          if (error) throw error

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
              message: 'Afiliaciones obtenidas exitosamente'
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
        
      case 'POST': {
        const newAfiliacion = await req.json() as Afiliacion

        // Validate required fields
        if (!newAfiliacion.id_proveedor || !newAfiliacion.id_punto_venta) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: 'Los campos id_proveedor e id_punto_venta son requeridos'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Verify proveedor exists
        const { data: proveedor, error: proveedorError } = await supabaseClient
          .from('proveedor')
          .select('id')
          .eq('id', newAfiliacion.id_proveedor)
          .single()

        if (proveedorError || !proveedor) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: 'El proveedor especificado no existe'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Verify punto_venta exists
        const { data: puntoVenta, error: puntoVentaError } = await supabaseClient
          .from('punto_venta')
          .select('id')
          .eq('id', newAfiliacion.id_punto_venta)
          .single()

        if (puntoVentaError || !puntoVenta) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: 'El punto de venta especificado no existe'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Verify distribuidor exists if provided
        if (newAfiliacion.id_distribuidor) {
          const { data: distribuidor, error: distribuidorError } = await supabaseClient
            .from('distribuidor')
            .select('id')
            .eq('id', newAfiliacion.id_distribuidor)
            .single()

          if (distribuidorError || !distribuidor) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 400,
                error: 'El distribuidor especificado no existe'
              }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        // Check if afiliacion already exists (unique constraint)
        const { data: existingAfiliacion } = await supabaseClient
          .from('afiliacion_pv_proveedor')
          .select('id')
          .eq('id_proveedor', newAfiliacion.id_proveedor)
          .eq('id_punto_venta', newAfiliacion.id_punto_venta)
          .single()

        if (existingAfiliacion) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: 'Ya existe una afiliación entre este proveedor y punto de venta'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Set default values
        const afiliacionData = {
          ...newAfiliacion,
          estado: newAfiliacion.estado || 'PENDIENTE_APROBACION',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data, error } = await supabaseClient
          .from('afiliacion_pv_proveedor')
          .insert(afiliacionData)
          .select(`
            *,
            proveedor:id_proveedor (
              id,
              razon_social,
              numero_documento
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
          .single()

        if (error) {
          console.error('Error creating afiliacion:', error)
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: {
                message: 'Error al crear afiliación',
                details: error.message
              }
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({
            success: true,
            status: 201,
            data: {
              success: true,
              data,
              message: 'Afiliación creada exitosamente'
            }
          }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'PUT': {
        if (!afiliacionId || isNaN(Number(afiliacionId))) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: 'ID de afiliación requerido'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const updateData = await req.json() as Partial<Afiliacion>

        // Check if afiliacion exists
        const { data: existingAfiliacion } = await supabaseClient
          .from('afiliacion_pv_proveedor')
          .select('id, id_proveedor, id_punto_venta')
          .eq('id', afiliacionId)
          .single()

        if (!existingAfiliacion) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 404,
              error: 'Afiliación no encontrada'
            }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Verify entities exist if being updated
        if (updateData.id_proveedor && updateData.id_proveedor !== existingAfiliacion.id_proveedor) {
          const { data: proveedor, error: proveedorError } = await supabaseClient
            .from('proveedor')
            .select('id')
            .eq('id', updateData.id_proveedor)
            .single()

          if (proveedorError || !proveedor) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 400,
                error: 'El proveedor especificado no existe'
              }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        if (updateData.id_punto_venta && updateData.id_punto_venta !== existingAfiliacion.id_punto_venta) {
          const { data: puntoVenta, error: puntoVentaError } = await supabaseClient
            .from('punto_venta')
            .select('id')
            .eq('id', updateData.id_punto_venta)
            .single()

          if (puntoVentaError || !puntoVenta) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 400,
                error: 'El punto de venta especificado no existe'
              }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        if (updateData.id_distribuidor) {
          const { data: distribuidor, error: distribuidorError } = await supabaseClient
            .from('distribuidor')
            .select('id')
            .eq('id', updateData.id_distribuidor)
            .single()

          if (distribuidorError || !distribuidor) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 400,
                error: 'El distribuidor especificado no existe'
              }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        // Special handling for approval
        const updatedAfiliacionData = {
          ...updateData,
          updated_at: new Date().toISOString()
        }

        // If approving, set approval date
        if (updateData.estado === 'ACTIVA' && !updateData.fecha_aprobacion) {
          updatedAfiliacionData.fecha_aprobacion = new Date().toISOString()
        }

        const { data: updatedData, error: updateError } = await supabaseClient
          .from('afiliacion_pv_proveedor')
          .update(updatedAfiliacionData)
          .eq('id', afiliacionId)
          .select(`
            *,
            proveedor:id_proveedor (
              id,
              razon_social,
              numero_documento
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
          .single()

        if (updateError) {
          console.error('Error updating afiliacion:', updateError)
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: {
                message: 'Error al actualizar afiliación',
                details: updateError.message
              }
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({
            success: true,
            status: 200,
            data: updatedData,
            message: 'Afiliación actualizada exitosamente'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'DELETE': {
        if (!afiliacionId || isNaN(Number(afiliacionId))) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: 'ID de afiliación requerido'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check if afiliacion exists
        const { data: afiliacionToDelete } = await supabaseClient
          .from('afiliacion_pv_proveedor')
          .select('id')
          .eq('id', afiliacionId)
          .single()

        if (!afiliacionToDelete) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 404,
              error: 'Afiliación no encontrada'
            }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Soft delete - update estado to CANCELADA
        const { data: deletedData, error: deleteError } = await supabaseClient
          .from('afiliacion_pv_proveedor')
          .update({ 
            estado: 'CANCELADA',
            updated_at: new Date().toISOString()
          })
          .eq('id', afiliacionId)
          .select(`
            *,
            proveedor:id_proveedor (
              id,
              razon_social,
              numero_documento
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
          .single()

        if (deleteError) {
          console.error('Error deleting afiliacion:', deleteError)
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: {
                message: 'Error al cancelar afiliación',
                details: deleteError.message
              }
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({
            success: true,
            status: 200,
            data: deletedData,
            message: 'Afiliación cancelada exitosamente'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default: {
        return new Response(
          JSON.stringify({
            success: false,
            status: 405,
            error: 'Método no permitido'
          }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

  } catch (error) {
    console.error('Error in afiliacion function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        status: 500,
        error: {
          message: 'Error interno del servidor',
          details: error instanceof Error ? error.message : 'Error desconocido'
        }
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
