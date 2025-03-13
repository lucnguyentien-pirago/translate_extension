// Import utilities and constants
import { log, LANGUAGE_NAMES } from './constants.js';
import { isChromeRuntimeAvailable, getSelectedText } from './utils.js';

log('Quick Translator: Content script loaded');

let translateButton = null;
let lastMousePosition = { x: 0, y: 0 };

// Track mouse position
document.addEventListener('mousemove', (e) => {
  lastMousePosition.x = e.clientX;
  lastMousePosition.y = e.clientY;
});

// Calculate button position
function calculateButtonPosition(mouseX, mouseY) {
  const buttonWidth = 70;
  const buttonHeight = 30;
  const offset = 10;

  let posX = mouseX;
  let posY = mouseY + offset;

  if (posX + buttonWidth > window.innerWidth) {
    posX = window.innerWidth - buttonWidth - 5;
  }

  if (posY + buttonHeight > window.innerHeight) {
    posY = mouseY - buttonHeight - offset;
  }

  return { posX, posY };
}

// Handle translation request
function handleTranslation(selectedText) {
  if (translateButton) {
    translateButton.textContent = 'Đang dịch...';
  }

  showLoadingDialog();

  if (isChromeRuntimeAvailable()) {
    chrome.runtime.sendMessage({
      action: 'translate',
      text: selectedText
    }, (response) => {
      removeLoadingDialog();

      if (response) {
        showTranslationDialog(
            selectedText,
            response.translatedText,
            response.detectedLang,
            response.targetLang,
            response.service
        );
      } else {
        showTranslationDialog(
            selectedText,
            'Không thể dịch. Vui lòng thử lại.',
            '',
            '',
            'google'
        );
      }

      if (translateButton) {
        translateButton.remove();
        translateButton = null;
      }
    });
  } else {
    removeLoadingDialog();
    showTranslationDialog(
        selectedText,
        'Lỗi: Không thể kết nối với background script. Vui lòng tải lại trang và thử lại.',
        '',
        '',
        'google'
    );

    if (translateButton) {
      translateButton.remove();
      translateButton = null;
    }
  }
}

// Create translate button
function createTranslateButton(mouseX, mouseY, selectedText) {
  if (translateButton) {
    translateButton.remove();
  }

  const { posX, posY } = calculateButtonPosition(mouseX, mouseY);

  translateButton = document.createElement('button');
  translateButton.id = 'quick-translate-btn';
  translateButton.innerHTML = '🌐 Dịch';
  translateButton.style.left = `${posX}px`;
  translateButton.style.top = `${posY}px`;

  translateButton.addEventListener('click', () => handleTranslation(selectedText));

  document.body.appendChild(translateButton);
  log('Button created at position:', posX, posY);
}

// Create a loading dialog with spinner
function showLoadingDialog() {
  const loadingDialog = document.createElement('div');
  loadingDialog.id = 'translation-loading-dialog';
  loadingDialog.className = 'translation-dialog';
  loadingDialog.style.padding = '20px';
  loadingDialog.style.textAlign = 'center';

  loadingDialog.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="margin-bottom: 15px; width: 40px; height: 40px; border: 5px solid #f3f3f3; border-top: 5px solid #4285f4; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <p style="margin: 0; font-size: 16px;">Đang dịch...</p>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;

  document.body.appendChild(loadingDialog);
}

// Remove loading dialog
function removeLoadingDialog() {
  const loadingDialog = document.getElementById('translation-loading-dialog');
  if (loadingDialog) {
    loadingDialog.remove();
  }
}

// Handle mouseup event to detect text selection
document.addEventListener('mouseup', (e) => {
  setTimeout(() => {
    const selectedText = getSelectedText();

    if (!selectedText && translateButton) {
      translateButton.remove();
      translateButton = null;
      return;
    }

    if (selectedText) {
      try {
        createTranslateButton(lastMousePosition.x, lastMousePosition.y, selectedText);
      } catch (error) {
        log('Error creating button:', error);
      }
    }
  }, 10);
});

// Show translation results
function showTranslationDialog(originalText, translatedText, sourceLang, targetLang, service = 'google') {
  log('Show translation dialog');

  const oldDialog = document.querySelector('.translation-dialog');
  if (oldDialog) {
    oldDialog.remove();
  }

  const dialog = document.createElement('div');
  dialog.className = 'translation-dialog';

  // Prepare language info
  let langInfo = '';
  if (sourceLang) {
    const sourceDisplay = LANGUAGE_NAMES[sourceLang] || sourceLang;
    const targetDisplay = LANGUAGE_NAMES[targetLang] || targetLang;
    const serviceDisplay = service === 'google'
        ? 'Google Translate'
        : `ChatGPT (${translatedText.model || 'Developer mode'})`;

    langInfo = `
      <div class="lang-info">
        <div>${sourceDisplay} → ${targetDisplay}</div>
        <div style="margin-top: 5px; font-size: 12px;">Dịch bởi: ${serviceDisplay}</div>
      </div>
    `;
  }

  dialog.innerHTML = `
    <div style="padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
        <span style="font-size: 18px; font-weight: bold;">Kết quả dịch</span>
        <span class="close-btn" style="cursor: pointer; font-size: 22px; color: #666;">&times;</span>
      </div>
      ${langInfo}
      <div style="margin-bottom: 15px;">
        <h3 style="font-size: 14px; margin-bottom: 8px; color: #666;">Văn bản gốc:</h3>
        <p style="margin: 0; padding: 10px; background: #f9f9f9; border-radius: 4px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; font-family: 'Arial', sans-serif;">${originalText}</p>
      </div>
      <div style="margin-bottom: 15px;">
        <h3 style="font-size: 14px; margin-bottom: 8px; color: #666;">Bản dịch:</h3>
        <p style="margin: 0; padding: 10px; background: #ebf3ff; border-radius: 4px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; font-family: 'Arial', sans-serif;">${translatedText}</p>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  // Close button handler
  dialog.querySelector('.close-btn').onclick = () => dialog.remove();

  // Close on outside click
  document.addEventListener('mousedown', function closeOnClickOutside(e) {
    if (!dialog.contains(e.target) && e.target !== translateButton) {
      dialog.remove();
      document.removeEventListener('mousedown', closeOnClickOutside);
    }
  });
}

// Handle global errors
window.addEventListener('error', function(event) {
  log('Global error caught:', event.error);
});

log('Quick Translator: Content script fully loaded and ready');
