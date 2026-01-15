import * as mammoth from 'mammoth';

export const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
        // Dynamically import pdfjs-dist
        const pdfjs = await import('pdfjs-dist');

        // Version 5.4.530 requires a modern module worker (.mjs)
        // unpkg is generally more reliable for exact file paths in the npm package
        const VERSION = pdfjs.version;
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${VERSION}/build/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({
            data: arrayBuffer,
            // Use fake worker if the main one fails to load
            stopAtErrors: false
        });

        const pdf = await loadingTask.promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');

            text += pageText + '\n';
        }

        return text;
    } catch (error: any) {
        console.error('PDF parsing error:', error);

        // Fallback or more descriptive error
        if (error.message?.includes('worker')) {
            throw new Error('PDF worker failed to load. Please check your internet connection or try a different browser.');
        }
        throw error;
    }
};

export const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

export const extractTextFromFile = async (file: File): Promise<string> => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
        return await extractTextFromPdf(file);
    } else if (extension === 'docx' || extension === 'doc') {
        return await extractTextFromDocx(file);
    } else if (extension === 'txt') {
        return await file.text();
    } else {
        throw new Error('Unsupported file format');
    }
};
