'use client';

import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const Controls: React.FC = () => {
    const { isPlaying, setIsPlaying, wpm, setWpm, reset, currentIndex, totalWords } = useStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setIsPlaying(!isPlaying);
            } else if (e.code === 'ArrowUp') {
                setWpm(Math.min(wpm + 25, 2000));
            } else if (e.code === 'ArrowDown') {
                setWpm(Math.max(wpm - 25, 50));
            } else if (e.key === 'r') {
                reset();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, setIsPlaying, wpm, setWpm, reset]);

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl px-4 py-8">
            {/* Playback Controls */}
            <div className="flex items-center gap-6">
                <button
                    onClick={() => reset()}
                    className="p-2 text-sub hover:text-foreground transition-colors"
                    title="Reset (R)"
                >
                    <RotateCcw size={20} />
                </button>

                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 flex items-center justify-center bg-monkey/10 text-monkey rounded-full hover:bg-monkey/20 transition-all active:scale-95"
                    title="Play/Pause (Space)"
                >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
                </button>

                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* WPM and Settings */}
            <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setWpm(Math.max(wpm - 25, 50))}
                        className="p-1 text-sub hover:text-foreground transition-colors"
                    >
                        <Minus size={16} />
                    </button>

                    <div className="flex flex-col items-center min-w-[100px]">
                        <span className="text-3xl font-mono font-bold text-foreground">
                            {wpm}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-sub">wpm</span>
                    </div>

                    <button
                        onClick={() => setWpm(Math.min(wpm + 25, 2000))}
                        className="p-1 text-sub hover:text-foreground transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* WPM Slider (Custom Styled) */}
                <input
                    type="range"
                    min="50"
                    max="1000"
                    step="25"
                    value={wpm}
                    onChange={(e) => setWpm(parseInt(e.target.value))}
                    className="w-full h-1 bg-sub/20 rounded-lg appearance-none cursor-pointer accent-monkey hover:accent-monkey/80 transition-all"
                />

                <div className="flex justify-between w-full text-[10px] font-mono text-sub/50 uppercase tracking-tighter">
                    <span>slow</span>
                    <span>normal</span>
                    <span>fast</span>
                    <span>god speed</span>
                </div>
            </div>
        </div>
    );
};
