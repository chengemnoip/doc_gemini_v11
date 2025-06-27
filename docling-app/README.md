# 文件轉換器 (Docling App)

這是一個基於 Next.js 和 Google Gemini AI SDK 的文件轉換應用程式。它允許使用者上傳多種格式的文件（例如 PDF、TXT、程式碼文件等），並將其轉換為 Markdown 格式。

## 功能

*   支援從本地檔案或 URL 上傳文件。
*   利用 Google Gemini AI 模型進行文件內容的理解和轉換。
*   將轉換後的內容輸出為 Markdown 格式。
*   提供模型選擇功能（預設 `gemini-2.5-flash`，可選 `gemini-2.5-pro`）。
*   下載轉換後的 Markdown 文件，檔名與原始文件一致。

## 技術棧

*   **前端框架：** Next.js 14+ (App Router)
*   **樣式：** Tailwind CSS
*   **AI SDK：** `@google/genai` TypeScript SDK
*   **套件管理：** pnpm

## 安裝與運行

請按照以下步驟在本地環境中設定和運行應用程式：

### 1. 克隆倉庫

```bash
git clone https://github.com/chengemnoip/doc_gemini_v11.git
cd doc_gemini_v11/docling-app
```

### 2. 設定環境變數

在 `docling-app/` 目錄下，複製 `example.env.local` 文件並將其重命名為 `.env.local`：

```bash
cp example.env.local .env.local
```

然後，編輯 `.env.local` 文件，將 `GOOGLE_API_KEY=YOUR_GEMINI_API_KEY_HERE` 替換為您實際的 Google Gemini API 金鑰。您可以從 Google AI Studio 或 Google Cloud Console 獲取。

```
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
PORT=53311
```

### 3. 安裝依賴

使用 pnpm 安裝專案依賴：

```bash
pnpm install
```

### 4. 運行開發伺服器

```bash
pnpm dev
```
應用程式將在 `http://localhost:53311` 上運行。

## 使用說明

1.  打開瀏覽器並訪問 `http://localhost:53311`。
2.  您可以選擇上傳本地文件或輸入文件 URL。
3.  在「提示詞」輸入框中輸入您希望模型執行的操作，例如「將此文件轉換為 Markdown 格式」。
4.  選擇您希望使用的 Gemini 模型（預設為 `gemini-2.5-flash`）。
5.  點擊「轉換文件」按鈕。
6.  轉換完成後，將會出現一個下載按鈕，點擊即可下載轉換後的 Markdown 文件。

## 未來可能的改進

*   增加更多文件格式的支援。
*   優化大型文件的處理性能。
*   提供更多自定義轉換選項。
*   實作使用者認證和歷史記錄功能。
*   部署到 Vercel 或其他雲平台以提供公開訪問。
