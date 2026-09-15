const fs = require('fs')
const path = require('path')

const ROOT = __dirname
const OUT_DIR = path.join(ROOT, 'dist')

const IGNORED = new Set(['dist', 'node_modules', '.git', '.vercel', '.env', '.env.local'])

function copyTree(sourceDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true })

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (IGNORED.has(entry.name)) continue

    const sourcePath = path.join(sourceDir, entry.name)
    const destPath = path.join(destDir, entry.name)

    if (entry.isDirectory()) {
      copyTree(sourcePath, destPath)
    } else {
      fs.copyFileSync(sourcePath, destPath)
    }
  }
}

fs.rmSync(OUT_DIR, { recursive: true, force: true })
copyTree(ROOT, OUT_DIR)

const envScript = 'window.ENV = ' + JSON.stringify({ TMDB_API_KEY: process.env.TMDB_API_KEY || '' }) + ';\n'
fs.writeFileSync(path.join(OUT_DIR, 'scripts', 'env.js'), envScript)

console.log('Build complete. Output in /dist')