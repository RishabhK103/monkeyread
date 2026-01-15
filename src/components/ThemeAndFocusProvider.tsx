'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Header } from '@/components/Header';
import { CommandPalette } from '@/components/CommandPalette';
import { SettingsPanel } from '@/components/SettingsPanel';
import { AnimatePresence, motion } from 'framer-motion';

export const ThemeAndFocusProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme, focusMode, isPlaying } = useStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Apply theme to html tag
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    if (!mounted) return <>{children}</>;

    const hideUI = focusMode && isPlaying;

    return (
        <div
            className={cn(
                "min-h-screen flex flex-col items-center bg-background text-foreground transition-all duration-700 ease-in-out relative overflow-hidden",
                isPlaying && "bg-opacity-95"
            )}
        >
            {/* Ambient Background Glow */}
            <AnimatePresence>
                {isPlaying && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.08 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 pointer-events-none bg-monkey blur-[120px] z-0"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!hideUI && (
                    <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full flex justify-center z-10"
                    >
                        <Header />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 w-full flex flex-col items-center z-10">
                {children}
            </div>

            <AnimatePresence>
                {!hideUI && (
                    <motion.footer
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="w-full max-w-5xl px-8 py-12 flex items-center justify-between text-sub font-mono text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity z-10"
                    >
                        <div className="flex items-center gap-4">
                            <a href="https://github.com" target="_blank" className="hover:text-monkey transition-colors">github</a>
                            <a href="https://twitter.com" target="_blank" className="hover:text-monkey transition-colors">twitter</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>v1.2.0</span>
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-monkey animate-pulse" />
                                <span>online</span>
                            </div>
                        </div>
                    </motion.footer>
                )}
            </AnimatePresence>

            <CommandPalette />

            <AnimatePresence>
                <SettingsPanel />
            </AnimatePresence>
        </div>
    );
};

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
