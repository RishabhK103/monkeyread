'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { getWordInfo } from '@/lib/rsvp-engine';

export const ReadingViewport: React.FC = () => {
    const {
        words,
        currentIndex,
        isPlaying,
        nextWord,
        wpm,
        setCurrentIndex,
        readingConfig,
        fontConfig
    } = useStore();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const galleryRef = useRef<HTMLDivElement>(null);

    // Memoize word info with bionic support
    const currentWordInfo = useMemo(() => {
        if (!words[currentIndex]) return null;
        return getWordInfo(words[currentIndex], readingConfig.bionicEnabled);
    }, [words, currentIndex, readingConfig.bionicEnabled]);

    // Windowing for the gallery
    const WINDOW_SIZE = 15;
    const galleryWindow = useMemo(() => {
        const start = Math.max(0, currentIndex - WINDOW_SIZE);
        const end = Math.min(words.length, currentIndex + WINDOW_SIZE + 1);
        return words.slice(start, end).map((word, idx) => ({
            word,
            originalIndex: start + idx
        }));
    }, [words, currentIndex]);

    useEffect(() => {
        if (galleryRef.current) {
            const activeElement = galleryRef.current.querySelector(`[data-index="${currentIndex}"]`) as HTMLElement;
            if (activeElement) {
                galleryRef.current.scrollTo({
                    left: activeElement.offsetLeft - galleryRef.current.offsetWidth / 2 + activeElement.offsetWidth / 2,
                    behavior: 'auto'
                });
            }
        }
    }, [currentIndex]);

    useEffect(() => {
        if (isPlaying && currentIndex < words.length) {
            const baseDelay = (60 * 1000) / wpm;
            const delay = baseDelay * (currentWordInfo?.delayFactor || 1);

            timerRef.current = setTimeout(() => {
                nextWord();
            }, delay);
        } else {
            if (timerRef.current) clearTimeout(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isPlaying, currentIndex, words, wpm, nextWord, currentWordInfo]);

    if (!words || words.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-sub italic font-mono">
                paste text below to start
            </div>
        );
    }

    const { word, pivotIndex, bionicWord } = currentWordInfo || { word: '', pivotIndex: 0 };

    // Split the word for ORP highlighting
    const beforePivot = word.substring(0, pivotIndex);
    const pivot = word[pivotIndex];
    const afterPivot = word.substring(pivotIndex + 1);

    // Apply font configuration
    const viewportStyle = {
        fontFamily: fontConfig.family,
        fontSize: `${fontConfig.size}%`,
        fontWeight: fontConfig.weight
    };

    return (
        <div className="relative flex flex-col items-center justify-center w-full gap-16 overflow-hidden">

            {/* Main RSVP Display */}
            <div className="relative h-40 flex items-center justify-center w-full" style={viewportStyle}>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[1px] h-20 bg-monkey/20" />
                </div>

                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.05 }}
                    className="text-6xl md:text-8xl font-mono tracking-tight flex items-center justify-center w-full select-none"
                    style={{ willChange: 'transform, opacity' }}
                >
                    <div className="flex-1 text-right text-foreground">
                        {readingConfig.bionicEnabled && bionicWord ? (
                            <>
                                <span className="font-bold">{bionicWord.bold.substring(0, pivotIndex)}</span>
                                {bionicWord.bold.length <= pivotIndex ? bionicWord.rest.substring(0, pivotIndex - bionicWord.bold.length) : ''}
                                {beforePivot.substring(Math.max(bionicWord.bold.length, 0))}
                            </>
                        ) : beforePivot}
                    </div>

                    <div className="text-monkey glow-green px-[1px] relative">
                        {readingConfig.bionicEnabled && bionicWord && pivotIndex < bionicWord.bold.length ? (
                            <span className="font-bold">{pivot}</span>
                        ) : pivot}
                    </div>

                    <div className="flex-1 text-left text-foreground">
                        {readingConfig.bionicEnabled && bionicWord ? (
                            <>
                                {pivotIndex + 1 < bionicWord.bold.length ? (
                                    <span className="font-bold">{bionicWord.bold.substring(pivotIndex + 1)}</span>
                                ) : null}
                                <span>{word.substring(Math.max(pivotIndex + 1, bionicWord.bold.length))}</span>
                            </>
                        ) : afterPivot}
                    </div>
                </motion.div>
            </div>

            {/* Word Gallery Slider */}
            <div className="w-full flex flex-col items-center gap-4">
                <div
                    ref={galleryRef}
                    className="w-full h-16 overflow-hidden flex items-center gap-6 px-[50%] no-scrollbar select-none"
                >
                    {galleryWindow.map(({ word, originalIndex }) => (
                        <span
                            key={`${word}-${originalIndex}`}
                            data-index={originalIndex}
                            onClick={() => setCurrentIndex(originalIndex)}
                            className={cn(
                                "cursor-pointer font-mono whitespace-nowrap text-lg transition-all duration-150 py-2",
                                originalIndex === currentIndex
                                    ? "text-monkey scale-125 opacity-100"
                                    : "text-foreground opacity-20 hover:opacity-40"
                            )}
                        >
                            {word}
                        </span>
                    ))}
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full max-w-2xl h-[1px] bg-sub/10 relative">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-monkey shadow-[0_0_8px_rgba(var(--monkey-rgb), 0.5)]"
                        initial={false}
                        animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </div>
            </div>
        </div>
    );
};

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
