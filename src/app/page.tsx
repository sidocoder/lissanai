"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { FiBriefcase, FiMail, FiMic, FiEdit3, FiFacebook, FiTwitter, FiLinkedin, FiArrowLeft, FiArrowRight, FiMenu, FiX } from 'react-icons/fi';


interface NavigationItem {
  label: string;
  href: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  items: string[];
  gradient: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  image: string;
  quote: string;
}


export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';


  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  
  const navigationItems: NavigationItem[] = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Success Stories', href: '#testimonials' },
  ];

  const features: Feature[] = [
    { icon: <FiBriefcase size={28} />, title: 'Mock Interviews', subtitle: 'Practice with AI', items: ['Industry-specific questions', 'Real-time feedback', 'Performance analytics'], gradient: 'from-[#3f72af] to-[#0057b7]' },
    { icon: <FiMail size={28} />, title: 'Email Drafting', subtitle: 'Professional communication', items: ['Amharic to English translation', 'Professional templates', 'Tone adjustment'], gradient: 'from-[#3f72af] to-[#a0e7e5]' },
    { icon: <FiMic size={28} />, title: 'Pronunciation Coach', subtitle: 'Speak with confidence', items: ['Speech-to-text analysis', 'Phonetic breakdowns', 'Progress tracking'], gradient: 'from-[#0057b7] to-[#3f72af]' },
    { icon: <FiEdit3 size={28} />, title: 'Grammar & Clarity', subtitle: 'Write like a pro', items: ['Real-time corrections', 'Style improvements', 'Clarity scoring'], gradient: 'from-[#0057b7] to-[#a0e7e5]' },
  ];

  const steps: Step[] = [
    { number: '1', title: 'Sign Up & Assess', description: 'Create your account and take a quick assessment to tailor your learning plan.' },
    { number: '2', title: 'Practice Daily', description: 'Engage with personalized lessons, mock interviews, and writing exercises.' },
    { number: '3', title: 'Land Your Job', description: 'Apply your improved skills to real opportunities and track your progress.' },
  ];

  const testimonials: Testimonial[] = [
    { name: 'Meron Tadesse', role: 'Software Developer', image: '/images/logo.png', quote: 'LissanAI was a game-changer. The mock interviews gave me the confidence to ace my technical interviews in English. I highly recommend it!' },
    { name: 'Abel Lemma', role: 'Frontend Engineer', image: '/images/logo.png', quote: 'The real-time grammar and pronunciation feedback is incredible. I saw a huge improvement in my communication skills in just a few weeks.' },
  ];

  const footerSections = {
    features: ['Mock Interviews', 'Email Drafting', 'Pronunciation Coach', 'Grammar Check'],
    company: ['About Us', 'Careers', 'Blog', 'Contact'],
    support: ['Help Center', 'Privacy Policy', 'Terms of Service'],
  };

  const handlePrevTestimonial = () => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const handleNextTestimonial = () => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md h-[73px] sticky top-0 z-50 w-full border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-[#3d72b3] to-[#112d4f] rounded-lg w-8 h-8 flex items-center justify-center"><span className="text-white font-bold text-lg">L</span></div>
              <span className="text-xl font-bold text-black">LissanAI</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <a key={item.label} href={item.href} className="text-[#476385] hover:text-[#112d4e] transition-colors text-base font-medium">{item.label}</a>
              ))}
              <div className="flex items-center space-x-4">
                {status === 'loading' ? (
                  <div className="h-9 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                ) : isAuthenticated ? (
                  <>
                    <Link href="/dashboard">
                      <button className="bg-[#0057b7] text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-[#004499] transition-colors">Dashboard</button>
                    </Link>
                    <button onClick={() => signOut()} className="bg-[#f0f2f5] rounded-lg px-5 py-2 text-sm font-semibold text-black hover:bg-gray-200 transition-colors">Log Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <button className="bg-[#f0f2f5] border border-transparent rounded-lg px-5 py-2 text-sm font-semibold text-black hover:bg-gray-200 transition-colors">Log In</button>
                    </Link>
                    <Link href="/signup">
                      <button className="bg-[#0057b7] text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-[#004499] transition-colors">Sign Up</button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu"><FiMenu size={28} className="text-gray-700" /></button>
            </div>
          </div>
        </div>
      </nav>
      
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-900/90 z-50 flex flex-col items-center justify-center md:hidden">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6" aria-label="Close menu"><FiX size={32} className="text-white" /></button>
          <nav className="flex flex-col items-center gap-8">
            {navigationItems.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)} className="text-white text-2xl font-semibold">{item.label}</a>
            ))}
            <div className="flex flex-col items-center gap-6 mt-8">
               {status === 'loading' ? (
                  <div className="h-12 w-32 bg-gray-600 rounded-lg animate-pulse"></div>
                ) : isAuthenticated ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <button className="bg-white text-black rounded-lg px-8 py-3 text-lg font-semibold hover:bg-gray-200 transition-colors">Dashboard</button>
                    </Link>
                    <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="text-white text-lg font-semibold">Log Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <button className="bg-white border border-transparent rounded-lg px-8 py-3 text-lg font-semibold text-black hover:bg-gray-200 transition-colors">Log In</button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      <button className="bg-[#0057b7] text-white rounded-lg px-8 py-3 text-lg font-semibold hover:bg-[#004499] transition-colors">Sign Up</button>
                    </Link>
                  </>
                )}
            </div>
          </nav>
        </div>
      )}

      <main>
        {/* Hero Section */}
        <section className="relative bg-[#dbe2ef] py-20 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 opacity-20"><svg className="absolute right-0 top-0 w-full h-auto md:w-[502px]" viewBox="0 0 502 256" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M502 256C502 114.613 389.387 0 248 0H0V256H502Z" fill="url(#paint0_linear_hero)"/><defs><linearGradient id="paint0_linear_hero" x1="0" y1="128" x2="502" y2="128" gradientUnits="userSpaceOnUse"><stop stopColor="#A0E7E5" stopOpacity="0"/><stop offset="1" stopColor="#3f72af"/></linearGradient></defs></svg></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center lg:text-left">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-[#112d4e]">
                        <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">Your Personal English Coach for Global Opportunities</h1>
                        <p className="text-lg lg:text-xl mb-8 text-[#1f1f1f]/90 max-w-xl mx-auto lg:mx-0">Master English with coaching designed specifically for Ethiopians.</p>
                        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
                            <button className="bg-[#0057b7] text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:bg-[#004499] transition-all transform hover:scale-105">Start Practicing Free</button>
                            <button className="border-2 border-[#3f72af] text-[#112d4e] px-8 py-3 rounded-xl font-semibold text-lg hover:bg-[#3f72af] hover:text-white transition-colors">Learn More</button>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <span className="bg-[#0057b7] text-white px-4 py-2 rounded-full text-sm font-semibold">AI Powered</span>
                            <span className="bg-[#a0e7e5] text-[#112d4e] px-4 py-2 rounded-full text-sm font-semibold">24/7 Available</span>
                        </div>
                    </div>
                    <div className="relative h-64 w-64 md:h-80 md:w-80 mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#3f72af] to-[#a0e7e5] rounded-full shadow-2xl animate-pulse"></div>
                        <div className="relative h-64 w-64 md:h-80 md:w-80 mx-auto flex items-center justify-center">
                        <img
                            src="/videos/welcomingmascot.gif" // Path to your GIF file
                            alt="LissanAI Mascot Animation" // Accessible alt text for the image
                            className="absolute inset-0 w-full h-full object-contain" // Keep consistent styling
                        />
                    </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#112d4e] mb-4">Powerful Features for Your Success</h2>
              <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">Everything you need to master English communication and land your dream international job.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className={`text-white bg-gradient-to-r ${feature.gradient} rounded-xl w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center flex-shrink-0 mr-4`}>{feature.icon}</div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#112d4e]">{feature.title}</h3>
                      <p className="text-gray-500">{feature.subtitle}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {feature.items.map((item) => ( <li key={item} className="flex items-center"><div className="w-2 h-2 bg-[#a0e7e5] rounded-full mr-3"></div><span className="text-gray-700">{item}</span></li>))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 lg:py-24 bg-gradient-to-r from-white to-[#dbe2ef]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16"><h2 className="text-3xl lg:text-4xl font-bold text-[#112d4e]">How LissanAI Works</h2></div>
                <div className="grid md:grid-cols-3 gap-y-16 md:gap-x-8">
                    {steps.map((step, index) => (
                        <div key={step.number} className="text-center">
                            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-lg ${['bg-gradient-to-br from-green-500 to-blue-600', 'bg-gradient-to-br from-blue-500 to-teal-500', 'bg-gradient-to-br from-teal-400 to-indigo-600'][index]}`}>{step.number}</div>
                            <h3 className="text-xl sm:text-2xl font-bold text-[#112d4e] mb-4">{step.title}</h3>
                            <p className="text-gray-600 max-w-sm mx-auto">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Success Stories Section */}
        <section id="testimonials" className="py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16"><h2 className="text-3xl lg:text-4xl font-bold text-[#112d4e] mb-4">Success Stories</h2><p className="text-base lg:text-lg text-gray-600">Hear from Ethiopians who transformed their careers.</p></div>
            <div className="max-w-3xl mx-auto relative px-10">
              <div className="bg-gradient-to-r from-white to-[#dbe2ef] rounded-2xl border border-[#a0e7e5] p-8 shadow-lg text-center">
                <p className="text-base sm:text-lg italic text-gray-700 mb-6">{testimonials[currentTestimonial].quote}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#a0e7e5] overflow-hidden flex-shrink-0">
                    <Image src={testimonials[currentTestimonial].image} alt={testimonials[currentTestimonial].name} width={80} height={80} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#112d4e]">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-[#3f72af] font-medium">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </div>
              <button onClick={handlePrevTestimonial} className="absolute top-1/2 -left-2 sm:-left-4 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#3f72af] rounded-full flex items-center justify-center text-white hover:bg-[#2d5a8f] transition-colors shadow-lg"><FiArrowLeft size={24} /></button>
              <button onClick={handleNextTestimonial} className="absolute top-1/2 -right-2 sm:-right-4 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#3f72af] rounded-full flex items-center justify-center text-white hover:bg-[#2d5a8f] transition-colors shadow-lg"><FiArrowRight size={24} /></button>
            </div>
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => ( <button key={index} onClick={() => setCurrentTestimonial(index)} className={`w-3 h-3 rounded-full transition-colors ${currentTestimonial === index ? 'bg-[#0057b7]' : 'bg-[#a0e7e5]'}`}></button>))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 lg:py-24 bg-gradient-to-r from-[#275081] via-[#3d72b3] to-[#22c55e]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Transform Your Career?</h2>
            <p className="text-lg text-[#dbe2ef] mb-12 max-w-3xl mx-auto">Join thousands of Ethiopians who are already mastering English and landing international opportunities.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="bg-[#a0e7e5] text-[#112d4e] px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:bg-white transition-all transform hover:scale-105">Start Free Trial</button>
              <button className="border-2 border-[#a0e7e5] text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors">Schedule Demo</button>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[#dbe2ef]">
              <span className="font-medium">✓ Free 7-day trial</span>
              <span className="font-medium">✓ No credit card required</span>
              <span className="font-medium">✓ Cancel anytime</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1e1e1e] py-16 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6"><div className="bg-gradient-to-r from-[#3f72af] to-[#a0e7e5] rounded-lg w-10 h-10 flex items-center justify-center"><span className="text-[#112d4e] font-bold text-xl">L</span></div><span className="text-xl font-bold text-white">LissanAI</span></div>
              <p className="mb-6 pr-4">Empowering Ethiopians to achieve global career success through AI-powered English coaching.</p>
              <div className="flex space-x-4"><a href="#" aria-label="Facebook" className="hover:text-white"><FiFacebook size={24} /></a><a href="#" aria-label="Twitter" className="hover:text-white"><FiTwitter size={24} /></a><a href="#" aria-label="LinkedIn" className="hover:text-white"><FiLinkedin size={24} /></a></div>
            </div>
            {Object.entries(footerSections).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-lg font-bold text-white mb-4 capitalize">{title}</h3>
                <ul className="space-y-3">
                  {links.map((item) => ( <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 pt-8"><p className="text-center text-gray-400">© {new Date().getFullYear()} LissanAI. All rights reserved. Made with ❤️ by A2SVIANS</p></div>
        </div>
      </footer>
    </div>
  );
}