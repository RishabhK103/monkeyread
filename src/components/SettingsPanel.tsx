'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, Theme } from '@/store/useStore';
import {
    X,
    Palette,
    Type,
    Zap,
    Eye,
    Layout,
    Check,
    Minus,
    Plus
} from 'lucide-react';

export const SettingsPanel = () => {
    const {
        isSettingsOpen,
        setSettingsOpen,
        theme,
        setTheme,
        readingConfig,
        updateReadingConfig,
        fontConfig,
        updateFontConfig,
        focusMode,
        setFocusMode
    } = useStore();

    if (!isSettingsOpen) return null;

    const themes: { id: Theme; label: string; color: string }[] = [
        { id: 'monkeytype', label: 'Monkeytype', color: '#62fc93' },
        { id: 'serika-dark', label: 'Serika Dark', color: '#e2b714' },
        { id: 'carbon', label: 'Carbon', color: '#f66e0d' },
        { id: 'matrix', label: 'Matrix', color: '#00ff41' },
        { id: 'nord', label: 'Nord', color: '#88c0d0' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSettingsOpen(false)}
                className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-sm h-full bg-background border-l border-sub/10 shadow-2xl p-8 flex flex-col gap-8 glass overflow-y-auto no-scrollbar"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-mono font-bold flex items-center gap-2">
                        <Layout size={20} className="text-monkey" />
                        Settings
                    </h2>
                    <button
                        onClick={() => setSettingsOpen(false)}
                        className="p-2 hover:bg-sub/5 rounded-full transition-colors text-sub hover:text-foreground"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Theme Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-sub font-mono">
                        <Palette size={14} />
                        Themes
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${theme === t.id
                                        ? 'border-monkey bg-monkey/5 text-foreground'
                                        : 'border-sub/10 hover:border-sub/30 text-sub'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: t.color }} />
                                    <span className="font-mono text-sm capitalize">{t.label}</span>
                                </div>
                                {theme === t.id && <Check size={16} className="text-monkey" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Typography Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-sub font-mono">
                        <Type size={14} />
                        Typography
                    </div>

                    <div className="flex flex-col gap-6 p-4 bg-sub/5 rounded-2xl border border-sub/10">
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between text-xs font-mono text-sub">
                                <span>Font Size</span>
                                <span>{fontConfig.size}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => updateFontConfig({ size: Math.max(50, fontConfig.size - 10) })} className="p-1 hover:text-monkey transition-colors"><Minus size={14} /></button>
                                <input
                                    type="range"
                                    min="50" max="200" step="10"
                                    value={fontConfig.size}
                                    onChange={(e) => updateFontConfig({ size: parseInt(e.target.value) })}
                                    className="flex-1 h-1 bg-sub/20 rounded-lg appearance-none cursor-pointer accent-monkey"
                                />
                                <button onClick={() => updateFontConfig({ size: Math.min(200, fontConfig.size + 10) })} className="p-1 hover:text-monkey transition-colors"><Plus size={14} /></button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between text-xs font-mono text-sub">
                                <span>Font Weight</span>
                                <span>{fontConfig.weight}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => updateFontConfig({ weight: Math.max(300, fontConfig.weight - 100) })} className="p-1 hover:text-monkey transition-colors"><Minus size={14} /></button>
                                <input
                                    type="range"
                                    min="300" max="900" step="100"
                                    value={fontConfig.weight}
                                    onChange={(e) => updateFontConfig({ weight: parseInt(e.target.value) })}
                                    className="flex-1 h-1 bg-sub/20 rounded-lg appearance-none cursor-pointer accent-monkey"
                                />
                                <button onClick={() => updateFontConfig({ weight: Math.min(900, fontConfig.weight + 100) })} className="p-1 hover:text-monkey transition-colors"><Plus size={14} /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reading Modes Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-sub font-mono">
                        <Zap size={14} />
                        Reading Modes
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => updateReadingConfig({ bionicEnabled: !readingConfig.bionicEnabled })}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${readingConfig.bionicEnabled
                                    ? 'border-monkey bg-monkey/5 text-foreground'
                                    : 'border-sub/10 hover:border-sub/30 text-sub'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Zap size={18} className={readingConfig.bionicEnabled ? 'text-monkey' : ''} />
                                <div className="flex flex-col items-start">
                                    <span className="font-mono text-sm">Bionic Reading</span>
                                    <span className="text-[10px] opacity-50">Highlight first half of words</span>
                                </div>
                            </div>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${readingConfig.bionicEnabled ? 'bg-monkey' : 'bg-sub/20'}`}>
                                <div className={`absolute top-1 w-2 h-2 rounded-full bg-background transition-all ${readingConfig.bionicEnabled ? 'left-5' : 'left-1'}`} />
                            </div>
                        </button>

                        <button
                            onClick={() => setFocusMode(!focusMode)}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${focusMode
                                    ? 'border-monkey bg-monkey/5 text-foreground'
                                    : 'border-sub/10 hover:border-sub/30 text-sub'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Eye size={18} className={focusMode ? 'text-monkey' : ''} />
                                <div className="flex flex-col items-start">
                                    <span className="font-mono text-sm">Focus Mode</span>
                                    <span className="text-[10px] opacity-50">Auto-hide UI when playing</span>
                                </div>
                            </div>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${focusMode ? 'bg-monkey' : 'bg-sub/20'}`}>
                                <div className={`absolute top-1 w-2 h-2 rounded-full bg-background transition-all ${focusMode ? 'left-5' : 'left-1'}`} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-auto pt-8 text-[10px] text-sub/40 font-mono text-center">
                    Settings persist automatically.
                    <br />
                    Use <span className="text-sub/60">Cmd+K</span> for faster access.
                </div>
            </motion.div>
        </div>
    );
};
