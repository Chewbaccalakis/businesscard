import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';  // Install file-saver for client-side file download
import * as fontkit from '@pdf-lib/fontkit';
import arimottf from '../public/assets/arimo/Arimo-Regular.ttf';

const state = { headerX: 0, headerEndX: 0 };

const drawHeader = (page, text, y, font, size, color) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    const pageWidth = page.getWidth();
    state.headerX = (pageWidth - textWidth) / 2;
    state.headerEndX = state.headerX + textWidth;
  
    page.drawText(text, { x: state.headerX, y, size, font, color });

  };

const drawCenteredText = (page, text, y, font, size, color) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    const pageWidth = page.getWidth();
    const x = (pageWidth - textWidth) / 2;
  
    page.drawText(text, { x, y, size, font, color });
  };

  const divider = (page, width, y) => {
    page.drawRectangle({
      x: (page.getWidth() - width) / 2, // Center the line horizontally
      y: y,                            // Vertical position of the line
      width: width,                    // Length of the line
      height: 1,                       // Thickness of the line
      color: rgb(0, 0, 0),             // Solid black color
    });
  };  

  const drawLogo = (page, pngImage, pngDims, height, text, size, font, color) => {
    // Log out the dimensions and values for debugging
    console.log('PNG Dimensions:', pngDims);
    console.log('Height for text:', height);
    
    // Draw the logo
    page.drawImage(
      pngImage, { 
        x: state.headerEndX - pngDims.width + 7.5,
        y: height - 90,
        width: pngDims.width,
        height: pngDims.height,
      });

    // Calculate the width of the text and center it under the logo
    const textWidth = font.widthOfTextAtSize(text, size);
    const textX = state.headerEndX - (textWidth / 2 + 27);  // Center the text under the logo by aligning it with the logo's center

    // Place the text directly under the logo
    const textY = height - 87;  // Adjust for correct space between image and text
    console.log('Text Position:', textX, textY);

    // Draw the text centered underneath the logo
    page.drawText(text, {
        x: textX,
        y: textY,  // Corrected positioning
        size: size,
        font: font,
        color: color,
    });
};

  

export const GenerateCard = async (name: string, title: string, email: string, number: string) => {
  console.log({ name, title, email, number });

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  pdfDoc.registerFontkit(fontkit)
  console.log('Registered fontkit')

  const font = await pdfDoc.embedStandardFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedStandardFont(StandardFonts.HelveticaBold); // For bold
  console.log('Standard fonts embedded.');

  const arimoFontBytes = await fetch(arimottf).then((res) => res.arrayBuffer());
  console.log(arimoFontBytes)
  console.log('Arimo-Regular.ttf fetched successfully, bytes length:', arimoFontBytes.byteLength);
  
  console.log('Embedding font...');
  //const arimoFont = await pdfDoc.embedFont(arimoFontBytes);
  //console.log('Arimo-Regular font embedded successfully: ', arimoFont);

  // Define the size of the business card (2" x 3.5")
  const width = 3.5 * 72;  // 2 inches = 144 points
  const height = 2 * 72;  // 3.5 inches = 252 points

  // Add a page with the specified business card dimensions
  const page = pdfDoc.addPage([width, height]);
  

  // Text Colors
  const textColor = rgb(0, 0, 0);


  // Text
  const header = `King County 4x4 Search and Rescue`;
  const footnote1 = `P.O. Box 50785 • Bellevue, WA 98015`
  const footnote2 = `100% Volunteer • Registered 501(c)(3) Non-Profit`

  const pngImageBytes = await fetch(`/assets/logo.png`).then((res) => res.arrayBuffer())
  const pngImage = await pdfDoc.embedPng(pngImageBytes)
  const pngDims = pngImage.scale(0.09)

  // Draw text for business card details (adjust coordinates to fit design)
  const textWidth = font.widthOfTextAtSize(header, 12); // Get the header width
  const x = (width - textWidth) / 2;  // Center header horizontally
  
  
  drawHeader(page, header, height - 20, fontBold, 12, textColor);
  page.drawText(`Name: ${name}`, { x: state.headerX, y: height - 45, size: 9, font: font, color: textColor });
  page.drawText(`Title: ${title}`, { x: state.headerX, y: height - 55, size: 9, font: font, color: textColor });
  page.drawText(`Email: ${email}`, { x: state.headerX, y: height -90, size: 9, font, color: textColor });
  page.drawText(`Number: ${number}`, { x: state.headerX, y: height - 100, size: 9, font, color: textColor });
  drawCenteredText(page, footnote1, height - 124, font, 8, textColor);
  divider(page, 190, height - 127.5)
  drawCenteredText(page, footnote2, height - 135.5, font, 8, textColor);
  drawLogo(page, pngImage, pngDims, height, `that others may live...`, 8, font, textColor);

  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();

  // Trigger a download using the 'file-saver' library
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'BusinessCard.pdf');  // This will prompt the user to download the file
};
