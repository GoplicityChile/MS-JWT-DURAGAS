# Changelog

## [1.0.1] - 2025-06-11
### DevOps / Configuración
- Se configuró Prettier como formateador por defecto para TypeScript en VS Code.
- Se habilitó la integración de ESLint para aplicar reglas de linting y autocorrección al guardar archivos.
- Se ajustó la indentación del código para cumplir con las reglas de ESLint.

## [1.0.0] - 2025-05-20
### Added
- Fechas de emisión y expiración en hora local de Chile (`America/Santiago`) usando Luxon.
- Soporte para recibir el token tanto en el header `Authorization: Bearer <token>` como en el body.
- Documentación Swagger mejorada para endpoints protegidos con Bearer.
- Respuesta de endpoints incluye fechas en formato local y UTC.

### Changed
- El token en la respuesta ahora se entrega con el prefijo `Bearer ` para facilitar su uso en clientes.
- Validación robusta del token para aceptar ambos formatos (con o sin prefijo `Bearer `).

### Fixed
- Corrección en la extracción del token para evitar errores con prefijos.

---

## [1.0.0] - 2025-05-15
### Added
- Versión inicial del microservicio JWT Auth.