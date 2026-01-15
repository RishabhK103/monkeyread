'use client';

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useStore, Theme } from '@/store/useStore';
import {
    Palette,
    Settings as SettingsIcon,
    Eye,
    EyeOff,
    Zap,
    RotateCcw
} from 'lucide-react';

export const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const {
        setTheme,
        focusMode,
        setFocusMode,
        reset,
        readingConfig,
        updateReadingConfig,
        setSettingsOpen
    } = useStore();

    // Toggle the menu when ⌘K is pressed
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command: () => void) => {
        command();
        setOpen(false);
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            aria-labelledby="command-palette-title"
            aria-describedby="command-palette-description"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        >
            <div className="w-full max-w-xl bg-background border border-sub/20 rounded-xl shadow-2xl overflow-hidden glass">
                {/* Visually Hidden Title and Description for Accessibility */}
                <h2 id="command-palette-title" className="sr-only">Command Palette</h2>
                <p id="command-palette-description" className="sr-only">
                    Search for themes, toggle reading modes, and manage your session commands.
                </p>

                <Command.Input
                    placeholder="Type a command or search..."
                    className="w-full p-4 bg-transparent border-b border-sub/10 outline-none text-foreground font-mono placeholder:opacity-30"
                />
                <Command.List className="max-h-[300px] overflow-y-auto p-2 no-scrollbar">
                    <Command.Empty className="p-4 text-xs text-sub font-mono">No results found.</Command.Empty>

                    <Command.Group heading="Themes" className="p-2 text-[10px] uppercase tracking-widest text-sub/50 font-mono">
                        {(['monkeytype', 'serika-dark', 'carbon', 'matrix', 'nord'] as Theme[]).map((t) => (
                            <Command.Item
                                key={t}
                                onSelect={() => runCommand(() => setTheme(t))}
                                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-sub/5 transition-colors aria-selected:bg-sub/10 font-mono text-sm capitalize"
                            >
                                <Palette size={16} className="text-monkey" />
                                <span>{t.replace('-', ' ')}</span>
                            </Command.Item>
                        ))}
                    </Command.Group>

                    <Command.Group heading="Reading" className="p-2 mt-2 text-[10px] uppercase tracking-widest text-sub/50 font-mono border-t border-sub/5">
                        <Command.Item onSelect={() => runCommand(() => setFocusMode(!focusMode))} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-sub/5 transition-colors aria-selected:bg-sub/10 font-mono text-sm">
                            {focusMode ? <EyeOff size={16} /> : <Eye size={16} />}
                            <span>Toggle Focus Mode ({focusMode ? 'On' : 'Off'})</span>
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => updateReadingConfig({ bionicEnabled: !readingConfig.bionicEnabled }))} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-sub/5 transition-colors aria-selected:bg-sub/10 font-mono text-sm">
                            <Zap size={16} />
                            <span>Toggle Bionic Reading ({readingConfig.bionicEnabled ? 'On' : 'Off'})</span>
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => setSettingsOpen(true))} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-sub/5 transition-colors aria-selected:bg-sub/10 font-mono text-sm">
                            <SettingsIcon size={16} />
                            <span>Open Visual Settings</span>
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => reset())} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-sub/5 transition-colors aria-selected:bg-sub/10 font-mono text-sm">
                            <RotateCcw size={16} />
                            <span>Reset Progress</span>
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </div>
        </Command.Dialog>
    );
};
