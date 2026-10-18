import { execFileSync } from 'node:child_process'
import { realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { searchForWorkspaceRoot } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

/**
 * Roots the dev server may serve files from. `npm link @6g-dali/ui-theme` makes
 * the package a symlink into the common-ui checkout, whose font imports then
 * resolve outside this project; allowing the linked package's workspace root
 * keeps `npm run dev` working. Same as portal-ui.
 */
function sharedPackageRoots(): string[] {
  return ['@6g-dali/ui-theme', '@6g-dali/ui-shell'].flatMap(name => {
    try {
      return [searchForWorkspaceRoot(realpathSync(`${projectRoot}node_modules/${name}`))]
    } catch {
      return []
    }
  })
}

/**
 * Short commit SHA for the footer's build marker. GIT_SHA first, because the
 * image build has no .git (see .dockerignore); `git rev-parse` locally.
 */
function buildSha(): string {
  const fromEnv = process.env.GIT_SHA?.trim()
  if (fromEnv) return fromEnv.slice(0, 7)
  try {
    return execFileSync('git', ['rev-parse', '--short=7', 'HEAD'], {
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).toString().trim()
  } catch {
    return 'unknown'
  }
}

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_SHA__: JSON.stringify(buildSha()),
  },
  server: {
    port: 3200,
    // A shifted port is a different origin, which Keycloak's Web Origins list
    // would reject with an opaque CORS error on the token endpoint.
    strictPort: true,
    host: 'localhost',
    fs: {
      allow: [searchForWorkspaceRoot(projectRoot), ...sharedPackageRoots()],
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    // The shell package imports its CSS; inlined, Vite handles that import
    // instead of Node, which cannot load a .css file.
    server: { deps: { inline: [/@6g-dali\//] } },
  },
})
