// Import utilities and constants
import { log, DEFAULT_SETTINGS } from './constants.js';
import { splitTextForTranslation } from './utils.js';

// Import translator services
import GoogleTranslator from './services/googleTranslate.js';
import OpenAITranslator from './services/openaiTranslator.js';

// Initialize translators
const googleTranslator = new GoogleTranslator();
let openaiTranslator = null;

log('Quick Translator: Background script loaded');

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log('Message received:', request.action);

  if (request.action === 'translate') {
    chrome.storage.sync.get(DEFAULT_SETTINGS, async function(items) {
      log('Settings:', {
        targetLang: items.targetLang,
        service: items.service,
        apiKey: items.apiKey ? '[PRESENT]' : '[MISSING]',
        model: items.chatGptModel
      });

      try {
        let translatedText = '';
        let detectedLang = null;

        // Detect language (use Google's detection regardless of service)
        detectedLang = await googleTranslator.detectLanguage(request.text);

        // Translate using the selected service
        if (items.service === 'google') {
          if (request.text.length > 1000) {
            const textChunks = splitTextForTranslation(request.text);
            const translatedChunks = [];

            for (const chunk of textChunks) {
              const translated = await googleTranslator.translate(chunk, items.targetLang);
              translatedChunks.push(translated);
            }

            translatedText = translatedChunks.join(' ');
          } else {
            translatedText = await googleTranslator.translate(request.text, items.targetLang);
          }
        } else if (items.service === 'openai') {
          if (!items.apiKey) {
            translatedText = 'Lỗi: Thiếu OpenAI API Key. Vui lòng cung cấp API Key trong phần cài đặt.';
          } else {
            // Create or update the OpenAI translator with current API key
            if (!openaiTranslator || openaiTranslator.apiKey !== items.apiKey) {
              openaiTranslator = new OpenAITranslator(items.apiKey);
            }

            // Set the model before translating
            openaiTranslator.model = items.chatGptModel;
            translatedText = await openaiTranslator.translate(request.text, items.targetLang);
          }
        } else {
          translatedText = 'Không thể dịch - Dịch vụ không hợp lệ';
        }

        sendResponse({
          originalText: request.text,
          translatedText: translatedText,
          detectedLang: detectedLang,
          targetLang: items.targetLang,
          service: items.service
        });
      } catch (error) {
        log('Translation error:', error);
        sendResponse({
          originalText: request.text,
          translatedText: 'Lỗi xử lý: ' + error.message,
          detectedLang: null,
          targetLang: items.targetLang,
          service: items.service
        });
      }
    });

    return true; // Keep connection open for async response
  }
});

log('Quick Translator: Background script initialized');
