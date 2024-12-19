import { PDFDocument } from 'pdf-lib';
import { TenEssentials } from './TenEssentials';
import { GenerateQRCode } from './QRCode';

const backsideOptions = {
  essentials: TenEssentials, // Function to generate the "essentials" page
  qrcode: GenerateQRCode,    // Function to generate the QR code page
  // Add more options here as needed
};

export const AddBackside = async (cardBytes: Uint8Array, backside: any) => {
  // Load the frontside card from the provided cardBytes
  const pdfDoc = await PDFDocument.load(cardBytes);

  const generateBackside = backsideOptions[backside];

  // Generate the backside content from your 10Essentials component
  const essentialsBytes = await generateBackside(backside);  // This should return a Uint8Array (backside PDF)

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
