import type { Metadata, Viewport } from "next";
import { Inter, Coiny, Kanit, Playpen_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/components/LangProvider";
import LangToggle from "@/components/LangToggle";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// English display font.
const playPen = Playpen_Sans_Hebrew({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

// Thai UI font (self-hosted by next/font).
const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "You're Invited",
  description: "A wedding invitation — open the envelope and RSVP.",
  openGraph: {
    title: "You're Invited",
    description: "A wedding invitation — open the envelope and RSVP.",
    images: ["/FC.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f4ede4",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="th"
      className={`${inter.variable} ${playPen.variable} ${kanit.variable}`}
    >
      <body className="antialiased">
        <LangProvider>
          <LangToggle />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
