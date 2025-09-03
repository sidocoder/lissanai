"use client";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; // Add for logout
import { ChevronDown, LogOut } from "lucide-react"; // Add icons

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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // For profile dropdown
  const [storedAvatar, setStoredAvatar] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

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

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 z-50 w-full h-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link href="/">
            <img src="/images/logo.png" alt="LissanAI" className="h-12 w-20" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium ${
                  pathname === item.href
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex flex-col items-center space-y-1 text-gray-700 hover:text-blue-600"
            >
              <img
                src={displayAvatar}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover bg-center border-2 border-white shadow-md"
              />
              {/* <ChevronDown className="h-4 w-4 " /> */}
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session?.user?.email || ""}
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
          >
            {isMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium ${
                    pathname === item.href
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
