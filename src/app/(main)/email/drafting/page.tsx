// src/app/email/drafting/page.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

// --- MODIFICATION START: Import new hooks for dropdown functionality ---
import { useState, useRef, useEffect } from "react"
// --- END MODIFICATION ---
import Image from "next/image"
import Link from "next/link";
import { FiCopy, FiRefreshCw, FiSend, FiCheck, FiZap, FiStar, FiChevronDown, FiPlusCircle, FiXCircle } from "react-icons/fi"
import { FaWandMagicSparkles } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { IEmailProcessResponse } from "@/types";

export default function EmailDraftingPage() {
  // --- CORE LOGIC (UNCHANGED) ---
  const [recipient, setRecipient] = useState("Manager")
  const [purpose, setPurpose] = useState("Schedule a meeting")
  const [userInput, setUserInput] = useState("")
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // --- NEW STATE & DATA FOR CUSTOM DROPDOWN ---
  const [emailType, setEmailType] = useState("Meeting Request")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const emailOptions = [
      { label: "Job Application", category: "Career" },
      { label: "Application Follow-up", category: "Career" },
      { label: "Meeting Request", category: "Business" },
      { label: "Thank You Email", category: "Professional" },
      { label: "General Inquiry", category: "Business" },
  ];
  
  const selectedOption = emailOptions.find(opt => opt.label === emailType) || emailOptions[0];

  // Effect to handle clicks outside of the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  
  // --- CORE LOGIC (UNCHANGED) ---
  const handleGenerateEmail = async () => {
    if (!userInput.trim()) {
      toast.error("Please describe what you want to write about.");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("LissanAI is drafting your email...");

    try {
      const prompt = `
        Email Type: ${emailType}
        Recipient: ${recipient}
        Purpose: ${purpose}
        User's specific request: ${userInput}
      `;

      const response = await fetch('/api/email/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          type: 'GENERATE',
          template_type: emailType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      const data: IEmailProcessResponse = result;
      setGeneratedEmail(data.generated_email);
      toast.success("Your email has been generated!");

    } catch (error: any) {
      console.error("Failed to generate email:", error);
      toast.error(error.message || "Failed to generate email.");
    } finally {
      setIsGenerating(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleClear = () => {
    setUserInput("")
    setGeneratedEmail("")
  }

  const handleCopyEmail = () => {
    if (!generatedEmail) {
        toast.error("Nothing to copy!");
        return;
    }
    navigator.clipboard.writeText(generatedEmail)
    toast.success("Email copied to clipboard!");
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Toaster position="top-center" />
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 rounded-lg w-8 h-8 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">L</span>
                    </div>
                    <span className="text-xl font-bold text-gray-800">LissanAI</span>
                </div>
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Mock Interviews</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Grammar Coach</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Learn</a>
                    <a href="#" className="text-blue-600 font-semibold">Email Drafting</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Pronunciation</a>
                </nav>
            </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Header Section */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo.png"
            alt="LissanAI Email Assistant"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
          />
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <FiSend /> Email Writing Assistant
          </h1>
        </div>

        {/* Floating Status & Stats */}
        <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <Image src="/images/logo.png" alt="Mascot" width={40} height={40} className="w-10 h-10 rounded-full" />
                <p className="text-gray-700 font-medium">Great work! Your email looks professional and polite. Ready to send?</p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <div className="text-center">
                    <p className="font-bold text-gray-800">14</p>
                    <p className="text-xs text-gray-500">Emails Written</p>
                </div>
                <div className="text-center">
                    <p className="font-bold text-gray-800">3</p>
                    <p className="text-xs text-gray-500">Day Streak</p>
                </div>
                <div className="text-center">
                    <p className="font-bold text-green-500">+15</p>
                    <p className="text-xs text-gray-500">XP Today</p>
                </div>
            </div>
        </div>

        {/* Action Toggles */}
        <div className="flex justify-center items-center bg-gray-100 p-1 rounded-lg max-w-md mx-auto mb-8">
          <button className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md shadow font-semibold transition-all">
            <FaWandMagicSparkles />
            Generate from Amharic
          </button>
          <Link
            href={{
              pathname: '/email/writing',
              query: { text: generatedEmail },
            }}
            onClick={(e) => !generatedEmail && e.preventDefault()}
            className={`flex-1 flex items-center justify-center gap-2 text-gray-600 px-4 py-2 font-semibold transition-all rounded-md ${
              !generatedEmail
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-white hover:shadow'
            }`}
            aria-disabled={!generatedEmail}
          >
            <FiZap />
            Improve English Text
          </Link>
        </div>

        {/* --- MODIFIED Email Type Card WITH DROPDOWN --- */}
        <div className="bg-white border border-green-200 rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-md font-semibold text-gray-800 mb-1">Email Type</h2>
            <p className="text-sm text-gray-500 mb-4">Choose the type of email you want to write</p>
            
            <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full border border-gray-300 rounded-lg p-3 flex justify-between items-center bg-white cursor-pointer text-left"
                >
                    <span className="font-medium text-gray-700">{selectedOption.label}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{selectedOption.category}</span>
                        <FiChevronDown className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                </button>

                {isDropdownOpen && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <ul>
                            {emailOptions.map((option) => (
                                <li 
                                  key={option.label}
                                  onClick={() => {
                                      setEmailType(option.label);
                                      setIsDropdownOpen(false);
                                  }}
                                  className="flex justify-between items-center p-3 hover:bg-gray-50 cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700">{option.label}</span>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{option.category}</span>
                                    </div>
                                    {emailType === option.label && <FiCheck className="text-blue-600" />}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mt-4">
                <p className="text-sm font-semibold text-gray-600">Example:</p>
                <p className="text-sm text-gray-500">I would like to schedule a meeting to discuss the project requirements</p>
            </div>
        </div>
        {/* --- END MODIFICATION --- */}


        {/* Main Content - Dual Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Pane - Input */}
          <div className="bg-white rounded-lg border border-green-200 shadow-sm p-6">
            <h2 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-1"><FiPlusCircle /> Describe in Amharic/English</h2>
            <p className="text-sm text-gray-500 mb-4">Tell me what you want to write in Amharic, and Ill create a professional English email for you!</p>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="e.g., Ask my manager for a follow-up meeting about the Q3 report next Tuesday."
              className="w-full h-52 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleGenerateEmail}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 font-semibold transition-colors"
              >
                {isGenerating ? <FiRefreshCw className="animate-spin" /> : <FiSend />}
                <span>{isGenerating ? "Creating..." : "Create Email (+25 XP)"}</span>
              </button>
              <button onClick={handleClear} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium">
                <FiXCircle />
                Clear
              </button>
            </div>
          </div>

          {/* Right Pane - Generated Email */}
          <div className="bg-white rounded-lg border border-green-200 shadow-sm p-6">
            <h2 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <FiCheck /> Professional English Email
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto">
              {isGenerating ? (
                  <div className="flex items-center justify-center h-full text-gray-500">Generating...</div>
              ) : generatedEmail ? (
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{generatedEmail}</pre>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Your generated email will appear here.
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                <FiCopy />
                <span>Copy Email</span>
              </button>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold">
                <FiZap />
                <span>Professional Quality</span>
              </button>
            </div>
          </div>
        </div>

        {/* Email Writing Tips */}
        <div className="bg-white rounded-lg border border-green-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Image src="/images/logo.png" alt="LissanAI Tips" width={40} height={40} className="w-10 h-10 rounded-full" />
            <h2 className="text-lg font-semibold text-gray-800">Lissans Email Writing Tips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">What to include in Amharic:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3"><FiCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" /><span className="text-sm text-gray-600">Purpose of the email (job application, meeting request, etc.)</span></li>
                <li className="flex items-start gap-3"><FiCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" /><span className="text-sm text-gray-600">Your specific situation or background</span></li>
                <li className="flex items-start gap-3"><FiCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" /><span className="text-sm text-gray-600">What action you want the recipient to take</span></li>
                <li className="flex items-start gap-3"><FiCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" /><span className="text-sm text-gray-600">Any deadlines or time constraints</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Lissan will automatically:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3"><FiStar className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" /><span className="text-sm text-gray-600">Use professional and polite language</span></li>
                <li className="flex items-start gap-3"><FiStar className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" /><span className="text-sm text-gray-600">Structure the email properly</span></li>
                <li className="flex items-start gap-3"><FiStar className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" /><span className="text-sm text-gray-600">Add appropriate greetings and closings</span></li>
                <li className="flex items-start gap-3"><FiStar className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" /><span className="text-sm text-gray-600">Ensure grammatically correct English</span></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}