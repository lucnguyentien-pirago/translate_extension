/**
 * Shared constants across the extension
 */

// Language mapping
export const LANGUAGE_NAMES = {
    'vi': 'Tiếng Việt',
    'en': 'Tiếng Anh',
    'fr': 'Tiếng Pháp',
    'de': 'Tiếng Đức',
    'ja': 'Tiếng Nhật',
    'ko': 'Tiếng Hàn',
    'zh-CN': 'Tiếng Trung (Giản thể)',
    'zh-TW': 'Tiếng Trung (Phồn thể)',
    'es': 'Tiếng Tây Ban Nha',
    'it': 'Tiếng Ý',
    'ru': 'Tiếng Nga',
    'pt': 'Tiếng Bồ Đào Nha',
    'ar': 'Tiếng Ả Rập',
    'hi': 'Tiếng Hindi',
    'th': 'Tiếng Thái'
};

// Language names for API use (English names)
export const API_LANGUAGE_NAMES = {
    'vi': 'Vietnamese',
    'en': 'English',
    'fr': 'French',
    'de': 'German',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh-CN': 'Simplified Chinese',
    'zh-TW': 'Traditional Chinese',
    'es': 'Spanish',
    'it': 'Italian',
    'ru': 'Russian',
    'pt': 'Portuguese',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'th': 'Thai'
};

// Default settings
export const DEFAULT_SETTINGS = {
    targetLang: 'vi',
    service: 'google',
    apiKey: '',
    chatGptModel: 'gpt-4o-mini'
};

// Debug flag (turn off in production)
export const DEBUG = false;

// API Endpoints
export const API_ENDPOINTS = {
    GOOGLE_DETECT: 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t',
    GOOGLE_TRANSLATE: 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&dt=t',
    OPENAI: 'https://api.openai.com/v1/chat/completions'
};

// Service descriptions
export const SERVICE_DESCRIPTIONS = {
    google: 'Google Translate dịch nhanh, miễn phí nhưng có thể thiếu chính xác với các thuật ngữ kỹ thuật.',
    openai: 'ChatGPT với gpt-4o-mini cung cấp khả năng dịch thuật chuyên nghiệp, đặc biệt hiệu quả với nội dung kỹ thuật và code. Yêu cầu API key.'
};

// Helper function for debugging
export function log(...args) {
    if (DEBUG) console.log(...args);
}
