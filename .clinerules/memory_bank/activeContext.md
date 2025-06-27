# 當前情境

## 當前工作重點

*   詳讀 `docling_docs/` 資料夾內容，已完成。
*   查詢 `@google/genai TypeScript SDK` 相關知識文件，已完成。
*   初始化 `memory bank` 核心文件，已完成。
*   開發 UI 介面，已完成。

## 最近的變更

*   已創建 `projectbrief.md`。
*   已創建 `productContext.md`。
*   已創建 `systemPatterns.md`。
*   已創建 `techContext.md`。
*   已創建 `progress.md`。
*   已更新 `docling-app/src/app/api/convert-document/route.ts` 以修正 TypeScript 錯誤和 `responseMimeType`。
*   已更新 `docling-app/src/app/page.tsx` 以實作 UI 介面並調整預設提示詞。
*   已修改 `docling-app/package.json` 以將開發伺服器 port 設定為 `53311`。
*   已在 `docling-app/.env.local` 中設定 `GOOGLE_API_KEY`。
*   已修改 UI 介面，不顯示轉換結果，而是提供下載 `.md` 檔案的選項，且下載檔名與原文件一致。
*   已添加 `example.env.local` 文件，內含範例。
*   已更新 `README.md`，包含 `example.env.local` 的使用說明。
*   已創建 `vercel_deployment_plan.md`，並修正了 Root Directory 的說明。

## 下一步

*   測試文件轉換功能和下載選項。
*   考慮將應用程式容器化 (Docker)。
*   部署到 Vercel。

## 重要的模式和偏好

*   使用 `@google/genai` TypeScript SDK。
*   文件上傳優先使用 File API。
*   UI 介面需提供模型選擇功能，預設為 `gemini-2.5-flash`。
*   UI 介面需顯示範例提示。
*   避免在客戶端程式碼中暴露 API 金鑰。

## 學習與專案洞察

*   Gemini API 支援多種文件類型轉換為 Markdown。
*   File API 適用於處理大型文件（超過 20 MB），最大支援 50 MB，檔案儲存 48 小時。
*   `@google/genai` 是 Google Deepmind 的「原生」SDK，用於生成式 AI 產品，並將添加新的 AI 功能。
