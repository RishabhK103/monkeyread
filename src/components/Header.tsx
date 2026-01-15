'use client';

import React from 'react';
import { Keyboard, Info, Command } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="w-full max-w-5xl px-8 py-12 flex items-center justify-between">
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 font-mono bg-monkey text-background flex items-center justify-center font-bold text-xl rounded">
                        M
                    </div>
                    <h1 className="text-2xl font-mono font-bold tracking-tight text-foreground">
                        monkey<span className="text-monkey">read</span>
                    </h1>
                </div>
                <span className="text-[10px] text-sub font-mono uppercase tracking-[0.2em] mt-1 ml-10">
                    speed reading simplified
                </span>
            </div>

            <div className="flex items-center gap-6 text-sub">
                <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-sub/5 rounded border border-sub/10">
                        <kbd className="text-[10px]">SPACE</kbd>
                        <span className="text-[10px] opacity-40">play/pause</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-sub/5 rounded border border-sub/10">
                        <kbd className="text-[10px]">R</kbd>
                        <span className="text-[10px] opacity-40">reset</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 border-l border-sub/20 pl-6">
                    <button className="hover:text-monkey transition-colors">
                        <Keyboard size={20} />
                    </button>
                    <button className="hover:text-monkey transition-colors">
                        <Command size={20} />
                    </button>
                    <button className="hover:text-monkey transition-colors">
                        <Info size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};
