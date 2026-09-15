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
    // Render the element to a canvas with high scale and standard document layout
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1440,
      windowHeight: 1800,
      onclone: (clonedDoc) => {
        const clonedEl = typeof target === 'string' 
          ? clonedDoc.getElementById(target) 
          : (element.id ? clonedDoc.getElementById(element.id) : null);
          
        if (clonedEl) {
          // Remove all parent overflow clipping constraints so the 794px width is never clipped
          let parent = clonedEl.parentElement;
          while (parent && parent !== clonedDoc.body) {
            parent.style.overflow = 'visible';
            parent.style.maxWidth = 'none';
            parent.style.width = 'auto';
            parent.style.height = 'auto';
            parent.style.maxHeight = 'none';
            parent.style.position = 'static';
            parent.style.transform = 'none';
            parent = parent.parentElement;
          }
          clonedDoc.body.style.overflow = 'visible';
          clonedDoc.body.style.width = '1440px';

          clonedEl.style.width = '794px';
          clonedEl.style.maxWidth = '794px';
          clonedEl.style.minWidth = '794px';
          clonedEl.style.margin = '0 auto';
          clonedEl.style.padding = '24px';
          clonedEl.style.boxSizing = 'border-box';
          clonedEl.style.background = '#ffffff';
          clonedEl.style.position = 'relative';
          clonedEl.style.overflow = 'visible';

          // Ensure any elements marked hidden for mobile (e.g. sm:flex) are explicitly shown
          const hiddenElements = clonedEl.querySelectorAll('.hidden');
          hiddenElements.forEach((el) => {
            if (el.className.includes('sm:') || el.className.includes('md:') || el.className.includes('lg:')) {
              el.style.display = 'flex';
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

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10; // 10mm margin
    const imgWidth = pageWidth - (margin * 2); // 190mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - (margin * 2));

    // Support multi-page reports if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - (margin * 2));
    }

    const cleanName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(cleanName);
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    // Graceful fallback to browser print dialog
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
