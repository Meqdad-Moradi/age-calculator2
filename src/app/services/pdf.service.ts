import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private readonly snackBar = inject(MatSnackBar);

  /**
   * downloadPDF
   * @returns void
   */
  public downloadPDF(): void {
    const element = document.getElementById('pdf-content');

    if (!element) {
      const errorMsg = `Element with id '${'pdf-content'}' not found.`;
      this.displayErrorMsg(errorMsg);
      return;
    }

    // Use html2canvas-pro to capture the content as a canvas
    html2canvas(element)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        // Initialize jsPDF. You can specify options like orientation or unit if needed.
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Calculate width and height of PDF page
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pageHeight = 295;
        let heightLeft = imgHeight;
        let position = 0;

        // If the content is longer than one page, you might need to split the content into multiple pages.
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position += heightLeft - imgHeight; // top padding for other pages
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('download.pdf');
      })
      .catch((err) => {
        this.displayErrorMsg('Error generating PDF: ' + err);
      });
  }

  /**
   * displayErrorMsg
   * @param msg string
   */
  private displayErrorMsg(msg: string): void {
    this.snackBar.open(msg, 'Close', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 10000,
    });
  }
}

// html2canvas(element)
//   .then((canvas) => {
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF('p', 'mm', 'a4');

//     // Get dimensions of the PDF page
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfPageHeight = pdf.internal.pageSize.getHeight();

//     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfPageHeight);
//     pdf.save(pdfFilename);
//   })
//   .catch((err) => {
//     this.displayErrorMsg('Error generating PDF: ' + err);
//   });
