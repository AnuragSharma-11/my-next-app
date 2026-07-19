import "./globals.css";
import Navbar from "./components/Navbar";
import {Raleway, Geist, Inter} from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// export const metadata = {
//   title: "Aashita",
//   description: "Aashita",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="english">
      <body className={`${raleway.variable} ${geist.variable} ${inter.variable}`} >
        
        <Navbar /> 
        {children}
      </body>
    </html>
  );
}