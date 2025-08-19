// ================================
// SERVICIO DE VERIFICACIÓN DE USUARIO
// ================================

import type { Database } from "../config/supabase.ts";
import {
    ERROR_MESSAGES,
    ESTADOS_USUARIO,
    TIPOS_DOCUMENTO,
} from "./constants.ts";
import type { EstadoUsuario, TipoDocumento } from "./constants.ts";

export interface UserInfo {
    id: number;
    id_supabase: string | null;
    email: string;
    nombre?: string;
    tipo_documento?: string;
    numero_documento?: string;
    telefono?: string;
    estado: EstadoUsuario;
}

export interface DocumentAccessInfo {
    hasAccess: boolean;
    user?: UserInfo;
    entities: EntityAccess[];
    message: string;
}

export interface EntityAccess {
    entityType: "proveedor" | "distribuidor" | "punto_venta";
    entityId: number;
    entityName?: string;
    roles: string[];
    estado: string;
}

export class UserVerificationService {
    constructor(private supabase: any) {}

    /**
     * Verificar si un email ya tiene acceso al sistema
     */
    async checkEmailAccess(email: string): Promise<DocumentAccessInfo> {
        if (!email || !this.isValidEmail(email)) {
            return {
                hasAccess: false,
                entities: [],
                message: ERROR_MESSAGES.INVALID_EMAIL,
            };
        }

        try {
            // Buscar usuario por email
            const { data: usuario, error } = await this.supabase
                .from("usuario")
                .select(`
          id,
          id_supabase,
          email,
          nombre,
          tipo_documento,
          numero_documento,
          telefono,
          estado
        `)
                .eq("email", email.toLowerCase().trim())
                .single();

            if (error || !usuario) {
                return {
                    hasAccess: false,
                    entities: [],
                    message: "Email no registrado en el sistema",
                };
            }

            // Obtener entidades asociadas al usuario
            const entities = await this.getUserEntities(usuario.id);

            return {
                hasAccess: true,
                user: usuario,
                entities,
                message:
                    `Usuario encontrado con ${entities.length} entidad(es) asociada(s)`,
            };
        } catch (error) {
            console.error("Error verificando email:", error);
            return {
                hasAccess: false,
                entities: [],
                message: "Error interno del sistema",
            };
        }
    }

    /**
     * Verificar si un documento ya tiene acceso al sistema
     */
    async checkDocumentAccess(
        tipoDocumento: TipoDocumento,
        numeroDocumento: string,
    ): Promise<DocumentAccessInfo> {
        if (!this.isValidDocument(tipoDocumento, numeroDocumento)) {
            return {
                hasAccess: false,
                entities: [],
                message: ERROR_MESSAGES.INVALID_DOCUMENT,
            };
        }

        try {
            // Buscar usuario por documento
            const { data: usuario, error } = await this.supabase
                .from("usuario")
                .select(`
          id,
          id_supabase,
          email,
          nombre,
          tipo_documento,
          numero_documento,
          telefono,
          estado
        `)
                .eq("tipo_documento", tipoDocumento)
                .eq("numero_documento", numeroDocumento)
                .single();

            if (error || !usuario) {
                // Verificar si el documento existe en alguna entidad sin usuario
                const entityWithoutUser = await this.checkDocumentInEntities(
                    tipoDocumento,
                    numeroDocumento,
                );

                if (entityWithoutUser.found) {
                    return {
                        hasAccess: false,
                        entities: [],
                        message:
                            `Documento registrado en ${entityWithoutUser.entityType} pero sin usuario asignado`,
                    };
                }

                return {
                    hasAccess: false,
                    entities: [],
                    message: "Documento no registrado en el sistema",
                };
            }

            // Obtener entidades asociadas
            const entities = await this.getUserEntities(usuario.id);

            return {
                hasAccess: true,
                user: usuario,
                entities,
                message:
                    `Documento encontrado con ${entities.length} entidad(es) asociada(s)`,
            };
        } catch (error) {
            console.error("Error verificando documento:", error);
            return {
                hasAccess: false,
                entities: [],
                message: "Error interno del sistema",
            };
        }
    }

    /**
     * Verificar si un usuario puede acceder a una entidad específica
     */
    async checkUserEntityAccess(
        userId: number,
        entityType: "proveedor" | "distribuidor" | "punto_venta",
        entityId: number,
    ): Promise<boolean> {
        try {
            const { data, error } = await this.supabase
                .from("usuario_rol")
                .select("id")
                .eq("id_usuario", userId)
                .eq("tipo_entidad", entityType)
                .eq("id_entidad", entityId)
                .eq("activo", true)
                .single();

            return !error && !!data;
        } catch (error) {
            console.error("Error verificando acceso a entidad:", error);
            return false;
        }
    }

    /**
     * Obtener todas las entidades asociadas a un usuario
     */
    private async getUserEntities(userId: number): Promise<EntityAccess[]> {
        try {
            const { data: userRoles, error } = await this.supabase
                .from("usuario_rol")
                .select(`
          tipo_entidad,
          id_entidad,
          rol:id_rol (
            codigo,
            nombre
          )
        `)
                .eq("id_usuario", userId)
                .eq("activo", true);

            if (error || !userRoles) {
                return [];
            }

            const entities: EntityAccess[] = [];

            // Agrupar por entidad y obtener información adicional
            for (const userRole of userRoles) {
                let entityInfo = entities.find(
                    (e) =>
                        e.entityType === userRole.tipo_entidad &&
                        e.entityId === userRole.id_entidad,
                );

                if (!entityInfo) {
                    // Obtener información de la entidad
                    const entityData = await this.getEntityInfo(
                        userRole.tipo_entidad,
                        userRole.id_entidad,
                    );

                    entityInfo = {
                        entityType: userRole.tipo_entidad,
                        entityId: userRole.id_entidad,
                        entityName: entityData?.nombre ||
                            entityData?.razon_social,
                        roles: [],
                        estado: entityData?.estado || "DESCONOCIDO",
                    };

                    entities.push(entityInfo);
                }

                // Agregar rol
                if (userRole.rol && userRole.rol.codigo) {
                    entityInfo.roles.push(userRole.rol.codigo);
                }
            }

            return entities;
        } catch (error) {
            console.error("Error obteniendo entidades del usuario:", error);
            return [];
        }
    }

    /**
     * Obtener información básica de una entidad
     */
    private async getEntityInfo(entityType: string, entityId: number) {
        try {
            const { data, error } = await this.supabase
                .from(entityType)
                .select("nombre, razon_social, estado")
                .eq("id", entityId)
                .single();

            return error ? null : data;
        } catch (error) {
            return null;
        }
    }

    /**
     * Verificar si un documento existe en alguna entidad sin usuario
     */
    private async checkDocumentInEntities(
        tipoDocumento: TipoDocumento,
        numeroDocumento: string,
    ): Promise<{ found: boolean; entityType?: string; entityId?: number }> {
        const entityTypes = ["proveedor", "distribuidor", "punto_venta"];

        for (const entityType of entityTypes) {
            try {
                const { data, error } = await this.supabase
                    .from(entityType)
                    .select("id, estado")
                    .eq("tipo_documento", tipoDocumento)
                    .eq("numero_documento", numeroDocumento)
                    .single();

                if (!error && data) {
                    return {
                        found: true,
                        entityType,
                        entityId: data.id,
                    };
                }
            } catch (error) {
                // Continuar con el siguiente tipo de entidad
                continue;
            }
        }

        return { found: false };
    }

    /**
     * Validar formato de email
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validar documento según tipo
     */
    private isValidDocument(
        tipoDocumento: TipoDocumento,
        numeroDocumento: string,
    ): boolean {
        if (!numeroDocumento || !tipoDocumento) return false;

        const documento = numeroDocumento.trim();

        switch (tipoDocumento) {
            case "DNI":
                return /^\d{8}$/.test(documento);
            case "RUC":
                return /^\d{11}$/.test(documento);
            case "CE":
                return /^[A-Z0-9]{9,12}$/.test(documento);
            //   case 'PASSPORT':
            //     return /^[A-Z0-9]{6,12}$/.test(documento);
            default:
                return false;
        }
    }

    /**
     * Verificar disponibilidad de email para nuevo registro
     */
    async isEmailAvailable(
        email: string,
        excludeUserId?: number,
    ): Promise<boolean> {
        try {
            let query = this.supabase
                .from("usuario")
                .select("id")
                .eq("email", email.toLowerCase().trim());

            if (excludeUserId) {
                query = query.neq("id", excludeUserId);
            }

            const { data, error } = await query.single();

            // Email disponible si no se encuentra o hay error de no encontrado
            return error && error.code === "PGRST116"; // No rows found
        } catch (error) {
            // En caso de error, asumir que no está disponible por seguridad
            return false;
        }
    }

    /**
     * Verificar disponibilidad de documento para nuevo registro
     */
    async isDocumentAvailable(
        tipoDocumento: TipoDocumento,
        numeroDocumento: string,
        excludeUserId?: number,
    ): Promise<boolean> {
        try {
            let query = this.supabase
                .from("usuario")
                .select("id")
                .eq("tipo_documento", tipoDocumento)
                .eq("numero_documento", numeroDocumento);

            if (excludeUserId) {
                query = query.neq("id", excludeUserId);
            }

            const { data, error } = await query.single();

            // Documento disponible si no se encuentra
            return error && error.code === "PGRST116"; // No rows found
        } catch (error) {
            return false;
        }
    }
}
