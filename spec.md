# SPEC.md — SMART TRAINING MANAGEMENT DASHBOARD
## Đặc tả tổng thể dự án dành cho Antigravity IDE

**Phiên bản:** 1.0  
**Phạm vi:** Web dashboard quản lý, phân tích và báo cáo dữ liệu đào tạo tại Trường Đào tạo cán bộ Agribank  
**Mục tiêu triển khai:** Xây dựng ứng dụng BI nội bộ có tương tác đa chiều, báo cáo chi tiết và khả năng mở rộng theo từng phân hệ.

---

## 1. Mục tiêu và nguyên tắc triển khai

### 1.1. Mục tiêu
Xây dựng một ứng dụng dashboard web độc lập giúp tổng hợp, trực quan hóa và phân tích dữ liệu đào tạo từ các nguồn dữ liệu hiện có. Hệ thống phục vụ hai nhu cầu chính:

1. **Quản trị tổng quan:** theo dõi quy mô, tiến độ, chất lượng và hiệu quả đào tạo.
2. **Báo cáo nghiệp vụ:** tra cứu và lập báo cáo chi tiết theo Mã lớp học hoặc Mã chương trình, với bố cục và thứ tự nội dung tương ứng biểu mẫu đánh giá của Trường.

Ứng dụng mô phỏng trải nghiệm phân tích của Power BI Service, nhưng không tuyên bố là Power BI và không phụ thuộc vào Power BI để vận hành.

### 1.2. Nguyên tắc bắt buộc
- **Cổng phục vụ Web Server:** Tất cả các dashboard khi phục vụ web server phải luôn chạy trên cổng **9669** (`http://localhost:9669`).
- **Quy tắc GitHub:** Tuyệt đối **KHÔNG tự động push code lên GitHub**. Mọi tính năng, màn hình mới và link dữ liệu chỉ phát triển, kiểm thử trên môi trường cục bộ (localhost:9669). Chỉ đẩy code lên GitHub khi người dùng yêu cầu trực tiếp.
- **Quy tắc hiển thị Hình thức đào tạo:** Hiển thị theo dữ liệu gốc tại bảng dữ liệu data (`hinh_thuc_hoc` / `hinh_thuc_dt`); riêng trường hợp lớp học có cả phần trực tuyến và trực tiếp cùng mã lớp thì dòng trực tuyến được tự động suy diễn gộp tên thành "Trực tiếp kết hợp Trực tuyến".
- **Tính thống nhất với `PROJECT_CONTEXT.md`:** `spec.md` và `PROJECT_CONTEXT.md` là bộ đôi tài liệu tham chiếu chuẩn mực, bắt buộc tuân thủ trong toàn bộ vòng đời phát triển dự án.
- Dữ liệu là nguồn sự thật duy nhất; không tự tạo số liệu nghiệp vụ khi dữ liệu nguồn chưa có.
- Tách rõ **dữ liệu thực**, **dữ liệu mẫu/mock** và **chỉ số suy diễn**.
- Không suy diễn quan hệ giữa các bảng nếu chưa xác định khóa ghép.
- Mọi chỉ số phải có định nghĩa, mẫu số, phạm vi lọc và quy tắc xử lý dữ liệu thiếu rõ ràng.
- Các biểu đồ, KPI, bảng dữ liệu và báo cáo phải dùng chung logic tính toán.
- Tương tác lọc phải nhất quán giữa các thành phần; có thể xóa bộ lọc hoặc quay về trạng thái mặc định.
- Giữ nguyên dữ liệu gốc; chuẩn hóa ở lớp xử lý, không ghi đè nguồn.
- Không hiển thị thông tin cá nhân không cần thiết; không đưa dữ liệu nhạy cảm vào log.
- Ưu tiên kiến trúc đơn giản, có thể kiểm thử, bảo trì và mở rộng theo từng giai đoạn.

---

## 2. Phạm vi chức năng

### 2.1. Các phân hệ mục tiêu

Ứng dụng được thiết kế theo dạng SPA với các tab/phân hệ sau. Chỉ triển khai những phân hệ có dữ liệu nguồn tương ứng; phần chưa có dữ liệu phải hiển thị trạng thái “Chưa có dữ liệu nguồn/Chưa triển khai”, không dựng số liệu giả như số liệu thật.

1. **Tình hình và quy mô đào tạo**
   - Tổng lượt học viên/lượt đào tạo theo định nghĩa dữ liệu.
   - Kế hoạch và thực tế theo thời gian nếu có bảng kế hoạch.
   - Phân bổ theo đơn vị, chương trình, nhóm nội dung, hình thức và thời gian.
   - Tiến độ lớp học và các cảnh báo dữ liệu đủ điều kiện xác định.

2. **Đánh giá chất lượng giảng viên**
   - Điểm đánh giá theo giảng viên, lớp, chương trình và tiêu chí.
   - So sánh giảng viên nội bộ/chuyên gia ngoài nếu nguồn có phân loại.
   - Xếp hạng có điều kiện về số phiếu tối thiểu; cho phép drill-through tới lớp/tiêu chí.
   - Không gộp thang điểm 4 và thang điểm 5 nếu chưa có quy tắc chuẩn hóa được phê duyệt.

3. **Đánh giá nội dung đào tạo**
   - Ba tiêu chí cốt lõi từ sheet `NĐĐT`: phù hợp vị trí công việc, tính thực tiễn, khả năng áp dụng kiến thức.
   - Phân bố mức đánh giá 4–3–2–1, điểm trung bình và tỷ lệ đánh giá tích cực.
   - Phân tích theo lớp, chương trình, hình thức học và cán bộ quản lý.
   - Đặc tả chi tiết tại mục 7.

4. **Công tác tổ chức và cơ sở vật chất**
   - Chỉ số tổ chức lớp, cơ sở vật chất, hậu cần, đường truyền, thiết bị… khi có dữ liệu nguồn.
   - Phân tích theo địa điểm, lớp, chương trình và hình thức.

5. **Phương pháp và hình thức học tập**
   - Đánh giá hoạt động học tập, phương pháp, hình thức đào tạo và mức độ tương tác nếu dữ liệu có.
   - So sánh trực tiếp, trực tuyến, hybrid nhưng phải tách đúng phạm vi đánh giá.

6. **Hiệu quả đầu ra và ứng dụng thực tiễn**
   - Điểm đầu vào/đầu ra, tỷ lệ đạt, cam kết áp dụng… chỉ khi có nguồn dữ liệu tương ứng.
   - Không dùng phản hồi tự đánh giá để khẳng định tác động thực tế nếu chưa có dữ liệu kiểm chứng.

7. **Báo cáo chi tiết lớp học/chương trình**
   - Tra cứu theo `Mã lớp` hoặc `Mã chương trình`.
   - Sinh báo cáo theo thứ tự và cấu trúc biểu mẫu tại mục 8.
   - Hỗ trợ lớp trực tiếp, trực tuyến và hybrid; hybrid phải có phần đánh giá riêng theo từng hình thức.

### 2.2. Trạng thái phân hệ
Mỗi phân hệ có trạng thái `ready`, `partial` hoặc `not_available`. UI cần thể hiện rõ khi chưa có dữ liệu, chưa cấu hình hoặc chưa triển khai. Không hiển thị KPI giả để lấp chỗ trống.

---

## 3. Công nghệ và kiến trúc

### 3.1. Hiện trạng hệ thống và định hướng tiến hóa
- **Hiện trạng hệ thống (Current Stack):** Ứng dụng hiện đang vận hành ổn định trên nền tảng Single Page Application với HTML5, Vanilla CSS (CSS Variables / Design Tokens chuẩn tông màu Agribank), JavaScript ES6+ module hóa, Chart.js / Apache ECharts, Node.js Express server chạy cố định tại cổng **9669** (`http://localhost:9669`).
- **Định hướng chuẩn hóa & nâng cấp (Target Stack):**
  - **Frontend:** React + Vite + TypeScript.
  - **Charting:** Apache ECharts qua `echarts-for-react`.
  - **State management:** Zustand.
  - **Data grid:** TanStack Table.
  - **Styling:** Tailwind CSS / CSS variables/design tokens cho hệ màu.
  - **Icons:** Lucide React / FontAwesome 6.
  - **Kiểm thử:** Vitest và React Testing Library; bổ sung kiểm thử end-to-end nếu dự án có cấu hình phù hợp.
  - **Import/export:** Thư viện phù hợp để đọc/ghi Excel và CSV (SheetJS / ExcelJS / jsPDF).
  - **Backend:** Node.js server chạy cổng 9669; adapter đọc dữ liệu từ local file (CSV, JSON) và Google Sheets. Không nhúng secret/API key vào frontend.
- **Quy tắc phát triển kỹ thuật:** Các module/phân hệ phát triển mới phải trực tiếp tương thích và chạy được ngay trên nền tảng hiện tại (port 9669), không làm gián đoạn các tính năng đang hoạt động. Không tự ý thay thế công nghệ nếu chưa có kế hoạch di chuyển được duyệt.

### 3.2. Cấu trúc module tham khảo
```text
src/
  app/
    App.tsx
    routes.tsx
  components/
    layout/
    filters/
    kpi/
    charts/
    tables/
    feedback-report/
  features/
    training-overview/
    instructor-performance/
    content-evaluation/
    operations-facilities/
    learning-methods/
    learning-impact/
    class-program-report/
  data/
    adapters/
    mock/
    schemas/
  domain/
    models/
    metrics/
    validation/
  store/
    filterStore.ts
    trainingScheduleStore.ts
    trainingFeedbackStore.ts
  services/
    export/
    report/
  styles/
    tokens.css
  tests/
```
Đây là cấu trúc định hướng, không phải yêu cầu tạo toàn bộ file rỗng. Trước khi sửa dự án hiện có, Agent phải kiểm tra cấu trúc, dependencies, quy ước và tái sử dụng thành phần đã có.

### 3.3. Phân tầng
1. **Source/Adapter:** lấy dữ liệu từ Google Sheets, Excel/CSV hoặc nguồn đã cấu hình.
2. **Validation & normalization:** chuẩn hóa tên cột, kiểu dữ liệu, ngày, mã, số lượng và giá trị trống.
3. **Domain model:** mô hình dữ liệu nghiệp vụ và quan hệ khóa.
4. **Metrics engine:** tính toán chỉ số tập trung, không viết công thức rời rạc trong từng biểu đồ.
5. **State/filter engine:** quản lý bộ lọc và lựa chọn tương tác.
6. **Presentation:** KPI, biểu đồ, bảng và báo cáo.
7. **Export:** xuất dữ liệu/báo cáo theo bộ lọc hiện hành.

---

## 4. Mô hình dữ liệu và quy tắc chất lượng dữ liệu

### 4.1. Nguồn dữ liệu
Các nguồn dự kiến:
- Sheet `NĐĐT` trong file đánh giá: dữ liệu đánh giá nội dung đào tạo.
- File `Data bao cao`: thông tin danh mục/lớp/chương trình liên quan.
- Nguồn lịch đào tạo hiện có: thông tin kế hoạch, lớp, thời gian, địa điểm, hình thức và cán bộ quản lý nếu được cung cấp.
- Các nguồn giảng viên, cơ sở vật chất, kết quả học tập… chỉ được tích hợp khi đã xác định được file/bảng và định nghĩa trường.

Tên file, tên sheet, tên cột và kiểu dữ liệu thực tế phải được kiểm tra khi kết nối. Không coi tên trường trong tài liệu này là bằng chứng rằng cột đã tồn tại trong nguồn.

### 4.2. Mô hình logic gợi ý
- `dim_class`: một dòng cho mỗi lớp, khóa nghiệp vụ `class_id`/`ma_lop`.
- `dim_program`: một dòng cho mỗi chương trình, khóa nghiệp vụ `program_id`/`ma_chuong_trinh`.
- `dim_date`: ngày, tháng, quý, năm.
- `fact_training_progress`: dữ liệu tiến độ/học viên nếu có.
- `fact_content_feedback`: dữ liệu đánh giá nội dung theo lớp và hình thức.
- `fact_general_feedback`: dữ liệu đánh giá phương pháp, tổ chức, cơ sở vật chất, giảng viên và đánh giá chung nếu đã chuẩn hóa được.
- Các dimension giảng viên, đơn vị, địa điểm chỉ tạo khi nguồn dữ liệu có khóa và định nghĩa rõ.

Đây là mô hình logic mục tiêu, không yêu cầu chuyển ngay mọi nguồn sang star schema nếu giai đoạn hiện tại đang dùng Google Sheets/Excel. Có thể xây adapter để ánh xạ dữ liệu nguồn sang mô hình chuẩn.

### 4.3. Grain và khóa
- `fact_content_feedback`: grain mục tiêu là **một lớp × một hình thức học × một tiêu chí đánh giá**. Nếu nguồn đang ở dạng rộng (mỗi tiêu chí là nhiều cột số phiếu), chuyển đổi sang dạng dài trong lớp chuẩn hóa.
- Khóa lớp ưu tiên `Mã lớp`; khóa chương trình là `Mã chương trình`. Không dùng tên chương trình làm khóa chính nếu có mã ổn định.
- Hybrid: cùng `Mã lớp` có thể có nhiều bản ghi theo `Hình thức học` (Trực tiếp/Trực tuyến). Khóa nghiệp vụ của dữ liệu đánh giá phải bao gồm tối thiểu `Mã lớp + Hình thức học + Tiêu chí`, hoặc khóa nguồn tương đương.
- Nếu một lớp thuộc một chương trình, quan hệ lớp → chương trình phải được xác nhận bằng dữ liệu nguồn. Không tự ghép chỉ dựa trên tên gần giống.
- Phải phát hiện khóa trùng, mã thiếu và bản ghi không ghép được; báo cáo lỗi dữ liệu thay vì âm thầm loại bỏ.

### 4.4. Chuẩn hóa trường
Chuẩn hóa về dạng nội bộ nhất quán, đồng thời giữ lại giá trị gốc để truy vết:
- `ma_lop`, `ma_chuong_trinh`, `chuong_trinh`, `hinh_thuc_hoc`.
- `ngay_bat_dau`, `ngay_ket_thuc`, `cbql`, `dia_diem`.
- Với đánh giá: `criterion_code`, `rating_level`, `response_count`, `score_mean` nếu nguồn cung cấp.
- Loại bỏ khoảng trắng thừa, chuẩn hóa cách viết hình thức học, nhưng không tự sửa các mã nghiệp vụ.
- Ngày phải được parse theo định dạng được xác nhận; ngày lỗi phải được gắn cờ.
- Ô trống ở các cột số lượng có thể chuẩn hóa thành 0 **chỉ khi xác định ô trống có nghĩa là không có phiếu**. Nếu ô trống có thể là thiếu dữ liệu, giữ trạng thái missing và đánh dấu cần kiểm tra.

### 4.5. Đối soát số liệu
- Nếu nguồn có số phiếu, tỷ lệ và điểm bình quân, ưu tiên tính lại từ số phiếu theo công thức được xác nhận rồi so sánh với giá trị nguồn.
- Tỷ lệ phần trăm làm tròn có thể khiến tổng khác 100%; không tự điều chỉnh số liệu gốc.
- Tổng số phiếu không mặc định bằng tổng lượt học viên tham gia; một học viên có thể không trả lời tất cả câu hỏi.
- Không cộng số phiếu của các tiêu chí để gọi là “tổng số người đánh giá”. Dùng nhãn chính xác như “Tổng lượt phản hồi theo tiêu chí” hoặc “Số phiếu phản hồi” tùy định nghĩa dữ liệu.
- Với dữ liệu không đủ để tính chỉ số, hiển thị `—` kèm chú giải phù hợp; tránh chia cho 0, `NaN`, `Infinity`.

---

## 5. Design System và quy tắc UI/UX

### 5.1. Bố cục
- Thiết kế ưu tiên màn hình desktop 16:10, baseline tham chiếu 1920×1200; responsive theo kích thước vùng chứa, không khóa cứng chiều rộng.
- Các độ phân giải nhỏ hơn phải có cuộn hợp lý, không làm mất chức năng.
- Clean Enterprise, card-based; hiệu ứng glassmorphism chỉ dùng nhẹ nếu không ảnh hưởng độ tương phản và hiệu năng.
- Header và thanh lọc có thể sticky; không để che nội dung hoặc chiếm quá nhiều chiều cao.

### 5.2. Design tokens
```css
:root {
  --color-primary: #8C1D40;
  --color-primary-accent: #AE1C3F;
  --color-success-dark: #0F5132;
  --color-success: #10B981;
  --color-warning: #D97706;
  --color-danger: #E11D48;
  --color-text: #374151;
  --color-muted: #9CA3AF;
  --color-surface: #F8FAFC;
  --color-border: #E2E8F0;
  --radius-card: 12px;
  --radius-control: 8px;
}
```
Typography ưu tiên Inter; có fallback hệ thống. Đảm bảo hiển thị tiếng Việt, tương phản và trạng thái focus rõ ràng. Màu sắc không phải cách duy nhất để truyền tải trạng thái; dùng nhãn/icon đi kèm.

### 5.3. Thành phần dùng chung
- App header và tab navigation.
- Global filter bar, dropdown đa chọn, date range, search.
- KPI cards, chart containers, empty/loading/error states.
- Bảng dữ liệu có sắp xếp, phân trang, trạng thái không có kết quả.
- Modal/drawer chi tiết, nút reset bộ lọc, export.
- Hiển thị trạng thái đồng bộ dữ liệu: lần đồng bộ cuối, thành công/thất bại. Chỉ dùng nhãn “Realtime” nếu nguồn thực sự hỗ trợ cập nhật gần thời gian thực; nếu không, ghi đúng “Lần cập nhật gần nhất”.

---

## 6. Global Filter và tương tác kiểu Power BI

### 6.1. Bộ lọc toàn cục
Bộ lọc có thể gồm:
- Khoảng thời gian/năm/quý.
- Mã lớp.
- Mã chương trình/chương trình.
- Hình thức học.
- Đơn vị/địa bàn.
- Cán bộ quản lý.
- Giảng viên.
- Khoảng điểm hoặc mức đánh giá, khi áp dụng được cho phân hệ hiện tại.

Chỉ hiển thị bộ lọc khi có trường dữ liệu tương ứng. Bộ lọc không liên quan tới một phân hệ có thể được ẩn hoặc vô hiệu hóa có giải thích.

### 6.2. Quy tắc cross-filtering
- Click vào phần tử biểu đồ có thể chọn một hoặc nhiều giá trị và cập nhật `filterContext`.
- Tất cả KPI, biểu đồ, bảng và báo cáo trong phạm vi áp dụng phải dùng cùng ngữ cảnh lọc.
- Click lại phần tử đang chọn hoặc dùng nút “Xóa lựa chọn” để bỏ lọc; phím `Esc` có thể đóng modal/tooltip và bỏ lựa chọn biểu đồ nếu hành vi đó không gây mất thao tác đang nhập.
- Phân biệt **filter** (loại các bản ghi ngoài lựa chọn) và **highlight** (giữ ngữ cảnh nhưng làm nổi bật phần được chọn).
- Trạng thái lựa chọn phải nhìn thấy được và có cách xóa rõ ràng.
- Không được để click biểu đồ gây vòng lặp cập nhật state hoặc làm mất bộ lọc độc lập.
- Thêm kiểm thử cho lọc kết hợp, xóa lọc, không có kết quả và dữ liệu trùng.

### 6.3. Quy tắc tính toán
Tạo lớp metric/service dùng chung. Mỗi metric cần khai báo:
- Tên và mô tả.
- Công thức.
- Thang điểm.
- Tập bản ghi/mẫu số.
- Quy tắc loại trừ missing/null.
- Quy tắc làm tròn.
- Bộ lọc có ảnh hưởng.
- Nếu là tỷ lệ, xác định rõ tử số và mẫu số.

Không áp dụng một ngưỡng “tốt/xuất sắc” cho mọi thang điểm nếu chưa được nghiệp vụ phê duyệt.

---

## 7. Đặc tả phân hệ: Nội dung đào tạo

### 7.1. Nguồn và trường dữ liệu
Nguồn chính là sheet `NĐĐT`. Các trường dự kiến:
- `Mã lớp`, `Chương trình`, `Ngày bắt đầu`, `Ngày kết thúc`, `Hình thức học`, `CBQL`.
- Ba tiêu chí:
  1. Nội dung đào tạo phù hợp với yêu cầu vị trí công việc và mục tiêu học tập.
  2. Tính thực tiễn của nội dung đào tạo sát với yêu cầu công việc.
  3. Khả năng áp dụng kiến thức vào công việc thực tế.
- Với mỗi tiêu chí: số phiếu mức 4, 3, 2, 1. Tên cột thực tế phải được đối chiếu trực tiếp khi nạp dữ liệu.

### 7.2. Công thức
Với một tiêu chí:
- `N = N4 + N3 + N2 + N1`, chỉ cộng các giá trị hợp lệ đã xác định.
- `Điểm TB = (4*N4 + 3*N3 + 2*N2 + 1*N1) / N`, khi `N > 0`.
- `Tỷ lệ tích cực = (N4 + N3) / N * 100%`, khi `N > 0`.
- `Tỷ lệ từng mức = Nm / N * 100%`.
- `Điểm tổng hợp lớp = trung bình cộng của điểm TB các tiêu chí có dữ liệu`, trừ khi nghiệp vụ yêu cầu trọng số khác. Ghi rõ số tiêu chí được tính.
- Không gộp tổng số phiếu của ba tiêu chí để thể hiện số học viên phản hồi duy nhất.

### 7.3. Bộ lọc
- Khoảng ngày/năm/quý dựa trên ngày bắt đầu hoặc quy tắc ngày được nghiệp vụ chọn rõ ràng.
- Hình thức học: Trực tiếp, Trực tuyến.
- Chương trình, Mã lớp, CBQL.
- Mức điểm: ngưỡng tùy chỉnh hoặc các nhóm đã được phê duyệt. Không hard-code nhãn “Xuất sắc/Tốt/Cần cải thiện” nếu chưa thống nhất quy chuẩn.
- Tìm kiếm theo Mã lớp, chương trình.

### 7.4. KPI cards
1. Số phiếu phản hồi theo phạm vi hiện hành (định nghĩa rõ là tổng phiếu theo tiêu chí hay số phiếu duy nhất).
2. Điểm trung bình tổng hợp (thang 4.0).
3. Điểm TB phù hợp vị trí công việc.
4. Điểm TB tính thực tiễn.
5. Điểm TB khả năng áp dụng.
Có thể thêm tỷ lệ tích cực dưới từng KPI tiêu chí.

### 7.5. Biểu đồ
- **100% stacked bar:** phân bổ mức 4/3/2/1 theo ba tiêu chí; tooltip hiển thị số phiếu và tỷ lệ.
- **Xếp hạng lớp:** điểm tổng hợp theo lớp, có tùy chọn xem nhóm cao/thấp; hiển thị số phiếu để cung cấp bối cảnh.
- Không xếp hạng hoặc kết luận lớp khi số phiếu quá ít nếu chưa cấu hình ngưỡng tối thiểu.
- Bảng chi tiết: Mã lớp/chương trình, hình thức, thời gian, CBQL, điểm từng tiêu chí, điểm tổng hợp, số phiếu; modal/drawer cho phân rã số phiếu từng mức.
- Sort, phân trang, export CSV/Excel.

---

## 8. Đặc tả phân hệ: Báo cáo chi tiết lớp học/chương trình

### 8.1. Mục tiêu và cách tra cứu
Cho phép người dùng lập báo cáo theo:
- **Mã lớp học**: báo cáo một lớp cụ thể.
- **Mã chương trình**: báo cáo phạm vi chương trình; hiển thị các lớp thuộc chương trình theo nguồn dữ liệu đã xác nhận.
- Nếu tra cứu theo Mã chương trình có nhiều lớp, hiển thị danh sách lớp để chọn xem từng lớp hoặc tạo báo cáo tổng hợp chương trình. Không cộng các chỉ số không cùng mẫu số hoặc khác hình thức mà không chú thích.

### 8.2. Xác định hình thức đào tạo
Mỗi lớp/chương trình có thể thuộc một trong các trường hợp:
- **Trực tiếp:** hiển thị một phần báo cáo “Trực tiếp”.
- **Trực tuyến:** hiển thị một phần báo cáo “Trực tuyến”.
- **Hybrid (kết hợp):** phải trình bày riêng phần đánh giá Trực tiếp và phần đánh giá Trực tuyến. Không gộp hai phần thành một bảng duy nhất nếu làm mất khả năng đối chiếu.
- Nếu nguồn chỉ có dữ liệu một hình thức, không tự tạo phần còn thiếu; hiển thị “Chưa có dữ liệu đánh giá cho hình thức này”.

### 8.3. Phần đầu báo cáo
Trình bày theo mẫu hành chính của Trường Đào tạo cán bộ Agribank:
- Khối trái: “TRƯỜNG ĐÀO TẠO CÁN BỘ AGRIBANK” và “PHÒNG QUẢN LÝ ĐÀO TẠO VÀ THƯ VIỆN”.
- Khối phải: “CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM” và “Độc lập - Tự do - Hạnh phúc”.
- Khu vực logo/ảnh: chỉ dùng tài nguyên logo chính thức có sẵn trong dự án hoặc được cung cấp; không tự vẽ logo giả.
- Tiêu đề: **BẢNG TỔNG HỢP PHIẾU NHẬN XÉT, ĐÁNH GIÁ ([HÌNH THỨC])**.
- Tên chương trình đầy đủ.
- Dòng mã lớp, địa điểm và thời gian tổ chức.
- Dòng số người/lượt tham gia đánh giá, chỉ hiển thị nếu nguồn có dữ liệu đáng tin cậy. Nếu chỉ có số phiếu theo câu hỏi, ghi rõ “Số phiếu phản hồi” thay vì suy diễn số người.

### 8.4. Thứ tự các mục trong báo cáo
Giữ đúng thứ tự dưới đây. Chỉ hiển thị mục khi có cấu hình nguồn tương ứng; nếu biểu mẫu yêu cầu cố định thì giữ tiêu đề và ghi “Chưa có dữ liệu”.

#### I. Đánh giá về Nội dung đào tạo
Bảng gồm:
- TT.
- Nội dung đánh giá.
- Tổng số phiếu.
- Điểm đánh giá bình quân (tối đa 4 điểm).
- Tốt (4 điểm): số phiếu và tỷ lệ %.
- Khá (3 điểm): số phiếu và tỷ lệ %.
- Bình thường (2 điểm): số phiếu và tỷ lệ %.
- Hạn chế (1 điểm): số phiếu và tỷ lệ %.

Các tiêu chí dự kiến:
1. Nội dung đào tạo phù hợp với yêu cầu vị trí công việc và mục tiêu học tập.
2. Tính thực tiễn của nội dung đào tạo sát với yêu cầu công việc.
3. Kiến thức từ khóa học có thể áp dụng hiệu quả vào công việc thực tế.

#### II. Đánh giá về phương pháp, hình thức đào tạo
Bảng có cấu trúc phân phối phiếu:
- TT, Nội dung đánh giá, Tổng số phiếu, Điểm bình quân (tối đa 4 điểm hoặc theo thang điểm thực tế của biểu mẫu), số phiếu và tỷ lệ cho từng mức.
- Ví dụ tiêu chí: hoạt động học tập (thảo luận, bài tập, tình huống) hỗ trợ tiếp thu; mức độ phù hợp và hiệu quả của hình thức đào tạo.
- Không mặc định mọi câu hỏi ở phần này dùng thang 4 nếu nguồn biểu mẫu thực tế khác.

#### III. Công tác tổ chức, cơ sở vật chất
Bảng gồm:
- TT, Nội dung đánh giá, Tổng số phiếu, Điểm bình quân, số phiếu và tỷ lệ theo từng mức đánh giá.
- Các nội dung có thể gồm công tác tổ chức lớp, cơ sở vật chất, phục vụ hậu cần.
- Thang điểm lấy từ biểu mẫu/nguồn của từng câu hỏi; không suy đoán.

#### IV. Đánh giá về Giảng viên
Tổ chức theo từng giảng viên, mỗi người có tên và chuyên đề/nội dung giảng dạy. Các tiêu chí thường gồm:
1. Kiến thức chuyên môn, nghiệp vụ theo nội dung giảng dạy.
2. Kỹ năng sư phạm và phương pháp giảng dạy.
3. Thái độ, tác phong của giảng viên.

Cột bảng:
- TT.
- Nội dung/tiêu chí đánh giá.
- Tổng số phiếu.
- Điểm bình quân (thang 5 điểm nếu đúng theo biểu mẫu).
- Xuất sắc (5), Tốt (4), Khá (3), Bình thường (2), Hạn chế (1): số phiếu và tỷ lệ từng mức.

Không gộp điểm của các giảng viên khác nhau thành một kết quả duy nhất nếu không có chỉ số tổng hợp được định nghĩa.

#### V. Đánh giá chung
Các câu hỏi có thể gồm:
1. Mức độ cải thiện kiến thức sau khóa học.
2. Mức độ cải thiện kỹ năng làm việc sau khóa học.
3. Nội dung hữu ích nhất của khóa học.
4. Ý kiến góp ý khác.

Với câu hỏi định lượng: hiển thị tổng phiếu, điểm bình quân và phân bố phiếu theo đúng thang điểm trong biểu mẫu. Với câu hỏi mở: hiển thị nội dung ý kiến đã được tổng hợp hoặc danh sách phản hồi theo quyền truy cập; giữ nguyên ý nghĩa, không tự tạo nội dung. Nếu cần ẩn danh, loại bỏ thông tin nhận diện cá nhân.

### 8.5. Cách tổng hợp theo chương trình
- Báo cáo chương trình có phần thông tin chung và danh sách lớp trực thuộc.
- Cho phép xem từng lớp riêng.
- Khi tổng hợp nhiều lớp, tính điểm bình quân theo số phiếu hợp lệ của từng mức/tiêu chí nếu dữ liệu cho phép; không lấy trung bình đơn giản các điểm lớp khi số phiếu khác nhau, trừ khi quy định nghiệp vụ yêu cầu.
- Phải phân tách theo hình thức học nếu lớp hybrid hoặc các lớp có hình thức khác nhau.
- Ghi rõ số lớp, số phiếu và phạm vi ngày được tổng hợp.
- Câu trả lời mở có thể nhóm theo chủ đề nhưng phải giữ nội dung có căn cứ và cho phép truy nguyên nguồn khi được phép.

### 8.6. UI/UX báo cáo
- Khu vực tra cứu nổi bật: chọn loại tra cứu (Mã lớp/Mã chương trình), nhập hoặc chọn mã, nút “Tạo báo cáo”.
- Hiển thị thông tin lớp/chương trình trước báo cáo để người dùng xác nhận đúng đối tượng.
- Với hybrid, dùng tab/section “Trực tiếp” và “Trực tuyến”, nhưng khi in/xuất PDF phải bảo đảm cả hai phần được xuất đầy đủ.
- Hỗ trợ xem trước, in, xuất PDF và xuất Excel. PDF phải ưu tiên khổ giấy ngang nếu bảng nhiều cột; có thể chia trang lặp lại hàng tiêu đề bảng.
- Excel giữ dữ liệu số dạng số, ngày dạng ngày và tỷ lệ dạng phần trăm; không chỉ xuất ảnh chụp dashboard.
- Tên file gợi ý: `Bao_cao_danh_gia_<MaLop>_<HinhThuc>_<YYYYMMDD>`.
- Trạng thái rõ ràng cho không tìm thấy mã, thiếu dữ liệu, lỗi tải dữ liệu và báo cáo đang tạo.

---

## 9. Tiêu chuẩn báo cáo, in và xuất dữ liệu

- Mọi file xuất phải áp dụng bộ lọc đang hiển thị, đồng thời ghi lại phạm vi bộ lọc trong tiêu đề/metadata khi phù hợp.
- Xuất Excel/CSV phải bao gồm dữ liệu nguồn của bảng hiện hành, không chỉ các dòng đang nhìn thấy trên trang nếu người dùng chọn “Xuất tất cả”.
- Có lựa chọn rõ “Xuất dữ liệu đang hiển thị” và “Xuất toàn bộ kết quả đã lọc”.
- PDF/print cần có tiêu đề, mã lớp/chương trình, hình thức, thời gian, ngày lập báo cáo và số trang nếu thư viện hỗ trợ.
- Không đưa các bộ lọc hoặc dữ liệu ngoài quyền truy cập vào file xuất.
- Xử lý ký tự tiếng Việt, định dạng ngày và dấu thập phân nhất quán.

---

## 10. Đồng bộ dữ liệu và trạng thái hệ thống

- Tạo adapter riêng cho từng nguồn; không để component UI đọc trực tiếp cấu trúc thô của Google Sheets.
- Có trạng thái loading, success, stale, error và empty.
- Hiển thị thời điểm đồng bộ thành công gần nhất; không gắn nhãn “Realtime” nếu không có cơ chế đảm bảo.
- Nếu đồng bộ thất bại, giữ dữ liệu thành công gần nhất khi phù hợp và thông báo trạng thái lỗi; không âm thầm thay bằng mock data.
- Không lưu API key, OAuth secret hoặc thông tin xác thực trong mã frontend/repository.
- Dữ liệu mock phải được bật rõ ràng trong môi trường phát triển và có nhãn “DỮ LIỆU MẪU”.
- Ghi nhận lỗi nhập liệu/ghép khóa ở màn hình kiểm tra dữ liệu hoặc log kỹ thuật đã loại bỏ thông tin nhạy cảm.

---

## 11. Hiệu năng, khả năng tiếp cận và bảo mật

### 11.1. Hiệu năng
- Với dữ liệu lớn, tránh tính toán lặp trong mỗi component; memoize metric theo filter context.
- Dùng Web Worker chỉ khi benchmark cho thấy phép tính gây nghẽn giao diện; không triển khai phức tạp hóa sớm.
- Dùng phân trang/virtualization nếu bảng có nhiều dòng.
- ECharts nên dùng cấu hình phù hợp; chỉ dùng Canvas/SVG theo nhu cầu thực tế.
- Mock data 50.000 bản ghi chỉ phục vụ kiểm thử hiệu năng, không được trộn với dữ liệu thật.

### 11.2. Accessibility
- Hỗ trợ điều hướng bàn phím, focus nhìn thấy rõ, nhãn cho control, tương phản màu đủ tốt.
- Tooltip không được là nơi duy nhất chứa thông tin quan trọng.
- Biểu đồ cần tiêu đề, đơn vị, chú giải và bảng/diễn giải thay thế khi cần.
- Trạng thái tốt/cảnh báo/lỗi cần có chữ hoặc icon, không chỉ dùng màu.

### 11.3. Bảo mật
- Không commit dữ liệu học viên hoặc phản hồi có thông tin nhận diện cá nhân vào repository.
- Không ghi dữ liệu nhạy cảm vào console/log.
- Tích hợp phân quyền/xác thực phải được thiết kế ở backend hoặc lớp bảo vệ tương ứng; frontend-only không được xem là ranh giới bảo mật.
- Tuân thủ quyền truy cập của nguồn dữ liệu và chính sách nội bộ trước khi triển khai thật.

---

## 12. Quy tắc làm việc cho Antigravity Agent

Trước mỗi thay đổi:
1. Đọc kỹ `PROJECT_CONTEXT.md` và `spec.md` (2 tài liệu nguồn sự thật bắt buộc của dự án), cùng các quy tắc trong `.agents/AGENTS.md` và `.agents/rules/`.
2. Tuân thủ tuyệt đối 3 quy tắc bất biến:
   - Web server luôn chạy trên cổng **9669** (`http://localhost:9669`).
   - Tuyệt đối **KHÔNG tự động push code lên GitHub**; chỉ phát triển, kiểm thử trên local và chỉ push khi người dùng yêu cầu rõ ràng.
   - Hình thức đào tạo hiển thị theo dữ liệu gốc (`hinh_thuc_hoc` / `hinh_thuc_dt`), riêng lớp có cả phần trực tuyến và trực tiếp cùng mã thì dòng trực tuyến suy diễn gộp tên thành "Trực tiếp kết hợp Trực tuyến".
3. Kiểm tra cấu trúc dự án, server, dependencies và các component/store đã tồn tại.
4. Xác định phạm vi file cần sửa; tránh viết lại toàn bộ dự án nếu chỉ cần thay đổi một phân hệ.
5. Nêu ngắn gọn kế hoạch và các giả định quan trọng trước thay đổi lớn.
6. Ưu tiên tái sử dụng component, tokens, data adapters và metric services hiện có.

Sau khi thay đổi:
1. Chạy lint/typecheck/test/build theo scripts thực tế có trong `package.json`.
2. Kiểm tra giao diện ở kích thước desktop mục tiêu và ít nhất một viewport nhỏ hơn.
3. Kiểm tra bộ lọc kết hợp, reset filter, empty state, dữ liệu thiếu, hybrid và export nếu có liên quan.
4. Báo cáo file đã sửa, chức năng đã hoàn thành, kết quả kiểm thử và phần còn thiếu.
5. Không tuyên bố hoàn thành kiểm thử nếu chưa thực sự chạy.

### 12.1. Quy ước code
- TypeScript strict khi phù hợp với dự án hiện có.
- Tách domain logic khỏi UI.
- Không hard-code số liệu thật trong component.
- Dùng tên biến/hàm rõ nghĩa; tránh `any` nếu có thể.
- Công thức chỉ được định nghĩa một lần trong metric layer.
- Thêm test cho các phép tính nghiệp vụ và các trường hợp biên.
- Không tự ý đổi schema nguồn hoặc xóa dữ liệu.

---

## 13. Lộ trình triển khai đề xuất

### Sprint 0 — Khảo sát và xác nhận dữ liệu
- Kiểm tra repo, file hiện có, dependencies và các màn hình đã xây.
- Kiểm tra các sheet/cột thực tế, khóa ghép, kiểu ngày và quy tắc missing.
- Lập data dictionary và ghi rõ vấn đề cần nghiệp vụ xác nhận.

### Sprint 1 — Data model và metric engine
- Xây adapter, validation, normalization.
- Chuẩn hóa `Mã lớp`, `Mã chương trình`, hình thức học và dữ liệu đánh giá.
- Viết unit test cho điểm trung bình, tỷ lệ, missing và tổng hợp nhiều lớp.

### Sprint 2 — App shell và global state
- Dựng/hoàn thiện header, navigation, filter bar, design tokens.
- Triển khai filter context và reset state.

### Sprint 3 — Phân hệ Nội dung đào tạo
- KPI, stacked bar, xếp hạng lớp, bảng chi tiết và modal phân rã mức đánh giá.
- Kiểm thử số liệu đối chiếu với nguồn.

### Sprint 4 — Báo cáo chi tiết lớp/chương trình
- Tra cứu theo mã, thông tin đầu báo cáo, 5 phần đánh giá theo thứ tự biểu mẫu.
- Hỗ trợ tách trực tiếp/trực tuyến cho hybrid.
- In/PDF/Excel và kiểm tra đối soát.

### Sprint 5 — Các phân hệ khác
- Triển khai theo mức độ sẵn sàng của dữ liệu nguồn.
- Không dựng phân hệ bằng dữ liệu giả mà không có nhãn.

### Sprint 6 — Hoàn thiện và nghiệm thu
- Kiểm tra cross-filter, hiệu năng, responsive, accessibility và lỗi dữ liệu.
- Chốt hướng dẫn vận hành, giới hạn dữ liệu và quy trình cập nhật.

---

## 14. Tiêu chí nghiệm thu

- [ ] Ứng dụng khởi chạy và build thành công theo scripts thực tế.
- [ ] Không có lỗi TypeScript/lint nghiêm trọng chưa được ghi nhận.
- [ ] Dữ liệu mẫu và dữ liệu thật được phân biệt rõ.
- [ ] Các chỉ số ở KPI, biểu đồ, bảng và báo cáo thống nhất công thức.
- [ ] Cross-filter hoạt động đúng; reset lọc hoạt động.
- [ ] Tra cứu được bằng Mã lớp và Mã chương trình.
- [ ] Hybrid tách riêng đánh giá Trực tiếp và Trực tuyến.
- [ ] Báo cáo có đủ các mục I–V đúng thứ tự và đúng thang điểm theo nguồn.
- [ ] Không suy diễn số người từ tổng số phiếu của các tiêu chí.
- [ ] Tổng hợp nhiều lớp có trọng số đúng theo số phiếu hợp lệ khi phù hợp.
- [ ] In/PDF/Excel hiển thị tiếng Việt, không cắt mất cột hoặc nội dung.
- [ ] Trạng thái thiếu dữ liệu, lỗi đồng bộ và không tìm thấy mã được xử lý.
- [ ] Có test cho các công thức trọng yếu và trường hợp dữ liệu rỗng.
- [ ] Các phân hệ chưa có dữ liệu không hiển thị số liệu nghiệp vụ giả.

---

## 15. Các điểm cần xác nhận với nghiệp vụ

Không tự quyết định các nội dung sau nếu nguồn chưa thể hiện rõ:
1. Ô trống ở cột số phiếu có luôn đồng nghĩa bằng 0 hay có trường hợp thiếu dữ liệu?
2. Ngày dùng để lọc là ngày bắt đầu, ngày kết thúc hay khoảng thời gian lớp giao với khoảng lọc?
3. Quy tắc chuẩn để phân loại điểm “Tốt/Xuất sắc/Cần cải thiện” cho thang 4 và thang 5.
4. Ngưỡng số phiếu tối thiểu để xếp hạng lớp/giảng viên.
5. Khi tổng hợp chương trình, có yêu cầu phân tách địa điểm, hình thức, nhóm học viên hay không?
6. Nguồn chính thức cho số người tham gia đánh giá duy nhất (khác với tổng số phiếu theo câu hỏi).
7. Quy tắc ẩn danh và quyền xem phản hồi mở.
8. Nguồn dữ liệu và khóa chính thức cho từng phân hệ ngoài NĐĐT.

Các điểm này cần được cấu hình hoặc xác nhận trước khi đưa kết quả vào báo cáo chính thức.

---

**Nguyên tắc cuối cùng:** Khi có xung đột giữa dữ liệu thực tế, tài liệu đặc tả và suy đoán của Agent, hãy dừng phần bị ảnh hưởng, báo rõ xung đột và yêu cầu xác nhận; không tự bịa dữ liệu hoặc âm thầm thay đổi định nghĩa nghiệp vụ.
