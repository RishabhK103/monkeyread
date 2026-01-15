'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import {
    Keyboard,
    Zap,
    Settings as SettingsIcon,
    Command as CommandIcon
} from 'lucide-react';

export const Header: React.FC = () => {
    const { setSettingsOpen } = useStore();

    return (
        <header className="w-full max-w-5xl px-8 py-10 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-default">
                <div className="relative">
                    <Zap className="w-8 h-8 text-monkey fill-monkey/20 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-monkey blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-mono font-bold tracking-tighter text-foreground">
                        Monkey<span className="text-monkey">Read</span>
                    </h1>
                    <span className="text-[10px] font-mono text-sub uppercase tracking-[0.2em] opacity-50">
                        Fast As Hell.
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-8 text-sub font-mono text-[10px] uppercase tracking-widest">
                    <div className="flex items-center gap-2 group hover:text-foreground transition-colors">
                        <Keyboard size={14} className="group-hover:text-monkey transition-colors" />
                        <span className="px-1.5 py-0.5 rounded bg-sub/10 border border-sub/10 text-foreground/80">space</span>
                        <span>play</span>
                    </div>
                    <div className="flex items-center gap-2 group hover:text-foreground transition-colors">
                        <CommandIcon size={14} className="group-hover:text-monkey transition-colors" />
                        <span className="px-1.5 py-0.5 rounded bg-sub/10 border border-sub/10 text-foreground/80">K</span>
                        <span>commands</span>
                    </div>
                </div>

                <div className="h-4 w-[1px] bg-sub/10 hidden md:block" />

                <button
                    onClick={() => setSettingsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sub/5 border border-sub/10 hover:border-monkey/30 hover:bg-monkey/5 transition-all group"
                >
                    <SettingsIcon size={18} className="text-sub group-hover:text-monkey transition-colors" />
                    <span className="text-xs font-mono text-sub group-hover:text-foreground transition-colors hidden sm:inline">Settings</span>
                </button>
            </div>
        </header>
    );
};
