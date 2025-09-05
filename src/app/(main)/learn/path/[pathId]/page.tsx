

"use client";

import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { FiBookOpen, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';


const mockPath = {
  title: 'Grammar Basics',
  description: 'Master the fundamental rules of English grammar to build a strong foundation for clear and effective communication.',
  lessons: [
    { id: 'lesson-1', title: 'Nouns, Verbs, and Adjectives', isCompleted: true },
    { id: 'lesson-2', title: 'Subject-Verb Agreement', isCompleted: true },
    { id: 'lesson-3', title: 'Articles: A, An, The', isCompleted: false },
    { id: 'lesson-4', title: 'Prepositions of Time and Place', isCompleted: false },
  ]
};


interface LessonListItemProps {
  id: string;
  title: string;
  isCompleted: boolean;
}

const LessonListItem = ({ id, title, isCompleted }: LessonListItemProps) => (
  <Link 
    href={`/learn/lesson/${id}`} // This will point to our final lesson detail page
    className="block"
  >
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between hover:bg-gray-50 hover:border-blue-500 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}>
          <FiCheckCircle className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
      </div>
      <FiChevronRight className="text-gray-400" />
    </div>
  </Link>
);


export default function LessonListPage() {
  const params = useParams();
  const pathId = params.pathId as string;


  const pathData = mockPath;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        
        <div className="mb-8">
          <Link href="/learn" className="text-sm font-semibold text-blue-600 hover:underline mb-2 inline-block">
            &larr; Back to Learning Paths
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900">{pathData.title}</h1>
          <p className="mt-2 text-lg text-gray-600">{pathData.description}</p>
        </div>



        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
                <FiBookOpen className="text-blue-500" />
                <h2 className="text-xl font-bold text-gray-800">Lessons in this Path</h2>
            </div>
            <div className="space-y-3">
                {pathData.lessons.map(lesson => (
                    <LessonListItem key={lesson.id} {...lesson} />
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}