'use client';

import { ReadingViewport } from '@/components/ReadingViewport';
import { Controls } from '@/components/Controls';
import { InputArea } from '@/components/InputArea';

export default function Home() {
  return (
    <div className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center gap-12 py-20 animate-in fade-in duration-1000">
      <ReadingViewport />
      <Controls />
      <InputArea />
    </div>
  );
}
