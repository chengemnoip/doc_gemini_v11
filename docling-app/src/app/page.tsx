'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('Convert this document to markdown format. Ensure all formatting (e.g., headings, lists, code blocks) is preserved or generated appropriately in markdown.');
  const [modelName, setModelName] = useState<string>('gemini-2.5-flash');
  const [markdown, setMarkdown] = useState<string>('');
  const [originalFileName, setOriginalFileName] = useState<string>('converted_document');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUrl(''); // Clear URL if file is selected
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setFile(null); // Clear file if URL is entered
  };

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleModelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setModelName(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMarkdown('');

    const MAX_FILE_SIZE_MB = 50; // 最大文件大小限制为 50MB
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    const formData = new FormData();
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`文件大小不能超過 ${MAX_FILE_SIZE_MB}MB。`);
        setLoading(false);
        return;
      }
      formData.append('file', file);
    } else if (url) {
      formData.append('url', url);
    } else {
      setError('請選擇一個文件或輸入一個 URL。');
      setLoading(false);
      return;
    }
    formData.append('prompt', prompt);
    formData.append('modelName', modelName);

    try {
      const response = await fetch('/api/convert-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to convert document.');
      }

      const data = await response.json();
      setMarkdown(data.markdown);
      setOriginalFileName(data.originalFileName || 'converted_document');
    } catch (err: unknown) {
      let errorMessage = 'Failed to convert document.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-8">文件轉換器</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-2xl mb-8">
        <div className="mb-4">
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            上傳文件 (本地檔案)
          </label>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 dark:text-gray-100
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            或輸入文件 URL
          </label>
          <input
            type="text"
            id="url-input"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://example.com/document.pdf"
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            選擇 Gemini 模型
          </label>
          <select
            id="model-select"
            value={modelName}
            onChange={handleModelChange}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="gemini-2.5-flash">gemini-2.5-flash (預設)</option>
            <option value="gemini-2.5-pro">gemini-2.5-pro</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="prompt-textarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            提示詞
          </label>
          <textarea
            id="prompt-textarea"
            value={prompt}
            onChange={handlePromptChange}
            rows={4}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="例如：將此文件轉換為 Markdown 格式，並總結其主要內容。"
          ></textarea>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            範例提示：將此文件轉換為 Markdown 格式。
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          disabled={loading}
        >
          {loading ? '轉換中...' : '轉換文件'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full max-w-2xl mb-4" role="alert">
          <strong className="font-bold">錯誤！</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {markdown && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">轉換完成！</h2>
          <button
            onClick={() => {
              const blob = new Blob([markdown], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              const fileNameWithoutExtension = originalFileName.split('.').slice(0, -1).join('.');
              a.download = `${fileNameWithoutExtension}.md`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            下載 Markdown 文件
          </button>
        </div>
      )}
    </div>
  );
}
