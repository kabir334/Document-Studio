import html2pdf from 'html2pdf.js'

export async function exportPdf(element: HTMLElement, filename: string): Promise<void> {
  const options = {
    margin: 10,
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
  }

  await html2pdf().set(options).from(element).save()
}
