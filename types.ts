
export type ReviewSource = 'Google' | 'TripAdvisor' | 'TheFork' | 'Manual';

export type ReviewStatus = 'pending' | 'replied';

export type ReplyTone = 'formal' | 'informal' | 'friendly' | 'concise';

export type ReplyLanguage = 'it' | 'en' | 'de';

export type PhotoStyle = 'natural' | 'warm' | 'bright' | 'dramatic' | 'hdr';

export interface BrandIdentity {
  vision: string; // e.g. "We want to be the home for mountain lovers"
  values: string; // e.g. "Sustainability, Family warmth, Km0"
  history: string; // e.g. "Founded in 1950 by Grandpa Hans"
}

export interface Tenant {
  id: string;
  name: string;
  accessCode: string;
  planLimit: number; // Monthly generation limit
  planName: 'Basic' | 'Pro' | 'Enterprise';
  cuisineType?: string; // e.g. "Pizza & Tyrolean"
  location?: string; // e.g. "Bolzano"
  identity?: BrandIdentity;
}

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
  restaurantName: string; // Context for the AI
  brandIdentity?: BrandIdentity;
}

export interface ParsedReviewData {
  author: string;
  rating: number;
  text: string;
  source: ReviewSource;
  date?: string;
}

export interface OptimizationRequest {
  restaurantName: string;
  cuisineType: string;
  currentDescription?: string;
  location: string;
}

export interface OptimizationResult {
  optimizedDescription: string;
  keywords: string[];
  photoSuggestions: string[];
  menuSuggestions: string[];
}

export interface MenuDishRequest {
  dishName: string;
  ingredients?: string;
  style: 'gourmet' | 'rustic' | 'simple';
}

export interface GooglePostRequest {
  topic: 'event' | 'offer' | 'update';
  details: string;
  restaurantName: string;
}

export interface QnARequest {
  restaurantName: string;
  cuisineType: string;
}

export interface QnAPair {
  question: string;
  answer: string;
}