import Translator from './translator.js';

class GoogleTranslator extends Translator {
  async detectLanguage(text) {
    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`);
      const data = await response.json();
      return data[2];
    } catch (error) {
      console.error('Language detection error:', error);
      return null;
    }
  }

  async translate(text, targetLang = this.defaultTargetLang) {
    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await response.json();
      return data[0][0][0];
    } catch (error) {
      console.error('Translation error:', error);
      return 'Error translating text';
    }
  }
}

export default GoogleTranslator; 