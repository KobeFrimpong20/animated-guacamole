'use client';

import { useState } from 'react';
import SessionReportForm from "./components/SessionReportForm";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <div className="p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <button 
            onClick={() => setShowForm(false)}
            className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <SessionReportForm />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex flex-col items-start gap-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
          Welcome back, Kobe
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          What would you like to do today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => setShowForm(true)}
          className="group relative flex flex-col items-start p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-6 text-white dark:text-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Create a report</h3>
          <p className="text-zinc-500 dark:text-zinc-400">
            Generate and send a new session report to parents.
          </p>
          <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
