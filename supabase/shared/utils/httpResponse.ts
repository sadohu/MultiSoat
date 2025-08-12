// Utilidades para respuestas HTTP estandarizadas y modulares

type HttpResponseOptions = {
  status: number;
  success: boolean;
  message?: string;
  data?: unknown;
  logLevel?: 'log' | 'error';
};

function buildResponse({ status, success, message, data, logLevel = 'log' }: HttpResponseOptions): Response {
  const payload: Record<string, unknown> = { data, success, status };
  if (message) payload.message = message;
  if (logLevel === 'error') {
    console.error(`[${status}]`, message ?? '', data);
  } else {
    console.log(`[${status}]`, message ?? '', data);
  }
  return new Response(
    JSON.stringify(payload),
    { status, headers: { "Content-Type": "application/json" } }
  );
}

export function http200(data: unknown) {
  return buildResponse({ status: 200, success: true, data });
}

export function http400(message = "Solicitud incorrecta", data?: unknown) {
  return buildResponse({ status: 400, success: false, message, data });
}

export function http401(message = "No autorizado", data?: unknown) {
  return buildResponse({ status: 401, success: false, message, data });
}

export function http404(message = "No encontrado", data?: unknown) {
  return buildResponse({ status: 404, success: false, message, data });
}

export function http500(message = "Error interno del servidor", data?: unknown) {
  return buildResponse({ status: 500, success: false, message, data, logLevel: 'error' });
}
