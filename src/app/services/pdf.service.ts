import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private readonly snackBar = inject(MatSnackBar);

  public isDownloading = signal(false);

  /**
   * downloadPDF
   * Generates a PDF from the HTML element with id 'pdf-content'
   * and saves it as 'download.pdf'.
   */
  public generatePDF(): void {
    this.isDownloading.set(true);
    // Get the HTML element to capture as PDF
    const element = document.getElementById('pdf-content');

    // If the element doesn't exist, display an error and exit the function
    if (!element) {
      const errorMsg = `Element with id 'pdf-content' not found.`;
      this.displayErrorMsg(errorMsg);
      return;
    }

    // Define PDF page settings (A4 dimensions in mm)
    const margin = 15;
    const pageWidth = 210; // A4 page width in mm
    const pageHeight = 297 - margin * 2; // A4 page height in mm
    const headerHeight = 20; // Height reserved for the header in mm
    const headerSpacing = 5; // Space between header and content in mm
    // Calculate the width available for the main content
    const contentWidth = pageWidth - margin * 2;

    html2canvas(element, {
      useCORS: true,
      allowTaint: false,
      scale: 2,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        // Calculate the height of the image in the PDF based on the scaling to the available width
        const contentImgHeight = (canvas.height * contentWidth) / canvas.width;

        // Calculate the height available for content on the first page (excluding header area and margins)
        const firstPageContentHeight =
          pageHeight - headerHeight - headerSpacing - margin * 2;
        // For subsequent pages, the available content height is the page height minus top and bottom margins
        const otherPagesContentHeight = pageHeight - margin * 2;

        // Initialize the jsPDF document (portrait mode, mm units, A4 paper)
        const pdf = new jsPDF('p', 'mm', 'a4');

        // ---------------
        // Build the Header
        // ---------------
        pdf.setFontSize(10); // Set small font for header text

        // Get the current date (formatted in German locale) and add it to the header
        const currentDate = new Date().toLocaleDateString('de');
        pdf.text(currentDate, margin, headerHeight + margin - 4);

        // Define an external logo image URL
        const logoUrl =
          'https://images.pexels.com/photos/30912294/pexels-photo-30912294/free-photo-of-serene-white-swan-gliding-on-foggy-pond-in-sintra.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load';
        const logoWidth = 20; // Width of the logo in mm
        const logoHeight = 20; // Height of the logo in mm
        // Calculate the logo's X coordinate so it aligns to the right with a margin
        const logoX = pageWidth - margin - logoWidth;
        const logoY = margin; // Place the logo at the top margin
        // Add the logo image to the PDF header
        pdf.addImage(logoUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);

        // Add the company name text centered under the logo
        pdf.setFontSize(16);
        pdf.setFont('roboto', 'bold');
        pdf.text('AGE Calculator', margin, margin);

        // Draw a bottom border for the header
        pdf.setDrawColor(200); // Set border color
        pdf.setLineWidth(0.2); // Set border thickness
        pdf.line(
          margin,
          margin + headerHeight,
          pageWidth - margin,
          margin + headerHeight
        );

        // ---------------
        // Insert the Captured Content
        // ---------------
        // Set the initial Y offset to start right after the header and its spacing
        const yOffset = margin + headerHeight + headerSpacing;
        // Add the full captured image to the first page at the calculated offset and scale it to the content width
        pdf.addImage(
          imgData,
          'PNG',
          margin,
          yOffset,
          contentWidth,
          contentImgHeight
        );

        // add footer
        pdf.setFontSize(10);
        pdf.text(new Date().toLocaleDateString('de'), margin, pageHeight + margin + 5);
        pdf.text('Page 1 of 1', pageWidth - margin * 2, margin + pageHeight + 5)

        // 'position' tracks how much of the content image has been printed
        let position = firstPageContentHeight;

        // If the image height is larger than the first page's content area, add additional pages
        while (position < contentImgHeight) {
          pdf.addPage();
          // For subsequent pages, adjust the y offset to print the next part of the image.
          // A negative y offset is used to "crop" the image so that only the next segment appears on the page.
          pdf.addImage(
            imgData,
            'PNG',
            margin,
            margin - position,
            contentWidth,
            contentImgHeight
          );
          // Increase the position by the available content height on pages after the first
          position += otherPagesContentHeight;

          // add footer
          pdf.setFontSize(10);
          pdf.text(new Date().toLocaleDateString('de'), margin, pageHeight + margin + 5);
          pdf.text('Page 1 of 1', pageWidth - margin * 2, margin + pageHeight + 5)
        }

        // Save the generated PDF with the given filename
        pdf.save('download.pdf');
        this.isDownloading.set(false);
      })
      .catch((err) => {
        // If an error occurs, display an error message with the error details
        this.displayErrorMsg('Error generating PDF: ' + err);
      });
  }

  /**
   * displayErrorMsg
   * @param msg string
  */
  private displayErrorMsg(msg: string): void {
    this.isDownloading.set(false);
    this.snackBar.open(msg, 'Close', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 10000,
    });
  }
}
