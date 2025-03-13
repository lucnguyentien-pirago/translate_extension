document.addEventListener('DOMContentLoaded', function() {
  const targetLangSelect = document.getElementById('targetLang');
  const serviceSelect = document.getElementById('translationService');
  const apiKeyContainer = document.getElementById('apiKeyContainer');
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('saveButton');
  const statusDiv = document.getElementById('status');
  
  // Load cài đặt đã lưu
  chrome.storage.sync.get({
    targetLang: 'vi',
    service: 'google',
    apiKey: ''
  }, function(items) {
    targetLangSelect.value = items.targetLang;
    serviceSelect.value = items.service;
    apiKeyInput.value = items.apiKey;
    
    // Hiển thị trường API Key nếu dịch vụ là OpenAI
    if (items.service === 'openai') {
      apiKeyContainer.style.display = 'block';
    }
  });
  
  // Hiển thị/ẩn trường API Key dựa trên dịch vụ được chọn
  serviceSelect.addEventListener('change', function() {
    if (this.value === 'openai') {
      apiKeyContainer.style.display = 'block';
    } else {
      apiKeyContainer.style.display = 'none';
    }
  });
  
  // Lưu cài đặt
  saveButton.addEventListener('click', function() {
    chrome.storage.sync.set({
      targetLang: targetLangSelect.value,
      service: serviceSelect.value,
      apiKey: apiKeyInput.value
    }, function() {
      // Hiển thị thông báo thành công
      statusDiv.textContent = 'Đã lưu cài đặt thành công!';
      statusDiv.className = 'status success';
      statusDiv.style.display = 'block';
      
      // Ẩn thông báo sau 2 giây
      setTimeout(function() {
        statusDiv.style.display = 'none';
      }, 2000);
    });
  });
}); 