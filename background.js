console.log('Quick Translator: Background script loaded');

// Dịch văn bản bằng Google Translate
async function translateWithGoogle(text, targetLang) {
  console.log('Translating with Google, text length:', text.length, 'to', targetLang);
  
  try {
    // Đảm bảo mã hóa đúng cho các ngôn ngữ như tiếng Nhật
    const encodedText = encodeURIComponent(text);
    console.log('Encoded text length:', encodedText.length);
    
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodedText}`;
    console.log('Request URL length:', url.length);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Network response error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Translation response structure:', JSON.stringify(data).substring(0, 100) + '...');
    
    if (!data || !Array.isArray(data) || !data[0]) {
      console.error('Unexpected response structure:', data);
      return 'Lỗi cấu trúc dữ liệu phản hồi';
    }
    
    // Xử lý đặc biệt cho cấu trúc dữ liệu phản hồi của Google Translate
    let translatedText = '';
    
    // Ghép nối từ tất cả các phần phân đoạn dịch
    if (Array.isArray(data[0])) {
      translatedText = data[0]
        .filter(item => item && item[0])
        .map(item => item[0])
        .join('');
    }
    
    console.log('Translation result length:', translatedText.length);
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return 'Lỗi khi dịch văn bản: ' + error.message;
  }
}

// Phát hiện ngôn ngữ của văn bản
async function detectLanguage(text) {
  console.log('Detecting language for text length:', text.length);
  
  try {
    const encodedText = encodeURIComponent(text);
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodedText}`);
    
    if (!response.ok) {
      throw new Error(`Network response error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data && data[2]) {
      console.log('Detected language:', data[2]);
      return data[2];
    } else {
      console.log('Language data structure:', JSON.stringify(data).substring(0, 100) + '...');
      console.error('Language detection failed, unexpected structure');
      return null;
    }
  } catch (error) {
    console.error('Language detection error:', error);
    return null;
  }
}

// Chia nhỏ văn bản dài để tránh lỗi URL quá dài
function splitTextForTranslation(text, maxLength = 1000) {
  if (text.length <= maxLength) return [text];
  
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    // Tìm điểm kết thúc phù hợp (khoảng trắng, dấu chấm câu)
    let end = Math.min(start + maxLength, text.length);
    
    if (end < text.length) {
      // Tìm điểm ngắt câu/từ gần nhất
      const breakPoints = [
        text.lastIndexOf('. ', end),
        text.lastIndexOf('? ', end),
        text.lastIndexOf('! ', end),
        text.lastIndexOf('\n', end),
        text.lastIndexOf('. ', end),
        text.lastIndexOf(' ', end)
      ].filter(point => point > start);
      
      if (breakPoints.length > 0) {
        end = Math.max(...breakPoints) + 1;
      }
    }
    
    chunks.push(text.substring(start, end));
    start = end;
  }
  
  console.log(`Split text into ${chunks.length} chunks`);
  return chunks;
}

// Xử lý yêu cầu dịch từ content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in background, action:', request.action);
  
  if (request.action === 'translate') {
    console.log('Processing translate request for text length:', request.text.length);
    
    // Lấy cài đặt từ storage
    chrome.storage.sync.get({
      targetLang: 'vi',
      service: 'google',
      apiKey: ''
    }, async function(items) {
      console.log('Got settings:', items);
      
      let translatedText = '';
      let detectedLang = null;
      
      try {
        if (items.service === 'google') {
          // Chia nhỏ văn bản nếu quá dài
          if (request.text.length > 1000) {
            const textChunks = splitTextForTranslation(request.text);
            const translatedChunks = [];
            
            for (const chunk of textChunks) {
              const translated = await translateWithGoogle(chunk, items.targetLang);
              translatedChunks.push(translated);
            }
            
            translatedText = translatedChunks.join(' ');
          } else {
            translatedText = await translateWithGoogle(request.text, items.targetLang);
          }
          
          detectedLang = await detectLanguage(request.text);
        } else if (items.service === 'openai' && items.apiKey) {
          translatedText = 'Tính năng dịch với OpenAI đang được phát triển';
          console.log('OpenAI translation not implemented yet');
        } else {
          translatedText = 'Không thể dịch - Vui lòng kiểm tra cài đặt';
          console.log('Invalid translation service configuration');
        }
        
        console.log('Sending response back to content script');
        sendResponse({
          originalText: request.text,
          translatedText: translatedText,
          detectedLang: detectedLang,
          targetLang: items.targetLang
        });
      } catch (error) {
        console.error('Error in background processing:', error);
        sendResponse({
          originalText: request.text,
          translatedText: 'Lỗi xử lý: ' + error.message,
          detectedLang: null,
          targetLang: items.targetLang
        });
      }
    });
    
    return true; // Giữ kết nối để có thể trả lời bất đồng bộ
  }
});

console.log('Quick Translator: Background script fully initialized'); 