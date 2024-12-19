import { PDFDocument, degrees } from 'pdf-lib';

// Page Size
const width = 3.5 * 72;  // 3.5 inches = 252 points
const height = 2 * 72;  // 2 inches = 144 points

export const GenerateQRCode = async (): Promise<Uint8Array> => {

    // Create PDF document
    const pdfDoc = await PDFDocument.create();

    // Page Setup
    const page = pdfDoc.addPage([width, height]);

    // Image Loading
    const QRImageBytes = await fetch('/assets/qr.png').then((res) => res.arrayBuffer());
    const QRImage = await pdfDoc.embedPng(QRImageBytes);
    const QRDims = QRImage.scale(0.25); // mail icon scaling

    // Page Drawing
    page.drawImage(QRImage, {
        x: 0, // Position to left of text
        y: 0,
        width: QRDims.width,
        height: QRDims.height,
    });

    // Serialize PDF to bytes
    const pdfBytes = await pdfDoc.save();
    return(pdfBytes)
  };
  