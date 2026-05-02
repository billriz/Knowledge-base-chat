/* eslint-disable @typescript-eslint/no-require-imports */
import * as mammoth from 'mammoth';

const canvasImplementation = (() => {
  try {
    return require('canvas');
  } catch {
    return null;
  }
})();

if (canvasImplementation) {
  if (typeof globalThis.DOMMatrix === 'undefined' && canvasImplementation.DOMMatrix) {
    globalThis.DOMMatrix = canvasImplementation.DOMMatrix;
  }
  if (typeof globalThis.ImageData === 'undefined' && canvasImplementation.ImageData) {
    globalThis.ImageData = canvasImplementation.ImageData;
  }
  if (typeof globalThis.Path2D === 'undefined' && canvasImplementation.Path2D) {
    globalThis.Path2D = canvasImplementation.Path2D;
  }
}

type PdfParseConstructor = new (options: {
  data: Buffer | Uint8Array | ArrayBuffer;
}) => {
  getText(): Promise<{ text: string }>;
  destroy?(): Promise<void>;
};

type PdfParseModule = {
  PDFParse?: PdfParseConstructor & { setWorker?: (workerSrc: string) => string };
  default?: { PDFParse?: PdfParseConstructor & { setWorker?: (workerSrc: string) => string } };
};

type PdfParseWorkerModule = {
  getData?: () => string;
  default?: { getData?: () => string };
};

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParseModule = (await import('pdf-parse')) as PdfParseModule;
    const PDFParse = pdfParseModule.PDFParse ?? pdfParseModule.default?.PDFParse;
    const pdfWorkerModule = (await import('pdf-parse/worker')) as PdfParseWorkerModule;
    const getWorkerData = pdfWorkerModule.getData ?? pdfWorkerModule.default?.getData;

    if (typeof PDFParse !== 'function') {
      throw new Error('Unable to load PDF parser implementation');
    }

    if (typeof getWorkerData !== 'function') {
      throw new Error('Unable to load PDF worker implementation');
    }

    PDFParse.setWorker?.(getWorkerData());

    const pdfParser = new PDFParse({ data: buffer });
    try {
      const pdfData = await pdfParser.getText();
      const text = String(pdfData?.text ?? '');

      if (!text.trim()) {
        throw new Error('PDF contains no readable text. This may be an image-only PDF or scanned document.');
      }

      return text.trim();
    } finally {
      await pdfParser.destroy?.();
    }
  } catch (error) {
    console.error('Error parsing PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to parse PDF';
    throw new Error(`PDF parsing failed: ${errorMessage}`);
  }
}

export async function extractTextFromWord(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error parsing Word document:', error);
    throw new Error('Failed to parse Word document');
  }
}

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === 'application/pdf') {
    return extractTextFromPDF(buffer);
  } else if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return extractTextFromWord(buffer);
  } else if (
    mimeType === 'text/plain' ||
    mimeType === 'text/markdown' ||
    mimeType === 'application/json'
  ) {
    return buffer.toString('utf-8');
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}

export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let position = 0;

  while (position < text.length) {
    const chunk = text.slice(position, position + chunkSize);
    chunks.push(chunk);
    position += chunkSize - overlap;
  }

  return chunks.filter(chunk => chunk.trim().length > 0);
}
