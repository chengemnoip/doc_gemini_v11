# Vercel 部署計畫

本文件提供將文件轉換應用程式部署到 Vercel 的詳細指南。

## 1. Vercel 帳戶和專案設定

1.  **登入 Vercel 帳戶：** 確保您已登入您的 Vercel 帳戶。
2.  **新增專案：** 在 Vercel 儀表板中，點擊「Add New...」->「Project」。
3.  **導入 Git 倉庫：** 選擇從 Git 倉庫導入專案。由於專案已推送到 `https://github.com/chengemnoip/doc_gemini_v11`，您可以直接從 GitHub 導入。

## 2. 配置專案設定

在導入專案後，您需要配置以下設定：

1.  **Root Directory (根目錄)：**
    *   由於您已將 `docling-app` 目錄的內容直接推送到 GitHub 倉庫的根目錄，Vercel 會自動識別 Next.js 應用程式。因此，請將「Root Directory」保留為**預設值 (通常是空的)**，或確保它沒有被設定為 `docling-app/`。

2.  **Build & Development Settings (構建與開發設定)：**
    *   **Framework Preset (框架預設)：** Vercel 通常會自動檢測為 Next.js。
    *   **Build Command (構建命令)：** 預設應該是 `next build`。
    *   **Install Command (安裝命令)：** 由於專案使用 pnpm，請將其設定為 `pnpm install`。
    *   **Output Directory (輸出目錄)：** 預設應該是 `.next`。

3.  **Environment Variables (環境變數)：**
    *   您需要將 `GOOGLE_API_KEY` 環境變數添加到 Vercel 專案的環境變數中。
    *   在 Vercel 儀表板的專案設定中，找到「Environment Variables」部分。
    *   添加一個新的環境變數：
        *   **Name (名稱)：** `GOOGLE_API_KEY`
        *   **Value (值)：** 您的實際 Gemini API 金鑰
    *   請確保將其標記為「Secret」，以保護您的金鑰。

## 3. 部署

1.  **確認配置：** 配置完成後，Vercel 將會自動開始部署您的應用程式。
2.  **自動部署：** 每次您推送到 GitHub 倉庫的 `master` 分支時，Vercel 都會自動觸發新的部署。

## 重要提示

*   **API 金鑰安全：** `GOOGLE_API_KEY` 必須在 Vercel 環境變數中設定，絕不能直接硬編碼在程式碼中。
*   **Port 設定：** 在 Vercel 上部署時，您無需擔心 `PORT=53311` 的設定，因為 Vercel 會自動處理 port 映射。
