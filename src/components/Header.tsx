"use client";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navigationItems = [
  { label: "Mock Interviews", href: "/interview" },
  { label: "Grammar Coach", href: "/grammar" },
  { label: "Learn", href: "/learn" },
  { label: "Email Drafting", href: "/email/drafting" },
  { label: "Pronunciation", href: "/pronunciation" },
];

interface HeaderProps {
  avatarImage?: string;
}

export default function Header({ avatarImage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [storedAvatar, setStoredAvatar] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("avatarImage");
    if (savedAvatar) setStoredAvatar(savedAvatar);
  }, []);

  const defaultAvatar =
    "https://via.placeholder.com/24x24/cccccc/000000?text=U";
  const displayAvatar = avatarImage || storedAvatar || defaultAvatar;

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-[#112D4F] to-[#3D72B3]">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  LissanAI
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-[#476385] hover:text-[#112d4e] transition-colors text-base font-medium pb-1 ${
                    pathname === item.href
                      ? "border-b-2 border-[#0084E2] text-[#112d4e]"
                      : "border-b-2 border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Profile Image */}
            <div className="hidden md:flex items-center">
              <Link
                href="/profile"
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                  pathname === "/profile" ? "bg-gray-100" : ""
                }`}
                aria-label="Profile"
              >
                <img
                  src={displayAvatar}
                  alt="User Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
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

      {/* Mobile Menu (Overlay) */}
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
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-white text-2xl font-semibold pb-1 ${
                  pathname === item.href
                    ? "border-b-2 border-white"
                    : "border-b-2 border-transparent"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile Profile Image */}
            <Link
              href="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Profile"
            >
              <img
                src={displayAvatar}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            </Link>
            <Link href="/login">
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
