# Documentación: Edge Function Auth (Autenticación)

## Descripción
Edge Function para **autenticación completa de usuarios** en el sistema MultiSoat. Implementa registro, login, verificación de tokens, renovación y logout usando Supabase Auth.

## Configuración
- **Autenticación**: Manejo completo de Supabase Auth
- **CORS**: Habilitado automáticamente
- **Métodos HTTP**: GET, POST
- **Tokens**: JWT con refresh tokens
- **Validaciones**: Email y contraseña robustas

## ⚠️ **IMPORTANTE: Validación de Dominios de Email**

### 🔍 **Descubrimiento Técnico**
Supabase Auth implementa **validación de dominios en tiempo real** que va más allá de la validación de formato:

1. **Verificación DNS**: Comprueba que el dominio tenga registros MX válidos
2. **Existencia del dominio**: Rechaza emails de dominios inexistentes
3. **Lista de dominios bloqueados**: Filtra dominios temporales o sospechosos

### 📧 **Implicaciones para Emails de Prueba**
- ❌ **`test@multisoat.com`** → Rechazado (dominio no existe)
- ✅ **`test@gmail.com`** → Aceptado (dominio válido)
- ✅ **`admin@outlook.com`** → Aceptado (dominio válido)

### 💡 **Recomendaciones**
- **Para desarrollo**: Usar dominios reales (Gmail, Outlook, etc.)
- **Para producción**: Registrar el dominio corporativo real
- **Para testing**: Implementar un dominio de desarrollo válido

## ⚡ Características

### 🔐 **Funcionalidades de Auth**
- **Registro de usuarios** con validaciones completas
- **Login con email/password**
- **Verificación de tokens JWT**
- **Renovación automática** con refresh tokens
- **Logout seguro**
- **Verificación de estado** de autenticación

### 🛡️ **Validaciones Implementadas**
- **Email**: Formato RFC válido
- **Contraseña**: Mínimo 6 caracteres + 1 número
- **Roles**: Control de acceso por roles
- **Tokens**: Verificación JWT automática

## 🔧 API Endpoints

### 1. **POST /auth/register** - Registrar Usuario
Registra un nuevo usuario en el sistema.

#### Request Body:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "123456",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "usuario"
}
```

#### Campos:
- `email` (requerido): Email válido
- `password` (requerido): Mínimo 6 caracteres + 1 número
- `nombre` (opcional): Nombre del usuario
- `apellido` (opcional): Apellido del usuario
- `rol` (opcional): "usuario", "admin", etc. (default: "usuario")

#### Ejemplo de Request:
```bash
curl -X POST "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@email.com",
    "password": "123456",
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "usuario"
  }'
```

#### Response Exitoso:
```json
{
  "data": {
    "user": {
      "id": "uuid-del-usuario",
      "email": "juan.perez@email.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "usuario",
      "email_confirmed": true
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token",
      "expires_at": 1755223200
    },
    "message": "Usuario registrado y autenticado exitosamente"
  },
  "success": true,
  "status": 200
}
```

---

### 2. **POST /auth/login** - Iniciar Sesión
Autentica un usuario existente.

#### Request Body:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "123456"
}
```

#### Ejemplo de Request:
```bash
curl -X POST "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@email.com",
    "password": "123456"
  }'
```

#### Response Exitoso:
```json
{
  "data": {
    "user": {
      "id": "uuid-del-usuario",
      "email": "juan.perez@email.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "usuario",
      "email_confirmed": true,
      "last_sign_in": "2025-08-15T01:00:00Z"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token",
      "expires_at": 1755223200,
      "token_type": "bearer"
    },
    "message": "Autenticación exitosa"
  },
  "success": true,
  "status": 200
}
```

---

### 3. **POST /auth/verify** - Verificar Token
Verifica si un token de acceso es válido.

#### Request Body:
```json
{
  "token": "jwt-access-token"
}
```

#### Ejemplo de Request:
```bash
curl -X POST "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/auth/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

#### Response Exitoso:
```json
{
  "data": {
    "user": {
      "id": "uuid-del-usuario",
      "email": "juan.perez@email.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "usuario",
      "email_confirmed": true,
      "last_sign_in": "2025-08-15T01:00:00Z"
    },
    "valid": true,
    "message": "Token válido"
  },
  "success": true,
  "status": 200
}
```

---

### 4. **POST /auth/refresh** - Renovar Token
Renueva un access token usando el refresh token.

#### Request Body:
```json
{
  "refresh_token": "refresh-token"
}
```

#### Ejemplo de Request:
```bash
curl -X POST "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "refresh-token-aqui"
  }'
```

#### Response Exitoso:
```json
{
  "data": {
    "session": {
      "access_token": "nuevo-jwt-token",
      "refresh_token": "nuevo-refresh-token",
      "expires_at": 1755226800,
      "token_type": "bearer"
    },
    "user": {
      "id": "uuid-del-usuario",
      "email": "juan.perez@email.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "usuario"
    },
    "message": "Token renovado exitosamente"
  },
  "success": true,
  "status": 200
}
```

---

### 5. **GET /auth/status** - Estado de Autenticación
Verifica el estado de autenticación usando el header Authorization.

#### Headers:
```
Authorization: Bearer jwt-access-token
```

#### Ejemplo de Request:
```bash
curl -X GET "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/auth/status" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response Exitoso:
```json
{
  "data": {
    "authenticated": true,
    "user": {
      "id": "uuid-del-usuario",
      "email": "juan.perez@email.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "usuario",
      "email_confirmed": true,
      "created_at": "2025-08-15T00:00:00Z"
    },
    "message": "Usuario autenticado"
  },
  "success": true,
  "status": 200
}
```

---

### 6. **POST /auth/logout** - Cerrar Sesión
Cierra la sesión del usuario invalidando los tokens.

#### Request Body (opcional):
```json
{
  "token": "jwt-access-token"
}
```

#### Ejemplo de Request:
```bash
curl -X POST "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/auth/logout" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "jwt-access-token"
  }'
```

#### Response Exitoso:
```json
{
  "data": {
    "message": "Sesión cerrada exitosamente"
  },
  "success": true,
  "status": 200
}
```

## 🚫 Respuestas de Error

### Error 400 - Datos Inválidos
```json
{
  "error": "Email y contraseña son requeridos",
  "success": false,
  "status": 400
}
```

### Error 400 - Validación de Email (Dominio Inexistente)
**Caso especial descubierto**: Supabase valida dominios en tiempo real

```json
{
  "success": false,
  "status": 400,
  "error": {
    "message": "Error de autenticación",
    "details": "El email no es válido. Verifique que el dominio exista y tenga un formato correcto."
  }
}
```

**Causas comunes:**
- Domain no existe en DNS (ej: `test@multisoat.com` si multisoat.com no está registrado)
- Domain sin registros MX válidos
- Domain en lista negra de Supabase

**Solución:**
- Para desarrollo: Usar dominios reales (`@gmail.com`, `@outlook.com`)
- Para producción: Registrar el dominio corporativo
- Verificar DNS: `nslookup -type=MX domain.com`

### Error 401 - No Autorizado
```json
{
  "error": "Credenciales inválidas",
  "success": false,
  "status": 401
}
```

## 📝 Tests de Postman

### Collection de Tests Básicos

#### 1. **Registrar Usuario**
```bash
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456",
  "nombre": "Test",
  "apellido": "User",
  "rol": "usuario"
}
```

#### 2. **Login**
```bash
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```

#### 3. **Verificar Token**
```bash
POST {{base_url}}/auth/verify
Content-Type: application/json

{
  "token": "{{access_token}}"
}
```

#### 4. **Estado de Auth**
```bash
GET {{base_url}}/auth/status
Authorization: Bearer {{access_token}}
```

#### 5. **Renovar Token**
```bash
POST {{base_url}}/auth/refresh
Content-Type: application/json

{
  "refresh_token": "{{refresh_token}}"
}
```

#### 6. **Logout**
```bash
POST {{base_url}}/auth/logout
Content-Type: application/json

{
  "token": "{{access_token}}"
}
```

## 🔐 Variables de Postman

Configurar estas variables en Postman:

```json
{
  "base_url": "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1",
  "access_token": "",
  "refresh_token": "",
  "user_id": ""
}
```

### Scripts de Postman para Automatización

#### En el Test de Register/Login:
```javascript
// Guardar tokens automáticamente
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.data.session) {
        pm.globals.set("access_token", response.data.session.access_token);
        pm.globals.set("refresh_token", response.data.session.refresh_token);
    }
    if (response.data.user) {
        pm.globals.set("user_id", response.data.user.id);
    }
}
```

#### Test de Validación de Response:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success true", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});

pm.test("User data exists", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.user).to.have.property("email");
    pm.expect(jsonData.data.user).to.have.property("id");
});
```

## 🎯 Casos de Test Prioritarios

### ✅ Tests Básicos
1. **Registrar usuario válido**
2. **Login con credenciales válidas**
3. **Verificar token válido**
4. **Renovar token con refresh token válido**
5. **Verificar estado de autenticación**
6. **Logout exitoso**

### ⚠️ Tests de Validación
1. **Email inválido** (esperado: 400)
2. **Contraseña débil** (esperado: 400)
3. **Login con credenciales incorrectas** (esperado: 401)
4. **Token inválido/expirado** (esperado: 401)
5. **Refresh token inválido** (esperado: 401)

### 🚫 Tests de Errores
1. **Campos requeridos faltantes** (esperado: 400)
2. **Token malformado** (esperado: 401)
3. **Usuario ya registrado** (verificar comportamiento)

## 🚀 Deployment

La función está lista para ser desplegada:

```bash
supabase functions deploy auth
```

URL de deployment:
```
https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/auth
```
