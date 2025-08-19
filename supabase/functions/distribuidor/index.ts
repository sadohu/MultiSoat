import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface Distribuidor {
  id?: number
  id_proveedor: number
  nombre: string
  telefono?: string
  email: string
  id_externo_db_data?: number
  estado?: string
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
    const distributorId = pathSegments[pathSegments.length - 1]

    switch (req.method) {
      case 'GET': {
        if (distributorId && !isNaN(Number(distributorId))) {
          // Get specific distribuidor
          const { data, error } = await supabaseClient
            .from('distribuidor')
            .select(`
              *,
              proveedor:id_proveedor (
                id,
                razon_social,
                numero_documento
              )
            `)
            .eq('id', distributorId)
            .single()

          if (error) {
            if (error.code === 'PGRST116') {
              return new Response(
                JSON.stringify({
                  success: false,
                  status: 404,
                  error: 'Distribuidor no encontrado'
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
              message: 'Distribuidor encontrado exitosamente'
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          // List all distribuidores with pagination
          const page = parseInt(url.searchParams.get('page') || '1')
          const limit = parseInt(url.searchParams.get('limit') || '10')
          const offset = (page - 1) * limit

          // Get total count
          const { count } = await supabaseClient
            .from('distribuidor')
            .select('*', { count: 'exact', head: true })

          // Get data with pagination
          const { data, error } = await supabaseClient
            .from('distribuidor')
            .select(`
              *,
              proveedor:id_proveedor (
                id,
                razon_social,
                numero_documento
              )
            `)
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
              message: 'Distribuidores obtenidos exitosamente'
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
        
      case 'POST': {
        const newDistribuidor = await req.json() as Distribuidor

        // Validate required fields
        if (!newDistribuidor.id_proveedor || !newDistribuidor.email || !newDistribuidor.nombre) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: 'Los campos id_proveedor, nombre y email son requeridos'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Verify proveedor exists
        const { data: proveedor, error: proveedorError } = await supabaseClient
          .from('proveedor')
          .select('id')
          .eq('id', newDistribuidor.id_proveedor)
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

        // Check if email already exists
        const { data: existingEmail } = await supabaseClient
          .from('distribuidor')
          .select('id')
          .eq('email', newDistribuidor.email)
          .single()

        if (existingEmail) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: 'Ya existe un distribuidor con este email'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Set default values
        const distributorData = {
          ...newDistribuidor,
          estado: newDistribuidor.estado || 'PENDIENTE_USUARIO',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data, error } = await supabaseClient
          .from('distribuidor')
          .insert(distributorData)
          .select(`
            *,
            proveedor:id_proveedor (
              id,
              razon_social,
              numero_documento
            )
          `)
          .single()

        if (error) {
          console.error('Error creating distribuidor:', error)
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: {
                message: 'Error al crear distribuidor',
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
              message: 'Distribuidor creado exitosamente'
            }
          }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'PUT': {
        if (!distributorId || isNaN(Number(distributorId))) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: 'ID de distribuidor requerido'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const updateData = await req.json() as Partial<Distribuidor>

        // Check if distribuidor exists
        const { data: existingDistribuidor } = await supabaseClient
          .from('distribuidor')
          .select('id, email')
          .eq('id', distributorId)
          .single()

        if (!existingDistribuidor) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 404,
              error: 'Distribuidor no encontrado'
            }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check email uniqueness if email is being updated
        if (updateData.email && updateData.email !== existingDistribuidor.email) {
          const { data: emailExists } = await supabaseClient
            .from('distribuidor')
            .select('id')
            .eq('email', updateData.email)
            .neq('id', distributorId)
            .single()

          if (emailExists) {
            return new Response(
              JSON.stringify({
                success: false,
                status: 400,
                error: 'Ya existe un distribuidor con este email'
              }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        // Verify proveedor exists if id_proveedor is being updated
        if (updateData.id_proveedor) {
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

        const updatedDistributorData = {
          ...updateData,
          updated_at: new Date().toISOString()
        }

        const { data: updatedData, error: updateError } = await supabaseClient
          .from('distribuidor')
          .update(updatedDistributorData)
          .eq('id', distributorId)
          .select(`
            *,
            proveedor:id_proveedor (
              id,
              razon_social,
              numero_documento
            )
          `)
          .single()

        if (updateError) {
          console.error('Error updating distribuidor:', updateError)
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: {
                message: 'Error al actualizar distribuidor',
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
            message: 'Distribuidor actualizado exitosamente'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'DELETE': {
        if (!distributorId || isNaN(Number(distributorId))) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 400,
              error: 'ID de distribuidor requerido'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check if distribuidor exists
        const { data: distributorToDelete } = await supabaseClient
          .from('distribuidor')
          .select('id')
          .eq('id', distributorId)
          .single()

        if (!distributorToDelete) {
          return new Response(
            JSON.stringify({
              success: false,
              status: 404,
              error: 'Distribuidor no encontrado'
            }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Soft delete - update estado to INACTIVO
        const { data: deletedData, error: deleteError } = await supabaseClient
          .from('distribuidor')
          .update({ 
            estado: 'INACTIVO',
            updated_at: new Date().toISOString()
          })
          .eq('id', distributorId)
          .select(`
            *,
            proveedor:id_proveedor (
              id,
              razon_social,
              numero_documento
            )
          `)
          .single()

        if (deleteError) {
          console.error('Error deleting distribuidor:', deleteError)
          return new Response(
            JSON.stringify({
              success: false,
              status: 500,
              error: {
                message: 'Error al eliminar distribuidor',
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
            message: 'Distribuidor eliminado exitosamente'
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
    console.error('Error in distribuidor function:', error)
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
