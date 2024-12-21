'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface HeaderProps {
  isLoggedIn: boolean;
  loading: boolean;
  onLogout: () => Promise<void>;
}

export default function Header({ isLoggedIn, loading, onLogout }: HeaderProps) {
  const [showMobileLogout, setShowMobileLogout] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleProfileClick = () => {
    setShowMobileLogout(!showMobileLogout);
  };

  const handleLogoutClick = async () => {
    await onLogout();
    setShowMobileLogout(false);
  };

  // Don't render interactive elements until client-side hydration is complete
  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white border-b">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Stress Analyzer
          </Link>
          <nav className="flex items-center">
            <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-xl font-semibold text-gray-900 sm:text-2xl"
        >
          Stress Analyzer
        </Link>

        {/* Navigation */}
        <nav className="flex items-center">
          {loading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
            </div>
          ) : isLoggedIn ? (
            <div className="flex items-center space-x-4 relative">
              {/* Profile Icon */}
              <div 
                className="relative h-8 w-8 rounded-full overflow-hidden cursor-pointer sm:cursor-default"
                onClick={handleProfileClick}
              >
                <Image
                  src="/profile1.jpg"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="object-cover"
                  priority
                />
              </div>
              {/* Mobile Logout Dropdown */}
              {showMobileLogout && (
                <>
                  <div className="absolute right-0 top-10 sm:hidden z-50">
                    <div className="bg-white border rounded-md shadow-lg py-1">
                      <button
                        onClick={handleLogoutClick}
                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                  <div 
                    className="fixed inset-0 sm:hidden z-40 bg-transparent"
                    onClick={() => setShowMobileLogout(false)}
                  />
                </>
              )}
              {/* Desktop Logout Button */}
              <button
                onClick={onLogout}
                className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-white hover:bg-red-600 h-9 px-4"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 bg-indigo-500 text-white hover:bg-indigo-600"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 bg-indigo-500 text-white hover:bg-indigo-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}