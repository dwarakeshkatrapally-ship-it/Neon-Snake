/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#07070a] text-gray-100 flex flex-col pt-8 pb-12 px-4 md:px-8 overflow-x-hidden relative selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#07070a] to-[#07070a]" />
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500" />
      
      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-center md:justify-start gap-4 mb-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-600 flex items-center justify-center shadow-[0_0_20px_theme('colors.fuchsia.500/40')]">
          <Gamepad2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-300 drop-shadow-sm uppercase">Neon Snake</h1>
          <p className="text-fuchsia-500/80 font-mono text-xs tracking-widest uppercase mt-1">& Synth Engine</p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 xl:gap-20">
        
        {/* Left/Top: Music Player */}
        <section className="w-full lg:w-1/3 flex-shrink-0 animate-[fadeIn_0.5s_ease-out]">
          <div className="sticky top-8">
            <h2 className="font-mono text-sm uppercase tracking-widest text-cyan-500 mb-4 flex items-center gap-2">
              <span className="w-full h-[1px] bg-gradient-to-r from-transparent to-cyan-500/30"></span>
              Audio_System
            </h2>
            <MusicPlayer />
          </div>
        </section>

        {/* Center/Right: Game Board */}
        <section className="w-full lg:w-2/3 max-w-2xl animate-[fadeIn_0.7s_ease-out]">
          <h2 className="font-mono text-sm uppercase tracking-widest text-fuchsia-500 mb-4 flex items-center gap-2">
            Game_Terminal
            <span className="w-full h-[1px] bg-gradient-to-l from-transparent to-fuchsia-500/30"></span>
          </h2>
          <SnakeGame />
        </section>

      </main>
      
      {/* Footer */}
      <footer className="mt-auto pt-16 pb-4 w-full text-center relative z-10 opacity-50 font-mono text-xs">
        <p>SYSTEM.VERSION 1.0.0 // AI GENERATED EXPERIMENT</p>
      </footer>
    </div>
  );
}
