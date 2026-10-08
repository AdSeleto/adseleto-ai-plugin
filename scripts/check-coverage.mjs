#!/usr/bin/env node
/**
 * Confere a documentação da skill contra o manifesto de tools do conector.
 *
 * Checa nos dois sentidos:
 *   1. Tool no manifesto que a skill não cita  → buraco de cobertura
 *   2. Tool citada que não está no manifesto   → nome errado ou tool removida
 *
 * O segundo caso é o mais perigoso: um nome com erro de digitação faz o
 * modelo tentar chamar uma tool que não existe, e nada avisa.
 *
 * As tools do conector são snake_case com um verbo na frente
 * (listar_sites, ajustar_fallback). Parâmetros como company_id também são
 * snake_case, então só conta como "tool citada" o token em crase cujo
 * primeiro pedaço é o verbo de alguma tool do manifesto.
 *
 * Uso:  node scripts/check-coverage.mjs
 *
 * Para atualizar o manifesto: o endpoint exige login, então não dá para
 * enumerar em CI. Com o conector ligado no Claude Code, peça a lista de
 * tools e salve um nome por linha em tools/manifest.txt (linhas com # são
 * comentário).
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Tokens em crase que começam com verbo de tool mas não são tools (valores de acao). */
const ALLOWLIST = new Set(['criar_ramificacao'])

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (entry.endsWith('.md')) out.push(full)
  }
  return out
}

const manifest = readFileSync(join(root, 'tools/manifest.txt'), 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))

const known = new Set(manifest)
const verbs = new Set(manifest.map((t) => t.split('_')[0]))

const docs = [...walk(join(root, 'skills')), join(root, 'README.md')]
const corpus = docs.map((f) => readFileSync(f, 'utf8')).join('\n')

// 1. Tools do manifesto que ninguém cita
const uncited = manifest.filter((tool) => !corpus.includes('`' + tool + '`'))

// 2. Tokens em crase com cara de tool que não existem no manifesto
const cited = new Set()
for (const [, token] of corpus.matchAll(/`([a-z][a-z0-9]*(?:_[a-z0-9]+)+)`/g)) {
  if (verbs.has(token.split('_')[0])) cited.add(token)
}
const unknown = [...cited].filter((t) => !known.has(t) && !ALLOWLIST.has(t))

const problems = []
if (uncited.length) {
  problems.push(
    `${uncited.length} tool(s) do manifesto sem nenhuma menção na skill:\n` +
      uncited.map((t) => `    ${t}`).join('\n'),
  )
}
if (unknown.length) {
  problems.push(
    `${unknown.length} nome(s) citado(s) que não existem no manifesto ` +
      `(erro de digitação, ou tool removida do conector):\n` +
      unknown.map((t) => `    ${t}`).join('\n'),
  )
}

if (problems.length) {
  console.error('✗ Cobertura de tools com problema\n')
  for (const p of problems) console.error('  ' + p + '\n')
  console.error(
    '  Se o conector mudou, atualize tools/manifest.txt e documente o que entrou.\n',
  )
  process.exit(1)
}

console.log(`✓ Cobertura de tools: ${manifest.length}/${manifest.length} citadas`)
console.log(`✓ Nenhum nome de tool inexistente na documentação`)
