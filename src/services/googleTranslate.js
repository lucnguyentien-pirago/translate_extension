import Translator from './translator.js';
import { API_ENDPOINTS, log } from '../constants.js';

class GoogleTranslator extends Translator {
  // Helper method to fetch Google Translate API
  async #fetchGoogleApi(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Network response error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async detectLanguage(text) {
    try {
      const url = `${API_ENDPOINTS.GOOGLE_DETECT}&q=${encodeURIComponent(text)}`;
      const data = await this.#fetchGoogleApi(url);

      if (data && data[2]) {
        return data[2];
      }

      log('Language detection failed, unexpected structure');
      return null;
    } catch (error) {
      console.error('Language detection error:', error);
      return null;
    }
  }

  async translate(text, targetLang = this.defaultTargetLang) {
    try {
      const url = `${API_ENDPOINTS.GOOGLE_TRANSLATE}&tl=${targetLang}&q=${encodeURIComponent(text)}`;
      const data = await this.#fetchGoogleApi(url);

      if (!data || !Array.isArray(data) || !data[0]) {
        throw new Error('Unexpected response structure');
      }

      // Extract and combine all translated segments
      let result = '';
      if (Array.isArray(data[0])) {
        result = data[0]
            .filter(item => item && item[0])
            .map(item => item[0])
            .join('');
      }

      return result;
    } catch (error) {
      console.error('Translation error:', error);
      return 'Error translating text: ' + error.message;
    }
  }
}

export default GoogleTranslator;
