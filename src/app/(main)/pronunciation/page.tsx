"use client";



import { useState, useEffect, useRef } from "react";


import Header from "@/components/Header"
import Image from "next/image"
import { FaHeadphones, FaMicrophone, FaPlay } from "react-icons/fa"


import { FiCheckCircle, FiRefreshCw, FiXCircle } from "react-icons/fi";






interface PracticeSentence {
  id: string;
  text: string;
}

interface AssessmentFeedback {
  full_feedback_summary: string;
  mispronouncedwords: string[];
  overall_accuracy_score: number;
}



type RecordingStatus = "idle" | "recording" | "processing" | "completed";


export default function PronunciationPage() {
  
    
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [practiceSentence, setPracticeSentence] = useState<PracticeSentence | null>(null);
  const [feedback, setFeedback] = useState<AssessmentFeedback | null>(null);

  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>("idle");
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Practice Progress</h1>
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">Word 1 of 4</div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div className="bg-blue-600 h-3 rounded-full" style={{ width: "25%" }}></div>
          </div>
          <p className="text-sm text-gray-600">Current word: three</p>
        </div>


        <div className="bg-green-50 rounded-lg p-8 mb-8 relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <FaHeadphones className="text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Practice Word</h2>
              </div>
              <p className="text-sm text-gray-600">Vowel Sounds • beginner</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-sm">
                <Image
                  src={"/images/mascot.png"}
                  alt="LissanAI Mascot"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-gray-600">🎧 Listen carefully</p>
            </div>
          </div>
        </div>


        <div className="text-center mb-8">
          <h3 className="text-6xl font-bold text-gray-900 mb-2">three</h3>
          <p className="text-lg text-gray-600 mb-2">/θriː/</p>
          <p className="text-gray-700">the number 3</p>
        </div>


        <div className="space-y-6 mb-8 flex flex-col items-center">

          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-3">
              <FaHeadphones className="text-blue-600 text-lg" />
              <span className="font-medium text-gray-900">Step 1: Listen</span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <FaPlay className="text-sm" />
              <span>Play Word</span>
            </button>
          </div>


          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-3">
              <FaMicrophone className="text-green-600 text-lg" />
              <span className="font-medium text-gray-900">Step 2: Practice</span>
            </div>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <FaMicrophone className="text-sm" />
              <span>Start Recording</span>
            </button>
          </div>
        </div>


        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <h4 className="font-medium text-gray-900 mb-2">Example Sentence:</h4>
          <p className="text-gray-700 italic">I have three computers on my desk.</p>
        </div>
      </main>
    </div>
  )
}