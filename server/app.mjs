import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.join(__dirname, '..', 'dist')
const PORT = Number(process.env.PORT || 8080)

let browserPromise

function getBrowser() {
  if (!browserPromise) {
    browserPromise = chromium.launch({ headless: true })
  }
  return browserPromise
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function safeFilename(name) {
  const base = String(name || 'document.pdf').replace(/[/\\?%*:|"<>]/g, '-')
  return base.toLowerCase().endsWith('.pdf') ? base : `${base}.pdf`
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
}

function serveStatic(req, res) {
  let urlPath = req.url?.split('?')[0] ?? '/'
  if (urlPath === '/') urlPath = '/index.html'

  const filePath = path.normalize(path.join(DIST_DIR, urlPath))
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  const sendFile = (target) => {
    const ext = path.extname(target)
    const type = MIME[ext] ?? 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': type })
    fs.createReadStream(target).pipe(res)
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    sendFile(filePath)
    return
  }

  const indexPath = path.join(DIST_DIR, 'index.html')
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    fs.createReadStream(indexPath).pipe(res)
    return
  }

  res.writeHead(404)
  res.end('Not found')
}

async function handlePdf(req, res) {
  try {
    const raw = await readBody(req)
    const payload = JSON.parse(raw)
    const html = payload.html
    if (typeof html !== 'string' || html.trim() === '') {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'html is required' }))
      return
    }

    const filename = safeFilename(payload.filename)
    const browser = await getBrowser()
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle' })
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
    })
    await page.close()

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    })
    res.end(pdf)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'PDF generation failed'
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: message }))
  }
}

const server = http.createServer(async (req, res) => {
  const url = req.url?.split('?')[0] ?? ''

  if (req.method === 'POST' && (url === '/api/pdf' || url === '/pdf')) {
    await handlePdf(req, res)
    return
  }

  if (req.method === 'GET') {
    serveStatic(req, res)
    return
  }

  res.writeHead(405)
  res.end('Method not allowed')
})

server.listen(PORT, () => {
  console.log(`Document Studio listening on http://localhost:${PORT}`)
})
