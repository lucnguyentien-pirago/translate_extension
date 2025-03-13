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

// Dịch văn bản bằng ChatGPT (OpenAI)
async function translateWithChatGPT(text, targetLang, apiKey, model = 'gpt-3.5-turbo') {
  console.log('Translating with ChatGPT, text length:', text.length, 'to', targetLang, 'using model:', model);
  
  if (!apiKey) {
    return 'Lỗi: Thiếu OpenAI API Key. Vui lòng cung cấp API Key trong phần cài đặt.';
  }
  
  try {
    const languageNames = {
      'vi': 'Vietnamese',
      'en': 'English',
      'fr': 'French',
      'de': 'German',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh-CN': 'Simplified Chinese',
      'zh-TW': 'Traditional Chinese',
      'es': 'Spanish',
      'it': 'Italian',
      'ru': 'Russian',
      'pt': 'Portuguese',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'th': 'Thai'
    };
    
    const targetLanguage = languageNames[targetLang] || targetLang;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'developer',
            content: `You are a professional translator. Translate the following text to ${targetLanguage}. Preserve formatting, paragraphs, and maintain the original meaning as accurately as possible. Only respond with the translation, no explanations or notes.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('ChatGPT response received');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Unexpected response structure from OpenAI');
    }
    
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('ChatGPT translation error:', error);
    return 'Lỗi khi dịch với ChatGPT: ' + error.message;
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
      apiKey: '',
      chatGptModel: 'gpt-3.5-turbo'
    }, async function(items) {
      console.log('Got settings:', { 
        targetLang: items.targetLang, 
        service: items.service, 
        apiKey: items.apiKey ? '******' : 'not set',
        model: items.chatGptModel
      });
      
      let translatedText = '';
      let detectedLang = null;
      
      try {
        // Phát hiện ngôn ngữ với Google (bất kể dịch vụ nào được sử dụng)
        detectedLang = await detectLanguage(request.text);
        
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
        } else if (items.service === 'openai') {
          // Không cần chia nhỏ văn bản với ChatGPT vì nó xử lý được văn bản dài
          translatedText = await translateWithChatGPT(
            request.text, 
            items.targetLang, 
            items.apiKey,
            items.chatGptModel
          );
        } else {
          translatedText = 'Không thể dịch - Dịch vụ không hợp lệ';
          console.log('Invalid translation service configuration');
        }
        
        console.log('Sending response back to content script');
        sendResponse({
          originalText: request.text,
          translatedText: translatedText,
          detectedLang: detectedLang,
          targetLang: items.targetLang,
          service: items.service
        });
      } catch (error) {
        console.error('Error in background processing:', error);
        sendResponse({
          originalText: request.text,
          translatedText: 'Lỗi xử lý: ' + error.message,
          detectedLang: null,
          targetLang: items.targetLang,
          service: items.service
        });
      }
    });
    
    return true; // Giữ kết nối để có thể trả lời bất đồng bộ
  }
});

console.log('Quick Translator: Background script fully initialized'); 