import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'serika-dark' | 'carbon' | 'matrix' | 'nord' | 'monkeytype';

interface FontConfig {
    family: string;
    size: number;
    weight: number;
}

interface ReadingConfig {
    bionicEnabled: boolean;
    wordChunkSize: number;
}

interface Stats {
    sessionWordCount: number;
    totalWordsRead: number;
}

interface ReadingState {
    // Core Reading State
    words: string[];
    currentIndex: number;
    wpm: number;
    isPlaying: boolean;
    totalWords: number;

    // UI/UX Customization
    theme: Theme;
    focusMode: boolean;
    isSettingsOpen: boolean;
    fontConfig: FontConfig;
    readingConfig: ReadingConfig;

    // Stats
    stats: Stats;

    // Actions
    setWords: (words: string[]) => void;
    setWpm: (wpm: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setCurrentIndex: (index: number) => void;
    nextWord: () => void;
    prevWord: () => void;
    reset: () => void;

    // New Actions
    setTheme: (theme: Theme) => void;
    setFocusMode: (enabled: boolean) => void;
    setSettingsOpen: (open: boolean) => void;
    updateFontConfig: (config: Partial<FontConfig>) => void;
    updateReadingConfig: (config: Partial<ReadingConfig>) => void;
    incrementStats: (wordCount: number) => void;
}

export const useStore = create<ReadingState>()(
    persist(
        (set) => ({
            words: [],
            currentIndex: 0,
            wpm: 300,
            isPlaying: false,
            totalWords: 0,

            theme: 'monkeytype',
            focusMode: false,
            isSettingsOpen: false,
            fontConfig: {
                family: 'var(--font-jetbrains-mono)',
                size: 100, // percentage
                weight: 500,
            },
            readingConfig: {
                bionicEnabled: false,
                wordChunkSize: 1,
            },
            stats: {
                sessionWordCount: 0,
                totalWordsRead: 0,
            },

            setWords: (words) => set({ words, totalWords: words.length, currentIndex: 0, isPlaying: false }),
            setWpm: (wpm) => set({ wpm }),
            setIsPlaying: (isPlaying) => set({ isPlaying }),
            setCurrentIndex: (currentIndex) => set({ currentIndex }),
            nextWord: () => set((state) => {
                const isLastWord = state.currentIndex + 1 >= state.totalWords;
                return {
                    currentIndex: Math.min(state.currentIndex + 1, state.totalWords - 1),
                    isPlaying: isLastWord ? false : state.isPlaying,
                    stats: isLastWord ? state.stats : {
                        ...state.stats,
                        sessionWordCount: state.stats.sessionWordCount + 1,
                        totalWordsRead: state.stats.totalWordsRead + 1
                    }
                };
            }),
            prevWord: () => set((state) => ({
                currentIndex: Math.max(state.currentIndex - 1, 0)
            })),
            reset: () => set({ currentIndex: 0, isPlaying: false }),

            setTheme: (theme) => set({ theme }),
            setFocusMode: (focusMode) => set({ focusMode }),
            setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
            updateFontConfig: (config) => set((state) => ({ fontConfig: { ...state.fontConfig, ...config } })),
            updateReadingConfig: (config) => set((state) => ({ readingConfig: { ...state.readingConfig, ...config } })),
            incrementStats: (wordCount) => set((state) => ({
                stats: {
                    ...state.stats,
                    totalWordsRead: state.stats.totalWordsRead + wordCount
                }
            })),
        }),
        {
            name: 'monkeyread-storage-v2',
            partialize: (state) => ({
                wpm: state.wpm,
                theme: state.theme,
                fontConfig: state.fontConfig,
                readingConfig: state.readingConfig,
                stats: { totalWordsRead: state.stats.totalWordsRead }
            }),
        }
    )
);
