import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReadingState {
    words: string[];
    currentIndex: number;
    wpm: number;
    isPlaying: boolean;
    totalWords: number;

    // Actions
    setWords: (words: string[]) => void;
    setWpm: (wpm: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setCurrentIndex: (index: number) => void;
    nextWord: () => void;
    prevWord: () => void;
    reset: () => void;
}

export const useStore = create<ReadingState>()(
    persist(
        (set) => ({
            words: [],
            currentIndex: 0,
            wpm: 300,
            isPlaying: false,
            totalWords: 0,

            setWords: (words) => set({ words, totalWords: words.length, currentIndex: 0, isPlaying: false }),
            setWpm: (wpm) => set({ wpm }),
            setIsPlaying: (isPlaying) => set({ isPlaying }),
            setCurrentIndex: (currentIndex) => set({ currentIndex }),
            nextWord: () => set((state) => ({
                currentIndex: Math.min(state.currentIndex + 1, state.totalWords - 1),
                isPlaying: state.currentIndex + 1 >= state.totalWords ? false : state.isPlaying
            })),
            prevWord: () => set((state) => ({
                currentIndex: Math.max(state.currentIndex - 1, 0)
            })),
            reset: () => set({ currentIndex: 0, isPlaying: false }),
        }),
        {
            name: 'monkeyread-storage',
            partialize: (state) => ({ wpm: state.wpm }),
        }
    )
);
