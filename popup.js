document.addEventListener('DOMContentLoaded', function() {
  const targetLangSelect = document.getElementById('targetLang');
  const serviceSelect = document.getElementById('translationService');
  const apiKeyContainer = document.getElementById('apiKeyContainer');
  const apiKeyInput = document.getElementById('apiKey');
  const chatGptModelSelect = document.getElementById('chatGptModel');
  const saveButton = document.getElementById('saveButton');
  const statusDiv = document.getElementById('status');
  const serviceTip = document.getElementById('serviceTip');
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Kiểm tra tất cả các phần tử DOM
  console.log('DOM Elements:');
  console.log('targetLangSelect:', targetLangSelect);
  console.log('serviceSelect:', serviceSelect);
  console.log('apiKeyContainer:', apiKeyContainer);
  console.log('apiKeyInput:', apiKeyInput);
  console.log('chatGptModelSelect:', chatGptModelSelect);
  console.log('saveButton:', saveButton);
  console.log('statusDiv:', statusDiv);
  console.log('serviceTip:', serviceTip);
  
  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to current tab and corresponding content
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab') + '-tab';
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Load cài đặt đã lưu
  chrome.storage.sync.get({
    targetLang: 'vi',
    service: 'google',
    apiKey: '',
    chatGptModel: 'gpt-4o-mini'
  }, function(items) {
    targetLangSelect.value = items.targetLang;
    serviceSelect.value = items.service;
    apiKeyInput.value = items.apiKey;
    chatGptModelSelect.value = items.chatGptModel;
    
    // Hiển thị trường API Key và tip phù hợp
    updateServiceInfo(items.service);
  });
  
  // Hiển thị/ẩn trường API Key và cập nhật tip dựa trên dịch vụ được chọn
  serviceSelect.addEventListener('change', function() {
    updateServiceInfo(this.value);
  });
  
  function updateServiceInfo(service) {
    if (service === 'openai') {
      apiKeyContainer.style.display = 'block';
      serviceTip.innerHTML = 'ChatGPT với gpt-4o-mini cung cấp khả năng dịch thuật chuyên nghiệp, đặc biệt hiệu quả với nội dung kỹ thuật và code. Yêu cầu API key.';
    } else {
      apiKeyContainer.style.display = 'none';
      serviceTip.innerHTML = 'Google Translate dịch nhanh, miễn phí nhưng có thể thiếu chính xác với các thuật ngữ kỹ thuật.';
    }
  }
  
  // Lưu cài đặt
  saveButton.addEventListener('click', function() {
    // Hiển thị trạng thái đang lưu
    statusDiv.textContent = 'Đang lưu...';
    statusDiv.className = 'status';
    statusDiv.style.display = 'block';
    
    // Xác thực API key nếu dịch vụ là OpenAI
    if (serviceSelect.value === 'openai' && !apiKeyInput.value.trim()) {
      statusDiv.textContent = 'Lỗi: Vui lòng nhập OpenAI API Key';
      statusDiv.className = 'status error';
      return;
    }
    
    chrome.storage.sync.set({
      targetLang: targetLangSelect.value,
      service: serviceSelect.value,
      apiKey: apiKeyInput.value,
      chatGptModel: chatGptModelSelect.value
    }, function() {
      // Hiển thị thông báo thành công
      statusDiv.textContent = 'Đã lưu cài đặt thành công!';
      statusDiv.className = 'status success';
      
      // Ẩn thông báo sau 2 giây
      setTimeout(function() {
        statusDiv.style.display = 'none';
      }, 2000);
    });
  });
});