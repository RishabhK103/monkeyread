'use client';

import { Header } from '@/components/Header';
import { ReadingViewport } from '@/components/ReadingViewport';
import { Controls } from '@/components/Controls';
import { InputArea } from '@/components/InputArea';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-background text-foreground transition-colors duration-500">
      <Header />

      <div className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center gap-12 py-20 animate-in fade-in duration-1000">
        <ReadingViewport />
        <Controls />
        <InputArea />
      </div>

      <footer className="w-full max-w-5xl px-8 py-12 flex items-center justify-between text-sub font-mono text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-monkey transition-colors">github</a>
          <a href="#" className="hover:text-monkey transition-colors">twitter</a>
          <a href="#" className="hover:text-monkey transition-colors">terms</a>
        </div>
        <div className="flex items-center gap-4">
          <span>v1.0.0</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-monkey animate-pulse" />
            <span>online</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
