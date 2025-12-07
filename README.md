# IOTA Water Tracker

Ứng dụng theo dõi lượng nước uống hằng ngày và ghi nhận dữ liệu lên **IOTA EVM Testnet**, đồng thời sử dụng Gemini AI để đưa ra phân tích sức khỏe và gợi ý phù hợp cho người dùng.

![banner](./screenshot.png) <!-- optional image -->

---

## 🚀 Tính năng chính
- Theo dõi lượng nước hàng ngày
- Ghi lịch sử lên IOTA-EVM (transaction lưu data)
- Biểu đồ thống kê bằng Recharts
- Gemini AI phân tích và đưa ra gợi ý sức khoẻ
- UI React + TypeScript + Vite

---

## 🧩 Công nghệ
| Thành phần | Công nghệ |
|---|---|
| Frontend | React 19, Vite |
| Blockchain | IOTA-EVM Testnet |
| Ví Web | TanglePay / MetaMask |
| AI | Google Gemini |
| Ngôn ngữ | TypeScript |

---

## 🔗 Ví hỗ trợ
Ứng dụng này **không kết nối trực tiếp với IOTA Desktop/Firefly**, mà sử dụng ví có hỗ trợ chuẩn Web3/EVM:

### Ví đề nghị
- **TanglePay Browser Extension**
- MetaMask (cần add network)

### Không hỗ trợ
- Firefly desktop (không inject Web3 provider)

---

## 🛠 Cài đặt và chạy

```bash
npm install
npm run dev
