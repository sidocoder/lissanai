

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React from 'react';
import Header from "@/components/Header";
import { FiCheck, FiX, FiActivity, FiThumbsUp, FiThumbsDown, FiSend } from "react-icons/fi";
import { FaLightbulb } from "react-icons/fa";
import { learnPageTips } from "@/constants/index";
import toast, { Toaster } from "react-hot-toast";


/* eslint-disable @typescript-eslint/no-explicit-any */


interface QuizQuestion {
    id: string;
    text: string;
    options: string[];
}

interface LessonContent {
    id: string;
    title: string;
    description: string;
    content: string;
    quiz: {
        id: string;
        title: string;
        questions: QuizQuestion[];
    }
}

interface QuizResult {
    score: number;
    max_score: number;
    percentage: number;
    passed: boolean;
    correct_answers: Record<string, string>;
}



interface QuizProps {
    quizData: LessonContent['quiz'];
    onSubmit: (answers: Record<string, string>) => void;
    isSubmitting: boolean;
    results: QuizResult | null;
}

const Quiz = ({ quizData, onSubmit, isSubmitting, results }: QuizProps) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const handleAnswerChange = (questionId: string, option: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const getOptionStyle = (questionId: string, option: string) => {
        if (!results) return 'border-gray-300 hover:border-blue-500 cursor-pointer'; // Default state before submission
        const correctAnswer = results.correct_answers[questionId];
        const userAnswer = answers[questionId];
        
        if (option === correctAnswer) return 'border-green-500 bg-green-50 text-green-800'; // Correct answer style
        if (option === userAnswer && option !== correctAnswer) return 'border-red-500 bg-red-50 text-red-800'; // Incorrectly selected answer
        return 'border-gray-300 bg-gray-50 text-gray-500'; // Other options after submission
    };
    
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{quizData.title}</h2>
            <div className="space-y-8">
                {quizData.questions.map((q, index) => (
                    <div key={q.id}>
                        <p className="font-semibold text-gray-700 mb-3">{index + 1}. {q.text}</p>
                        <div className="space-y-2">
                            {q.options.map(option => (
                                <button
                                    key={option}
                                    onClick={() => !results && handleAnswerChange(q.id, option)}
                                    className={`w-full text-left p-3 border-2 rounded-lg transition-colors flex items-center gap-3 ${getOptionStyle(q.id, option)}`}
                                    disabled={!!results}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answers[q.id] === option ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
                                        {answers[q.id] === option && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                    <span>{option}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {!results && (
                 <button 
                    onClick={() => onSubmit(answers)}
                    disabled={isSubmitting || Object.keys(answers).length !== quizData.questions.length}
                    className="mt-8 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {isSubmitting ? <FiActivity className="animate-spin" /> : <FiSend />}
                    {isSubmitting ? 'Submitting...' : 'Submit Answers'}
                </button>
            )}
            {results && (
                <div className={`mt-8 p-6 rounded-lg ${results.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            {results.passed ? <FiThumbsUp className="w-10 h-10 text-green-500" /> : <FiThumbsDown className="w-10 h-10 text-red-500" />}
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${results.passed ? 'text-green-800' : 'text-red-800'}`}>{results.passed ? 'Congratulations, you passed!' : 'Keep trying!'}</h3>
                            <p className="text-2xl font-semibold">{results.score} / {results.max_score} ({results.percentage}%)</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};



export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/learning/lessons/${lessonId}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch lesson content.');
        }
        setLesson(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleQuizSubmit = async (answers: Record<string, string>) => {
      if (!lesson?.quiz.id) return;
      setIsSubmitting(true);
      const loadingToast = toast.loading("Submitting your answers...");
      
      try {
          const response = await fetch(`/api/learning/quizzes/${lesson.quiz.id}/submit`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ answers })
          });
          const data = await response.json();
          if (!response.ok) {
              throw new Error(data.error || "Failed to submit quiz.");
          }
          setQuizResults(data);
          toast.success("Quiz submitted successfully!");
      } catch (err: any) {
          toast.error(err.message);
      } finally {
          setIsSubmitting(false);
          toast.dismiss(loadingToast);
      }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
            <FiActivity className="w-8 h-8 mx-auto animate-spin text-blue-500" />
            <p className="mt-2 text-gray-600">Loading Lesson...</p>
        </main>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h1 className="text-2xl font-bold text-red-700">Lesson Not Found</h1>
          <p className="mt-4 text-red-600">{error || "We could not find the lesson you were looking for."}</p>
          <Link href="/learn" className="mt-6 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
            Back to All Lessons
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">{lesson.title}</h1>
        </div>

        <div className="relative bg-white rounded-xl shadow-sm border-2 border-blue-200 p-6 pr-28 sm:pr-32 mb-12">
            <p className="text-gray-700 max-w-lg">
                {lesson.description}
            </p>
            <div className="absolute -top-6 -right-6 sm:-right-8 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none">
              <div className="relative w-full h-full p-1.5 bg-gradient-to-tr from-green-400 to-white rounded-full shadow-lg">
                <div className="w-full h-full bg-white rounded-full">
                  <Image src="/images/mascot.png" alt="Mascot" width={112} height={112} className="w-full h-full object-contain rounded-full" />
                </div>
              </div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Lesson Content</h2>
            <div className="prose max-w-none">
                <p>{lesson.content}</p>
            </div>
        </div>
        
        {lesson.quiz && (
             <Quiz 
                quizData={lesson.quiz}
                onSubmit={handleQuizSubmit}
                isSubmitting={isSubmitting}
                results={quizResults}
             />
        )}
        
        <div className="mt-12 bg-white rounded-xl shadow-sm border-2 border-blue-200 p-6 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-grow w-full">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Tips for Practice</h3>
                  <ul className="space-y-3 pl-4">
                      {learnPageTips.map(tip => (
                          <li key={tip} className="flex items-start gap-3">
                              <div className="w-5 h-5 flex items-center justify-center bg-yellow-100 rounded-full flex-shrink-0 mt-0.5">
                                <FaLightbulb className="w-3 h-3 text-yellow-500" />
                              </div>
                              <span className="text-sm text-gray-600">{tip}</span>
                          </li>
                      ))}
                  </ul>
              </div>
              <div className="relative flex-shrink-0 flex items-center justify-center md:justify-end mt-6 md:mt-0 w-full md:w-auto">
                  <div className="bg-blue-100 text-blue-800 font-semibold py-3 px-5 rounded-xl shadow-sm mr-4">
                      Lets Learn Together!
                  </div>
                  <div className="w-24 h-24">
                      <Image 
                          src="/images/mascot.png" 
                          alt="Mascot" 
                          width={96} 
                          height={96} 
                          className="w-full h-full object-contain" 
                      />
                  </div>
              </div>
          </div>
        </div>

      </main>
    </div>
  );
}