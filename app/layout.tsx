import type { Metadata } from "next";

import "./globals.css";
import { Sora } from "next/font/google";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";
import ShopfinityAI from "@/components/ShopfinityAi";




const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "Shopfinity",
  description: "Multi-vendor E-commerce platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={sora.className}>
        <Provider >
          <StoreProvider >
            <InitUser />
               {children}
                 <ShopfinityAI />

          </StoreProvider>
      


        </Provider>
   
      

     
 
      </body>
    </html>
  );
}
