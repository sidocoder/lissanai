"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Copy,
  Download,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Image from "next/image";

export default function GrammarCoachPage() {
  const [activeTab, setActiveTab] = useState<"grammar" | "examples">("grammar");
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setActiveTab("grammar"); // Switch to grammar tab to show analysis results
    setIsAnalyzing(true);

    // Simulate API call
    setTimeout(() => {
      const hasErrors =
        text.toLowerCase().includes("there") &&
        text.toLowerCase().includes("hey");

      setAnalysisResults({
        score: hasErrors ? 85 : 95,
        issuesFound: hasErrors ? 1 : 0,
        wordCount: text.split(" ").filter((word) => word.length > 0).length,
        readability: "Good",
        issues: hasErrors
          ? [
              {
                type: "grammar",
                priority: "medium",
                original: "hey There",
                suggestion: "Hello there",
                explanation:
                  'Subject-verb agreement: "background and enthusiasm" is plural, so use "make"',
              },
            ]
          : [],
        improvedVersion: hasErrors
          ? text.replace(/hey There/gi, "Hello there")
          : text,
        writingTips: [
          "Read your text aloud to catch errors",
          "Use active voice when possible",
          "Keep sentences clear and concise",
          "Check subject-verb agreement",
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const sampleTexts = [
    {
      id: 1,
      title: "Load Sample 1",
      text: "I am writing to apply for the position of software developer at your company. I have 3 years experience in programming and I'm very excited about this opportunity.",
    },
    {
      id: 2,
      title: "Load Sample 2",
      text: "Dear hiring manager, I want to introduce myself as a candidate for the marketing role. I has worked in various companies and learned many skills.",
    },
    {
      id: 3,
      title: "Load Sample 3",
      text: "Thank you for considering my application. I am confident that my background and enthusiasm makes me a strong candidate for this position.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab("grammar")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "grammar"
                  ? "bg-[#337fa1] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <CheckCircle className="w-4 h-4 inline-block mr-1" />
              Grammar Check
            </button>
            <button
              onClick={() => setActiveTab("examples")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "examples"
                  ? "bg-[#337fa1] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Practice Examples
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Text Analysis */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  {/* Left: Text Analysis Title and Subtitle */}
                  <div>
                    <CardTitle className="flex items-center space-x-2 mb-1">
                      <span className="inline-block mr-2 align-middle">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                        >
                          <circle
                            cx="11"
                            cy="11"
                            r="10"
                            stroke="#112D4F"
                            strokeWidth="2"
                          />
                          <circle
                            cx="11"
                            cy="11"
                            r="6"
                            stroke="#112D4F"
                            strokeWidth="2"
                          />
                          <circle cx="11" cy="11" r="2" fill="#112D4F" />
                        </svg>
                      </span>
                      <span>Text Analysis</span>
                    </CardTitle>
                    <p className="text-sm text-[#476385]">
                      Paste your text below and I'll check for grammar,
                      spelling, and style issues
                    </p>
                  </div>
                  {/* Right: Mascot and Listen Carefully */}
                  <div className="flex flex-col items-center ml-4">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Image
                        src="/images/mascot.png"
                        alt="Grammar Coach Mascot"
                        width={128}
                        height={128}
                        className="w-32 h-32 rounded-[9999px] object-contain"
                      />
                    </div>
                    <div className="flex items-center text-xs text-black bg-[#D9E0ED] rounded-full mt-2 px-3 py-1 font-medium shadow">
                      🗣️ Listen carefully
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <Textarea
                  placeholder={text || "hey There"}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] resize-none pr-44"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {text.length} characters
                  </span>
                  <Button
                    onClick={handleAnalyze}
                    disabled={!text.trim() || isAnalyzing}
                    className="bg-[#337fa1] hover:bg-[#2c6e91]"
                  >
                    {isAnalyzing ? "Checking..." : "✓ Check Grammar"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {activeTab === "grammar" && analysisResults && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Analysis Results</span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      Score: {analysisResults.score}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {analysisResults.issuesFound === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-[#337fa1] mb-2">
                        Perfect Grammar!
                      </h3>
                      <p className="text-gray-600">
                        No errors found in your text.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold text-[#112D4F]">
                          {analysisResults.issuesFound} Issues Found
                        </span>
                      </div>

                      {analysisResults.issues.map(
                        (issue: any, index: number) => (
                          <div
                            key={index}
                            className="border rounded-lg p-4 bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-[#112D4F]"
                                >
                                  grammar
                                </Badge>
                                <Badge variant="outline" className=" text-xs">
                                  <span className="text-blue-900">
                                    {" "}
                                    medium priority
                                  </span>
                                </Badge>
                              </div>
                              <Button className="text-xs bg-transparent">
                                Apply Fix
                              </Button>
                            </div>
                            <div className="text-sm">
                              <span className="line-through text-red-600">
                                "{issue.original}"
                              </span>
                              <span className="mx-2">→</span>
                              <span className="text-[#112D4F]">
                                "{issue.suggestion}"
                              </span>
                            </div>
                            <p className="text-xs text-gray-900 mt-1">
                              {issue.explanation}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* Improved Version */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">⚡</span>
                      <span className=" text-[#112D4F] font-semibold ">
                        Improved Version
                      </span>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-md text-[#112D4F] whitespace-pre-line">
                        {analysisResults.improvedVersion}
                      </p>
                      <div className="flex space-x-2 mt-3">
                        <Button className="text-xs bg-blue-100  text-black rounded-full flex items-center">
                          <Copy className="w-3 h-3 mr-1 text-black" />
                          <span className="text-[#112D4F]">Copy</span>
                        </Button>
                        <Button className="text-xs bg-[#F8F7F7] rounded-full flex items-center">
                          <Download className="w-3 h-3 mr-1 text-black" />
                          <span className="text-[#112D4F]">Download</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Writing Tips */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <span className="text-black font-semibold">
                        Writing Tips
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {analysisResults.writingTips.map(
                        (tip: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2 text-sm"
                          >
                            <Lightbulb className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-[#112D4F]">{tip}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Try Sample Texts - Only show in examples tab */}
            {activeTab === "examples" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle> Try Sample Texts</CardTitle>
                  <p className="text-sm text-gray-600">
                    Practice with these examples that contain common errors
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sampleTexts.map((sample) => (
                    <div
                      key={sample.id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <p className="text-sm text-black mb-3">{sample.text}</p>
                      <Button
                        className="border bg-[#] text-[#112D4F]"
                        onClick={() => {
                          setText(sample.text);
                          setActiveTab("examples");
                          setAnalysisResults(null); // Hide analysis results when switching to examples
                        }}
                      >
                        {sample.title}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Analysis Summary & Grammar Coach */}
          <div className="space-y-6">
            {/* Analysis Summary */}
            {analysisResults && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Grammar Score</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {analysisResults.score}/100
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Issues Found</span>
                    <span className="text-sm font-medium text-gray-900">
                      {analysisResults.issuesFound}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Word Count</span>
                    <span className="text-sm font-medium text-gray-900">
                      {analysisResults.wordCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Readability</span>
                    <Badge variant="outline" className="text-blue-600">
                      <span className="text-green-600">Good</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Grammar Coach */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>✓ Your Grammar Coach</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="flex flex-col items-center ml-4">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Image
                        src="/images/mascot.png"
                        alt="Grammar Coach Mascot"
                        width={128}
                        height={128}
                        className="w-32 h-32 rounded-[9999px] object-contain"
                      />
                    </div>
                    <div className="flex items-center text-xs text-black bg-[#D9E0ED] rounded-full mt-2 px-3 py-1 font-medium shadow">
                      🗣️ Listen carefully
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    I'm here to help you write with confidence! I find errors
                    and suggest improvements to make your writing shine.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-large text-black font-semibold">
                    Writing Tips
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-black">
                        Read your text aloud to catch errors
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-black">
                        Use active voice when possible
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-black">
                        Keep sentences clear and concise
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-black">
                        Check subject-verb agreement
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
