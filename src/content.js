// Import utilities and constants
import { log, LANGUAGE_NAMES, DEFAULT_SETTINGS } from './constants.js';
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

  dialog.innerHTML = `
    <div style="padding: 20px; color-scheme: light; background-color: #f3f4f6; font-family: 'Arial', sans-serif;">
      <div style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center;" class="dialog-header">
            <h3 style="font-size: 14px; color: #737373;">Văn bản gốc:</h3>
            <span class="close-btn" style="cursor: pointer; font-size: 22px; color: #666; margin-top: -35px">&times;</span>
        </div>
        <p style="margin: 0; padding: 10px; background: #9ca3af; border-radius: 4px; line-height: 1.5; white-space: pre-wrap; word-break: break-word;">${originalText}</p>
      </div>
      <div style="margin-bottom: 15px;">
        <h3 style="font-size: 14px; color: #737373;">Bản dịch:</h3>
        <p style="margin: 0; padding: 10px; background: #9ca3af; border-radius: 4px; line-height: 1.5; white-space: pre-wrap; word-break: break-word;">${translatedText}</p>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  // Thêm chức năng kéo thả (drag)
  makeDraggable(dialog);

  // Close button handler
  dialog.querySelector('.close-btn').onclick = () => dialog.remove();

  // Tạo hàm xử lý click outside
  function closeOnClickOutside(e) {
    // Đảm bảo dialog vẫn tồn tại trong DOM
    if (!document.body.contains(dialog)) {
      document.removeEventListener('mousedown', closeOnClickOutside);
      return;
    }
    
    // Kiểm tra nếu click bên ngoài dialog và không phải là nút dịch
    if (!dialog.contains(e.target) && e.target !== translateButton) {
      log('Click outside dialog - closing');
      dialog.remove();
      document.removeEventListener('mousedown', closeOnClickOutside);
    }
  }

  // Kiểm tra cài đặt closeOnClickOutside
  chrome.storage.sync.get(DEFAULT_SETTINGS, function(items) {
    log('Cài đặt closeOnClickOutside:', items.closeOnClickOutside);
    
    // Đảm bảo dialog vẫn tồn tại trong DOM trước khi thêm event listener
    if (items.closeOnClickOutside && document.body.contains(dialog)) {
      // Thêm một độ trễ nhỏ để tránh xung đột với sự kiện mouseup
      setTimeout(() => {
        // Kiểm tra lại xem dialog có còn tồn tại không
        if (document.body.contains(dialog)) {
          log('Bật chức năng close on click outside');
          document.addEventListener('mousedown', closeOnClickOutside);
        }
      }, 100);
    } else {
      log('Tắt chức năng close on click outside');
    }
  });

  //close on esc key
  document.addEventListener('keydown', function closeOnEsc(e) {
    if (e.key === 'Escape') {
      dialog.remove();
      document.removeEventListener('keydown', closeOnEsc);
    }
  });
  
  return dialog;
}

// Hàm để làm cho một phần tử có thể kéo thả
function makeDraggable(element) {
  let pos1 = 0, pos2 = 0;
  const header = element.querySelector('.dialog-header') || element;

  header.style.cursor = 'move';
  header.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    
    // Lấy vị trí chuột và vị trí dialog
    const rect = element.getBoundingClientRect();
    pos1 = e.clientX - rect.left;
    pos2 = e.clientY - rect.top;
    
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    element.classList.add('dragging');
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    
    // Tính toán vị trí mới
    const newLeft = e.clientX - pos1;
    const newTop = e.clientY - pos2;
    
    // Đặt vị trí mới cho phần tử
    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
    element.style.transform = 'none';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    element.classList.remove('dragging');
  }
}

// Handle global errors
window.addEventListener('error', function(event) {
  log('Global error caught:', event.error);
});

log('Quick Translator: Content script fully loaded and ready');
