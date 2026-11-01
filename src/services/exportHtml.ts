export function downloadHtml(html: string, filename: string): void {
  const name = filename.replace(/\.pdf$/i, '.html')
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name.endsWith('.html') ? name : `${name}.html`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
