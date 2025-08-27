// src/app/email/writing/page.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { FiCheck, FiCopy } from "react-icons/fi"
import toast, { Toaster } from "react-hot-toast"
import { IEmailProcessResponse } from "@/types"

// This component contains the core interactive logic
function WritingForm() {
  const searchParams = useSearchParams()
  const initialText = searchParams.get("text")

  const [inputText, setInputText] = useState("")
  const [improvedText, setImprovedText] = useState<IEmailProcessResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // This effect runs once to populate the text area from the URL
  useEffect(() => {
    if (initialText) {
      setInputText(initialText)
    }
  }, [initialText])

  const handleClear = () => {
    setInputText("")
    setImprovedText(null) // Also clear the results
  }

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter the text you want to improve.");
      return;
    }

    setIsAnalyzing(true)
    setImprovedText(null) // Clear previous results before fetching new ones
    const loadingToast = toast.loading("LissanAI is analyzing your text...")

    try {
      const response = await fetch('/api/email/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputText,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      const data: IEmailProcessResponse = result;
      setImprovedText(data); // Store the full response object
      toast.success("Your text has been improved!");

    } catch (error: any) {
      console.error("Failed to improve text:", error);
      toast.error(error.message || "Failed to improve text.");
    } finally {
    
      setIsAnalyzing(false)
      toast.dismiss(loadingToast)
    }
  }
  
  const handleCopyImprovedEmail = () => {
    if (!improvedText) return;
    const fullEmail = `Subject: ${improvedText.subject}\n\n${improvedText.generated_email}`;
    navigator.clipboard.writeText(fullEmail);
    toast.success("Improved email copied!");
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Your English Text */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-900">Your English Text</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Post your English text here and well help improve it</p>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here or generate it from the previous page..."
            className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />

          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputText.trim()}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? "Analyzing..." : "Check and Improve Text"}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* --- MODIFIED RIGHT PANEL --- */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Improvements</h2>
          
          {isAnalyzing ? (
            <div className="flex items-center justify-center h-full text-gray-500">
                <p>Analyzing and improving your text...</p>
            </div>
          ) : improvedText ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Suggested Subject</label>
                <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm text-gray-800 font-semibold">
                  {improvedText.subject}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Improved Email Body</label>
                <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm text-gray-800 h-48 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans">{improvedText.generated_email}</pre>
                </div>
              </div>
              <button
                onClick={handleCopyImprovedEmail}
                className="flex items-center space-x-2 text-teal-600 hover:text-teal-800 font-medium"
              >
                <FiCopy className="w-4 h-4" />
                <span>Copy Improved Email</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Improvements will appear here after you analyze your text.</p>
            </div>
          )}
        </div>
        {/* --- END MODIFICATION --- */}
      </div>
    </>
  )
}

// This is the main page component that wraps our form in Suspense
export default function WritingAssistantPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/lisan.jpg"
                  alt="LissanAI Mascot"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-xl font-bold text-gray-900">LissanAI</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Mock Interviews
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Grammar Coach
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Learn
                </a>
                <Link href="/email/drafting" className="text-teal-600 font-medium">
                  Email Drafting
                </Link>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Pronunciation
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
            <Image
              src="/images/lisan.jpg"
              alt="LissanAI Assistant"
              width={80}
              height={80}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Writing Assistant</h1>
          <p className="text-gray-600 mb-6">Great work! Your email looks professional and polite. Ready to send? ✨</p>
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">14</div>
              <div className="text-sm text-gray-500">Emails Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-500">+15</div>
              <div className="text-sm text-gray-500">Professional Emails</div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Link href="/email/drafting" className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              🇪🇹 Generate from Amharic
            </Link>
            <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              🔄 Improve English Text
            </button>
          </div>
        </div>

        <Suspense fallback={<div className="text-center p-8">Loading Editor...</div>}>
          <WritingForm />
        </Suspense>

        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Common Writing Tips</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use interested in not interested for</span>
            </li>
            <li className="flex items-start space-x-2">
              <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Say I have experience not Im having experience</span>
            </li>
            <li className="flex items-start space-x-2">
              <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use past tense I worked for completed actions</span>
            </li>
            <li className="flex items-start space-x-2">
              <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Be specific: several projects instead of many projects</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Image
              src="/images/lisan.jpg"
              alt="Lissan Mascot"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <h2 className="text-lg font-semibold text-gray-900">Lissans Email Writing Tips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                <FiCheck className="w-4 h-4 text-green-500" />
                <span>What to include in Amharic:</span>
              </h3>
              <ul className="space-y-1 text-sm text-gray-600 ml-6">
                <li>• Purpose of the email (job application, meeting request, etc.)</li>
                <li>• Your specific situation or background</li>
                <li>• What you want to say to the recipient in detail</li>
                <li>• Any deadlines or time constraints</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                <span className="w-4 h-4 bg-yellow-400 rounded-full flex-shrink-0"></span>
                <span>Lissan will automatically:</span>
              </h3>
              <ul className="space-y-1 text-sm text-gray-600 ml-6">
                <li>• Use professional and polite language</li>
                <li>• Structure the email properly</li>
                <li>• Add appropriate greetings and closings</li>
                <li>• Ensure grammatically correct English</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}