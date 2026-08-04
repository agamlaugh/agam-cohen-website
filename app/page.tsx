"use client";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center p-8 font-sans">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl text-center space-y-6 mt-20 mb-32"
      >
        <h1 className="text-5xl font-bold tracking-tight text-white">
          Agam Rain Cohen
        </h1>
        <p className="text-xl text-neutral-400 font-mono">
          Software Engineer | BSc Computer Science '27
        </p>
        <p className="text-neutral-500 max-w-xl mx-auto">
          Specializing in systems-level programming, C++, operating systems, and memory management.
        </p>
        
        {/* Call to Action Buttons */}
        <div className="flex gap-4 justify-center pt-8">
          <a 
            href="https://github.com/agamlaugh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-neutral-200 transition-colors"
          >
            View GitHub
          </a>
          <a 
            href="/Agam_Cohen_CV_UK.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border border-neutral-700 px-6 py-3 rounded-md font-medium hover:bg-neutral-800 transition-colors"
          >
            Download CV
          </a>
        </div>
      </motion.div>

      {/* Projects Grid Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="max-w-5xl w-full space-y-8 pb-20"
      >
        <h2 className="text-2xl font-bold text-white border-b border-neutral-800 pb-4">
          Selected Projects
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Project Card 1: OS & Memory */}
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg hover:border-neutral-600 transition-colors flex flex-col h-full">
            <h3 className="text-xl font-bold text-white">C++ Operating System & Memory Management</h3>
            <p className="text-neutral-400 mt-2 text-xs font-mono">ANTICIPATED AUGUST 2026</p>
            <p className="text-neutral-300 mt-4 text-sm leading-relaxed flex-grow">
              [Placeholder: Detail architecture for core OS components and custom memory allocator implementation.]
            </p>
            <div className="pt-6 mt-auto">
                <span className="text-xs font-mono bg-neutral-800 text-neutral-300 px-2 py-1 rounded">C++</span>
            </div>
          </div>

          {/* Project Card 2: Networks */}
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg hover:border-neutral-600 transition-colors flex flex-col h-full">
            <h3 className="text-xl font-bold text-white">C++ Computer Communications</h3>
            <p className="text-neutral-400 mt-2 text-xs font-mono">ANTICIPATED AUGUST 2026</p>
            <p className="text-neutral-300 mt-4 text-sm leading-relaxed flex-grow">
              [Placeholder: Detail network protocols, socket programming, and concurrency models utilized for data transfer.]
            </p>
            <div className="pt-6 mt-auto">
                <span className="text-xs font-mono bg-neutral-800 text-neutral-300 px-2 py-1 rounded">C++</span>
            </div>
          </div>

        </div>
      </motion.div>

    </main>
  );
}