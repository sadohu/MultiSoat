// Validator.ts - Validaciones específicas para datos peruanos
export class ValidationError extends Error {
    public field?: string;

    constructor(message: string, field?: string) {
        super(message);
        this.name = "ValidationError";
        this.field = field;
    }
}

export class Validator {
    // Validar DNI peruano (8 dígitos)
    static isValidDNI(dni: string): boolean {
        if (!dni) return false;
        const cleanDNI = dni.replace(/\D/g, "");
        return cleanDNI.length === 8 && /^\d{8}$/.test(cleanDNI);
    }

    // Validar RUC peruano (11 dígitos)
    static isValidRUC(ruc: string): boolean {
        if (!ruc) return false;
        const cleanRUC = ruc.replace(/\D/g, "");
        return cleanRUC.length === 11 && /^\d{11}$/.test(cleanRUC);
    }

    // Validar email
    static isValidEmail(email: string): boolean {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar teléfono peruano (9 dígitos, inicia con 9)
    static isValidPhone(phone: string): boolean {
        if (!phone) return false;
        const cleanPhone = phone.replace(/\D/g, "");
        return cleanPhone.length === 9 && cleanPhone.startsWith("9");
    }

    // Validar placa vehicular peruana (ABC-123 o ABC1234)
    static isValidPlaca(placa: string): boolean {
        if (!placa) return false;
        const cleanPlaca = placa.toUpperCase().replace(/\s/g, "");
        // Formato: ABC-123 o ABC1234
        return /^[A-Z]{3}-?\d{3,4}$/.test(cleanPlaca);
    }

    // Validaciones que lanzan excepciones (para uso con try-catch)

    static validateRequired(value: any, fieldName: string): void {
        if (!value || (typeof value === "string" && value.trim() === "")) {
            throw new ValidationError(`${fieldName} es requerido`, fieldName);
        }
    }

    static validateDNI(dni: string, fieldName = "DNI"): void {
        if (!this.isValidDNI(dni)) {
            throw new ValidationError(
                "DNI debe tener exactamente 8 dígitos",
                fieldName,
            );
        }
    }

    static validateRUC(ruc: string, fieldName = "RUC"): void {
        if (!this.isValidRUC(ruc)) {
            throw new ValidationError(
                "RUC debe tener exactamente 11 dígitos",
                fieldName,
            );
        }
    }

    static validateEmail(email: string, fieldName = "email"): void {
        if (!this.isValidEmail(email)) {
            throw new ValidationError(
                "Email tiene formato inválido",
                fieldName,
            );
        }
    }

    static validatePhone(phone: string, fieldName = "telefono"): void {
        if (!this.isValidPhone(phone)) {
            throw new ValidationError(
                "Teléfono debe tener 9 dígitos y empezar por 9",
                fieldName,
            );
        }
    }

    static validatePlaca(placa: string, fieldName = "placa"): void {
        if (!this.isValidPlaca(placa)) {
            throw new ValidationError(
                "Placa debe tener formato ABC-123 o ABC1234",
                fieldName,
            );
        }
    }

    // Validación específica para datos de proveedor
    static validateProveedorData(
        data: any,
        isUpdate = false,
    ): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!isUpdate) {
            // Validaciones requeridas para CREATE
            if (!data.razon_social?.trim()) {
                errors.push("Razón social es requerida");
            }
            if (!data.tipo_documento?.trim()) {
                errors.push("Tipo de documento es requerido");
            }
            if (!data.numero_documento?.trim()) {
                errors.push("Número de documento es requerido");
            }
        }

        // Validaciones de formato (aplicables tanto para CREATE como UPDATE)
        if (
            data.tipo_documento &&
            !["RUC", "DNI", "CE"].includes(data.tipo_documento)
        ) {
            errors.push("tipo_documento debe ser: RUC, DNI o CE");
        }

        if (data.numero_documento) {
            // Validar según el tipo de documento
            if (
                data.tipo_documento === "RUC" &&
                !this.isValidRUC(data.numero_documento)
            ) {
                errors.push("RUC inválido (debe tener 11 dígitos)");
            }
            if (
                data.tipo_documento === "DNI" &&
                !this.isValidDNI(data.numero_documento)
            ) {
                errors.push("DNI inválido (debe tener 8 dígitos)");
            }
        }

        // Validaciones opcionales
        if (data.email && !this.isValidEmail(data.email)) {
            errors.push("Email tiene formato inválido");
        }

        if (data.telefono && !this.isValidPhone(data.telefono)) {
            errors.push(
                "Teléfono inválido (debe tener 9 dígitos y empezar por 9)",
            );
        }

        return { valid: errors.length === 0, errors };
    }
}
