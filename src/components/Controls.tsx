'use client';

import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const Controls: React.FC = () => {
    const {
        isPlaying,
        setIsPlaying,
        wpm,
        setWpm,
        reset,
        currentIndex,
        totalWords,
        stats
    } = useStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in a text area or input
            if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

            if (e.code === 'Space') {
                e.preventDefault();
                setIsPlaying(!isPlaying);
            } else if (e.code === 'ArrowUp') {
                e.preventDefault();
                setWpm(Math.min(wpm + 25, 2000));
            } else if (e.code === 'ArrowDown') {
                e.preventDefault();
                setWpm(Math.max(wpm - 25, 50));
            } else if (e.key === 'r') {
                reset();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, setIsPlaying, wpm, setWpm, reset]);

    const progress = totalWords > 0 ? (currentIndex / totalWords) * 100 : 0;

    return (
        <div className="flex flex-col items-center gap-10 w-full max-w-3xl px-6 py-10 bg-sub/5 rounded-3xl border border-sub/10 glass transition-all duration-500">

            {/* Main Controls Row */}
            <div className="flex items-center justify-between w-full">
                {/* Stats / Progress */}
                <div className="flex flex-col gap-1 min-w-[100px]">
                    <span className="text-[10px] uppercase tracking-widest text-sub font-mono">Progress</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-mono font-bold text-foreground">{Math.round(progress)}%</span>
                        <span className="text-[10px] text-sub/50 font-mono">({currentIndex}/{totalWords})</span>
                    </div>
                </div>

                {/* Playback Circle */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => reset()}
                        className="p-3 text-sub hover:text-monkey transition-all hover:bg-monkey/5 rounded-full"
                        title="Reset (R)"
                    >
                        <RotateCcw size={20} />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="group relative w-18 h-18 flex items-center justify-center bg-monkey text-background rounded-full hover:scale-105 transition-all active:scale-95 shadow-[0_0_20px_rgba(98,252,147,0.3)]"
                        title="Play/Pause (Space)"
                    >
                        <div className="absolute inset-0 rounded-full bg-monkey blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
                        {isPlaying ? <Pause size={30} fill="currentColor" className="relative" /> : <Play size={30} className="ml-1 relative" fill="currentColor" />}
                    </button>

                    <div className="w-11" /> {/* Spacer to balance */}
                </div>

                {/* Session Stats */}
                <div className="flex flex-col items-end gap-1 min-w-[100px]">
                    <span className="text-[10px] uppercase tracking-widest text-sub font-mono">Session</span>
                    <div className="flex items-center gap-1.5 text-monkey">
                        <Zap size={12} className="fill-monkey/20" />
                        <span className="text-xl font-mono font-bold">{stats.sessionWordCount}</span>
                        <span className="text-[10px] text-sub/50 font-mono">words</span>
                    </div>
                </div>
            </div>

            {/* WPM Adjustment Panel */}
            <div className="w-full flex flex-col gap-6 pt-6 border-t border-sub/5">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setWpm(Math.max(wpm - 25, 50))}
                            className="p-2 bg-sub/10 rounded-lg text-sub hover:text-foreground hover:bg-sub/20 transition-all"
                        >
                            <Minus size={18} />
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-mono font-bold text-foreground tabular-nums">
                                {wpm}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-sub font-medium">words per minute</span>
                        </div>
                        <button
                            onClick={() => setWpm(Math.min(wpm + 25, 2000))}
                            className="p-2 bg-sub/10 rounded-lg text-sub hover:text-foreground hover:bg-sub/20 transition-all"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="hidden sm:flex flex-col items-end gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-sub font-mono">Reading Level</span>
                        <span className="text-xs font-mono text-monkey px-2 py-0.5 bg-monkey/10 rounded-md border border-monkey/20">
                            {wpm < 300 ? 'Relaxed' : wpm < 500 ? 'Steady' : wpm < 800 ? 'Advanced' : 'Superhuman'}
                        </span>
                    </div>
                </div>

                {/* Range Slider Container */}
                <div className="relative w-full px-2">
                    <input
                        type="range"
                        min="50"
                        max="1000"
                        step="25"
                        value={wpm}
                        onChange={(e) => setWpm(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-sub/10 rounded-lg appearance-none cursor-pointer accent-monkey hover:accent-monkey/80 transition-all"
                    />
                    <div className="flex justify-between w-full mt-3 text-[9px] font-mono text-sub/40 uppercase tracking-widest">
                        <span>50</span>
                        <span>250</span>
                        <span>500</span>
                        <span>750</span>
                        <span>1000+</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
