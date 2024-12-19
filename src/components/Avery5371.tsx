import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

// Constants for Avery 5371 Layout
const pageWidth = 612; // 8.5 inches
const pageHeight = 792; // 11 inches
const cardWidth = 252; // 3.5 inches
const cardHeight = 144; // 2 inches
const marginX = 18; // 0.25 inches
const marginY = 36; // 0.5 inches
const columns = 2;
const rows = 5;

// Configuration to adjust overall centering
const config = {
  xOffset: 0, // Horizontal offset for centering (positive shifts right, negative shifts left)
  yOffset: 0, // Vertical offset for centering (positive shifts down, negative shifts up)
};

// Function to generate sheet with proper card positioning for front and back cards
const generateSheetForCards = async (sheetPdf: PDFDocument, cardPdf: PDFDocument, cardPage: number) => {
  // Create a new page in the Avery 5371 sheet for each card (front or back)
  const sheetPage = sheetPdf.addPage([pageWidth, pageHeight]);

  // Embed the specific page (front or back) from the provided PDF into the sheet
  const pageToEmbed = await cardPdf.getPages();
  const cardEmbed = await sheetPdf.embedPage(pageToEmbed[cardPage]);

  // Calculate the offset to center the grid on the page
  const totalWidth = columns * cardWidth;
  const totalHeight = rows * cardHeight;
  const xOffset = (pageWidth - totalWidth - 2 * marginX) / 2 + config.xOffset;
  const yOffset = (pageHeight - totalHeight - 2 * marginY) / 2 + config.yOffset;

  let currentCardIndex = 0;
  // Loop to place all cards in the grid (for the specified page)
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const x = marginX + column * cardWidth + xOffset;
      const y = pageHeight - marginY - cardHeight - row * cardHeight + yOffset;

      if (currentCardIndex < columns * rows) {
        sheetPage.drawPage(cardEmbed, { x, y, width: cardWidth, height: cardHeight }); // Add the current page to the sheet
        currentCardIndex++;
      }
    }
  }
};

// Function to create the Avery 5371 Sheet
export const CreateAvery5371Sheet = async (cardBytes: Uint8Array) => {
  // Load the card PDF
  const cardPdf = await PDFDocument.load(cardBytes);

  // Create a new document for the Avery 5371 sheet
  const sheetPdf = await PDFDocument.create();

  // Get number of pages in the input card PDF (front/back)
  const numberOfPages = cardPdf.getPages().length;

  // Generate Avery sheet for the front cards
  await generateSheetForCards(sheetPdf, cardPdf, 0);  // Always use the front card for the first sheet

  // If there are more pages (back side), generate a sheet for the back side as well
  if (numberOfPages > 1) {
    await generateSheetForCards(sheetPdf, cardPdf, 1);  // Use the second page (back card) for the second sheet
  }

  // Serialize the sheet PDF
  const sheetBytes = await sheetPdf.save();

  // Download the final sheet
  const blob = new Blob([sheetBytes], { type: 'application/pdf' });
  saveAs(blob, 'Avery5371Sheet.pdf');
};
