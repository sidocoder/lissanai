"use client";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navigationItems = [
  { label: "Mock Interviews", href: "/interview" },
  { label: "Grammar Coach", href: "/grammar" },
  { label: "Learn", href: "/learn" },
  { label: "Email Drafting", href: "/writing" },
  { label: "Pronunciation", href: "/pronunciation" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-[#112D4F] to-[#3D72B3]">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                LissanAI
              </span>
            </div>
            <nav className="flex space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-[#476385] hover:text-[#112d4e] transition-colors text-base font-medium pb-1 ${
                    pathname === item.href ? "border-b-2 border-[#0084E2]" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <FiMenu size={28} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-900/90 z-50 flex flex-col items-center justify-center md:hidden">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6"
            aria-label="Close menu"
          >
            <FiX size={32} className="text-white" />
          </button>
          <nav className="flex flex-col items-center gap-8">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-[#476385] text-2xl font-semibold pb-1 ${
                  pathname === item.href ? "border-b-2 border-[#0084E2]" : ""
                }`}
              >
                {item.label}
              </a>
            ))}
            <Link href="/auth/sign-in">
              <button className="bg-white border border-transparent rounded-lg px-8 py-3 text-lg font-semibold text-black hover:bg-gray-200 transition-colors mt-4">
                Log In
              </button>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
