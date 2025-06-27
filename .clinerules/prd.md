若有程式碼範例，專案設定文件優先著重相關內容。
當未指定的專案設定文件，請以下列專案配置文件為例：

# 專案配置

## 技術棧 (Tech Stack)

-   TypeScript 型別
-   Next.js 14+ (使用 App Router)
-   Tailwind CSS (用於樣式設計)
-   Supabase (作為後端)
-   Vercel (用於部署)
-   GitHub (用於版本控制)

## 專案結構

```
/src
    /app            # Next.js App Router 的頁面
    /components     # React 元件
    /lib            # 工具函式
    /types          # TypeScript 型別
    /supabase
        /migrations # SQL 遷移檔案
        /seed       # 種子資料檔案
    /public         # 靜態資源
```

## 資料庫遷移 (Database Migrations)

位於 `/supabase/migrations` 的 SQL 檔案應遵循以下規則：

-   使用連續編號：001, 002, 等。
-   包含描述性的名稱。
-   執行前須由 Cline 審核。
    範例：`001_create_users_table.sql`

## 開發流程 (Development Workflow)

-   Cline 會協助撰寫與審核程式碼變更。
-   Vercel 會自動從 `main` 分支進行部署。
-   資料庫遷移在執行前須由 Cline 審核。

## 安全性 (Security)

**禁止**讀取或修改以下檔案：

-   `.env` 檔案
-   `*/config/secrets.*`
-   任何包含 API 金鑰 (API keys) 或憑證 (credentials) 的檔案。