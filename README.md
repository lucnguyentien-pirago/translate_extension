<think>Tôi sẽ viết một file README.md toàn diện cho extension dịch thuật này. README sẽ bao gồm:

1. Giới thiệu về extension
2. Tính năng chính
3. Cách cài đặt
4. Cách sử dụng
5. Hướng dẫn lấy API key từ OpenAI
6. Cách thêm API key vào extension
7. Giải thích về các mô hình ChatGPT
8. Xử lý sự cố thường gặp
9. Thông tin bổ sung 

Tất cả sẽ được viết bằng tiếng Việt, dễ hiểu và có hình ảnh minh họa (tôi sẽ chỉ mô tả vị trí đặt hình ảnh).</think># Quick Translator - Công cụ dịch thuật thông minh

## Giới thiệu

Quick Translator là extension dịch thuật giúp bạn dễ dàng dịch văn bản được chọn trên bất kỳ trang web nào. Extension hỗ trợ dịch với Google Translate (miễn phí) và OpenAI ChatGPT (cần API key) để mang lại kết quả dịch thuật chính xác và tự nhiên.

## Tính năng chính

- Dịch nhanh văn bản bằng cách bôi đen và nhấp vào nút dịch
- Hỗ trợ nhiều ngôn ngữ khác nhau
- Hai option dịch thuật:
  - **Google Translate**: Miễn phí, nhanh chóng
  - **ChatGPT**: Chất lượng cao, dịch tự nhiên như người bản xứ, đặc biệt tốt với nội dung kỹ thuật (cần API key)
- Tự động phát hiện ngôn ngữ nguồn
- Hiển thị kết quả trong dialog dễ đọc

## Cài đặt

### Phương pháp 1: Cài đặt từ thư mục source code

1. Tải xuống và giải nén thư mục extension
2. Mở Chrome và truy cập `chrome://extensions/`
3. Bật chế độ "Developer mode" ở góc trên bên phải
4. Nhấn "Load unpacked" và chọn thư mục chứa extension
5. Extension sẽ được cài đặt và sẵn sàng sử dụng

### Phương pháp 2: Cài đặt từ Chrome Web Store (nếu có)

1. Truy cập [Quick Translator trên Chrome Web Store](#) (Thêm link sau khi đăng tải)
2. Nhấn "Add to Chrome"
3. Xác nhận cài đặt

## Cách sử dụng

1. Truy cập bất kỳ trang web nào
2. Bôi đen văn bản bạn muốn dịch
3. Nút "🌐 Dịch" sẽ xuất hiện gần vị trí con trỏ chuột
4. Nhấp vào nút để dịch văn bản
5. Kết quả dịch sẽ hiển thị trong dialog, bao gồm:
   - Văn bản gốc
   - Bản dịch
   - Thông tin về ngôn ngữ nguồn và đích
   - Dịch vụ được sử dụng (Google Translate hoặc ChatGPT)

## Lấy API key từ OpenAI

Để sử dụng tính năng dịch bằng ChatGPT, bạn cần có API key từ OpenAI:

1. Truy cập [https://platform.openai.com/signup](https://platform.openai.com/signup) để đăng ký tài khoản OpenAI nếu bạn chưa có
2. Sau khi đăng nhập, truy cập [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. Nhấp vào "Create new secret key"
4. Đặt tên cho key của bạn (ví dụ: "Quick Translator Extension")
5. Sao chép API key vừa tạo (lưu ý: key chỉ hiển thị một lần, hãy lưu lại ở nơi an toàn)

Lưu ý: OpenAI cung cấp $5 credit miễn phí cho người dùng mới. Sau đó, bạn cần cung cấp phương thức thanh toán để tiếp tục sử dụng dịch vụ. Chi phí sử dụng GPT-4o-mini khá thấp, khoảng $0.15/100K tokens.

## Thêm API key vào extension

1. Nhấp vào biểu tượng extension Quick Translator trên thanh công cụ Chrome
2. Chuyển sang tab "API" (nếu chưa được chọn)
3. Dán API key của bạn vào ô "OpenAI API Key"
4. Chọn mô hình ChatGPT (mặc định là GPT-4o-mini, phù hợp cho hầu hết người dùng)
5. Nhấp "Lưu cài đặt"
6. Quay lại tab "Cài đặt chung" và chọn "OpenAI ChatGPT" trong mục "Dịch vụ dịch thuật"
7. Nhấp "Lưu cài đặt" một lần nữa

![Minh họa cách thêm API key]

## Cấu hình Extension

### Thay đổi ngôn ngữ đích

1. Nhấp vào biểu tượng extension trên thanh công cụ Chrome
2. Chọn ngôn ngữ đích từ dropdown "Ngôn ngữ đích"
3. Nhấp "Lưu cài đặt"

### Chọn dịch vụ dịch thuật

1. Nhấp vào biểu tượng extension
2. Chọn một trong hai dịch vụ:
   - **Google Translate**: Miễn phí, không cần thiết lập gì thêm
   - **OpenAI ChatGPT**: Cần API key, dịch chất lượng cao
3. Nhấp "Lưu cài đặt"

### Chọn mô hình ChatGPT

Trong tab "API", bạn có thể chọn các mô hình khác nhau:
- **GPT-4o-mini**: Mặc định, cân bằng giữa chi phí và chất lượng
- **GPT-3.5-turbo**: Rẻ hơn, chất lượng ổn
- **GPT-4**: Chất lượng cao nhất, nhưng đắt hơn
- **GPT-4o**: Phiên bản mới nhất, hỗ trợ nhiều khả năng

## Xử lý sự cố

### API key không hoạt động

- Kiểm tra xem API key đã được nhập đúng chưa
- Kiểm tra xem tài khoản OpenAI của bạn có đủ quota không
- Truy cập [https://platform.openai.com/account/usage](https://platform.openai.com/account/usage) để kiểm tra sử dụng

### Lỗi "Insufficient quota"

Thông báo này xuất hiện khi:
- Credit miễn phí của bạn đã hết
- Tài khoản chưa được thiết lập phương thức thanh toán
- Đã vượt quá hạn mức hàng tháng

Để khắc phục:
1. Truy cập [https://platform.openai.com/account/billing/overview](https://platform.openai.com/account/billing/overview)
2. Thêm phương thức thanh toán hoặc nạp thêm credit
3. Hoặc chuyển tạm thời sang Google Translate trong extension

### Extension không hiển thị nút dịch

- Làm mới trang web (F5)
- Kiểm tra xem extension đã được kích hoạt chưa (chrome://extensions/)
- Tắt và bật lại extension

## Thông tin bổ sung

Quick Translator được thiết kế để tôn trọng quyền riêng tư của người dùng. Văn bản chỉ được gửi đến dịch vụ dịch thuật khi bạn yêu cầu, và không lưu trữ lịch sử dịch thuật của bạn trên bất kỳ máy chủ nào.

Extension hiện đang trong giai đoạn phát triển. Các tính năng mới sẽ được thêm vào trong tương lai, bao gồm:
- Lưu lịch sử dịch thuật cục bộ
- Thêm nhiều dịch vụ dịch thuật khác
- Khả năng thay thế văn bản gốc bằng bản dịch
- Tùy chỉnh giao diện người dùng

---

© 2024 Quick Translator. Mã nguồn được chia sẻ theo giấy phép MIT.
