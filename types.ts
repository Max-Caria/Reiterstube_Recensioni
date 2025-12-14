
export type ReviewSource = 'Google' | 'TripAdvisor' | 'TheFork' | 'Manual';

export type ReviewStatus = 'pending' | 'replied';

export type ReplyTone = 'formal' | 'informal' | 'friendly' | 'concise';

export type ReplyLanguage = 'it' | 'en' | 'de';

export interface Review {
  id: string;
  source: ReviewSource;
  author: string;
  rating: number; // 1-5
  text: string;
  date: string;
  reply?: string;
  status: ReviewStatus;
}

export interface ReplyGenerationRequest {
  reviewText: string;
  authorName: string;
  rating: number;
  tone: ReplyTone;
  language: ReplyLanguage;
}

export interface ParsedReviewData {
  author: string;
  rating: number;
  text: string;
  source: ReviewSource;
  date?: string;
}
