import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Configuration

// Page Size
const height = 3.5 * 72;  // 3.5 inches = 252 points
const width = 2 * 72;  // 2 inches = 144 points

const texts = [
    'Navigation',
    'Protection',
    'Insulation',
    'Illumination',
    'First Aid',
    'Fire',
    'Repair Tools',
    'Extra Food & Water',
    'Emergency Shelter',
    'Communication'
];

const subtexts = [
    'map, compass, gps',
    'sunglasses, sunscreen, hat',
    'extra clothing, blanket',
    'flashlight, headlamp',
    'including medication',
    'lighter, waterproof matches',
    'multi-tool, knife, spare parts',
    'water purification or filter',
    'tarp & paracord, small tent',
    'cell phone, whistle, signal mirror'
];

const icons = [
    '/assets/essentials/compass.png',
    '/assets/essentials/sunglasses.png',
    '/assets/essentials/jacket.png',
    '/assets/essentials/flashlight.png',
    '/assets/essentials/first-aid-kit.png',
    '/assets/essentials/matches.png',
    '/assets/essentials/multi-tool.png',
    '/assets/essentials/bottle-of-water.png',
    '/assets/essentials/tent.png',
    '/assets/essentials/phone-call.png',
];


const state = { headerX: 0, headerEndX: 0 }; // state for sides of header

const HeaderText = (
        page: any,
        text: string,
        y: number,
        size: number,
        font: any,
        color: ReturnType<typeof rgb>
    ) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    const textX = (page.getWidth() - textWidth) / 2;
    state.headerX = textX;  // Set headerX to where the text starts
  
    state.headerEndX = state.headerX + textWidth;  // Set headerEndX to the end of the text

    // Draw the P.O. Box text
    page.drawText(text, {
      x: textX,
      y: y,
      size,
      font,
      color,
    });

    page.drawRectangle({
        x: (page.getWidth() - textWidth)/ 2, // width of divider
        y: y - 2.75,
        width: textWidth + 2, // Length of line
        height: 0.75, // Thickness of line
        color,
      });
}

const EssentialsText = async (
    pdfDoc: any,
    page: any,
    startY: number,
    font: any,
    texts: any,
    subtexts: any,
    icons: any
) => {
    const textX = state.headerX + 25;
    const ySpacing = 18; // Change this value to adjust spacing between lines
  
    // Loop through the array of texts (assumes `texts` has 20 items)
    for (let i = 0; i < texts.length; i++) {
        const currentY = startY - i * ySpacing;  // Adjust y for each line
        const currentText = texts[i];  // Get the text for this line
        const currentsubText = subtexts[i];
        const currentIcon = icons[i];
        const iconImageBytes = await fetch(currentIcon).then((res) => res.arrayBuffer());
        const iconImage = await pdfDoc.embedPng(iconImageBytes);
        const iconDims = iconImage.scale(0.03); // mail icon scaling

        page.drawText(currentText, {
            x: textX,
            y: currentY,
            size: 8.5,
            font,
            color: rgb(62 / 255, 62 / 255, 62 / 255),
        });
        page.drawText(currentsubText, {
            x: textX,
            y: currentY - 7.5,
            size: 7,
            font,
            color: rgb(92 / 255, 92 / 255, 92 / 255),
        });
        page.drawImage(iconImage, {
            x: state.headerX + 5, // Position to left of text
            y: currentY - 8,
            width: iconDims.width,
            height: iconDims.height,
        })
    }
};


export const TenEssentials = async (name: string, title: string, email: string, number: string) => {
  console.log({ name, title, email, number });

  // Create PDF document
  const pdfDoc = await PDFDocument.create();



  // Font Loading
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);




  // Page Setup
  const page = pdfDoc.addPage([width, height]);

  // Page Drawing
  HeaderText(page, `Always Carry the Ten Essentials`, 232, 9, font, rgb(0, 0, 0))
  await EssentialsText(pdfDoc, page, 215, font, texts, subtexts, icons)
  page.drawText(`If lost or injured:`, { x: state.headerX, y: 30, size: 7, font: fontBold, color: rgb(0, 0, 0) })
  page.drawText(`• Call 911 as soon as possible`, { x: state.headerX + 5, y: 20, size: 7, font: font, color: rgb(32 / 255, 32 / 255, 32 / 255) })
  page.drawText(`• Stay put. Stay warm. Stay dry.`, { x: state.headerX + 5, y: 10, size: 7, font: font, color: rgb(32 / 255, 32 / 255, 32 / 255) })

  // Serialize PDF to bytes
  const pdfBytes = await pdfDoc.save();
  return(pdfBytes)
};
