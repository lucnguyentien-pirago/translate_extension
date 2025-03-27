// services/openaiTranslator.js
import Translator from './translator.js';
import { API_LANGUAGE_NAMES, API_ENDPOINTS, log } from '../constants.js';

class OpenAITranslator extends Translator {
  constructor(apiKey = null) {
    super();
    this.apiKey = apiKey;
    this.model = 'gpt-4o-mini'; // Default model
  }

  // Helper method to make OpenAI API calls
  async #callOpenAI(messages, model = this.model) {
    if (!this.apiKey) {
      throw new Error('API key is required for OpenAI services');
    }

    const response = await fetch(API_ENDPOINTS.OPENAI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (errorData.error?.code === 'insufficient_quota') {
        throw new Error('Tài khoản OpenAI của bạn đã hết hạn mức sử dụng.');
      }

      throw new Error(errorData.error?.message || response.statusText);
    }

    return await response.json();
  }

  async detectLanguage(text) {
    try {
      const data = await this.#callOpenAI([
        {
          role: 'system',
          content: 'You are a language detection assistant. Respond with only the ISO language code (e.g., "en", "vi", "ja") of the text.'
        },
        {
          role: 'user',
          content: `Detect the language of this text: "${text}"`
        }
      ], 'gpt-4o-mini');

      // Extract just the language code from response
      const langCode = data.choices[0].message.content.trim().match(/[a-z]{2}(-[A-Z]{2})?/)[0];
      return langCode;
    } catch (error) {
      log('Language detection error:', error);
      return null;
    }
  }

  async translate(text, targetLang = this.defaultTargetLang) {
    try {
      const targetLanguage = API_LANGUAGE_NAMES[targetLang] || targetLang;

      const data = await this.#callOpenAI([
        {
          role: 'system',
          content: `You are a technical translator. Translate the following text to ${targetLanguage}. 

Rules:
1. Keep code syntax unchanged.
2. Translate code comments.
3. Translate naturally, not word-by-word.
4. Keep programming variables and keywords unchanged.
5. Preserve formatting (markdown, HTML tags, etc.).
6. Maintain all IT technical terms in their original English form (e.g., "instance method", "static method", "framework", "dependency injection", "middleware", etc.).
7. Do not translate technical programming concepts, design patterns, or technology names.
8. For acronyms like API, URL, HTTP, REST, etc., keep them in English.

Return ONLY the translation, no explanations.`
        },
        {
          role: 'user',
          content: text
        }
      ], this.model);

      return data.choices[0].message.content.trim();
    } catch (error) {
      log('Translation error:', error);
      return 'Lỗi khi dịch văn bản: ' + error.message;
    }
  }
}

export default OpenAITranslator;
