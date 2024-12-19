import { PDFDocument } from 'pdf-lib';
import { TenEssentials } from './TenEssentials';
import { GenerateQRCode } from './QRCode';

type BacksideOption = 'essentials' | 'qrcode';

const backsideOptions = {
  essentials: TenEssentials, // Function to generate the "essentials" page
  qrcode: GenerateQRCode,    // Function to generate the QR code page
  // Add more options here as needed
};

export const AddBackside = async (cardBytes: Uint8Array, backside: BacksideOption) => {
  const pdfDoc = await PDFDocument.load(cardBytes);
  const generateBackside = backsideOptions[backside];
  const essentialsBytes = await generateBackside();
  const essentialsPdfDoc = await PDFDocument.load(essentialsBytes);
  const [essentialsPage] = await pdfDoc.copyPages(essentialsPdfDoc, [0]);
  pdfDoc.addPage(essentialsPage);
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
