import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Downloads a DOM element directly as a high-resolution PDF file.
 * @param {HTMLElement|string} target - The DOM element or ID of the element to capture
 * @param {string} filename - The name of the downloaded file (without .pdf extension)
 * @param {object} options - Additional configuration options
 */
export const downloadElementAsPdf = async (target, filename = 'BHUMICRED_Document', options = {}) => {
  let element = typeof target === 'string' ? document.getElementById(target) : target;

  if (!element) {
    console.warn(`Element ${target} not found for PDF generation. Fallback to print.`);
    window.print();
    return false;
  }

  try {
    // Render the element cleanly without any modal or flexbox parent clipping
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1024,
      onclone: (clonedDoc) => {
        const clonedEl = typeof target === 'string' 
          ? clonedDoc.getElementById(target) 
          : (element.id ? clonedDoc.getElementById(element.id) : null);
          
        if (clonedEl) {
          // Clear everything in cloned body and mount only our printable element
          clonedDoc.body.innerHTML = '';
          clonedDoc.body.style.margin = '0';
          clonedDoc.body.style.padding = '24px';
          clonedDoc.body.style.background = '#ffffff';
          clonedDoc.body.style.display = 'flex';
          clonedDoc.body.style.justifyContent = 'center';
          clonedDoc.body.style.alignItems = 'flex-start';
          clonedDoc.body.style.width = '1024px';
          clonedDoc.body.appendChild(clonedEl);

          clonedEl.style.width = '700px';
          clonedEl.style.maxWidth = '700px';
          clonedEl.style.minWidth = '700px';
          clonedEl.style.margin = '0 auto';
          clonedEl.style.padding = '24px 28px';
          clonedEl.style.background = '#ffffff';
          clonedEl.style.color = '#0f172a';
          clonedEl.style.boxSizing = 'border-box';
          clonedEl.style.border = '3px double #065f46';
          clonedEl.style.borderRadius = '16px';
          clonedEl.style.transform = 'none';
          clonedEl.style.overflow = 'visible';
          clonedEl.style.fontFamily = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

          // Force all text, spans, and tables inside cloned element to stay crisp and unclipped
          const allElements = clonedEl.querySelectorAll('*');
          allElements.forEach((el) => {
            el.style.overflow = 'visible';
            el.style.letterSpacing = 'normal';
            if (el.tagName === 'TABLE') {
              el.style.width = '100%';
              el.style.borderCollapse = 'collapse';
              el.style.tableLayout = 'fixed';
            }
            if (['P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'TD', 'TH', 'DIV'].includes(el.tagName)) {
              el.style.lineHeight = el.style.lineHeight || '1.35';
            }
          });
        }
      },
      ...options.html2canvas,
    });

    const imgData = canvas.toDataURL('image/png');

    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const margin = options.margin !== undefined ? options.margin : 10; // 10mm margin
    const usableWidth = pageWidth - (margin * 2); // 190mm
    const usableHeight = pageHeight - (margin * 2); // 277mm

    // Calculate proportional aspect ratio
    const imgRatio = canvas.width / canvas.height;
    let renderWidth = usableWidth;
    let renderHeight = usableWidth / imgRatio;

    // If single page certificate fits on A4, scale to fit within usable boundaries without cut-off
    if (options.multiPage !== true && renderHeight > usableHeight) {
      renderHeight = usableHeight;
      renderWidth = usableHeight * imgRatio;
    }

    // Horizontally and vertically center on A4 page
    const offsetX = (pageWidth - renderWidth) / 2;
    const offsetY = (pageHeight - renderHeight) / 2;

    if (options.multiPage && renderHeight > usableHeight) {
      let heightLeft = renderHeight;
      let position = margin;

      pdf.addImage(imgData, 'PNG', offsetX, position, renderWidth, renderHeight);
      heightLeft -= usableHeight;

      while (heightLeft > 0) {
        position = heightLeft - renderHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', offsetX, position, renderWidth, renderHeight);
        heightLeft -= usableHeight;
      }
    } else {
      pdf.addImage(imgData, 'PNG', offsetX, offsetY, renderWidth, renderHeight);
    }

    const cleanName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(cleanName);
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    const originalTitle = document.title;
    document.title = filename;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
    return false;
  }
};

export default downloadElementAsPdf;
