import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import StoreProvider from "../store/StoreProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata = {
  title: "Havenly Listing",
  description: "Smarter Property Discovery",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${nunito.variable} antialiased`}>
          <StoreProvider>
            <main>{children} </main>
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
