// ================================
// SERVICIO DE REGISTRO DE ENTIDADES
// ================================

declare const Deno: any;

import type { Database } from "../config/supabase.ts";
import { UserVerificationService } from "./user-verification.ts";
import {
    ERROR_MESSAGES,
    ESTADOS_AFILIACION,
    ESTADOS_ENTIDAD,
    ROLES_DEFAULT_POR_ENTIDAD,
} from "./constants.ts";
import type { TipoDocumento, TipoEntidad } from "./constants.ts";

export interface EntityRegistrationData {
    // Datos comunes
    nombre?: string;
    email: string;
    telefono?: string;
    direccion?: string;

    // Datos específicos según tipo
    razon_social?: string; // Solo proveedor
    tipo_documento: TipoDocumento;
    numero_documento: string;

    // Contexto organizacional
    id_proveedor?: number; // Para distribuidor y punto_venta
    id_distribuidor?: number; // Solo para punto_venta

    // Referencia externa de db_data (viene del frontend o se obtiene automáticamente)
    id_externo_db_data?: number;
}

export interface RegistrationResult {
    success: boolean;
    entityCreated: boolean;
    entityId?: number;
    userExists: boolean;
    userId?: number;
    invitationSent: boolean;
    affiliationCreated?: boolean;
    message: string;
    errors?: string[];
}

export interface AuditInfo {
    fields: {
        created_by?: string;
        updated_by?: string;
    };
    userId?: string;
}

export class EntityRegistrationService {
    private userVerificationService: UserVerificationService;

    constructor(private supabase: any, private auditInfo: AuditInfo) {
        this.userVerificationService = new UserVerificationService(supabase);
    }

    /**
     * Registro universal de entidades (proveedor, distribuidor, punto_venta)
     */
    async registerEntityWithInvitation(
        entityType: TipoEntidad,
        data: EntityRegistrationData,
    ): Promise<RegistrationResult> {
        try {
            // 1. Validaciones previas
            const validation = await this.validateRegistrationData(
                entityType,
                data,
            );
            if (!validation.valid) {
                return {
                    success: false,
                    entityCreated: false,
                    userExists: false,
                    invitationSent: false,
                    message: "Datos de registro inválidos",
                    errors: validation.errors,
                };
            }

            // 2. Validar y obtener referencia externa de db_data
            const dbDataValidation = await this.validateAndGetExternalReference(
                data,
            );
            if (!dbDataValidation.success) {
                return {
                    success: false,
                    entityCreated: false,
                    userExists: false,
                    invitationSent: false,
                    message: dbDataValidation.message ||
                        "Error obteniendo referencia externa",
                    errors: dbDataValidation.errors,
                };
            }

            // Actualizar data con la referencia obtenida
            data.id_externo_db_data = dbDataValidation.id_externo_db_data;

            // 3. Verificar duplicados de documento en la entidad específica
            const duplicateExists = await this.checkEntityDocumentDuplicate(
                entityType,
                data.numero_documento,
            );
            if (duplicateExists) {
                return {
                    success: false,
                    entityCreated: false,
                    userExists: false,
                    invitationSent: false,
                    message:
                        `Ya existe un ${entityType} con este número de documento`,
                };
            }

            // 4. Verificar si ya existe usuario con ese email
            const emailAccess = await this.userVerificationService
                .checkEmailAccess(data.email);

            // 5. Crear entidad
            const entityId = await this.createEntity(entityType, data);

            // 6. Gestionar usuario e invitación
            if (emailAccess.hasAccess && emailAccess.user) {
                // Usuario existe: crear vinculación directa
                await this.linkUserToEntity(
                    emailAccess.user.id,
                    entityType,
                    entityId,
                );

                return {
                    success: true,
                    entityCreated: true,
                    entityId,
                    userExists: true,
                    userId: emailAccess.user.id,
                    invitationSent: false,
                    message:
                        `${entityType} registrado y vinculado con usuario existente`,
                };
            } else {
                // Usuario no existe: crear registro pendiente y enviar invitación
                const userCreated = await this.createPendingUserRecord(
                    data,
                    entityType,
                    entityId,
                );
                const invitationSent = await this.sendInvitationEmail(
                    data.email,
                    entityType,
                    entityId,
                );

                return {
                    success: true,
                    entityCreated: true,
                    entityId,
                    userExists: false,
                    userId: userCreated.userId,
                    invitationSent,
                    message: `${entityType} registrado. ${
                        invitationSent
                            ? "Invitación enviada"
                            : "Error enviando invitación"
                    } a ${data.email}`,
                };
            }
        } catch (error) {
            console.error(`Error en registro de ${entityType}:`, error);
            return {
                success: false,
                entityCreated: false,
                userExists: false,
                invitationSent: false,
                message: `Error interno durante el registro de ${entityType}`,
                errors: [(error as Error).message],
            };
        }
    }

    /**
     * Caso especial: Punto de Venta con múltiples afiliaciones
     */
    async registerPuntoVentaWithMultipleProviders(
        data: EntityRegistrationData,
        proveedorIds: number[],
    ): Promise<RegistrationResult> {
        try {
            // 1. Verificar si PV ya existe por documento
            const existingPV = await this.checkExistingPuntoVenta(
                data.numero_documento,
            );

            if (existingPV) {
                // PV existe: crear nuevas afiliaciones
                let affiliationsCreated = 0;

                for (const proveedorId of proveedorIds) {
                    const created = await this.createAfiliacion(
                        existingPV.id,
                        proveedorId,
                        data.id_distribuidor,
                    );
                    if (created) affiliationsCreated++;
                }

                return {
                    success: true,
                    entityCreated: false,
                    entityId: existingPV.id,
                    userExists: true,
                    invitationSent: false,
                    affiliationCreated: affiliationsCreated > 0,
                    message:
                        `Punto de venta existente. ${affiliationsCreated} nueva(s) afiliación(es) creada(s).`,
                };
            } else {
                // PV no existe: registro normal
                const result = await this.registerEntityWithInvitation(
                    "punto_venta",
                    data,
                );

                if (result.success && result.entityId) {
                    // Crear afiliaciones con todos los proveedores
                    let affiliationsCreated = 0;

                    for (const proveedorId of proveedorIds) {
                        const created = await this.createAfiliacion(
                            result.entityId,
                            proveedorId,
                            data.id_distribuidor,
                        );
                        if (created) affiliationsCreated++;
                    }

                    return {
                        ...result,
                        affiliationCreated: affiliationsCreated > 0,
                        message:
                            `${result.message} ${affiliationsCreated} afiliación(es) creada(s).`,
                    };
                }

                return result;
            }
        } catch (error) {
            console.error(
                "Error en registro múltiple de punto de venta:",
                error,
            );
            return {
                success: false,
                entityCreated: false,
                userExists: false,
                invitationSent: false,
                message: "Error interno durante el registro múltiple",
                errors: [(error as Error).message],
            };
        }
    }

    /**
     * Validar y obtener referencia externa de db_data
     */
    private async validateAndGetExternalReference(
        data: EntityRegistrationData,
    ): Promise<
        {
            success: boolean;
            id_externo_db_data?: number;
            message?: string;
            errors?: string[];
        }
    > {
        try {
            // Si ya viene con id_externo_db_data del frontend, usar directamente
            if (data.id_externo_db_data) {
                console.log(
                    `Usando id_externo_db_data del frontend: ${data.id_externo_db_data}`,
                );
                return {
                    success: true,
                    id_externo_db_data: data.id_externo_db_data,
                };
            }

            // Si no viene, consultar APIs externas según tipo de documento
            console.log(
                `Consultando APIs externas para ${data.tipo_documento}: ${data.numero_documento}`,
            );

            let externalData: any = null;
            const dniToken = Deno.env.get("DB_DATA_DNI_TOKEN");
            const rucToken = Deno.env.get("DB_DATA_RUC_TOKEN");

            if (data.tipo_documento === "DNI") {
                if (!dniToken) {
                    console.warn(
                        "DB_DATA_DNI_TOKEN no configurado, permitiendo registro sin referencia externa",
                    );
                    return {
                        success: true,
                        id_externo_db_data: undefined,
                    };
                }
                // Consultar API de persona natural
                externalData = await this.consultarPersonaNatural(
                    data.numero_documento,
                    dniToken,
                );
            } else if (data.tipo_documento === "RUC") {
                if (!rucToken) {
                    console.warn(
                        "DB_DATA_RUC_TOKEN no configurado, permitiendo registro sin referencia externa",
                    );
                    return {
                        success: true,
                        id_externo_db_data: undefined,
                    };
                }
                // Consultar API de persona jurídica
                externalData = await this.consultarPersonaJuridica(
                    data.numero_documento,
                    rucToken,
                );
            } else {
                // CE u otros tipos - permitir sin referencia
                console.log(
                    `Tipo de documento ${data.tipo_documento} no requiere consulta externa`,
                );
                return {
                    success: true,
                    id_externo_db_data: undefined,
                };
            }

            if (externalData && externalData.id) {
                console.log(
                    `Referencia externa encontrada: ${externalData.id}`,
                );
                return {
                    success: true,
                    id_externo_db_data: externalData.id,
                };
            } else {
                console.log(
                    `No se encontró referencia externa para ${data.numero_documento}, permitiendo registro manual`,
                );
                return {
                    success: true,
                    id_externo_db_data: undefined,
                };
            }
        } catch (error) {
            console.error("Error en validateAndGetExternalReference:", error);
            // En caso de error, permitir registro sin referencia
            return {
                success: true,
                id_externo_db_data: undefined,
            };
        }
    }

    /**
     * Consultar API de persona natural
     */
    private async consultarPersonaNatural(
        dni: string,
        dniToken: string,
    ): Promise<any> {
        try {
            const response = await fetch(
                `https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural?dni=${dni}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${dniToken}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                console.warn(`API persona natural error: ${response.status}`);
                return null;
            }

            const responseData = await response.json();

            // Verificar estructura de respuesta esperada
            if (responseData?.success && responseData?.data) {
                console.log(
                    `DNI ${dni} encontrado con ID: ${responseData.data.id}`,
                );
                return responseData.data; // Retornar solo la data con el ID
            } else {
                console.log(
                    `DNI ${dni} no encontrado en la base de datos externa`,
                );
                return null;
            }
        } catch (error) {
            console.error("Error consultando persona natural:", error);
            return null;
        }
    }

    /**
     * Consultar API de persona jurídica
     */
    private async consultarPersonaJuridica(
        ruc: string,
        rucToken: string,
    ): Promise<any> {
        try {
            const response = await fetch(
                `https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?ruc=${ruc}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${rucToken}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                console.warn(`API persona jurídica error: ${response.status}`);
                return null;
            }

            const responseData = await response.json();

            // Verificar estructura de respuesta esperada
            if (responseData?.success && responseData?.data) {
                console.log(
                    `RUC ${ruc} encontrado con ID: ${responseData.data.id}`,
                );
                return responseData.data; // Retornar solo la data con el ID
            } else {
                console.log(
                    `RUC ${ruc} no encontrado en la base de datos externa`,
                );
                return null;
            }
        } catch (error) {
            console.error("Error consultando persona jurídica:", error);
            return null;
        }
    }

    /**
     * Validar datos de registro según tipo de entidad
     */
    private async validateRegistrationData(
        entityType: TipoEntidad,
        data: EntityRegistrationData,
    ): Promise<{ valid: boolean; errors?: string[] }> {
        const errors: string[] = [];

        // Validaciones comunes
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push(ERROR_MESSAGES.INVALID_EMAIL);
        }

        if (!data.tipo_documento || !data.numero_documento) {
            errors.push(ERROR_MESSAGES.INVALID_DOCUMENT);
        }

        // Validaciones específicas por tipo
        switch (entityType) {
            case "proveedor":
                if (!data.razon_social && !data.nombre) {
                    errors.push("Proveedor debe tener razón social o nombre");
                }
                break;

            case "distribuidor":
                if (!data.id_proveedor) {
                    errors.push(
                        "Distribuidor debe estar asociado a un proveedor",
                    );
                }
                if (!data.nombre) {
                    errors.push("Distribuidor debe tener nombre");
                }
                break;

            case "punto_venta":
                if (!data.nombre) {
                    errors.push("Punto de venta debe tener nombre");
                }
                break;
        }

        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined,
        };
    }

    /**
     * Verificar duplicado de documento en entidad específica
     */
    private async checkEntityDocumentDuplicate(
        entityType: TipoEntidad,
        numeroDocumento: string,
    ): Promise<boolean> {
        try {
            const { data, error } = await this.supabase
                .from(entityType)
                .select("id")
                .eq("numero_documento", numeroDocumento)
                .single();

            return !error && !!data;
        } catch (error) {
            return false;
        }
    }

    /**
     * Crear entidad según tipo
     */
    private async createEntity(
        entityType: TipoEntidad,
        data: EntityRegistrationData,
    ): Promise<number> {
        const baseData = {
            tipo_documento: data.tipo_documento,
            numero_documento: data.numero_documento,
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono,
            direccion: data.direccion,
            estado: ESTADOS_ENTIDAD[0], // PENDIENTE_USUARIO
            id_externo_db_data: data.id_externo_db_data, // Referencia externa (puede ser null para registros manuales)
            ...this.auditInfo.fields,
        };

        let entityData: any = baseData;

        // Datos específicos según tipo
        switch (entityType) {
            case "proveedor":
                entityData.razon_social = data.razon_social;
                break;
            case "distribuidor":
                entityData.id_proveedor = data.id_proveedor;
                break;
            case "punto_venta":
                // punto_venta solo usa baseData
                break;
        }

        const { data: newEntity, error } = await this.supabase
            .from(entityType)
            .insert(entityData)
            .select("id")
            .single();

        if (error) {
            throw new Error(`Error creando ${entityType}: ${error.message}`);
        }

        return newEntity.id;
    }

    /**
     * Crear afiliación entre punto de venta y proveedor
     */
    private async createAfiliacion(
        puntoVentaId: number,
        proveedorId: number,
        distribuidorId?: number,
    ): Promise<boolean> {
        try {
            // Verificar si ya existe la afiliación
            const { data: existing } = await this.supabase
                .from("afiliacion_pv_proveedor")
                .select("id")
                .eq("id_punto_venta", puntoVentaId)
                .eq("id_proveedor", proveedorId)
                .single();

            if (existing) {
                return false; // Ya existe
            }

            const { error } = await this.supabase
                .from("afiliacion_pv_proveedor")
                .insert({
                    id_punto_venta: puntoVentaId,
                    id_proveedor: proveedorId,
                    id_distribuidor: distribuidorId,
                    estado: ESTADOS_AFILIACION[0], // PENDIENTE_APROBACION
                    ...this.auditInfo.fields,
                });

            return !error;
        } catch (error) {
            console.error("Error creando afiliación:", error);
            return false;
        }
    }

    /**
     * Vincular usuario existente a entidad
     */
    private async linkUserToEntity(
        userId: number,
        entityType: TipoEntidad,
        entityId: number,
    ): Promise<void> {
        // Obtener rol por defecto para el tipo de entidad
        const rolCode = ROLES_DEFAULT_POR_ENTIDAD[entityType];

        const { data: rol, error: rolError } = await this.supabase
            .from("rol")
            .select("id")
            .eq("codigo", rolCode)
            .single();

        if (rolError || !rol) {
            throw new Error(
                `Error obteniendo rol ${rolCode}: ${rolError?.message}`,
            );
        }

        // Crear asignación de rol
        const { error: roleAssignError } = await this.supabase
            .from("usuario_rol")
            .insert({
                id_usuario: userId,
                id_rol: rol.id,
                id_entidad: entityId,
                tipo_entidad: entityType,
                activo: true,
                ...this.auditInfo.fields,
            });

        if (roleAssignError) {
            throw new Error(`Error asignando rol: ${roleAssignError.message}`);
        }

        // Actualizar estado de la entidad a ACTIVO
        const { error: updateError } = await this.supabase
            .from(entityType)
            .update({
                estado: ESTADOS_ENTIDAD[1], // ACTIVO
                ...this.auditInfo.fields,
            })
            .eq("id", entityId);

        if (updateError) {
            throw new Error(
                `Error activando ${entityType}: ${updateError.message}`,
            );
        }
    }

    /**
     * Crear registro de usuario pendiente
     */
    private async createPendingUserRecord(
        data: EntityRegistrationData,
        entityType: TipoEntidad,
        entityId: number,
    ): Promise<{ userId?: number }> {
        try {
            const { data: newUser, error } = await this.supabase
                .from("usuario")
                .insert({
                    email: data.email.toLowerCase().trim(),
                    nombre: data.nombre,
                    tipo_documento: data.tipo_documento,
                    numero_documento: data.numero_documento,
                    telefono: data.telefono,
                    estado: "PENDIENTE_USUARIO",
                    ...this.auditInfo.fields,
                })
                .select("id")
                .single();

            if (error) {
                // Si ya existe, obtener el usuario existente
                if (error.code === "23505") { // Duplicate key
                    const { data: existingUser } = await this.supabase
                        .from("usuario")
                        .select("id")
                        .eq("email", data.email.toLowerCase().trim())
                        .single();

                    return { userId: existingUser?.id };
                }
                throw error;
            }

            return { userId: newUser.id };
        } catch (error) {
            console.error("Error creando usuario pendiente:", error);
            return {};
        }
    }

    /**
     * Enviar email de invitación
     */
    private async sendInvitationEmail(
        email: string,
        entityType: TipoEntidad,
        entityId: number,
    ): Promise<boolean> {
        try {
            // TODO: Implementar envío real de email
            // Por ahora, solo simular envío exitoso
            console.log(
                `🔔 Invitación enviada a ${email} para ${entityType} ID: ${entityId}`,
            );

            // El email debe incluir:
            // - Link al sistema con token de invitación
            // - Información sobre el tipo de entidad y empresa
            // - Instrucciones para completar registro en Supabase Auth

            return true;
        } catch (error) {
            console.error("Error enviando invitación:", error);
            return false;
        }
    }

    /**
     * Verificar si existe punto de venta por documento
     */
    private async checkExistingPuntoVenta(numeroDocumento: string) {
        try {
            const { data, error } = await this.supabase
                .from("punto_venta")
                .select("id, email, nombre")
                .eq("numero_documento", numeroDocumento)
                .single();

            return error ? null : data;
        } catch (error) {
            return null;
        }
    }
}
