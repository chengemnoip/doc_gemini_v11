# 技術情境

## 技術棧 (Tech Stack)

*   TypeScript
*   Next.js 14+ (使用 App Router)
*   Tailwind CSS (用於樣式設計)
*   Supabase (作為後端，如果需要)
*   Vercel (用於部署)
*   GitHub (用於版本控制)
*   Google Gen AI SDK (`@google/genai`)

## 開發環境設定

*   Node.js 版本 20 或更高。
*   使用 `pnpm` 作為套件管理器。
*   API 金鑰應透過環境變數管理，例如 `GOOGLE_API_KEY`。

## 技術限制

*   File API 支援最大 50 MB 的 PDF 檔案，檔案儲存 48 小時。
*   Gemini API 支援最多 1,000 個文件頁面。
*   避免在客戶端程式碼中暴露 API 金鑰。

## 依賴項

*   `@google/genai`
*   `next`
*   `react`
*   `react-dom`
*   `tailwindcss`
*   `autoprefixer`
*   `postcss`

## 工具使用模式

*   **文件讀取：** 使用 `read_file` 讀取本地文件。
*   **文件寫入：** 使用 `write_to_file` 創建或更新文件。
*   **命令執行：** 使用 `execute_command` 執行 Node.js 和 pnpm 命令。
*   **MCP 工具：** 使用 `js-genai` MCP 獲取 Google Gen AI SDK 相關文件。
*   **網頁抓取：** 使用 `web_fetch` 獲取網頁內容。
