import type { Metadata } from "next";
import Link from "next/link";
import { PLATFORM_NAME, SCHOOL_NAME } from "./config";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rate Your Teacher",
  description: `Anonymous teacher reviews for ${SCHOOL_NAME} students`
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-semibold text-blue-700">
              {PLATFORM_NAME}
            </Link>
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <Link href="/teachers" className="hover:text-blue-600">
                Teachers
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
