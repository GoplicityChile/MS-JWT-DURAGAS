# JWT Auth Service

Microservicio Node.js para autenticación y emisión de tokens JWT, con soporte para validación, refresco, control de expiración configurable y fechas en zona horaria de Chile.

---

## Características

- **Emisión de JWT** con datos personalizados (`project`, `idUser`, `roleUser`).
- **Validación y refresco** de tokens JWT.
- **Expiración configurable** mediante variable de entorno (`JWT_EXPIRES_IN`).
- **Fechas de emisión y expiración** en UTC y en hora local de Chile (`America/Santiago`), usando [Luxon](https://moment.github.io/luxon/).
- **Validación de datos** con `class-validator` y DTOs.
- **Recepción de token** tanto en el header `Authorization: Bearer <token>` como en el body.
- **Swagger UI** con autenticación Bearer integrada y documentación automática.
- **Endpoints REST** listos para usar.

---

## Instalación

1. Clona el repositorio y entra en la carpeta:

   ```sh
   git clone https://github.com/juank-expled/MS-JWT.git
   cd jwt-auth-service
   ```

2. Instala las dependencias:

   ```sh
   npm install
   ```

3. Crea un archivo `.env` con el siguiente contenido de ejemplo:

   ```
   JWT_SECRET=tu_clave_secreta
   JWT_EXPIRES_IN=1h
   PORT=3000
   ```

---

## Uso en desarrollo

```sh
npm run dev
```

El servicio estará disponible en `http://localhost:3000`.

La documentación Swagger estará en:  
`http://localhost:3000/api-docs`

---

## Endpoints

### `POST /auth/token`

Genera un token JWT.

**Body JSON:**
```json
{
  "project": "projectA",
  "idUser": 1,
  "roleUser": "admin"
}
```

**Respuesta:**
```json
{
  "token": "Bearer <jwt>",
  "issuedAt": "2025-05-20T11:20:00.000-04:00",      // Hora Chile
  "expiresAt": "2025-05-20T12:20:00.000-04:00"      // Hora Chile
}
```

---

### `POST /auth/validate-token`

Valida un token JWT y los datos asociados.

**Body JSON:**
```json
{
  "token": "Bearer <jwt>",
  "project": "projectA",
  "idUser": 1,
  "roleUser": "admin"
}
```
**O puedes enviar el token en el header:**
```
Authorization: Bearer <jwt>
```

**Respuesta:**
```json
{
  "valid": true,
  "message": "Token válido"
}
```

---

### `POST /auth/refresh-token`

Genera un nuevo token a partir de uno válido.

**Body JSON:**
```json
{
  "token": "Bearer <jwt>",
  "project": "projectA",
  "idUser": 1,
  "roleUser": "admin"
}
```
**O puedes enviar el token en el header:**
```
Authorization: Bearer <jwt>
```

**Respuesta:**
```json
{
  "token": "Bearer <nuevo_jwt>",
  "issuedAt": "2025-05-20T11:20:00.000-04:00",
  "expiresAt": "2025-05-20T12:20:00.000-04:00"
}
```

---

## Variables de entorno

- `JWT_SECRET`: Clave secreta para firmar los tokens.
- `JWT_EXPIRES_IN`: Tiempo de expiración del token (ej: `1h`, `30m`, `2d`).
- `PORT`: Puerto donde se expone el microservicio.

---

## Zona horaria de Chile

Las fechas de emisión y expiración (`issuedAt`, `expiresAt`) se entregan en formato ISO y corresponden a la zona horaria oficial de Chile (`America/Santiago`), gestionada automáticamente por Luxon (incluye horario de verano/invierno).

---

## Seguridad y Swagger

- El microservicio implementa autenticación Bearer JWT.
- Swagger UI permite probar endpoints protegidos usando el botón "Authorize" con tu token JWT.
- El token puede ser enviado en el header `Authorization` o en el body bajo la propiedad `token`.

---

## Dependencias principales

- [express](https://expressjs.com/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [luxon](https://moment.github.io/luxon/)
- [class-validator](https://github.com/typestack/class-validator)
- [dotenv](https://github.com/motdotla/dotenv)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)

---

## Scripts útiles

- `npm run dev` — Ejecuta el servicio en modo desarrollo con recarga automática.
- `npm run build` — Compila el proyecto a JavaScript.
- `npm start` — Ejecuta el servicio desde la carpeta `dist`.

---

## Notas

- El microservicio está pensado para ser usado como backend de autenticación en arquitecturas de microservicios o aplicaciones SPA/Mobile.
- Las fechas en UTC también están disponibles si necesitas interoperabilidad internacional.
- Si tienes dudas sobre la zona horaria, revisa la documentación de [Luxon](https://moment.github.io/luxon/docs/manual/zones.html).

---

## Licencia

MIT
