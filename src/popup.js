import { DEFAULT_SETTINGS, SERVICE_DESCRIPTIONS, log } from './constants.js';
import { storeSettings, getSettings } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const elements = {
    targetLangSelect: document.getElementById('targetLang'),
    serviceSelect: document.getElementById('translationService'),
    apiKeyContainer: document.getElementById('apiKeyContainer'),
    apiKeyInput: document.getElementById('apiKey'),
    chatGptModelSelect: document.getElementById('chatGptModel'),
    saveButton: document.getElementById('saveButton'),
    statusDiv: document.getElementById('status'),
    serviceTip: document.getElementById('serviceTip'),
    tabs: document.querySelectorAll('.tab'),
    tabContents: document.querySelectorAll('.tab-content')
  };

  // Tab switching
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs and contents
      elements.tabs.forEach(t => t.classList.remove('active'));
      elements.tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to current tab and corresponding content
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab') + '-tab';
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Load saved settings
  function loadSettings() {
    getSettings(DEFAULT_SETTINGS)
        .then(settings => {
          elements.targetLangSelect.value = settings.targetLang;
          elements.serviceSelect.value = settings.service;
          elements.apiKeyInput.value = settings.apiKey;
          elements.chatGptModelSelect.value = settings.chatGptModel;

          updateServiceInfo(settings.service);
        })
        .catch(error => {
          log('Error loading settings:', error);
          // Use default settings in case of error
          updateServiceInfo(DEFAULT_SETTINGS.service);
        });
  }

  // Update service information
  function updateServiceInfo(service) {
    elements.apiKeyContainer.style.display = service === 'openai' ? 'block' : 'none';
    elements.serviceTip.innerHTML = SERVICE_DESCRIPTIONS[service] || '';
  }

  // Save settings
  function saveSettings() {
    // Show saving status
    showStatus('Đang lưu...', '');

    // Validate API key if using OpenAI
    if (elements.serviceSelect.value === 'openai' && !elements.apiKeyInput.value.trim()) {
      showStatus('Lỗi: Vui lòng nhập OpenAI API Key', 'error');
      return;
    }

    // Save settings to storage
    const settings = {
      targetLang: elements.targetLangSelect.value,
      service: elements.serviceSelect.value,
      apiKey: elements.apiKeyInput.value,
      chatGptModel: elements.chatGptModelSelect.value
    };

    storeSettings(settings)
        .then(() => {
          showStatus('Đã lưu cài đặt thành công!', 'success');

          // Hide status after 2 seconds
          setTimeout(function() {
            elements.statusDiv.style.display = 'none';
          }, 2000);
        })
        .catch(error => {
          log('Error saving settings:', error);
          showStatus('Lỗi khi lưu cài đặt: ' + error.message, 'error');
        });
  }

  // Show status message
  function showStatus(message, type) {
    elements.statusDiv.textContent = message;
    elements.statusDiv.className = 'status ' + type;
    elements.statusDiv.style.display = 'block';
  }

  // Event listeners
  elements.serviceSelect.addEventListener('change', function() {
    updateServiceInfo(this.value);
  });

  elements.saveButton.addEventListener('click', saveSettings);

  // Initialize
  loadSettings();
});
