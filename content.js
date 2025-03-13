console.log('Quick Translator: Content script loaded');

let translateButton = null;
let lastMousePosition = { x: 0, y: 0 };

// Theo dõi vị trí chuột
document.addEventListener('mousemove', function(e) {
  lastMousePosition.x = e.clientX;
  lastMousePosition.y = e.clientY;
});

// Hàm an toàn để lấy text đã chọn
function getSelectedText() {
  try {
    const selection = window.getSelection();
    if (!selection) {
      console.log('No selection object available');
      return '';
    }
    
    const text = selection.toString().trim();
    console.log('Raw selected text length:', text.length);
    console.log('Selected text sample:', text.substring(0, 50));
    
    // Kiểm tra xem có chứa chữ Nhật không (kiểm tra range Unicode cơ bản)
    const hasJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text);
    console.log('Contains Japanese characters:', hasJapanese);
    
    return text;
  } catch (error) {
    console.error('Error getting selected text:', error);
    return '';
  }
}

// Hàm tạo button
function createTranslateButton(mouseX, mouseY, selectedText) {
  console.log('Creating translate button at mouse position:', mouseX, mouseY);
  
  // Xóa button cũ nếu có
  if (translateButton) {
    console.log('Removing existing button');
    translateButton.remove();
  }

  // Tạo button mới
  translateButton = document.createElement('button');
  translateButton.id = 'quick-translate-btn';
  translateButton.innerHTML = '🌐 Dịch';
  translateButton.style.position = 'fixed';
  
  // Tính toán vị trí của button để đảm bảo hiển thị dưới con trỏ chuột
  // và không vượt quá biên của màn hình
  const buttonWidth = 70; // Ước tính chiều rộng của button
  const buttonHeight = 30; // Ước tính chiều cao của button
  const offset = 10; // Khoảng cách giữa con trỏ và button
  
  // Tính toán vị trí trên màn hình
  let posX = mouseX;
  let posY = mouseY + offset; // Hiển thị button bên dưới con trỏ
  
  // Đảm bảo button không vượt quá biên phải của màn hình
  if (posX + buttonWidth > window.innerWidth) {
    posX = window.innerWidth - buttonWidth - 5;
  }
  
  // Đảm bảo button không vượt quá biên dưới của màn hình
  if (posY + buttonHeight > window.innerHeight) {
    posY = mouseY - buttonHeight - offset; // Hiển thị button bên trên con trỏ
  }
  
  translateButton.style.left = `${posX}px`;
  translateButton.style.top = `${posY}px`;
  translateButton.style.zIndex = '99999';
  translateButton.style.padding = '5px 10px';
  translateButton.style.background = '#4285f4';
  translateButton.style.color = 'white';
  translateButton.style.border = 'none';
  translateButton.style.borderRadius = '4px';
  translateButton.style.cursor = 'pointer';
  translateButton.style.fontFamily = 'Arial, sans-serif';
  translateButton.style.fontSize = '14px';
  translateButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

  // Xử lý sự kiện click
  translateButton.addEventListener('click', function() {
    console.log('Translate button clicked');
    translateButton.textContent = 'Đang dịch...';
    
    // Hiển thị loading dialog
    showLoadingDialog();
    
    console.log('Sending message to background script');
    console.log('Text to translate (length):', selectedText.length);
    chrome.runtime.sendMessage({
      action: 'translate',
      text: selectedText
    }, function(response) {
      console.log('Got response from background:', response ? 'success' : 'failure');
      
      // Xóa loading dialog
      removeLoadingDialog();
      
      if (response) {
        console.log('Translated text sample:', response.translatedText.substring(0, 50));
        showTranslationDialog(selectedText, response.translatedText, response.detectedLang, response.targetLang);
      } else {
        console.error('No response or error occurred');
        showTranslationDialog(selectedText, 'Không thể dịch. Vui lòng thử lại.', '', '');
      }
      
      // Xóa button sau khi dịch
      if (translateButton) {
        translateButton.remove();
        translateButton = null;
      }
    });
  });

  console.log('Appending button to body');
  document.body.appendChild(translateButton);
  console.log('Button created at position:', posX, posY);
}

// Hiển thị loading dialog
function showLoadingDialog() {
  const loadingDialog = document.createElement('div');
  loadingDialog.id = 'translation-loading-dialog';
  loadingDialog.style.position = 'fixed';
  loadingDialog.style.top = '50%';
  loadingDialog.style.left = '50%';
  loadingDialog.style.transform = 'translate(-50%, -50%)';
  loadingDialog.style.background = 'white';
  loadingDialog.style.padding = '20px';
  loadingDialog.style.borderRadius = '8px';
  loadingDialog.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
  loadingDialog.style.zIndex = '99999';
  loadingDialog.style.fontFamily = 'Arial, sans-serif';
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

// Xóa loading dialog
function removeLoadingDialog() {
  const loadingDialog = document.getElementById('translation-loading-dialog');
  if (loadingDialog) {
    loadingDialog.remove();
  }
}

// Xử lý sự kiện select text
document.addEventListener('mouseup', function(e) {
  console.log('Mouse up event detected at', e.clientX, e.clientY);
  
  // Lưu vị trí chuột hiện tại
  lastMousePosition.x = e.clientX;
  lastMousePosition.y = e.clientY;
  
  // Sử dụng setTimeout để đảm bảo selection được xử lý đầy đủ
  setTimeout(() => {
    const selectedText = getSelectedText();
    
    // Nếu không có text được chọn, xóa button cũ
    if (!selectedText && translateButton) {
      console.log('No text selected, removing button');
      translateButton.remove();
      translateButton = null;
      return;
    }
    
    // Nếu có text được chọn, hiển thị button
    if (selectedText) {
      try {
        // Sử dụng vị trí chuột đã lưu để đặt button
        // Chuyển đổi từ viewport coordinates sang page coordinates
        const buttonX = lastMousePosition.x;
        const buttonY = lastMousePosition.y;
        
        console.log('Creating button at mouse position', buttonX, buttonY);
        createTranslateButton(buttonX, buttonY, selectedText);
      } catch (error) {
        console.error('Error positioning button:', error);
      }
    }
  }, 10); // Đợi một chút để selection được xử lý hoàn toàn
});

// Hiển thị dialog với kết quả dịch
function showTranslationDialog(originalText, translatedText, sourceLang, targetLang) {
  console.log('Showing translation dialog');
  console.log('Original text length:', originalText.length);
  console.log('Translated text length:', translatedText.length);
  
  // Xóa dialog cũ nếu có
  const oldDialog = document.querySelector('.translation-dialog');
  if (oldDialog) {
    console.log('Removing existing dialog');
    oldDialog.remove();
  }
  
  const dialog = document.createElement('div');
  dialog.className = 'translation-dialog';
  dialog.style.position = 'fixed';
  dialog.style.top = '50%';
  dialog.style.left = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';
  dialog.style.background = 'white';
  dialog.style.width = '80%';
  dialog.style.maxWidth = '500px';
  dialog.style.borderRadius = '8px';
  dialog.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
  dialog.style.zIndex = '99999';
  dialog.style.fontFamily = 'Arial, sans-serif';
  dialog.style.maxHeight = '80vh';
  dialog.style.overflow = 'auto';
  
  let langInfo = '';
  if (sourceLang) {
    const langNames = {
      'vi': 'Tiếng Việt',
      'en': 'Tiếng Anh',
      'fr': 'Tiếng Pháp',
      'de': 'Tiếng Đức',
      'ja': 'Tiếng Nhật',
      'ko': 'Tiếng Hàn',
      'zh-CN': 'Tiếng Trung (Giản thể)',
      'zh-TW': 'Tiếng Trung (Phồn thể)'
    };
    
    const sourceDisplay = langNames[sourceLang] || sourceLang;
    const targetDisplay = langNames[targetLang] || targetLang;
    langInfo = `<div style="background: #f5f5f5; padding: 8px 12px; border-radius: 4px; margin-bottom: 15px; font-size: 14px; color: #666;">${sourceDisplay} → ${targetDisplay}</div>`;
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
  console.log('Dialog appended to body');

  dialog.querySelector('.close-btn').onclick = function() {
    console.log('Close button clicked');
    dialog.remove();
  };
  
  // Thêm event listener để đóng dialog khi click bên ngoài
  document.addEventListener('mousedown', function closeOnClickOutside(e) {
    if (!dialog.contains(e.target) && e.target !== translateButton) {
      console.log('Clicked outside dialog, closing');
      dialog.remove();
      document.removeEventListener('mousedown', closeOnClickOutside);
    }
  });
}

console.log('Quick Translator: Content script fully loaded and ready'); 