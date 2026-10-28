import http from 'node:http'
import { chromium } from 'playwright'

const PORT = Number(process.env.PDF_PORT || 5174)

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

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = req.url?.split('?')[0] ?? ''
  if (req.method !== 'POST' || (url !== '/api/pdf' && url !== '/pdf')) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
    return
  }

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
})

server.listen(PORT, () => {
  console.log(`PDF server listening on http://localhost:${PORT}`)
})
