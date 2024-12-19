import { PDFDocument } from 'pdf-lib';
import { TenEssentials } from './TenEssentials';  // Assuming this is where you're defining the Essentials page

export const AddBackside = async (cardBytes: Uint8Array) => {
  // Load the frontside card from the provided cardBytes
  const pdfDoc = await PDFDocument.load(cardBytes);

  // Generate the backside content from your 10Essentials component
  const essentialsBytes = await TenEssentials();  // This should return a Uint8Array (backside PDF)

  // Load the backside PDF (essentials) as a separate PDF document
  const essentialsPdfDoc = await PDFDocument.load(essentialsBytes);

  // Copy pages from the essentialsPdfDoc (backside) into the main document
  const [essentialsPage] = await pdfDoc.copyPages(essentialsPdfDoc, [0]);

  // Add the backside page to the frontside PDF document
  pdfDoc.addPage(essentialsPage);

  // Return the updated combined PDF as a Uint8Array
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
