# Final Project Report

## Thông Tin Dự Án (Solo)

| | |
|---|---|
| **Hình thức** | Dự án cá nhân (Solo) |
| **Tên dự án** | WorldWords - IELTS Vocabulary |
| **GitHub Repository** | [Dragons212122/WorldWords](https://github.com/Dragons212122/WorldWords) |
| **Ngày nộp** | chưa xong |

### Sinh viên thực hiện

| Họ tên | MSSV | Vai trò |
|---|---|---|
| Phạm Ngọc Kha | 24020002 | Fullstack Developer |

---

## Tổng Quan Project và Công Nghệ Sử Dụng

**Mô tả ứng dụng:**

WorldWords là một ứng dụng học từ vựng IELTS Academic hiệu quả với phương pháp hiện đại. Ứng dụng cung cấp các công cụ như Flashcards, Quiz tương tác, Phát âm (Text-to-Speech) và theo dõi tiến độ học tập (XP, Streak) giúp sinh viên và học viên IELTS ôn luyện từ vựng một cách tối ưu.

**Tech stack:**

| Layer | Công nghệ |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS v4, Lucide React |
| Backend / Auth | Firebase Authentication |
| Database | Firebase Firestore / LocalStorage (Demo Mode) |
| Deploy | GitHub Pages |

**Tính năng chính:**

- Xác thực người dùng (Đăng nhập, Đăng ký, Quên mật khẩu).
- Thư viện từ vựng chia theo chủ đề (Academic, Business, Research, v.v.).
- Học từ vựng qua Flashcards lật 3D có tích hợp phát âm tiếng Anh.
- Làm Quiz trắc nghiệm đánh giá kiến thức và tích lũy điểm XP.
- Dashboard cá nhân hiển thị tiến độ học tập và cấp bậc rank.

---

## Hướng Dẫn Cài Đặt và Chạy Ứng Dụng

**Yêu cầu hệ thống:**

| Công cụ | Phiên bản |
|---|---|
| Node.js | >= 18.x |
| npm | >= 8.x |

**Các bước cài đặt:**

```bash
# 1. Clone repository
git clone https://github.com/Dragons212122/WorldWords.git
cd WorldWords

# 2. Cài đặt dependencies
npm install

# 3. Khởi động ứng dụng (Development mode)
npm run dev

# 4. Build dự án (Production mode)
npm run build
```

---

## Task 1 — Project Planning & Teamwork

### (a) Phân công vai trò

Do đây là dự án cá nhân, sinh viên tự thực hiện toàn bộ từ thiết kế UI/UX, lập trình Frontend bằng React và Tailwind CSS, đến tích hợp Backend bằng Firebase. Đồng thời tự cấu hình triển khai ứng dụng lên GitHub Pages.

### (b) Wireframe

- **Tool sử dụng:** Figma / Code Prototype
- **Các trang đã thiết kế:**
  - [x] Homepage
  - [x] Topic Catalog
  - [x] Flashcards
  - [x] Auth Page (Login / Register / Forgot Password)
  - [x] Dashboard & Profile

### (c) Project Plan

**Milestones:**

| Milestone | Trạng thái |
|---|---|
| Khởi tạo dự án & Setup môi trường | Hoàn thành |
| Xây dựng UI Component (Cards, Buttons, Navigation) | Hoàn thành |
| Tích hợp dữ liệu từ vựng & Flashcards 3D | Hoàn thành |
| Triển khai Animation và Refactor Auth | Hoàn thành |

### (d) GitHub Repository

- **Repository link:** [Dragons212122/WorldWords](https://github.com/Dragons212122/WorldWords)

### (e) Quy trình làm việc trên GitHub

Dự án được thực hiện cá nhân, do đó quy trình làm việc sử dụng Git tập trung vào việc tạo các nhánh tính năng (feature branches) để kiểm soát phiên bản. Các tính năng mới được phát triển và kiểm tra kỹ trên các nhánh (VD: `task-4/optimization`) trước khi được merge vào nhánh `main`.

**Ví dụ commit messages tiêu biểu:**

```
feat: finalize UI with images
fix: update image paths to match new filenames in publics/imgs
Merge updates from task-4/optimization
```

---

## Task 2 — Implement User Interface

### (a) Các trang đã xây dựng

| Trang | URL / Route | Mô tả | Người thực hiện |
|---|---|---|---|
| Homepage | `https://world-words.vercel.app/` | Trang chủ giới thiệu nền tảng và kêu gọi hành động. | Phạm Ngọc Kha |
| Catalog | `https://world-words.vercel.app/catalog` | Hiển thị danh sách các chủ đề từ vựng dạng thẻ. | Phạm Ngọc Kha |
| Flashcards | `https://world-words.vercel.app/flashcards` | Giao diện học từ vựng bằng thẻ lật tương tác 3D. | Phạm Ngọc Kha |
| Login | `https://world-words.vercel.app/login` | Trang đăng nhập vào hệ thống. | Phạm Ngọc Kha |
| Register | `https://world-words.vercel.app/register` | Trang đăng ký tài khoản mới. | Phạm Ngọc Kha |
| Forgot Password | `https://world-words.vercel.app/forgot-password` | Khôi phục mật khẩu qua email. | Phạm Ngọc Kha |
| Dashboard | `https://world-words.vercel.app/dashboard` | Tổng quan thông tin, XP, Rank của người dùng. | Phạm Ngọc Kha |
| Profile | `https://world-words.vercel.app/profile` | Chỉnh sửa thông tin cá nhân và thiết lập mục tiêu. | Phạm Ngọc Kha |

### (b) Sử dụng Tailwind CSS

Ứng dụng sử dụng **Tailwind CSS v4** để xây dựng toàn bộ UI.
- Sử dụng các utility classes tạo layout (Flexbox, Grid).
- Kết hợp classes animation cao cấp (`animate-bounce`, `hover:-translate-y-2`, `transition-all`, `group-hover:scale-105`) để mang lại trải nghiệm mượt mà, "Premium".
- Giao diện đáp ứng (Responsive) tốt trên nhiều màn hình.

### (c) Các tính năng tương tác

| Tính năng | Mô tả |
|---|---|
| **3D Flashcard** | Thẻ từ vựng lật 180 độ khi nhấn nhờ CSS 3D Transforms (`rotate-y-180`). |
| **Word Bookmark** | Nhấn icon Bookmark trên Flashcard để lưu trực tiếp từ khó vào mảng `savedWords` trong Profile. |
| **Password Visibility** | Nút toggle thay đổi dạng input từ `password` sang `text` và ngược lại. |
| **Hover Physics** | Ảnh và Card phóng to mượt mà, đổ bóng `shadow-2xl` khi di chuột. |

### (d) Giao diện trên nhiều thiết bị

- [x] Mobile (< 768px)
- [x] Tablet (768px – 1024px)
- [x] Desktop (> 1024px)

---

## Task 3 — Database Integration & Dynamic Content

### (a) Thiết kế cơ sở dữ liệu

- **Database system:** Firebase Firestore / LocalStorage (cho Demo Mode)

**Danh sách bảng (Collections):**

| Collection | Mô tả | Các cột chính |
|---|---|---|
| `users` | Quản lý thông tin người dùng. | `uid`, `email`, `name`, `goal`, `streak`, `xp`, `rank` |
| `WORDS_BY_TOPIC` | Cấu trúc dữ liệu tĩnh trong app (có thể thay bằng Document Database). | `term`, `pos`, `def`, `ex`, `trans` |

### (b) Kết nối cơ sở dữ liệu

- **Công nghệ server-side:** Firebase SDK.
- Hỗ trợ luồng xác thực `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `sendPasswordResetEmail`.

### (c) Các trang hiển thị dữ liệu động

| Trang | Dữ liệu hiển thị | Query / Endpoint | Người thực hiện |
|---|---|---|---|
| Flashcards | Danh sách thẻ từ vựng dựa theo chủ đề người dùng đã chọn. | `GET https://world-words.vercel.app/api/topics/:id/words` | Nguyễn Ngọc |
| Dashboard | Tên người dùng, Điểm XP, Rank hiện tại. | `GET https://world-words.vercel.app/api/users/:uid/dashboard` | Nguyễn Ngọc |
| Profile | Form thông tin chi tiết (Email, Mục tiêu, Chuỗi ngày học liên tiếp). | `GET/PUT https://world-words.vercel.app/api/users/:uid/profile` | Nguyễn Ngọc |

---

## Task 4 — Optimization

### (a) Kiểm tra hiệu năng với Lighthouse

Ứng dụng được tối ưu hóa liên tục để đạt điểm số cao trên Lighthouse. Hình ảnh trên trang chủ sử dụng Unsplash được nén với tham số `?auto=format&fit=crop&q=80` và gắn thuộc tính `loading="lazy"`.

**Kết quả sau khi tối ưu:**

| Metric | Điểm (Dự kiến/Đo được) |
|---|---|
| Performance | 95+ |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

### (b) Theo dõi hành vi người dùng

- [x] Đã tích hợp các công cụ **Vercel Analytics** (`@vercel/analytics`) và **Speed Insights** (`@vercel/speed-insights`).
- Các component `<Analytics />` và `<SpeedInsights />` được đặt ở cấp độ gốc của ứng dụng (`App.jsx`) để thu thập dữ liệu truy cập và Web Vitals.

---

## Deliverables Checklist

- [x] **Source code trên GitHub**
- [x] **README.md** (Chứa đầy đủ nội dung Report)
