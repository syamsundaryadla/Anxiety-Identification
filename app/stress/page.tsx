"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

const StressForm = ({ onSubmit }: { onSubmit: (result: string) => void }) => {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Start loading state
    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: userInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the prediction");
      }

      const result = await response.json();
      onSubmit(result.result); // Receive prediction result from Flask API
    } catch (error) {
      console.error("Error during prediction:", error);
      onSubmit("Error occurred during prediction");
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <div className="w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md">
      <div className="mb-4 sm:mb-6">
        <label className="block mb-2 text-base sm:text-lg lg:text-xl font-medium text-gray-700">
          How are you feeling?
        </label>
        <textarea
          value={userInput}
          onChange={handleChange}
          className="w-full p-3 sm:p-4 lg:p-5 text-sm sm:text-base lg:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder="Type your feelings here..."
          rows={6}
        />
      </div>
      <button
        onClick={handleSubmit}
        className={`w-full px-4 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
        } text-white rounded-md hover:bg-blue-400 transition-all duration-200 font-medium`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="animate-spin border-t-4 border-white rounded-full w-6 h-6 mx-auto"></div>
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
};


const StressPage = () => {
  const [moodResult, setMoodResult] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setLoading(false); // This should only happen client-side
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSubmit = (mood: string) => {
    setMoodResult(mood);
  };

  if (loading) {
    // Prevent rendering loading spinner on SSR to avoid hydration mismatch
    return null; // Or you could return a different placeholder, like an empty div
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isLoggedIn loading={loading} onLogout={handleLogout} />

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 lg:mb-10 text-gray-800 text-center">
          Stress Analysis
        </h1>
        <StressForm onSubmit={handleSubmit} />
        {moodResult && (
          <div className="mt-6 sm:mt-8 lg:mt-10 p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md text-center w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-700">
              Your Mood:{" "}
              <span className="font-bold text-blue-500">{moodResult}</span>
            </h2>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};


export default StressPage;
