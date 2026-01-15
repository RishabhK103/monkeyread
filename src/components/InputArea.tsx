'use client';

import React, { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { processText } from '@/lib/rsvp-engine';
import { extractTextFromFile } from '@/lib/file-parser';
import { FileText, Type, Trash2, Loader2 } from 'lucide-react';

export const InputArea: React.FC = () => {
    const { setWords, isPlaying } = useStore();
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleStart = () => {
        if (text.trim()) {
            const words = processText(text);
            setWords(words);
        }
    };

    const handleClear = () => {
        setText('');
        setWords([]);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        try {
            const extractedText = await extractTextFromFile(file);
            setText(extractedText);
        } catch (error) {
            console.error('Failed to extract text:', error);
            alert('Failed to parse file. Please try again.');
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (isPlaying) return null;

    return (
        <div className="w-full max-w-3xl flex flex-col gap-4 px-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-sub">
                <div className="flex items-center gap-2">
                    <Type size={14} />
                    <span>Input Text</span>
                </div>
                <button
                    onClick={handleClear}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                    <Trash2 size={12} />
                    <span>Clear</span>
                </button>
            </div>

            <div className="relative">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your text here or drop a file..."
                    className="w-full h-48 bg-sub/5 border border-sub/10 rounded-xl p-6 font-mono text-sm focus:outline-none focus:border-monkey/30 transition-all resize-none placeholder:text-sub/30"
                />

                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".pdf,.docx,.doc,.txt"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="p-2 text-sub hover:text-foreground transition-colors disabled:opacity-50"
                        title="Upload File (PDF, DOCX, TXT)"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
                    </button>

                    <button
                        onClick={handleStart}
                        disabled={!text.trim() || isLoading}
                        className="px-6 py-2 bg-monkey text-background font-mono font-bold rounded-lg hover:bg-monkey/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                    >
                        START
                    </button>
                </div>
            </div>

            <div className="text-[10px] text-sub/40 font-mono text-center">
                Tip: Paste text or upload <span className="text-sub/60">PDF / DOCX / TXT</span>. Press <span className="text-sub/60">START</span> to load it into the reader.
            </div>
        </div>
    );
};
