/* eslint-disable @typescript-eslint/no-var-requires */
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

const { PDFParse } = require('pdf-parse');

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = result.text || '';

    if (!text || text.trim().length === 0) {
      throw new Error('PDF contains no readable text');
    }

    return text;
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
