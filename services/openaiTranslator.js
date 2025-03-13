// services/openaiTranslator.js
import Translator from './translator.js';

class OpenAITranslator extends Translator {
  constructor(apiKey = null) {
    super();
    this.apiKey = apiKey;
  }

  async detectLanguage(text) {
    if (!this.apiKey) {
      throw new Error('API key is required for OpenAI services');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'developer',
              content: 'You are a language detection assistant. Respond with only the ISO language code (e.g., "en", "vi", "ja") of the text.'
            },
            {
              role: 'user',
              content: `Detect the language of this text: "${text}"`
            }
          ],
          max_tokens: 10
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      // Extract just the language code from response
      const langCode = data.choices[0].message.content.trim().match(/[a-z]{2}(-[A-Z]{2})?/)[0];
      return langCode;
    } catch (error) {
      console.error('Language detection error:', error);
      return null;
    }
  }

  async translate(text, targetLang = this.defaultTargetLang) {
    if (!this.apiKey) {
      throw new Error('API key is required for OpenAI services');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'developer',
              content: `You are a translation assistant. Translate the text to ${targetLang}. Respond with only the translated text, no explanations or additional text.`
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.3
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Translation error:', error);
      return 'Lỗi khi dịch văn bản: ' + error.message;
    }
  }
}

export default OpenAITranslator;