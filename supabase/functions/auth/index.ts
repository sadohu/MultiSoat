// Edge Function para Autenticación de Usuarios - MultiSoat
import { createClient } from "@supabase/supabase-js";
import {
  http200,
  http400,
  http401,
  http500,
  withCors,
} from "../../shared/utils/http.ts";
import { Database } from "../../shared/config/supabase.ts";

// ====================================
// TIPOS DE DATOS
// ====================================

interface RegisterData {
  email: string;
  password: string;
  nombre?: string;
  apellido?: string;
  rol?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface VerifyTokenData {
  token: string;
}

interface RefreshTokenData {
  refresh_token: string;
}

// ====================================
// VALIDACIONES
// ====================================

/**
 * Valida formato de email según RFC 5321
 * Incluye verificación de longitud y formato
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) return false;
  if (email.length > 254) return false; // RFC 5321
  if (email.includes("..")) return false; // Puntos consecutivos

  const [local, domain] = email.split("@");
  if (local.length > 64) return false; // RFC 5321
  if (domain.length > 253) return false; // RFC 5321

  return true;
}

/**
 * Valida contraseña con requisitos mínimos de seguridad
 */
function isValidPassword(password: string): boolean {
  return password.length >= 6 && /\d/.test(password);
}

// ====================================
// MANEJO DE ERRORES
// ====================================

/**
 * Procesa errores de Supabase Auth y los convierte en respuestas HTTP apropiadas
 * Incluye traducción de mensajes comunes al español
 *
 * IMPORTANTE: Supabase valida que los dominios de email existan realmente (DNS/MX records)
 * Por lo tanto, emails con dominios inexistentes serán rechazados automáticamente
 */
function processAuthError(
  error: { message?: string; [key: string]: unknown },
): Response {
  const message = error.message || "Error de autenticación";

  // Mapeo de errores comunes de Supabase Auth
  const errorMappings: { [key: string]: string } = {
    "Email address is invalid": "El email no es válido",
    "Password should be at least 6 characters":
      "La contraseña debe tener al menos 6 caracteres",
    "User already registered": "El usuario ya está registrado",
    "Invalid login credentials": "Credenciales de acceso inválidas",
    "Email not confirmed": "Email no confirmado",
    "Token has expired": "El token ha expirado",
    "Invalid token": "Token inválido",
  };

  // Buscar traducción específica
  for (const [englishError, spanishError] of Object.entries(errorMappings)) {
    if (message.includes(englishError)) {
      return http400("Error de autenticación", spanishError);
    }
  }

  // Error específico para dominios inexistentes
  if (
    message.toLowerCase().includes("invalid") &&
    message.toLowerCase().includes("email")
  ) {
    return http400(
      "Error de autenticación",
      "El email no es válido. Verifique que el dominio exista y tenga un formato correcto.",
    );
  }

  return http400("Error de autenticación", message);
}

// ====================================
// FUNCIÓN PRINCIPAL
// ====================================
Deno.serve(withCors(async (req: Request) => {
  const url = new URL(req.url);
  const method = req.method;
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const action = pathSegments[pathSegments.length - 1];

  // Crear cliente Supabase para auth (sin headers de usuario)
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  try {
    switch (method) {
      case "POST": {
        if (action === "register" || action === "signup") {
          // POST /auth/register - Registrar nuevo usuario
          const registerData: RegisterData = await req.json();

          // Validaciones
          if (!registerData.email || !registerData.password) {
            return http400("Email y contraseña son requeridos");
          }

          if (!isValidEmail(registerData.email)) {
            return http400("Formato de email inválido");
          }

          if (!isValidPassword(registerData.password)) {
            return http400(
              "La contraseña debe tener al menos 6 caracteres y contener al menos un número",
            );
          }

          // Registrar usuario con Supabase Auth
          // NOTA: Supabase validará que el dominio del email exista realmente (DNS/MX records)
          // Si el dominio no existe, devolverá "Email address is invalid"
          const { data: authData, error: authError } = await supabase.auth
            .signUp({
              email: registerData.email,
              password: registerData.password,
              options: {
                data: {
                  nombre: registerData.nombre || "",
                  apellido: registerData.apellido || "",
                  rol: registerData.rol || "usuario",
                },
              },
            });

          if (authError) {
            return processAuthError(authError);
          }

          // Si el registro fue exitoso
          if (authData.user) {
            return http200({
              user: {
                id: authData.user.id,
                email: authData.user.email,
                nombre: authData.user.user_metadata?.nombre || "",
                apellido: authData.user.user_metadata?.apellido || "",
                rol: authData.user.user_metadata?.rol || "usuario",
                email_confirmed: authData.user.email_confirmed_at != null,
              },
              session: authData.session
                ? {
                  access_token: authData.session.access_token,
                  refresh_token: authData.session.refresh_token,
                  expires_at: authData.session.expires_at,
                }
                : null,
              message: authData.session
                ? "Usuario registrado y autenticado exitosamente"
                : "Usuario registrado. Verifica tu email para activar la cuenta.",
            });
          }

          return http400("No se pudo completar el registro");
        } else if (action === "login" || action === "signin") {
          // POST /auth/login - Iniciar sesión
          const loginData: LoginData = await req.json();

          if (!loginData.email || !loginData.password) {
            return http400("Email y contraseña son requeridos");
          }

          if (!isValidEmail(loginData.email)) {
            return http400("Formato de email inválido");
          }

          // Autenticar con Supabase Auth
          const { data: authData, error: authError } = await supabase.auth
            .signInWithPassword({
              email: loginData.email,
              password: loginData.password,
            });

          if (authError) {
            return processAuthError(authError);
          }

          if (authData.user && authData.session) {
            return http200({
              user: {
                id: authData.user.id,
                email: authData.user.email,
                nombre: authData.user.user_metadata?.nombre || "",
                apellido: authData.user.user_metadata?.apellido || "",
                rol: authData.user.user_metadata?.rol || "usuario",
                email_confirmed: authData.user.email_confirmed_at != null,
                last_sign_in: authData.user.last_sign_in_at,
              },
              session: {
                access_token: authData.session.access_token,
                refresh_token: authData.session.refresh_token,
                expires_at: authData.session.expires_at,
                token_type: authData.session.token_type,
              },
              message: "Autenticación exitosa",
            });
          }

          return http401("No se pudo autenticar el usuario");
        } else if (action === "verify" || action === "verify-token") {
          // POST /auth/verify - Verificar token de acceso
          const verifyData: VerifyTokenData = await req.json();

          if (!verifyData.token) {
            return http400("Token es requerido");
          }

          // Verificar token con Supabase Auth
          const { data: userData, error: userError } = await supabase.auth
            .getUser(verifyData.token);

          if (userError || !userData.user) {
            return userError
              ? processAuthError(userError)
              : http401("Token inválido o expirado");
          }

          return http200({
            user: {
              id: userData.user.id,
              email: userData.user.email,
              nombre: userData.user.user_metadata?.nombre || "",
              apellido: userData.user.user_metadata?.apellido || "",
              rol: userData.user.user_metadata?.rol || "usuario",
              email_confirmed: userData.user.email_confirmed_at != null,
              last_sign_in: userData.user.last_sign_in_at,
            },
            valid: true,
            message: "Token válido",
          });
        } else if (action === "refresh") {
          // POST /auth/refresh - Renovar token con refresh token
          const refreshData = await req.json();

          if (!refreshData.refresh_token) {
            return http400("Refresh token es requerido");
          }

          const { data: sessionData, error: refreshError } = await supabase.auth
            .refreshSession({
              refresh_token: refreshData.refresh_token,
            });

          if (refreshError || !sessionData.session) {
            return refreshError
              ? processAuthError(refreshError)
              : http401("Refresh token inválido");
          }

          return http200({
            session: {
              access_token: sessionData.session.access_token,
              refresh_token: sessionData.session.refresh_token,
              expires_at: sessionData.session.expires_at,
              token_type: sessionData.session.token_type,
            },
            user: sessionData.session.user
              ? {
                id: sessionData.session.user.id,
                email: sessionData.session.user.email,
                nombre: sessionData.session.user.user_metadata?.nombre || "",
                apellido: sessionData.session.user.user_metadata?.apellido ||
                  "",
                rol: sessionData.session.user.user_metadata?.rol || "usuario",
              }
              : null,
            message: "Token renovado exitosamente",
          });
        } else if (action === "logout" || action === "signout") {
          // POST /auth/logout - Cerrar sesión
          const logoutData = await req.json();

          if (logoutData.token) {
            // Cerrar sesión en Supabase (invalidar el token)
            const { error: signOutError } = await supabase.auth.signOut();

            if (signOutError) {
              return http400("Error al cerrar sesión", signOutError.message);
            }
          }

          return http200({
            message: "Sesión cerrada exitosamente",
          });
        }

        return http400(
          `Acción '${action}' no reconocida. Usa: register, login, verify, refresh, logout`,
        );
      }

      case "GET": {
        // GET /auth/status - Verificar estado de autenticación desde header
        const authHeader = req.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return http401("Token de autorización requerido");
        }

        const token = authHeader.substring(7);

        const { data: userData, error: userError } = await supabase.auth
          .getUser(token);

        if (userError || !userData.user) {
          return userError
            ? processAuthError(userError)
            : http401("Token inválido o expirado");
        }

        return http200({
          authenticated: true,
          user: {
            id: userData.user.id,
            email: userData.user.email,
            nombre: userData.user.user_metadata?.nombre || "",
            apellido: userData.user.user_metadata?.apellido || "",
            rol: userData.user.user_metadata?.rol || "usuario",
            email_confirmed: userData.user.email_confirmed_at != null,
            created_at: userData.user.created_at,
          },
          message: "Usuario autenticado",
        });
      }

      default: {
        return http400(`Método ${method} no permitido`);
      }
    }
  } catch (error) {
    console.error("Error en Edge Function Auth:", error);
    return http500("Error interno del servidor", (error as Error).message);
  }
}));
