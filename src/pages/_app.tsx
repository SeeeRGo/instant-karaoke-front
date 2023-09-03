import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-r from-[#FFDEA8] to-[#FEC84E]">
      <Component {...pageProps} />;
    </main>
  )
};

export default api.withTRPC(MyApp);
