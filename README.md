# Dashboard Quản Lý Đào Tạo - Trường Đào Tạo Cán Bộ Agribank

Hệ thống Dashboard theo dõi & phân tích dữ liệu đào tạo thời gian thực (Real-time) kết nối trực tiếp với Google Sheet.

## 🚀 Tính năng nổi bật

- **Đồng bộ Google Sheet trực tiếp (On-Demand & On-Load):**
  - Tự động nạp dữ liệu mới nhất trực tiếp từ Google Sheet mỗi khi bắt đầu mở trình duyệt / tải lại trang.
  - Hỗ trợ nút **"Đồng bộ Sheet"** thủ công trên thanh điều khiển để làm mới dữ liệu tức thì theo ý muốn, không tự động làm mới ngầm gây phiền toái.
  - Hỗ trợ cấu hình đường link Google Sheet tùy biến trực tiếp trên giao diện.
  - Cơ chế cache thông minh (`localStorage` + `data.js` dự phòng) giúp dashboard luôn hiển thị tức thì, không bị trắng trang ngay cả khi mất mạng.
- **5 Chỉ số KPI cốt lõi:** Số lượng chương trình, Số lớp học, HV Kế hoạch, HV Thực tế, Tỉ lệ tham dự (Gauge chart).
- **Trực quan hóa sinh động:** Biểu đồ so sánh kế hoạch & thực tế theo lớp (cuộn ngang mượt mà với nhãn dữ liệu thông minh), tiến độ tham dự theo chương trình.
- **Bảng dữ liệu chi tiết:** Bộ lọc đa chiều (Thời gian, Địa điểm, Hình thức đào tạo, Loại chương trình, Tìm kiếm theo từ khóa), sắp xếp đa cột và modal xem chi tiết từng lớp học.
- **Tuân thủ quy tắc hiển thị:** Hình thức đào tạo hiển thị chính xác theo dữ liệu gốc từ bảng dữ liệu (`hinh_thuc_hoc` / `hinh_thuc_dt`).

---

## 🌐 Hướng dẫn Đưa lên GitHub & Kích hoạt GitHub Pages

1. **Khởi tạo và đẩy mã nguồn lên GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Realtime Training Dashboard"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Kích hoạt GitHub Pages:**
   - Truy cập vào Repository trên GitHub: **Settings** -> **Pages**.
   - Tại mục **Build and deployment**:
     - **Source**: Chọn `Deploy from a branch`.
     - **Branch**: Chọn `main`, thư mục `/ (root)`.
     - Bấm **Save**.
   - Chờ khoảng 1-2 phút, GitHub Pages sẽ cấp link truy cập công khai có dạng:
     `https://<your-username>.github.io/<your-repo-name>/`

---

## 💻 Chạy cục bộ trên máy tính (Local)

Dashboard tuân thủ quy tắc phục vụ trên cổng **9669**:
```bash
node server.js
```
Truy cập qua trình duyệt tại: [http://localhost:9669](http://localhost:9669)
