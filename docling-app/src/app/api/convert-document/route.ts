import { GoogleGenAI, Part, createPartFromUri } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set in environment variables.');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const prompt = formData.get('prompt') as string;
    const modelName = formData.get('modelName') as string;
    const url = formData.get('url') as string | null;
    let originalFileName: string | undefined;

    let filePart: Part | undefined;

    if (file) {
      // For local file upload
      const fileDisplayName = file.name;
      const fileMimeType = file.type;
      originalFileName = file.name;

      if (!fileDisplayName || !fileMimeType) {
        return NextResponse.json({ error: 'File name or mime type is missing.' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Convert Buffer to ReadableStream
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
    } else if (url) {
      // For URL upload
      const fileDisplayName: string = url.substring(url.lastIndexOf('/') + 1) || 'uploaded_url_file';
      originalFileName = fileDisplayName;
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Determine mimeType from URL or response headers if possible
      const contentType = response.headers.get('content-type');
      const mimeType = contentType;

      if (!mimeType) {
        return NextResponse.json({ error: 'URL content type is missing.' }, { status: 400 });
      }

      const fileBlob = new Blob([buffer], { type: mimeType });

      const uploadedFile = await ai.files.upload({
        file: fileBlob,
        config: {
          displayName: fileDisplayName,
          mimeType: mimeType,
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
  } catch (error: any) {
    console.error('Error converting document:', error);
    return NextResponse.json({ error: error.message || 'Failed to convert document.' }, { status: 500 });
  }
}
