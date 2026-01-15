'use client';

import React, { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { processText } from '@/lib/rsvp-engine';
import { extractTextFromFile } from '@/lib/file-parser';
import { FileText, Type, Trash2, Loader2, UploadCloud } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export const InputArea: React.FC = () => {
    const { setWords, isPlaying } = useStore();
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
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

    const processFile = async (file: File) => {
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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const extension = file.name.split('.').pop()?.toLowerCase();
            if (['pdf', 'docx', 'doc', 'txt'].includes(extension || '')) {
                processFile(file);
            } else {
                alert('Unsupported file format');
            }
        }
    };

    if (isPlaying) return null;

    return (
        <div className="w-full max-w-3xl flex flex-col gap-6 px-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-sub font-mono font-medium">
                    <Type size={12} className="text-monkey" />
                    <span>Input Context</span>
                </div>
                <button
                    onClick={handleClear}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-sub/50 hover:text-red-400 transition-all font-mono"
                >
                    <Trash2 size={12} />
                    <span>Clear Area</span>
                </button>
            </div>

            <div
                className={`relative group transition-all duration-300 ${isDragging ? 'scale-[1.01]' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your text here or drop a file directly..."
                    className={`w-full h-60 bg-sub/5 border rounded-2xl p-8 font-mono text-sm focus:outline-none transition-all resize-none placeholder:text-sub/20 leading-relaxed ${isDragging
                        ? 'border-monkey bg-monkey/5 ring-4 ring-monkey/5'
                        : 'border-sub/10 focus:border-monkey/40 focus:bg-sub/10'
                        }`}
                />

                {/* Drag Overlay Cues */}
                <AnimatePresence>
                    {isDragging && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-monkey animate-in fade-in zoom-in-95 duration-200">
                            <UploadCloud size={48} className="text-monkey animate-bounce" />
                            <p className="mt-4 font-mono text-lg font-bold text-monkey">Drop to parse text</p>
                            <p className="text-xs text-sub font-mono">PDF, DOCX, TXT supported</p>
                        </div>
                    )}
                </AnimatePresence>

                <div className="absolute bottom-6 right-6 flex items-center gap-3">
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
                        className="flex items-center gap-2 px-4 py-2 bg-sub/10 hover:bg-sub/20 text-sub hover:text-foreground rounded-xl transition-all disabled:opacity-50 border border-sub/10"
                        title="Upload File (PDF, DOCX, TXT)"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                        <span className="text-xs font-mono hidden sm:inline">Upload</span>
                    </button>

                    <button
                        onClick={handleStart}
                        disabled={!text.trim() || isLoading}
                        className="group relative px-8 py-2 bg-monkey text-background font-mono font-black italic rounded-xl hover:bg-monkey/90 transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed active:scale-95 shadow-[0_0_15px_rgba(98,252,147,0.2)]"
                    >
                        <span className="relative z-10 tracking-widest">START READING</span>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-10 transition-opacity rounded-xl" />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-center gap-8 text-[10px] text-sub/30 font-mono uppercase tracking-[0.1em]">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <div className="w-1 h-1 rounded-full bg-monkey/40" />
                    Drag & Drop Files
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <div className="w-1 h-1 rounded-full bg-monkey/40" />
                    Auto PDF Parsing
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <div className="w-1 h-1 rounded-full bg-monkey/40" />
                    Word-Gallery enabled
                </div>
            </div>
        </div>
    );
};
