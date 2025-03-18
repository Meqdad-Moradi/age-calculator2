import { inject, Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private readonly snackBar = inject(MatSnackBar);
  /**
   * Captures the DOM element with the specified id and generates a PDF.
   * @param elementId - The id of the element to capture (default is 'pdf-content').
   * @param pdfFilename - The name of the generated PDF file.
   */
  public captureScreen(
    elementId = 'pdf-content',
    pdfFilename = 'document.pdf'
  ): void {
    const element = document.getElementById(elementId);

    if (!element) {
      const errorMsg = `Element with id '${elementId}' not found.`;
      this.displayErrorMsg(errorMsg);
      return;
    }

    html2canvas(element)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Get dimensions of the PDF page
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfPageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfPageHeight);
        pdf.save(pdfFilename);
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
      duration: 4000,
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
