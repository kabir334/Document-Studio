export async function exportPdfFromHtml(html: string, filename: string): Promise<void> {
  let response: Response
  try {
    response = await fetch('/api/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, filename }),
    })
  } catch {
    throw new Error(
      'PDF server is not running. Start the app with npm run dev (Vite + PDF server).',
    )
  }

  if (!response.ok) {
    let detail = `PDF export failed (${response.status})`
    try {
      const body = (await response.json()) as { error?: string }
      if (body.error) detail = body.error
    } catch {
      /* ignore */
    }
    throw new Error(detail)
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
