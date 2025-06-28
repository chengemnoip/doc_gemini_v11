import { GoogleGenAI, Part, createPartFromUri } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import Busboy from 'busboy';
import { Readable } from 'stream';

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set in environment variables.');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Helper to convert ReadableStream to Buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export async function POST(req: NextRequest) {
  let prompt: string | undefined;
  let modelName: string | undefined;
  let url: string | undefined;
  let originalFileName: string | undefined;
  let filePart: Part | undefined;
  let fileBuffer: Buffer | undefined;
  let fileMimeType: string | undefined;
  let fileDisplayName: string | undefined;

  try {
    // Use Busboy to parse multipart/form-data stream
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const busboy = Busboy({ headers: req.headers as any });

    const parsePromise = new Promise<void>((resolve, reject) => {
      busboy.on('file', (fieldname: string, fileStream: Readable, filename: string, encoding: string, mimetype: string) => {
        if (fieldname === 'file') {
          fileDisplayName = filename;
          fileMimeType = mimetype;
          originalFileName = filename;
          streamToBuffer(fileStream)
            .then(buffer => {
              fileBuffer = buffer;
              resolve();
            })
            .catch(reject);
        } else {
          fileStream.resume(); // Consume the stream to prevent 'end' event from hanging
        }
      });

      busboy.on('field', (fieldname: string, val: string) => {
        if (fieldname === 'prompt') {
          prompt = val;
        } else if (fieldname === 'modelName') {
          modelName = val;
        } else if (fieldname === 'url') {
          url = val;
        }
      });

      busboy.on('finish', () => {
        if (!fileBuffer) { // If no file was uploaded, resolve the promise
          resolve();
        }
      });

      busboy.on('error', reject);

      // Pipe the request body to busboy
      if (req.body) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Readable.fromWeb(req.body as any).pipe(busboy);
      } else {
        reject(new Error('Request body is empty.'));
      }
    });

    await parsePromise;

    if (fileBuffer && fileDisplayName && fileMimeType) {
      // For local file upload
      const fileBlob = new Blob([fileBuffer], { type: fileMimeType });

      const uploadedFile = await ai.files.upload({
        file: fileBlob,
        config: {
          displayName: fileDisplayName,
          mimeType: fileMimeType,
        },
      });

      let getFile = await ai.files.get({ name: uploadedFile.name! });
      while (getFile.state === 'PROCESSING') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        getFile = await ai.files.get({ name: uploadedFile.name! });
        console.log(`current file status: ${getFile.state}`);
      }

      if (getFile.state === 'FAILED') {
        throw new Error('File processing failed.');
      }

      if (getFile.uri && getFile.mimeType) {
        filePart = createPartFromUri(getFile.uri, getFile.mimeType as string);
      }
    } else if (url) {
      // For URL upload
      fileDisplayName = url.substring(url.lastIndexOf('/') + 1) || 'uploaded_url_file';
      originalFileName = fileDisplayName;
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Determine mimeType from URL or response headers if possible
      const contentType = response.headers.get('content-type');
      fileMimeType = contentType || 'application/octet-stream'; // Default to octet-stream if not found

      if (!fileMimeType) {
        return NextResponse.json({ error: 'URL content type is missing.' }, { status: 400 });
      }

      const fileBlob = new Blob([buffer], { type: fileMimeType });

      const uploadedFile = await ai.files.upload({
        file: fileBlob,
        config: {
          displayName: fileDisplayName,
          mimeType: fileMimeType,
        },
      });

      let getFile = await ai.files.get({ name: uploadedFile.name! });
      while (getFile.state === 'PROCESSING') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        getFile = await ai.files.get({ name: uploadedFile.name! });
        console.log(`current file status: ${getFile.state}`);
      }

      if (getFile.state === 'FAILED') {
        throw new Error('File processing failed.');
      }

      if (getFile.uri && getFile.mimeType) {
        filePart = createPartFromUri(getFile.uri, getFile.mimeType as string);
      }
    } else {
      return NextResponse.json({ error: 'No file or URL provided.' }, { status: 400 });
    }

    if (!prompt || !modelName) {
      return NextResponse.json({ error: 'Prompt or model name is missing.' }, { status: 400 });
    }

    const contents: (string | Part)[] = [
      prompt,
    ];

    if (filePart) {
      contents.push(filePart);
    }

    const result = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        responseMimeType: 'text/plain',
      },
    });

    const responseText = result.text;
    if (responseText === undefined) {
      return NextResponse.json({ error: 'Failed to get text response from Gemini API.' }, { status: 500 });
    }
    return NextResponse.json({ markdown: responseText, originalFileName: originalFileName });
  } catch (error: unknown) {
    console.error('Error converting document:', error);
    let errorMessage = 'Failed to convert document.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
