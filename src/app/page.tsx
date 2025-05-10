'use client';

import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import MultiStepForm from "@/components/MultiStepForm";

const themes = [
  { value: 'system', icon: ComputerDesktopIcon, label: 'System' },
  { value: 'light', icon: SunIcon, label: 'Light' },
  { value: 'dark', icon: MoonIcon, label: 'Dark' },
];

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Logo and Theme Toggle */}
      <header className="flex justify-between items-center mb-12">
        <div className="w-48 h-12 relative">
          {/* Logo with dark mode support */}
          <div className="w-full h-full relative">
            <Image
              src="/images/website-factory-logo-text-bright-blue.png"
              alt="Website Factory Logo"
              fill
              className="object-contain dark:hidden"
              priority
            />
            <Image
              src="/images/website-factory-logo-text-white.png"
              alt="Website Factory Logo"
              fill
              className="object-contain hidden dark:block"
              priority
            />
          </div>
        </div>
        {/* Theme Switcher */}
        <div className="flex items-center">
          <div className="flex bg-transparent border border-gray-400/60 dark:border-gray-600/60 rounded-full p-1 gap-1 shadow-sm">
            {themes.map(({ value, icon: Icon, label }) => {
              const highlight =
                (value === 'system' && theme === 'system') ||
                (value === 'light' && theme === 'light') ||
                (value === 'dark' && theme === 'dark');
              return (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  aria-label={label}
                  className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer
                    ${highlight ? 'bg-gray-300 dark:bg-gray-700' : 'bg-transparent'}
                    ${highlight ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-black rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
        <MultiStepForm />
      </div>
    </div>
  );
}
