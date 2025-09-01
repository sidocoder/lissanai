"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React from 'react';
import Header from "@/components/Header";
import { FiChevronDown, FiHash } from "react-icons/fi";

import { learnPageLessons, type Lesson, type SubTopic } from "@/constants/index";


const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');


    
interface AccordionItemProps {
    topic: SubTopic;
    isOpen: boolean;
    onToggle: () => void;
}

const AccordionItem = ({ topic, isOpen, onToggle }: AccordionItemProps) => (
    <div className="border-b border-gray-200 last:border-b-0">
        <button 
            onClick={onToggle}
            className="w-full text-left bg-transparent p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
        >
            <h3 className="font-bold text-gray-800">{topic.title}</h3>
            <FiChevronDown className={`text-gray-500 w-6 h-6 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
            <div className="p-4 pt-0">
                <p className="text-gray-600 mb-4">{topic.explanation}</p>
                
                {topic.examples && topic.examples.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Examples:</h4>
                        <ul className="space-y-2">
                            {topic.examples.map((example, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <FiHash className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                                    <span className="text-gray-600 italic">{example}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    </div>
);


export default function LessonDetailPage() {
  const params = useParams();
  const lessonSlug = params.lessonSlug as string;
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const lesson = learnPageLessons.find(
    (l) => slugify(l.title) === lessonSlug
  );

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h1 className="text-2xl font-bold">Lesson Not Found</h1>
          <p className="mt-4">We could not find the lesson you were looking for.</p>
          <Link href="/learn" className="mt-6 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
            Back to All Lessons
          </Link>
        </main>
      </div>
    );
  }

  const pageTitle = lesson.title;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">{pageTitle}</h1>
        </div>

        <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-6 flex items-center justify-between mb-10">
            <p className="text-gray-700 max-w-lg">
                Welcome to the {pageTitle} lesson! Here you will learn essential concepts to improve your English communication skills.
            </p>
            <div className="hidden sm:block">
                <Image 
                    src="/images/mascot.png" 
                    alt="Mascot" 
                    width={80} 
                    height={80} 
                    className="w-20 h-20 object-contain" 
                />
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="divide-y divide-gray-200">

                {lesson.subTopics.map((topic) => (
                    <AccordionItem 
                        key={topic.title} 
                        topic={topic} 
                        isOpen={openAccordion === topic.title}
                        onToggle={() => setOpenAccordion(openAccordion === topic.title ? null : topic.title)}
                    />
                ))}
                
            </div>
        </div>

      </main>
    </div>
  );
}