
export interface AIJournalResponse {
    summary_emotion: string;
    content_refined: string;
    quote: string;
    key_points: string[];
    improvements: string[];
    hashtags: string[];
}

export interface JournalEntry {
    id: string;
    date: Date;
    title: string;
    originalContent: string;
    aiData?: AIJournalResponse;
    mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'tired';
    image?: string; // Optional image URL
}
