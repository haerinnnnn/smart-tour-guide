# TÀI LIỆU TỔNG HỢP DỰ ÁN: SMART MUSEUM GUIDE

**Dự án:** Hệ thống hỗ trợ thuyết minh và định vị vi mô trong bảo tàng sử dụng công nghệ BLE Beacon.  
**Mô hình phát triển:** Agile/Scrum rút gọn (4 Tuần).

---

## PHẦN 1: KIẾN TRÚC HỆ THỐNG & ĐẶC TẢ DỮ LIỆU

### 1. Luồng hoạt động luân chuyển dữ liệu
* **ESP32:** Đóng vai trò là thiết bị phát sóng (Beacon), liên tục phát tín hiệu BLE trong bán kính hẹp (< 1m).
* **React Native App:** Thiết bị di động của người dùng quét sóng xung quanh, bắt các gói tin chứa UUID, Major, Minor và tiến hành lọc nhiễu dựa trên cường độ tín hiệu (RSSI).
* **Node.js API & MySQL:** Ứng dụng gửi thông tin định vị lên Server. Backend xử lý truy vấn cơ sở dữ liệu và trả về nội dung thuyết minh tương ứng.
* **Web Admin:** Giao diện quản trị tương tác với Backend để thêm mới, chỉnh sửa thông tin hiện vật và quản lý thiết bị phần cứng.

### 2. Thiết kế Cơ sở dữ liệu (MySQL)

**Bảng `beacons` (Quản lý thiết bị phần cứng)**

| Trường dữ liệu | Kiểu dữ liệu | Đặc tính | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | INT | Primary Key, Auto Increment | Định danh duy nhất |
| `uuid` | VARCHAR(255) | Not Null | Chuỗi định danh riêng của bảo tàng |
| `major` | INT | Not Null | Định danh khu vực hoặc tầng |
| `minor` | INT | Not Null | Định danh chính xác vị trí đặt tranh |
| `location_name`| VARCHAR(255) | Not Null | Tên vị trí (VD: "Gian phòng tranh số 1") |

**Bảng `artifacts` (Quản lý nội dung hiện vật)**

| Trường dữ liệu | Kiểu dữ liệu | Đặc tính | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | INT | Primary Key, Auto Increment | Định danh hiện vật |
| `beacon_id` | INT | Foreign Key (`beacons.id`) | Liên kết với thiết bị Beacon |
| `title` | VARCHAR(255) | Not Null | Tên bức tranh/hiện vật |
| `author` | VARCHAR(255) | Mặc định: "Ẩn danh" | Tên tác giả |
| `description` | TEXT | Nullable | Bài viết thuyết minh chi tiết |
| `image_url` | VARCHAR(255) | Nullable | Link ảnh lưu trên server |
| `audio_url` | VARCHAR(255) | Nullable | Link file âm thanh (.mp3) |

**Bảng `visit_logs` (Ghi nhận thống kê lượt xem)**

| Trường dữ liệu | Kiểu dữ liệu | Đặc tính | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | INT | Primary Key, Auto Increment | Định danh log |
| `artifact_id` | INT | Foreign Key (`artifacts.id`) | Hiện vật khách đang xem |
| `created_at` | TIMESTAMP | Default CURRENT_TIMESTAMP | Thời gian khách tiếp cận hiện vật |

---

## PHẦN 2: THÀNH PHẦN CÔNG NGHỆ (TECH STACK)
* **Hardware (Phần cứng):** Mạch ESP32 phát sóng theo chuẩn giao thức iBeacon.
* **Database (Cơ sở dữ liệu):** MySQL.
* **Backend API:** Node.js kết hợp framework Express.
* **Mobile App (Ứng dụng di động):** React Native (Ưu tiên sử dụng CLI để tối ưu can thiệp module Bluetooth tự nhiên).
* **Web Admin (Giao diện quản trị):** React.js hoặc Vue.js, thiết kế UI với Tailwind CSS hoặc Ant Design.

---

## PHẦN 3: DANH SÁCH CÔNG VIỆC CẦN TRIỂN KHAI (TODO LIST)

### 1. Phân hệ Phần cứng (ESP32)
- [ ] Thiết lập môi trường Arduino IDE và cài đặt thư viện board mạch ESP32.
- [ ] Lập trình mã nguồn C++ phát tín hiệu iBeacon định kỳ (Hardcode các thông số UUID, Major, Minor).
- [ ] Cấu hình giảm công suất phát sóng xuống mức thấp tối đa (`ESP_PWR_LVL_N12`) để giới hạn bán kính quét dưới 1 mét.
- [ ] Sử dụng ứng dụng nRF Connect để đo lường và kiểm thử chất lượng sóng thực tế.

### 2. Phân hệ Backend & Database
- [ ] Khởi tạo Database MySQL.
- [ ] Viết script Seeder nạp dữ liệu giả lập (Mock data) để phục vụ kiểm thử.
- [ ] Cấu hình project Express và kết nối tới Database.
- [ ] Xây dựng API `GET /api/artifacts/detect` để map dữ liệu UUID/Major/Minor sang thông tin hiện vật.
- [ ] Phát triển bộ RESTful API (CRUD) cho giao diện Web Admin.
- [ ] Thiết lập logic ghi log tự động vào bảng `visit_logs` kèm cơ chế chống nhiễu (Debounce) khi người dùng đứng lâu ở một vị trí.

### 3. Phân hệ Ứng dụng Di động (React Native)
- [ ] Khai báo quyền cấp phép truy cập Bluetooth và Vị trí trên cả Android (`AndroidManifest.xml`) và iOS (`Info.plist`).
- [ ] Tích hợp thư viện BLE (`react-native-ble-manager` hoặc `react-native-ble-plx`) để quét sóng nền.
- [ ] Xây dựng thuật toán phân loại mảng Beacon: Lọc tín hiệu rác và sắp xếp mảng theo thứ tự RSSI mạnh nhất.
- [ ] Thiết kế UI Components cho màn hình "Danh sách thông minh".
- [ ] Tích hợp trình phát Audio (`react-native-track-player`) để stream trực tiếp file MP3 thuyết minh.
- [ ] Dựng bản đồ bảo tàng phẳng tĩnh, lập trình logic đổi màu (Highlight) khu vực tương ứng với thiết bị Beacon gần nhất.

### 4. Phân hệ Web Admin
- [ ] Khởi tạo dự án Frontend và dựng Layout tổng thể cho trang Dashboard.
- [ ] Xây dựng form biểu mẫu (CRUD) để quản trị thiết bị Beacon và kho Hiện vật.
- [ ] Xử lý luồng Upload file (Hình ảnh, Âm thanh) qua API.
- [ ] Áp dụng thư viện Chart.js hoặc Recharts để vẽ biểu đồ thống kê lượt tham quan từ dữ liệu log.

### 5. Tối ưu & Kiểm thử Toàn trình
- [ ] Áp dụng công thức Lọc trung bình động (Moving Average Filter) trên Mobile để làm mượt chỉ số RSSI: `RSSI_smooth = (1/N) * Σ(RSSI_i)` với `(N=5)`.
- [ ] Thực hiện test End-to-End với thiết bị ESP32 vật lý và điện thoại thật.
- [ ] Đóng gói và xuất bản ứng dụng ra file cài (`.apk` / `.ipa`) cùng tài liệu báo cáo kỹ thuật.

---

## PHẦN 4: CHỈ THỊ DÀNH CHO GEMINI CODE ASSIST (AI RULES)

### 1. Vai trò của AI (AI Persona)
- Bạn là một Kỹ sư Phần mềm Full-stack cấp cao và Chuyên gia IoT.
- Khi được giao một task (ví dụ: tạo API, thiết kế màn hình), hãy luôn phân tích các file liên quan trước, sau đó đưa ra kế hoạch từng bước (Step-by-step plan) trước khi sinh ra code.
- Tuyệt đối không xóa hoặc ghi đè các hàm đang hoạt động bình thường nếu không được yêu cầu rõ ràng.

### 2. Tiêu chuẩn Học thuật & Bàn giao (Academic & Quality Standards)
- **Comment & Document:** Mọi hàm phức tạp (đặc biệt là thuật toán lọc RSSI, xử lý Bluetooth) phải có comment giải thích rõ input, output và mục đích của logic đó. 
- **Bảo mật:** Không bao giờ hardcode mật khẩu database, secret keys, hay thông tin nhạy cảm vào source code. Luôn sử dụng biến môi trường (`.env`).
- **Xử lý lỗi:** Không sử dụng các khối `try/catch` trống. Mọi lỗi phải được log ra console một cách rõ ràng kèm theo thông điệp dễ hiểu để phục vụ quá trình debug.

### 3. Quy ước Lập trình cụ thể (Coding Conventions)

**Đối với Node.js & MySQL (Backend):**
- Sử dụng cú pháp ES6+ (Async/Await, Destructuring, Arrow functions).
- Áp dụng mô hình MVC (Model - View - Controller) hoặc Router-Controller-Service để tách biệt logic xử lý dữ liệu và logic điều hướng API.
- Tên bảng và cột trong MySQL phải sử dụng `snake_case` (ví dụ: `visit_logs`), tên biến trong file JavaScript sử dụng `camelCase` (ví dụ: `visitLogs`).

**Đối với React Native (Mobile):**
- Luôn ưu tiên sử dụng Functional Components và React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`). Tuyệt đối không dùng Class Components.
- Tách biệt UI và Logic: Các logic xử lý BLE/Bluetooth phức tạp nên được đưa ra các custom hooks riêng (ví dụ: `useBleScanner.ts`).
- Styling: Sử dụng `StyleSheet.create` chuẩn của React Native, giữ code UI gọn gàng.

**Đối với ESP32 (C++):**
- Tránh dùng hàm `delay()` trong vòng lặp chính (loop) vì sẽ làm treo vi điều khiển. Hãy dùng cơ chế non-blocking với `millis()`.
---