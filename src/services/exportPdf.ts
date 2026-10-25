import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const PAGE_MARGIN_MM = 8
const CONTENT_WIDTH_PX = 800

function createExportMount(html: string): { root: HTMLDivElement; page: HTMLDivElement } {
  const parsed = new DOMParser().parseFromString(html, 'text/html')

  const root = document.createElement('div')
  root.setAttribute('data-pdf-export', 'true')
  root.style.cssText = [
    'position: fixed',
    'left: -12000px',
    'top: 0',
    `width: ${CONTENT_WIDTH_PX}px`,
    'background: #ffffff',
    'color: #111111',
    'color-scheme: light',
    'z-index: -1',
  ].join(';')

  const style = document.createElement('style')
  style.textContent = Array.from(parsed.querySelectorAll('style'))
    .map((node) => node.textContent ?? '')
    .join('\n')
  root.appendChild(style)

  const page = document.createElement('div')
  page.setAttribute('data-pdf-page', 'true')
  page.innerHTML = parsed.body.innerHTML
  page.style.width = `${CONTENT_WIDTH_PX}px`
  page.style.background = '#ffffff'
  page.style.color = '#111111'
  root.appendChild(page)

  document.body.appendChild(root)
  return { root, page }
}

function waitForLayout(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

export async function exportPdfFromHtml(html: string, filename: string): Promise<void> {
  const { root, page } = createExportMount(html)

  try {
    await waitForLayout()
    if (document.fonts?.ready) {
      await document.fonts.ready
    }

    const canvas = await html2canvas(page, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      windowWidth: CONTENT_WIDTH_PX,
      onclone: (clonedDoc) => {
        const clonedPage = clonedDoc.querySelector('[data-pdf-page]') as HTMLElement | null
        if (clonedPage) {
          clonedPage.style.background = '#ffffff'
          clonedPage.style.color = '#111111'
        }
        clonedDoc.documentElement.style.background = '#ffffff'
        clonedDoc.body.style.background = '#ffffff'
        clonedDoc.body.style.color = '#111111'
      },
    })

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const printableWidth = pageWidth - PAGE_MARGIN_MM * 2
    const printableHeight = pageHeight - PAGE_MARGIN_MM * 2

    const imgWidth = printableWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const imgData = canvas.toDataURL('image/jpeg', 0.95)

    let offsetY = 0
    let pageIndex = 0

    while (offsetY < imgHeight) {
      if (pageIndex > 0) {
        pdf.addPage()
      }

      pdf.addImage(
        imgData,
        'JPEG',
        PAGE_MARGIN_MM,
        PAGE_MARGIN_MM - offsetY,
        imgWidth,
        imgHeight,
      )

      offsetY += printableHeight
      pageIndex += 1
    }

    pdf.save(filename)
  } finally {
    root.remove()
  }
}
