/**
 * Tiered verification gate. Run via package.json scripts:
 *   verify:changed  fast tier on files changed vs merge-base with `main`
 *   verify:staged   fast tier on staged files (pre-commit hook)
 *   verify          full fast tier (CI / final handoff)
 *   verify:handoff  full fast tier + path-triggered storybook/e2e
 *
 * Quiet by design: prints one line per step on success, full output on failure.
 */
import { execFileSync, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import process from 'node:process'

type Mode = 'changed' | 'staged' | 'full' | 'handoff'

interface Step {
  name: string
  args: string[]
}

interface Result {
  name: string
  ok: boolean
  ms: number
  output: string
}

const MODES: readonly Mode[] = ['changed', 'staged', 'full', 'handoff']
const BASE_BRANCH = process.env.VERIFY_BASE ?? 'main'

const SKIP = [
  /\.md$/,
  /^docs\//,
  /^\.agents\//,
  /^\.vscode\//,
  /^\.editorconfig$/,
  /^\.gitattributes$/,
  /^\.gitignore$/,
  /^skills-lock\.json$/,
  /^opencode\.jsonc$/,
]
const CODE = /^(src|e2e)\//
const LINTABLE = /\.(vue|ts|mts|tsx)$/
const STORYBOOK_TRIGGER = [/\.stories\.ts$/, /^src\/components\/(?!ui\/).*\.vue$/]
const E2E_TRIGGER = [
  /^src\/components\//,
  /^src\/stores\//,
  /^src\/App\.vue$/,
  /^src\/style\.css$/,
  /^index\.html$/,
  /^e2e\//,
]

const matches = (patterns: RegExp[], file: string) => patterns.some((p) => p.test(file))

function git(args: string[]): string[] {
  const out = execFileSync('git', args, { encoding: 'utf8' })
  return out.split('\n').filter(Boolean)
}

function changedFiles(mode: Mode): string[] {
  if (mode === 'staged') return git(['diff', '--cached', '--name-only', '--diff-filter=ACMRD'])
  const base = git(['merge-base', 'HEAD', BASE_BRANCH])[0] ?? 'HEAD'
  const tracked = git(['diff', '--name-only', '--diff-filter=ACMRD', base])
  const untracked = git(['ls-files', '--others', '--exclude-standard'])
  return [...new Set([...tracked, ...untracked])]
}

function run(step: Step): Promise<Result> {
  const started = Date.now()
  return new Promise((resolve) => {
    const child = spawn('pnpm', ['exec', ...step.args], {
      env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1', PW_HEADLESS: '1' },
    })
    let output = ''
    child.stdout.on('data', (chunk: Buffer) => (output += chunk.toString()))
    child.stderr.on('data', (chunk: Buffer) => (output += chunk.toString()))
    child.on('close', (code) =>
      resolve({ name: step.name, ok: code === 0, ms: Date.now() - started, output }),
    )
  })
}

function report(results: Result[]): boolean {
  for (const r of results) {
    console.log(`${r.ok ? '✓' : '✗'} ${r.name} (${(r.ms / 1000).toFixed(1)}s)`)
  }
  for (const r of results.filter((x) => !x.ok)) {
    console.log(`\n--- ${r.name} ---\n${r.output.trim()}`)
  }
  return results.every((r) => r.ok)
}

function planFast(mode: Mode, files: string[]): Step[] {
  const relevant = files.filter((f) => !matches(SKIP, f))
  if (relevant.length === 0) return []

  const full = mode === 'full' || mode === 'handoff' || relevant.some((f) => !CODE.test(f))
  const existing = relevant.filter((f) => existsSync(f))
  const lintFiles = existing.filter((f) => LINTABLE.test(f))
  const relatedFiles = existing.filter((f) => CODE.test(f))

  const steps: Step[] = [{ name: 'type-check', args: ['vue-tsc', '--build'] }]

  if (full) {
    steps.push({ name: 'eslint', args: ['eslint', '.'] })
    steps.push({
      name: 'unit',
      args: ['vitest', 'run', '--project=unit', '--reporter=dot'],
    })
    return steps
  }

  if (lintFiles.length > 0) {
    steps.push({ name: `eslint (${lintFiles.length} files)`, args: ['eslint', ...lintFiles] })
  }
  if (relatedFiles.length > 0) {
    steps.push({
      name: `unit (related to ${relatedFiles.length} files)`,
      args: [
        'vitest',
        'related',
        '--run',
        '--project=unit',
        '--reporter=dot',
        '--passWithNoTests',
        ...relatedFiles,
      ],
    })
  }
  return steps
}

function planHeavy(files: string[]): Step[] {
  const relevant = files.filter((f) => !matches(SKIP, f))
  const configChange = relevant.some((f) => !CODE.test(f))
  const existing = relevant.filter((f) => existsSync(f) && CODE.test(f))
  const steps: Step[] = []

  if (configChange || relevant.some((f) => matches(STORYBOOK_TRIGGER, f))) {
    steps.push({
      name: 'storybook',
      args: configChange
        ? ['vitest', 'run', '--project=storybook', '--reporter=dot']
        : [
            'vitest',
            'related',
            '--run',
            '--project=storybook',
            '--reporter=dot',
            '--passWithNoTests',
            ...existing,
          ],
    })
  }
  if (configChange || relevant.some((f) => matches(E2E_TRIGGER, f))) {
    // Chromium only locally; CI runs the full browser matrix.
    steps.push({
      name: 'e2e (chromium)',
      args: ['playwright', 'test', '--project=chromium', '--reporter=line'],
    })
  }
  return steps
}

async function main() {
  const mode = process.argv[2] as Mode
  if (!MODES.includes(mode)) {
    console.error(`usage: verify.ts <${MODES.join('|')}>`)
    process.exit(2)
  }

  let files = mode === 'full' ? [] : changedFiles(mode)
  // Nothing to diff on `main` (or mode is full): run the whole fast tier.
  const runEverything =
    mode === 'full' || ((mode === 'changed' || mode === 'handoff') && files.length === 0)
  if (runEverything) files = ['package.json']

  const fast = planFast(mode, files)
  if (fast.length === 0) {
    console.log(`✓ verify:${mode} skipped (no code changes)`)
    return
  }

  const started = Date.now()
  const fastResults = await Promise.all(fast.map(run))
  let ok = report(fastResults)

  if (ok && mode === 'handoff') {
    const heavy = planHeavy(changedFiles('changed'))
    const heavyResults: Result[] = []
    for (const step of heavy) {
      const result = await run(step)
      heavyResults.push(result)
      if (!result.ok) break
    }
    ok = report(heavyResults) && ok
  }

  const seconds = ((Date.now() - started) / 1000).toFixed(1)
  console.log(ok ? `\n✓ verify:${mode} passed in ${seconds}s` : `\n✗ verify:${mode} FAILED`)
  process.exit(ok ? 0 : 1)
}

await main()
