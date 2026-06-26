#!/usr/bin/env node
// Proyecta las reglas de _project-standard/rules/ a cada herramienta de IA (fuente única de verdad).
// Uso: node _project-standard/sync/sync-rules.mjs   (sin dependencias; solo Node nativo)

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const STANDARD_DIR = resolve(__dirname, '..') // _project-standard/
const PROJECT_ROOT = resolve(STANDARD_DIR, '..') // raíz del proyecto que copió la carpeta
const RULES_DIR = join(STANDARD_DIR, 'rules')

/** Lee y concatena todas las reglas en un único bloque Markdown ordenado. */
function readRules() {
  // @sideffect lee el directorio rules/ del disco
  const files = readdirSync(RULES_DIR).filter((f) => f.endsWith('.md')).sort()
  if (files.length === 0) throw new Error('No se encontraron reglas en ' + RULES_DIR)
  return files
    .map((f) => readFileSync(join(RULES_DIR, f), 'utf8').trim())
    .join('\n\n---\n\n')
}

/** Banner que avisa que el archivo es generado y no debe editarse a mano. */
function banner(tool) {
  return [
    `<!-- GENERADO por _project-standard/sync/sync-rules.mjs para ${tool}. NO EDITAR A MANO. -->`,
    `<!-- Fuente de verdad: _project-standard/rules/  ·  Regenerar: node _project-standard/sync/sync-rules.mjs -->`,
    '',
  ].join('\n')
}

/** Escribe un archivo creando los directorios necesarios. */
function write(relPath, content) {
  const full = join(PROJECT_ROOT, relPath)
  // @sideffect crea carpetas y escribe en disco en la raíz del proyecto
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, content, 'utf8')
  console.log('  ✓', relPath)
}

/** Bloque de precedencia que apunta a un estándar externo, si está activo. */
function externalPrecedence() {
  const file = join(STANDARD_DIR, 'context', 'EXTERNAL_STANDARD.md')
  if (!existsSync(file)) return ''
  // @sideffect lee EXTERNAL_STANDARD.md para saber si hay estándar de empresa activo
  const content = readFileSync(file, 'utf8')
  const active = /\*\*Activo:\*\*\s*`?s[ií]`?/i.test(content)
  if (!active) return ''
  return [
    '> ⚠️ **ESTÁNDAR EXTERNO ACTIVO.** Las reglas de la empresa **ganan** sobre las de abajo.',
    '> Este estándar solo complementa donde el externo no diga nada. Detalle y tabla de conflictos en',
    '> `_project-standard/context/EXTERNAL_STANDARD.md`. Ante conflicto, sigue la empresa y regístralo.',
    '',
    '---',
    '',
  ].join('\n')
}

/** Cabecera común con las reglas innegociables resumidas. */
function header() {
  return [
    '# Reglas del proyecto (estándar senior)',
    '',
    'Estas son las reglas innegociables del proyecto. Fuente completa: `_project-standard/`.',
    '',
    '**Orden de precedencia:** instrucción directa del lead > estándar externo',
    '(`context/EXTERNAL_STANDARD.md`) > este estándar > defaults de la herramienta.',
    '',
    '**Antes de programar:** lee `_project-standard/context/AI_CONTEXT.md`, el perfil en',
    '`_project-standard/profiles/` y la arquitectura en `_project-standard/context/DECISIONS.md`.',
    'Si la tarea es un fix puntual o entras a un proyecto a medias, sigue el modo de alcance acotado',
    '(`prompts/02-scoped-task-prompt.md`): infiere y confirma el alcance antes de tocar código.',
    '',
    '**Innegociables:** código en inglés · comentarios en `COMMENTS_LANG` · función = 1 línea de doc',
    '+ tags (@sensitive/@param-critico/@sideffect/@todo) · validación en frontera · errores tipados',
    '· secretos en `.env` · i18n sin hardcode · lógica de negocio detrás de puertos · API versionada',
    '· testear casos límite (no solo el camino feliz) · diff mínimo y no romper código ajeno',
    '· corre el auditor del stack + baseline de seguridad (Semgrep/gitleaks) — ver skills/auditors.md',
    '· respetar el estándar externo si existe · aplica ponytail sin recortar seguridad/validación/errores/accesibilidad.',
    '',
    '---',
    '',
  ].join('\n')
}

const rules = readRules()
const body = externalPrecedence() + header() + rules
let count = 0

console.log('Proyectando reglas desde rules/ ...')

// 1) Claude Code — CLAUDE.md en la raíz + comando check-done
write('CLAUDE.md', banner('Claude Code') + body)
const checkDone = readFileSync(join(STANDARD_DIR, 'commands', 'check-done.md'), 'utf8')
write(join('.claude', 'commands', 'check-done.md'), checkDone)
count += 2

// 2) Cursor — un .mdc por regla con front-matter alwaysApply
const ruleFiles = readdirSync(RULES_DIR).filter((f) => f.endsWith('.md')).sort()
for (const f of ruleFiles) {
  const content = readFileSync(join(RULES_DIR, f), 'utf8')
  const mdc = `---\ndescription: ${f.replace('.md', '')}\nalwaysApply: true\n---\n\n` + content
  write(join('.cursor', 'rules', f.replace('.md', '.mdc')), mdc)
  count++
}

// 3) Windsurf — reglas concatenadas
write(join('.windsurf', 'rules', 'project-standard.md'), banner('Windsurf') + body)
count++

// 4) Genérico (OpenCode / Cline / Claude.ai / ChatGPT) — AGENTS.md en la raíz
write('AGENTS.md', banner('agentes genéricos / IA web') + body)
count++

console.log(`\nListo: ${count} archivos generados desde ${ruleFiles.length} reglas.`)
console.log('Recuerda: edita las reglas SOLO en _project-standard/rules/ y vuelve a correr este script.')
