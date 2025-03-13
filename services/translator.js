class Translator {
  constructor() {
    this.defaultTargetLang = 'vi';
  }

  async detectLanguage(text) {
    throw new Error('Method not implemented');
  }

  async translate(text, targetLang = this.defaultTargetLang) {
    throw new Error('Method not implemented');
  }
}

export default Translator; 