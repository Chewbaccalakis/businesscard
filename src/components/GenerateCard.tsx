import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver'; 
import * as fontkit from '@pdf-lib/fontkit';
import arimottf from '../../public/assets/arimo/Arimo-Regular.ttf';

// Configuration

// Page Size
const width = 3.5 * 72;  // 3.5 inches = 252 points
const height = 2 * 72;  // 2 inches = 144 points

// Text
const header = `King County 4x4 Search and Rescue`;
const footnote1 = `P.O. Box 50785 • Bellevue, WA 98015`;
const footnote2 = `100% Volunteer • Registered 501(c)(3) Non-Profit`;
const logocaption = `that others may live...`;

// Images
const mailicon = `/assets/email.png`;
const logo = `/assets/logo.png`;

// Text Colors
const HeaderColor = rgb(0, 0, 0);
const ContactInfoColor = rgb(92 / 255, 92 / 255, 92 / 255);
const LogoCaptionColor = rgb(92 / 255, 92 / 255, 92 / 255);
const FootnoteColor = rgb(92 / 255, 92 / 255, 92 / 255);

//Fonts


const state = { headerX: 0, headerEndX: 0 }; // state for sides of header


// Draw Header Function
const drawHeader = (
    page: any,
    text: string,
    y: any,
    font: any,
    size: number,
    color: ReturnType<typeof rgb>
  ) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    const pageWidth = page.getWidth();
    state.headerX = (pageWidth - textWidth) / 2;
    state.headerEndX = state.headerX + textWidth;
  
    page.drawText(text, { x: state.headerX, y, size, font, color });

  };


  // Draw Logo Function
  const drawLogo = async (
    page: any,
    pdfDoc: PDFDocument,
    logo: string,
    text: string,
    size: number,
    font: any,
    color: ReturnType<typeof rgb>,
    height: number
  ) => {
    const pngImageBytes = await fetch(logo).then((res) => res.arrayBuffer())
    const pngImage = await pdfDoc.embedPng(pngImageBytes)
    const pngDims = pngImage.scale(0.09)
    
    // Draw the logo
    page.drawImage(
      pngImage, { 
        x: state.headerEndX - pngDims.width + 7.5,
        y: height - 90,
        width: pngDims.width,
        height: pngDims.height,
      });

    // Calculate width of text and center it underlogo
    const textWidth = font.widthOfTextAtSize(text, size);
    const textX = state.headerEndX - (textWidth / 2 + 27);  // Center text under logo by aligning it with logo's center

    // Place the text directly under logo
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


// Draw Footer Function
const drawFooter = async (
  page: any,
  pdfDoc: PDFDocument,
  mailicon: string,
  footnote1: string,
  footnote2: string,
  size: number,
  font: any,
  color: ReturnType<typeof rgb>,
  height: number
) => {
  // Mail Icon Loading
  const mailImageBytes = await fetch(mailicon).then((res) => res.arrayBuffer());
  const mailImage = await pdfDoc.embedPng(mailImageBytes);
  const mailDims = mailImage.scale(0.023); // mail icon scaling

  const iconTextDistance = 3; // Space between icon and address text

  // vertical position for address/divider
  const footnote1Y = height - 124;
  const dividerY = height - 127.5;

  // Center address
  const footnote1Width = font.widthOfTextAtSize(footnote1, size);
  const footnote1X = (page.getWidth() - footnote1Width) / 2;

  // Draw the P.O. Box text
  page.drawText(footnote1, {
    x: footnote1X,
    y: footnote1Y,
    size,
    font,
    color,
  });

  // Draw icon
  page.drawImage(mailImage, {
    x: footnote1X - mailDims.width - iconTextDistance, // Position to left of text
    y: footnote1Y - 2.5, // Vertically center with text
    width: mailDims.width,
    height: mailDims.height,
  });

  // Draw divider line
  page.drawRectangle({
    x: (page.getWidth() - 190) / 2, // width of divider
    y: dividerY,
    width: 190, // Length of line
    height: 1, // Thickness of line
    color,
  });

  // Center Footnote 2 text
  const footnote2Width = font.widthOfTextAtSize(footnote2, size);
  const footnote2X = (page.getWidth() - footnote2Width) / 2;
  const footnote2Y = height - 135.5;

  page.drawText(footnote2, {
    x: footnote2X,
    y: footnote2Y,
    size,
    font,
    color,
  });
};

  

export const GenerateCard = async (name: string, title: string, email: string, number: string) => {
  console.log({ name, title, email, number });

  // Create PDF document
  const pdfDoc = await PDFDocument.create();



  // Font Loading
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



  // Page Setup
  const page = pdfDoc.addPage([width, height]);

  // Page Drawing
  drawHeader(page, header, height - 20, fontBold, 12, HeaderColor);
  page.drawText(`${name}`, { x: state.headerX, y: height - 45, size: 9, font: font, color: ContactInfoColor });
  page.drawText(`${title}`, { x: state.headerX, y: height - 55, size: 9, font: font, color: ContactInfoColor });
  page.drawText(`${email}`, { x: state.headerX, y: height -90, size: 9, font, color: ContactInfoColor });
  page.drawText(`${number}`, { x: state.headerX, y: height - 100, size: 9, font, color: ContactInfoColor });
  await drawLogo(page, pdfDoc, logo, logocaption, 8, font, LogoCaptionColor, height);
  await drawFooter(page, pdfDoc, mailicon, footnote1, footnote2, 8, font, FootnoteColor, height);

  // Serialize PDF to bytes
  const pdfBytes = await pdfDoc.save();

  return(pdfBytes)
};