import type { Block, DocumentModel, DocumentTheme } from '../domain/document'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const baseStyles = `
  @page { size: A4; margin: 12mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Segoe UI", system-ui, sans-serif;
    background: #ffffff;
    color: #111111;
    line-height: 1.55;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page { padding: 40px 48px; max-width: 800px; margin: 0 auto; }
  h1, h2, h3 { color: #111111; font-weight: 700; }
  h1 { font-size: 28px; margin-bottom: 12px; }
  h2 { font-size: 17px; margin: 24px 0 12px; text-transform: uppercase; letter-spacing: 0.04em; color: #1e3a5f; }
  h3 { font-size: 15px; margin: 16px 0 8px; color: #111111; }
  p { color: #222222; font-size: 14px; margin-bottom: 12px; }
  .meta-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 24px;
    font-size: 13px;
    margin-bottom: 20px;
  }
  .meta-grid dt { font-weight: 600; color: #111111; }
  .meta-grid dd { margin: 0; color: #333333; }
  .callout {
    background: #f4f6f8;
    border-left: 4px solid #2563eb;
    padding: 14px 18px;
    color: #222222;
    font-size: 14px;
    margin: 12px 0 20px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    margin: 8px 0 20px;
  }
  th {
    background: #1e3a5f;
    color: #ffffff;
    text-align: left;
    padding: 10px 12px;
    font-weight: 600;
  }
  td {
    padding: 10px 12px;
    border-bottom: 1px solid #dde3ea;
    color: #111111;
  }
  tr:nth-child(even) td { background: #f8fafc; }
  td.amount, th.amount { text-align: right; }
  ul, ol { margin: 8px 0 16px 22px; color: #222222; font-size: 14px; }
  li { margin-bottom: 6px; color: #222222; }
  .total-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    background: #1e3a5f;
    font-size: 16px;
    font-weight: 700;
    margin-top: 8px;
    border-radius: 4px;
  }
  .total-row span { color: #ffffff; }
  .subtotal-row {
    display: flex;
    justify-content: flex-end;
    gap: 24px;
    padding: 6px 0;
    font-size: 14px;
    color: #333333;
  }
  .footer {
    margin-top: 36px;
    padding-top: 14px;
    border-top: 1px solid #dde3ea;
    font-size: 11px;
    color: #666666;
    text-align: center;
  }
`

const themeStyles: Record<DocumentTheme, string> = {
  report: `
    .report-title { border-bottom: 3px solid #1e3a5f; padding-bottom: 16px; margin-bottom: 24px; }
    .report-title h1 { color: #1e3a5f; }
  `,
  invoice: `
    .invoice-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
    .invoice-brand { font-size: 20px; font-weight: 800; color: #0f172a; }
    .invoice-label { font-size: 26px; font-weight: 300; color: #475569; letter-spacing: 0.06em; }
  `,
  certificate: `
    body { background: #fffef8; }
    .cert-frame {
      border: 6px double #1e3a5f;
      padding: 48px 40px;
      text-align: center;
      max-width: 720px;
      margin: 32px auto;
      background: #ffffff;
    }
    .cert-frame h1 { font-family: Georgia, serif; font-size: 34px; color: #111111; }
    .cert-frame h2 { text-transform: none; font-size: 20px; color: #1e3a5f; border: none; }
    .cert-frame p { font-size: 15px; color: #333333; }
    .cert-frame > p:first-of-type {
      font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
      color: #1e3a5f; margin-bottom: 12px; font-weight: 600;
    }
    .cert-frame .meta-grid { grid-template-columns: 1fr; justify-items: center; }
  `,
  proposal: `
    .proposal-banner {
      background: #1e3a5f;
      color: #ffffff;
      padding: 36px 48px;
      margin: -40px -48px 32px;
    }
    .proposal-banner h1 { color: #ffffff; margin-bottom: 8px; }
    .proposal-banner p { color: #cbd5e1; margin: 0; }
  `,
}

function renderBlock(block: Block): string {
  switch (block.type) {
    case 'heading': {
      const level = block.level ?? 2
      const tag = level === 1 ? 'h1' : level === 3 ? 'h3' : 'h2'
      return `<${tag}>${escapeHtml(block.text)}</${tag}>`
    }
    case 'paragraph':
      return `<p>${escapeHtml(block.text)}</p>`
    case 'meta':
      return `<dl class="meta-grid">${block.items
        .map(
          (item) =>
            `<dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.value)}</dd>`,
        )
        .join('')}</dl>`
    case 'callout':
      return `<div class="callout">${escapeHtml(block.text)}</div>`
    case 'table': {
      const amountClass = (i: number, cols: string[]) =>
        cols[i]?.toLowerCase().includes('amount') || cols[i]?.toLowerCase().includes('total')
          ? ' class="amount"'
          : ''
      return `<table><thead><tr>${block.columns
        .map((c, i) => `<th${amountClass(i, block.columns)}>${escapeHtml(c)}</th>`)
        .join('')}</tr></thead><tbody>${block.rows
        .map(
          (row) =>
            `<tr>${row
              .map((cell, i) => `<td${amountClass(i, block.columns)}>${escapeHtml(cell)}</td>`)
              .join('')}</tr>`,
        )
        .join('')}</tbody></table>`
    }
    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul'
      return `<${tag}>${block.items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</${tag}>`
    }
    case 'total':
      return `<div class="total-row"><span>${escapeHtml(block.label)}</span><span>${escapeHtml(block.value)}</span></div>`
    default:
      return ''
  }
}

function wrapBody(theme: DocumentTheme, blocks: Block[]): string {
  const html = blocks.map(renderBlock).join('\n')

  switch (theme) {
    case 'certificate':
      return `<div class="cert-frame">${html}</div>`
    case 'proposal': {
      const h1 = blocks.find((b) => b.type === 'heading' && b.level === 1)
      const sub = blocks.find((b) => b.type === 'paragraph')
      const rest = blocks.filter((b) => b !== h1 && b !== sub)
      const banner =
        h1 && h1.type === 'heading'
          ? `<div class="proposal-banner"><h1>${escapeHtml(h1.text)}</h1>${
              sub && sub.type === 'paragraph' ? `<p>${escapeHtml(sub.text)}</p>` : ''
            }</div>`
          : ''
      return `<div class="page">${banner}${rest.map(renderBlock).join('\n')}</div>`
    }
    case 'report': {
      const title = blocks.find((b) => b.type === 'heading' && b.level === 1)
      const rest = blocks.filter((b) => b !== title)
      const titleHtml =
        title && title.type === 'heading'
          ? `<div class="report-title">${renderBlock(title)}</div>`
          : ''
      return `<div class="page">${titleHtml}${rest.map(renderBlock).join('\n')}</div>`
    }
    default:
      return `<div class="page">${html}</div>`
  }
}

export function renderHtml(document: DocumentModel): string {
  const bodyContent = wrapBody(document.theme, document.blocks)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>${baseStyles}${themeStyles[document.theme]}</style>
</head>
<body>
  ${bodyContent}
  <div class="footer">Generated by Document Studio</div>
</body>
</html>`
}
