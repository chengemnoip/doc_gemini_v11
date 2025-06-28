import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  api: {
    bodyParser: {
      sizeLimit: '50mb', // 設定為 50MB，以支援大型文件上傳
    },
  },
};

export default nextConfig;
