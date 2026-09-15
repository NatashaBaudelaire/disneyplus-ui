const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3000
const ROOT = __dirname

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.md': 'text/markdown'
}

function loadEnv() {
  const env = {}

  for (const file of ['.env.local', '.env']) {
    const envPath = path.join(ROOT, file)
    if (!fs.existsSync(envPath)) continue

    const content = fs.readFileSync(envPath, 'utf8')
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue

      const eqIndex = line.indexOf('=')
      if (eqIndex === -1) continue

      const key = line.slice(0, eqIndex).trim()
      let value = line.slice(eqIndex + 1).trim()

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      env[key] = value
    }
  }

  return env
}

const env = loadEnv()
const ENV_SCRIPT = '<script>window.ENV = ' + JSON.stringify(env) + ';</script>'

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0])
  const filePath = path.normalize(path.join(ROOT, urlPath === '/' ? '/index.html' : urlPath))

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  const ext = path.extname(filePath).toLowerCase()
  let content = fs.readFileSync(filePath)

  if (path.basename(filePath) === 'index.html') {
    content = content.toString().replace('</head>', ENV_SCRIPT + '\n  </head>')
  }

  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
  res.end(content)
})

server.listen(PORT, () => {
  console.log('Disney Plus UI running at http://localhost:' + PORT)
  console.log('Open index.html directly in a browser only if you have configured scripts/env.js.')
})