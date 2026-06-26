# Checklist pre-deploy

> Recórrela **antes de cada despliegue a producción**. Complementa el
> [`Definition of Done`](definition-of-done.md) (que es por feature); esto es por release.

---

## Antes de desplegar
- [ ] `main` está verde en CI (lint + test + build + audit).
- [ ] Versión etiquetada (SemVer) y CHANGELOG actualizado.
- [ ] Variables de entorno de producción configuradas y validadas (sin valores de ejemplo).
- [ ] Secretos en el gestor de secretos del entorno, no en el repo.
- [ ] Migraciones de BD probadas en staging y **reversibles** (plan de rollback).
- [ ] Cambios incompatibles de API → nueva versión; los clientes viejos siguen funcionando.
- [ ] Feature flags en el estado correcto para esta release.

## Configuración del entorno
- [ ] HTTPS y headers de seguridad activos.
- [ ] CORS restringido a los orígenes reales de producción.
- [ ] Rate limiting activo en endpoints públicos/sensibles.
- [ ] Logs estructurados llegan al destino correcto (sin secretos).
- [ ] Health check responde; métricas/alertas configuradas.
- [ ] Backups de BD configurados y verificados.

## Despliegue seguro
- [ ] Estrategia sin downtime si aplica (rolling / blue-green / canary).
- [ ] Plan de rollback claro y probado (cómo volver a la versión anterior).
- [ ] Para cambios de datos: patrón expand→migrate→contract, no big-bang.

## Después de desplegar
- [ ] Smoke test de los flujos críticos en producción.
- [ ] Revisar logs y métricas los primeros minutos (errores, latencia).
- [ ] Confirmar que las migraciones aplicaron correctamente.
- [ ] Anotar el despliegue en `context/PROGRESS.md`.
