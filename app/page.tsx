'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Homepage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include'
        });
        setIsLoggedIn(response.ok);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      router.refresh();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-pink-100">
      <Header 
        isLoggedIn={isLoggedIn} 
        loading={loading} 
        onLogout={handleLogout}
      />

      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[90%] sm:max-w-2xl lg:max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4 sm:mb-6 leading-tight">
            Welcome to the Student Stress Analyzer
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-prose mx-auto mb-6 sm:mb-8 leading-relaxed">
            Take a quick moment to assess your mood and stress levels with this
            interactive tool. Find out how you are feeling today!
          </p>

          <Link
            href={isLoggedIn ? "/stress" : "/login"}
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-indigo-500 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-indigo-400 transition-colors duration-200 shadow-md hover:shadow-lg active:transform active:scale-95"
          >
            {isLoggedIn ? "Start Stress Analysis" : "Login to Start Stress Analysis"}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}