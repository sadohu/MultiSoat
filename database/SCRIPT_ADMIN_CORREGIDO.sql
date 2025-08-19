-- SCRIPT CORREGIDO PARA ESQUEMA REAL
-- Copiar y pegar en: Supabase Dashboard -> SQL Editor

-- 1. CREAR EL STORED PROCEDURE CORRECTO
CREATE OR REPLACE FUNCTION registrar_admin_sistema(
    auth_user_uuid UUID,
    admin_type TEXT DEFAULT 'admin'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    usuario_id INTEGER;
    rol_id INTEGER;
    user_email TEXT;
    rol_codigo TEXT;
BEGIN
    -- Determinar código de rol según tipo
    IF admin_type = 'admin' THEN
        rol_codigo = 'SISTEMA_ADMIN';
    ELSIF admin_type = 'supervisor' THEN
        rol_codigo = 'PROVEEDOR_SUPERVISOR';  -- o el rol que prefieras para supervisor
    ELSE
        RETURN json_build_object('success', false, 'error', 'Tipo inválido. Use: admin o supervisor');
    END IF;
    
    -- Obtener email del usuario desde auth.users
    SELECT email INTO user_email FROM auth.users WHERE id = auth_user_uuid;
    
    IF user_email IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Usuario no encontrado en auth.users');
    END IF;
    
    -- Obtener ID del rol
    SELECT id INTO rol_id FROM rol WHERE codigo = rol_codigo;
    
    IF rol_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Rol no encontrado: ' || rol_codigo);
    END IF;
    
    -- Insertar o actualizar en tabla usuario
    INSERT INTO usuario (
        id_supabase, 
        nombre, 
        email, 
        estado,
        created_at, 
        updated_at, 
        created_by, 
        updated_by
    ) VALUES (
        auth_user_uuid, 
        'Admin Sistema', 
        user_email, 
        'activo',
        NOW(), 
        NOW(), 
        auth_user_uuid, 
        auth_user_uuid
    )
    ON CONFLICT (id_supabase) 
    DO UPDATE SET 
        estado = 'activo',
        updated_at = NOW(),
        updated_by = auth_user_uuid
    RETURNING id INTO usuario_id;
    
    -- Asignar rol al usuario (eliminar roles anteriores del sistema)
    DELETE FROM usuario_rol 
    WHERE id_usuario = usuario_id 
    AND tipo_entidad = 'sistema';
    
    -- Insertar nuevo rol
    INSERT INTO usuario_rol (
        id_usuario,
        id_rol,
        tipo_entidad,
        activo,
        created_at,
        updated_at,
        created_by,
        updated_by
    ) VALUES (
        usuario_id,
        rol_id,
        'sistema',
        true,
        NOW(),
        NOW(),
        auth_user_uuid,
        auth_user_uuid
    );
    
    RETURN json_build_object(
        'success', true, 
        'message', 'Admin registrado exitosamente', 
        'usuario_id', usuario_id,
        'rol_asignado', rol_codigo
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 2. REGISTRAR TU USUARIO COMO ADMIN DEL SISTEMA
SELECT registrar_admin_sistema('1a034e85-b1e1-40ac-934c-94e5088a4000', 'admin');

-- 3. VERIFICAR QUE SE CREÓ CORRECTAMENTE
SELECT 
    u.id,
    u.id_supabase,
    u.nombre,
    u.email,
    u.estado,
    r.codigo as rol,
    ur.tipo_entidad,
    ur.activo as rol_activo
FROM usuario u
JOIN usuario_rol ur ON u.id = ur.id_usuario
JOIN rol r ON ur.id_rol = r.id
WHERE u.id_supabase = '1a034e85-b1e1-40ac-934c-94e5088a4000';
