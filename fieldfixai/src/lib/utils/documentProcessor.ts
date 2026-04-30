// @ts-ignore
const pdfParse = require('pdf-parse');
import * as mammoth from 'mammoth';
import { generateEmbedding } from './embeddings';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF');
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

export { generateEmbedding } from './embeddings';
