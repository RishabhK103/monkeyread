export interface WordInfo {
    word: string;
    pivotIndex: number;
    delayFactor: number;
}

export const calculateORP = (word: string): number => {
    const length = word.length;
    if (length <= 1) return 0;
    if (length <= 5) return 1;
    if (length <= 9) return 2;
    if (length <= 13) return 3;
    return 4;
};

export const getDelayFactor = (word: string): number => {
    if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) return 2.5;
    if (word.endsWith(',') || word.endsWith(';') || word.endsWith(':')) return 1.5;
    if (word.length > 8) return 1.2;
    return 1;
};

export const processText = (text: string): string[] => {
    return text
        .split(/\s+/)
        .filter((word) => word.length > 0);
};

export const getWordInfo = (word: string): WordInfo => {
    return {
        word,
        pivotIndex: calculateORP(word),
        delayFactor: getDelayFactor(word),
    };
};
