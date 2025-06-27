# 系統模式

## 系統架構

本應用程式將採用客戶端-伺服器架構。前端將是一個基於 Next.js 的 Web 應用程式，負責提供使用者介面和處理文件上傳。後端將負責處理文件轉換邏輯，並與 Google Gen AI SDK 進行互動。

## 關鍵技術決策

*   **前端框架：** Next.js (App Router)
*   **樣式：** Tailwind CSS
*   **後端：** Supabase (用於資料庫和認證，如果需要)
*   **AI SDK：** `@google/genai` TypeScript SDK
*   **部署：** Vercel

## 設計模式

*   **模組化設計：** 將 UI 元件、工具函式和 API 邏輯分離，以提高可維護性和可擴展性。
*   **單向資料流：** 遵循 React/Next.js 的最佳實踐，確保資料流清晰可預測。

## 元件關係

*   **UI 元件：** 負責呈現使用者介面，並觸發文件上傳和模型選擇等操作。
*   **文件處理服務：** 負責接收文件，呼叫 Google Gen AI SDK 進行轉換，並返回 Markdown 格式的結果。
*   **API 路由：** 在 Next.js 中建立 API 路由，作為前端和後端邏輯之間的橋樑，特別是處理敏感的 API 金鑰。

## 關鍵實作路徑

1.  **文件上傳流程：**
    *   使用者透過 UI 選擇文件。
    *   前端使用 File API 將文件上傳到後端（或直接上傳到 Google Gen AI Files API）。
    *   後端接收文件，並使用 `@google/genai` SDK 的 `files.upload` 功能。
    *   等待文件處理完成。
2.  **文件轉換流程：**
    *   後端使用 `ai.models.generateContent` 方法，將上傳的文件作為 `contents` 參數傳遞。
    *   指定輸出格式為 Markdown。
    *   接收模型生成的 Markdown 內容。
3.  **模型選擇與提示顯示：**
    *   UI 介面提供下拉選單或其他方式供使用者選擇 Gemini 模型。
    *   UI 介面顯示預設的範例提示，並允許使用者修改。
4.  **安全性：**
    *   API 金鑰應儲存在伺服器端環境變數中，絕不暴露在客戶端程式碼中。
    *   前端透過 API 路由呼叫後端服務，後端再使用 API 金鑰與 Google Gen AI 互動。
