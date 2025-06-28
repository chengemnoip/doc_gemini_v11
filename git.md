- __確認 `.gitignore` 檔案：__ 再次確認根目錄的 `.gitignore` 檔案內容是正確的。

- __清空 Git 索引：__ 執行 `git rm -r --cached .`。

- __重新暫存所有檔案：__ 執行 `git add .`。此時，Git 會根據 `.gitignore` 重新追蹤檔案。

- __提交變更：__ 執行 `git commit -m "Rebuild Git index based on .gitignore and remove unwanted folders"`。

- __強制推送到遠端儲存庫：__ 執行 `git push --force origin `。
