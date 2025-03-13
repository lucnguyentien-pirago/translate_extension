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

## Yêu cầu hệ thống

- Node.js (phiên bản 14.x trở lên)
- npm hoặc yarn

## Cài đặt và Phát triển

### Cài đặt môi trường phát triển

1. Clone repository về máy của bạn:
```bash
git clone https://github.com/lucnguyentien-pirago/translate_extension.git
```

2. Cài đặt các dependencies:
```bash
npm install
# hoặc
yarn install
```

### Build extension

Để tạo bản build sẵn sàng để sử dụng:

```bash
npm run build
# hoặc
yarn build
```

Sau khi build thành công, thư mục `dist` sẽ chứa các file đã được đóng gói, sẵn sàng để cài đặt vào Chrome.

### Cài đặt extension từ thư mục build

1. Mở Chrome và truy cập `chrome://extensions/`
2. Bật chế độ "Developer mode" ở góc trên bên phải
3. Nhấn "Load unpacked" và chọn thư mục `dist` được tạo ra sau khi build
4. Extension sẽ được cài đặt và sẵn sàng sử dụng

## Cấu trúc Project

```
quick-translator/
├── src/                     # Mã nguồn
│   ├── background/          # Background scripts
│   ├── content/             # Content scripts
│   ├── popup/               # Popup UI
│   ├── services/            # Các dịch vụ dịch thuật
│   └── utils/               # Tiện ích và hàm trợ giúp
├── public/                  # Tài nguyên tĩnh (icons, v.v.)
├── dist/                    # Thư mục chứa build cuối cùng
├── webpack.config.js        # Cấu hình webpack
├── package.json             # Dependencies và scripts
└── README.md                # Tài liệu hướng dẫn
```

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

## Phát triển tùy chỉnh

### Thêm dịch vụ dịch thuật mới

Để thêm một dịch vụ dịch thuật mới, hãy tạo một module mới trong thư mục `src/services` và đăng ký nó trong `src/services/index.js`. Xem các file hiện có để hiểu cấu trúc.

### Tùy chỉnh giao diện

Giao diện popup được xây dựng bằng HTML/CSS và có thể được chỉnh sửa trong thư mục `src/popup`. Các styles được quản lý bằng webpack.

### Hot Reload trong quá trình phát triển

Dự án được cấu hình với chức năng hot reload khi phát triển. Chạy `npm run dev` sẽ theo dõi các thay đổi và tự động rebuild extension.

## Xử lý sự cố

### Lỗi build

Nếu gặp lỗi khi chạy `npm run build`:

1. Kiểm tra phiên bản Node.js (phải là 14.x trở lên)
2. Xóa thư mục `node_modules` và chạy lại `npm install`
3. Kiểm tra lỗi cú pháp trong code

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

## Đóng góp

Contributions được hoan nghênh! Nếu bạn muốn đóng góp cho dự án:

1. Fork repository
2. Tạo nhánh mới (`git checkout -b feature/amazing-feature`)
3. Commit các thay đổi (`git commit -m 'Add some amazing feature'`)
4. Push lên nhánh của bạn (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## Thông tin bổ sung

Quick Translator được thiết kế để tôn trọng quyền riêng tư của người dùng. Văn bản chỉ được gửi đến dịch vụ dịch thuật khi bạn yêu cầu, và không lưu trữ lịch sử dịch thuật của bạn trên bất kỳ máy chủ nào.

Extension hiện đang trong giai đoạn phát triển. Các tính năng mới sẽ được thêm vào trong tương lai, bao gồm:
- Lưu lịch sử dịch thuật cục bộ
- Thêm nhiều dịch vụ dịch thuật khác
- Khả năng thay thế văn bản gốc bằng bản dịch
- Tùy chỉnh giao diện người dùng

---

© 2024 Quick Translator. Mã nguồn được chia sẻ theo giấy phép MIT.
