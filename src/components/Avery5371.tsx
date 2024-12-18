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
  xOffset: -1.5, // Horizontal offset for centering (positive shifts right, negative shifts left)
  yOffset: 0, // Vertical offset for centering (positive shifts down, negative shifts up)
};

export const CreateAvery5371Sheet = async (cardBytes: Uint8Array) => {
  // Load the single card PDF
  const cardPdf = await PDFDocument.load(cardBytes);
  const [cardPage] = await cardPdf.getPages();

  // Create a new document for the Avery 5371 sheet
  const sheetPdf = await PDFDocument.create();
  const sheetPage = sheetPdf.addPage([pageWidth, pageHeight]);

  // Embed the card PDF into the sheet
  const cardEmbed = await sheetPdf.embedPage(cardPage);
  const cardScaledWidth = cardWidth;
  const cardScaledHeight = cardHeight;

  // Calculate the total width and height of the grid
  const totalWidth = columns * cardWidth;
  const totalHeight = rows * cardHeight;

  // Calculate the offset to center the grid on the page
  const xOffset = (pageWidth - totalWidth - 2 * marginX) / 2 + config.xOffset;
  const yOffset = (pageHeight - totalHeight - 2 * marginY) / 2 + config.yOffset;

  // Place cards in a grid with the center-adjusted position
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const x = marginX + column * cardWidth + xOffset;
      const y = pageHeight - marginY - cardHeight - row * cardHeight + yOffset;
      sheetPage.drawPage(cardEmbed, { x, y, width: cardScaledWidth, height: cardScaledHeight });
    }
  }

  // Serialize the sheet PDF
  const sheetBytes = await sheetPdf.save();

  // Download the final sheet
  const blob = new Blob([sheetBytes], { type: 'application/pdf' });
  saveAs(blob, 'Avery5371Sheet.pdf');
};
