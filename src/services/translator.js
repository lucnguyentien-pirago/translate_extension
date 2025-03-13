/**
 * Base Translator class that defines the interface for all translator implementations
 */
class Translator {
  constructor() {
    this.defaultTargetLang = 'vi';
  }

  /**
   * Detects the language of the provided text
   * @param {string} text - The text to detect language
   * @returns {Promise<string|null>} ISO language code or null if detection fails
   */
  async detectLanguage(text) {
    throw new Error('Method not implemented');
  }

  /**
   * Translates the provided text to the target language
   * @param {string} text - The text to translate
   * @param {string} targetLang - The target language code (default from constructor)
   * @returns {Promise<string>} The translated text
   */
  async translate(text, targetLang = this.defaultTargetLang) {
    throw new Error('Method not implemented');
  }
}

export default Translator;
