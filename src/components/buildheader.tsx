// buildheader.ts

import { PDFPage } from 'pdf-lib';  // If you are using pdf-lib

interface DrawHeaderParams {
  page: PDFPage; // assuming you're using pdf-lib for the PDF creation
  text: string;
  y: number;
  font: any; // specify the correct type of font if needed
  size: number;
  color: any; // specify color type, might be a tuple or a specific object depending on the PDF library used
}

export const drawHeader = ({ page, text, y, font, size, color }: DrawHeaderParams): void => {
  const textWidth = font.widthOfTextAtSize(text, size);
  const pageWidth = page.getWidth();
  const headerX = (pageWidth - textWidth) / 2;

  page.drawText(text, { x: headerX, y, size, font, color });
};
