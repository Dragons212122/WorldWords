# Thông tin cá nhân

- **Họ tên**: Phạm Ngọc Kha
- **MSSV**: 24020002
- **Nhóm**: Dự án cá nhân (Solo)
- **Vai trò trong nhóm**: Fullstack Developer

---

### Task 1 — Planning & Setup
**Tuần**: Tuần 1

**Công việc đã làm**:
- Lên ý tưởng dự án WorldWords (ứng dụng học từ vựng IELTS).
- Tạo wireframe cho các trang chính bằng Figma.
- Setup dự án Vite + React, cài đặt và cấu hình Tailwind CSS v4.
- Thiết lập GitHub repository `Dragons212122/WorldWords` và lên project plan.

**Bằng chứng đóng góp**:
- Link repo: [Dragons212122/WorldWords](https://github.com/Dragons212122/WorldWords)
- Link Figma: Đã đính kèm trong README.

**Khó khăn gặp phải**:
- Cần tối ưu cấu trúc file để dễ quản lý state.

**Đánh giá bản thân**: 9/10

---

### Task 2 — UI Implementation
**Tuần**: Tuần 1–2

**Công việc đã làm**:
- Tách monolithic `App.jsx` ban đầu thành kiến trúc component hóa.
- Lập trình toàn bộ UI cho ứng dụng: `HomePage`, `CatalogPage`, `FlashcardsPage`, `AuthPage`, `DashboardPage`, `ProfilePage`, `QuizPage`.
- Tích hợp 3D CSS transforms cho Flashcards (Flip Card).
- Tối ưu hóa UI/UX, hỗ trợ hiển thị hoàn toàn Responsive (Mobile, Tablet, Desktop) cho mọi màn hình.

**Bằng chứng đóng góp**:
- Commit lịch sử chia component.
- Hoạt động mượt mà khi đổi size màn hình (Responsive).

**Khó khăn gặp phải**:
- Tốn nhiều thời gian xử lý các fixed heights (`h-[520px]`) và layout grid để Responsive mượt trên mobile.

**Đánh giá bản thân**: 10/10

---

### Task 3 — Database Integration
**Tuần**: Tuần 2

**Công việc đã làm**:
- Tích hợp Firebase Authentication (đăng ký, đăng nhập, khôi phục mật khẩu).
- Cấu trúc hệ thống dữ liệu từ vựng theo chủ đề `WORDS_BY_TOPIC` và theo dõi tiến độ người dùng (`streak`, `xp`, `rank`).
- Xây dựng cơ chế LocalStorage để lưu trạng thái Demo Mode (lưu bookmark, số từ đã học).
- Load dữ liệu động vào trang Flashcards, Quiz và Dashboard dựa trên tương tác người dùng.

**Bằng chứng đóng góp**:
- Các file `src/services/firebase.js` và `src/data/topics.js`.

**Khó khăn gặp phải**:
- Quản lý đồng bộ state học tập giữa các component khác nhau.

**Đánh giá bản thân**: 9/10

---

### Task 4 — Optimization
**Tuần**: Tuần 2–3

**Công việc đã làm**:
- Tối ưu Performance bằng cách nén ảnh, lazy-loading ảnh trên trang chủ.
- Kiểm tra toàn bộ trang với Google Lighthouse, đạt Performance `99` trên Desktop và `97` trên Mobile.
- Tích hợp công cụ Vercel Analytics và Speed Insights để theo dõi traffic và performance.

**Bằng chứng đóng góp**:
- Ảnh chụp màn hình Lighthouse (Đính kèm trong thư mục `public/imgs`).
- Code Analytics tích hợp trong component gốc.

**Khó khăn gặp phải**:
- Việc tối ưu performance trên mobile tốn chút thời gian liên quan đến ảnh dung lượng lớn.

**Đánh giá bản thân**: 10/10

---

### Task 5 — Peer Review
**Tuần**: Tuần 3

**Công việc đã làm**:
- Thực hiện review UI/UX cho project của nhóm khác.
- Đã phân tích cụ thể 3 tiêu chí: Usability & User Experience (UX), Aesthetics & UI Hierarchy, User-Friendliness & Responsiveness.
- Phản hồi và chuẩn bị thực hiện implement các feedback được góp ý cho hệ thống WorldWords.

**Bằng chứng đóng góp**:
- Đã tạo Issue #56 góp ý chi tiết: "Improve Layout Consistency, Component Contrast, and Mobile Scaling".
- Ảnh chụp Issue đã thêm vào README của project.

**Khó khăn gặp phải**:
- Chưa có.

**Đánh giá bản thân**: 9/10

---

### Tổng Kết Đóng Góp Cá Nhân

**Tóm tắt những gì bạn đã đóng góp cho dự án**:
Dự án được thực hiện Solo, nên tôi đảm nhận 100% khối lượng công việc, từ khâu lên ý tưởng, thiết kế UI/UX đến khi code giao diện Frontend, tích hợp Backend (Firebase), responsive toàn diện và tối ưu Lighthouse. Tôi đặc biệt tự hào về hệ thống Quiz và Flashcards lật 3D hoạt động mượt mà, cũng như khả năng quy hoạch kiến trúc code sạch và dễ duy trì. Kỹ năng tôi cải thiện nhiều nhất là tư duy Responsive Design với Tailwind v4 và State Management trong React.

**Ước tính % đóng góp so với cả nhóm**: 100%

**Điểm tự đánh giá tổng thể**: 9.5/10
