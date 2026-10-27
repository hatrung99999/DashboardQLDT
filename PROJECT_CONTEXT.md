# PROJECT CONTEXT
## SMART TRAINING MANAGEMENT DASHBOARD SYSTEM
### Hệ thống Dashboard quản lý, phân tích và báo cáo đào tạo Agribank

**Đơn vị sử dụng:** Trường Đào tạo cán bộ Agribank  
**Đối tượng sử dụng:** Ban lãnh đạo, cán bộ quản lý đào tạo và cán bộ được phân công tổng hợp báo cáo  
**Môi trường phát triển:** Antigravity IDE  
**Định hướng:** Enterprise BI Dashboard – Interactive Analytics – Automated Reporting

---

# 1. TỔNG QUAN DỰ ÁN

## 1.1. Bối cảnh

Trường Đào tạo cán bộ Agribank quản lý nhiều chương trình đào tạo với các hình thức tổ chức khác nhau, bao gồm đào tạo trực tiếp, đào tạo trực tuyến và đào tạo kết hợp trực tiếp với trực tuyến.

Dữ liệu đào tạo được lưu trữ và tổng hợp từ nhiều nguồn, trong đó có các bảng tính Google Sheets hoặc Excel phục vụ quản lý lớp học, học viên, chương trình đào tạo, kết quả học tập và đánh giá sau đào tạo.

Việc tổng hợp số liệu thủ công gây tốn thời gian, khó duy trì tính nhất quán giữa các báo cáo và hạn chế khả năng phân tích dữ liệu đa chiều.

Dự án xây dựng một hệ thống Dashboard quản lý đào tạo trên nền tảng Web App, hướng tới tự động hóa việc tổng hợp, trực quan hóa, phân tích và lập báo cáo phục vụ công tác quản lý đào tạo.

Hệ thống cần hỗ trợ cả hai nhu cầu nghiệp vụ:

1. Phân tích tổng hợp phục vụ quản trị, theo dõi chất lượng và hỗ trợ ra quyết định.
2. Tra cứu, tổng hợp và xuất báo cáo chi tiết cho từng lớp học hoặc chương trình đào tạo theo mẫu nghiệp vụ của Trường.

## 1.2. Mục tiêu

- Tập trung dữ liệu đào tạo từ các nguồn được cấu hình.
- Trực quan hóa tình hình tổ chức, quy mô, chất lượng và hiệu quả đào tạo.
- Cho phép lọc chéo giữa các biểu đồ, bảng dữ liệu và thẻ KPI.
- Hỗ trợ truy xuất từ số liệu tổng hợp đến từng chương trình, lớp học và các bản ghi liên quan.
- Tự động tổng hợp báo cáo đánh giá sau đào tạo theo đúng cấu trúc nghiệp vụ.
- Hỗ trợ xuất dữ liệu và báo cáo phục vụ công tác quản lý, lưu trữ và trình ký.
- Giảm thời gian xử lý thủ công, đồng thời nâng cao tính chính xác, minh bạch và khả năng kiểm tra số liệu.

## 1.3. Nguyên tắc phát triển

1. Ưu tiên tính đúng đắn của dữ liệu và logic nghiệp vụ trước tính thẩm mỹ.
2. Không tự suy diễn hoặc tạo dữ liệu nghiệp vụ không có trong nguồn.
3. Tách biệt dữ liệu nguồn, dữ liệu đã chuẩn hóa, logic tính toán và giao diện hiển thị.
4. Các KPI phải được tính toán từ dữ liệu thực tế và tuân thủ đúng thang điểm, mẫu số, phạm vi lọc.
5. Các phân hệ dùng chung dữ liệu, bộ lọc, quy tắc tính toán và Design System.
6. Tái sử dụng cấu trúc, component và logic hiện có trước khi tạo mới.
7. Không thay đổi chức năng đang hoạt động nếu chưa xác định rõ tác động.
8. Kiểm tra workspace, cấu trúc mã nguồn và công nghệ hiện có trước khi quyết định thay đổi kiến trúc.
9. Thiết kế theo hướng có thể mở rộng nhưng không triển khai trước các chức năng chưa có dữ liệu hoặc chưa được xác nhận về nghiệp vụ.
10. Phân biệt rõ chức năng phân tích Dashboard với chức năng lập báo cáo nghiệp vụ.

---

# 2. PHẠM VI HỆ THỐNG

Hệ thống được tổ chức thành 7 phân hệ nghiệp vụ.

| STT | Phân hệ | Mục tiêu chính |
|---|---|---|
| 1 | Tình hình và quy mô đào tạo | Theo dõi kế hoạch, quy mô, tiến độ và kết quả tổ chức lớp |
| 2 | Đánh giá chất lượng giảng viên | Phân tích điểm đánh giá và hiệu quả giảng dạy |
| 3 | Đánh giá nội dung chương trình | Phân tích tính phù hợp, tính thực tiễn và khả năng áp dụng |
| 4 | Công tác tổ chức và cơ sở vật chất | Theo dõi chất lượng tổ chức lớp và điều kiện học tập |
| 5 | Phương pháp học tập và mức độ tương tác | Phân tích hình thức đào tạo và hoạt động học tập |
| 6 | Hiệu quả đầu ra và ứng dụng thực tiễn | Theo dõi kết quả học tập và các chỉ số đánh giá hiệu quả khi có dữ liệu |
| 7 | Báo cáo chi tiết lớp học/chương trình | Tổng hợp và xuất báo cáo nghiệp vụ theo Mã lớp hoặc Mã chương trình |

Các phân hệ sử dụng chung hệ thống dữ liệu và cơ chế lọc, nhưng phải duy trì tính độc lập về chức năng, logic nghiệp vụ và thành phần giao diện.

Không bắt buộc tất cả các phân hệ phải được triển khai đồng thời. Thứ tự triển khai căn cứ vào mức độ sẵn sàng của dữ liệu và yêu cầu nghiệp vụ.

---

# 3. KIẾN TRÚC NGHIỆP VỤ VÀ DỮ LIỆU

## 3.1. Nguồn dữ liệu

Các nguồn dữ liệu có thể bao gồm:

- Bảng tổng hợp tình hình tổ chức lớp học.
- Danh sách lớp học và thông tin chương trình đào tạo.
- Danh sách học viên.
- Bảng kết quả học tập và đánh giá sau đào tạo.
- Bảng đánh giá giảng viên.
- Bảng đánh giá nội dung đào tạo.
- Bảng đánh giá phương pháp, hình thức đào tạo.
- Bảng đánh giá công tác tổ chức và cơ sở vật chất.
- Các bảng dữ liệu khác được bổ sung trong quá trình phát triển.

Nguồn dữ liệu cụ thể, tên file, tên sheet, tên cột và phương thức đồng bộ phải được xác định từ workspace và cấu hình thực tế.

Không mặc định rằng tất cả nguồn dữ liệu đều đã có đầy đủ các trường cần thiết cho mọi phân hệ.

## 3.2. Các thực thể nghiệp vụ chính

### A. Chương trình đào tạo

Quản lý thông tin chương trình hoặc chuyên đề đào tạo.

Các trường dự kiến:

- Mã chương trình.
- Tên chương trình.
- Nhóm chương trình.
- Đối tượng đào tạo.
- Các thuộc tính phân loại khác nếu có trong nguồn.

### B. Lớp học

Quản lý thông tin từng lớp được tổ chức thuộc chương trình đào tạo.

Các trường dự kiến:

- Mã lớp.
- Mã chương trình.
- Tên chương trình.
- Hình thức học.
- Ngày bắt đầu.
- Ngày kết thúc.
- Địa điểm tổ chức.
- Cán bộ quản lý lớp.
- Số học viên kế hoạch.
- Số học viên thực tế.
- Các thông tin quản lý khác nếu có trong nguồn.

### C. Học viên

Quản lý thông tin học viên và mối liên hệ với lớp học.

Các trường dự kiến:

- Mã cán bộ hoặc mã định danh học viên.
- Họ và tên.
- Đơn vị công tác.
- Chức vụ hoặc vị trí công tác.
- Mã lớp.
- Trạng thái tham gia.
- Các thông tin liên quan khác nếu có trong nguồn.

### D. Kết quả đánh giá

Quản lý kết quả đánh giá sau đào tạo.

Các thông tin cần hỗ trợ:

- Lớp học hoặc chương trình được đánh giá.
- Hình thức đào tạo được đánh giá.
- Nhóm nội dung đánh giá.
- Tiêu chí đánh giá.
- Mức điểm hoặc số lượng phiếu theo từng mức.
- Điểm đánh giá bình quân.
- Tổng số phiếu hợp lệ.
- Ý kiến nhận xét và góp ý mở.
- Giảng viên được đánh giá.
- Các thuộc tính cần thiết để xác định phạm vi và nguồn gốc số liệu.

### E. Giảng viên

Quản lý thông tin giảng viên và mối liên hệ giữa giảng viên, lớp học và nội dung giảng dạy.

Các trường dự kiến:

- Mã giảng viên nếu có.
- Họ tên giảng viên.
- Nội dung hoặc chuyên đề giảng dạy.
- Mã lớp.
- Các thông tin phục vụ tổng hợp đánh giá.

Không sử dụng tên giảng viên làm khóa định danh duy nhất nếu nguồn dữ liệu có thể chứa nhiều người trùng tên.

## 3.3. Khóa định danh và quan hệ dữ liệu

Ưu tiên sử dụng các mã nghiệp vụ ổn định:

- Mã chương trình: định danh chương trình đào tạo.
- Mã lớp: định danh lớp học.
- Mã học viên: định danh học viên.
- Mã giảng viên: định danh giảng viên nếu nguồn có cung cấp.

Mã lớp phải liên kết được với Mã chương trình.

Khi một lớp có nhiều hình thức đào tạo, dữ liệu đánh giá phải phân biệt được từng hình thức.

Đối với lớp kết hợp trực tiếp và trực tuyến, hệ thống phải hỗ trợ tối thiểu các phạm vi:

1. Đánh giá của lớp theo hình thức trực tiếp.
2. Đánh giá của lớp theo hình thức trực tuyến.
3. Đánh giá tổng hợp của toàn lớp nếu có thể tổng hợp hợp lệ từ dữ liệu nguồn.

Không mặc định rằng Mã lớp kết hợp Mã chương trình là đủ để định danh mọi bản ghi đánh giá. Cần xác định thêm hình thức đào tạo, tiêu chí, giảng viên hoặc các khóa nghiệp vụ khác tùy cấu trúc dữ liệu thực tế.

## 3.4. Nguyên tắc chuẩn hóa dữ liệu

- Chuẩn hóa khoảng trắng, cách viết và kiểu dữ liệu của các mã định danh.
- Chuẩn hóa ngày tháng trước khi tính toán hoặc lọc thời gian.
- Chuẩn hóa các biến thể tên hình thức đào tạo theo danh mục nghiệp vụ.
- Không tự động gộp các bản ghi chỉ vì có cùng tên chương trình hoặc tên lớp.
- Kiểm tra bản ghi trùng lặp trước khi tổng hợp.
- Phân biệt dữ liệu thiếu, dữ liệu bằng 0 và dữ liệu chưa phát sinh.
- Giữ khả năng truy xuất từ chỉ số tổng hợp về bản ghi nguồn.
- Không thay thế dữ liệu thiếu bằng số liệu giả định.

---

# 4. DESIGN SYSTEM VÀ NGUYÊN TẮC UI/UX

## 4.1. Định hướng thiết kế

Giao diện theo phong cách Enterprise BI Dashboard, hiện đại, chuyên nghiệp, phù hợp môi trường ngân hàng.

Ưu tiên:

- Bố cục rõ ràng, dễ đọc.
- Mật độ thông tin hợp lý.
- Điều hướng nhất quán giữa các phân hệ.
- Thẻ KPI và biểu đồ có khả năng tương tác.
- Bảng dữ liệu hỗ trợ tra cứu nhanh.
- Phân biệt rõ dữ liệu tổng hợp và dữ liệu chi tiết.
- Hạn chế hiệu ứng trang trí gây ảnh hưởng đến khả năng đọc báo cáo.

## 4.2. Bảng màu

| Thành phần | Mã màu | Mục đích |
|---|---|---|
| Bordeaux chủ đạo | `#8C1D40` | Header, tiêu đề nhấn, tab đang chọn |
| Ruby Bordeaux | `#AE1C3F` | Điểm nhấn và trạng thái nổi bật |
| Forest Green | `#0F5132` | Chỉ số tích cực, trạng thái đạt |
| Mint Emerald | `#10B981` | Điểm nhấn tích cực trên biểu đồ |
| Amber Warning | `#D97706` | Cảnh báo, mức cần chú ý |
| Neutral Dark | `#374151` | Nội dung chính |
| Neutral Gray | `#9CA3AF` | Nội dung phụ, chú thích |
| Surface Background | `#F8FAFC` | Nền tổng thể |
| Card Border | `#E2E8F0` | Viền component |

Màu sắc phải được sử dụng nhất quán và có ý nghĩa. Không chỉ dựa vào màu để truyền đạt trạng thái; cần bổ sung nhãn, ký hiệu hoặc chú giải phù hợp.

## 4.3. Typography và component

- Ưu tiên Inter hoặc Plus Jakarta Sans nếu phù hợp với workspace hiện tại.
- Đảm bảo hỗ trợ đầy đủ tiếng Việt.
- Thẻ KPI bo góc khoảng 12px.
- Component và bộ lọc có bán kính bo góc nhất quán.
- Sử dụng đường viền nhẹ, đổ bóng tinh tế.
- Biểu đồ có tiêu đề, đơn vị đo, chú giải và tooltip.
- Bảng dữ liệu có phân trang, sắp xếp và trạng thái rỗng rõ ràng.

## 4.4. Kích thước và khả năng đáp ứng

- Tối ưu trải nghiệm trên màn hình tỷ lệ 16:10.
- Lấy 1920 × 1200 làm kích thước tham chiếu thiết kế, không phải kích thước cố định.
- Tự điều chỉnh bố cục theo chiều rộng vùng hiển thị.
- Trên màn hình nhỏ, cho phép các thẻ KPI và biểu đồ chuyển hàng.
- Không ép toàn bộ báo cáo nghiệp vụ vào một khung Dashboard quá nhỏ.

Đối với Phân hệ 7, cần có chế độ xem báo cáo riêng, tối ưu cho việc đọc, kiểm tra và xuất tài liệu, không áp dụng máy móc bố cục thẻ KPI của Dashboard.

---

# 5. PHÂN HỆ 1 — TÌNH HÌNH VÀ QUY MÔ ĐÀO TẠO

## 5.1. Mục tiêu

Theo dõi quy mô, tiến độ tổ chức lớp học và tình hình thực hiện kế hoạch đào tạo.

## 5.2. Các chỉ số chính

Tùy dữ liệu nguồn, hệ thống có thể hiển thị:

- Tổng số chương trình đào tạo.
- Tổng số lớp học.
- Tổng số lượt học viên.
- Số học viên kế hoạch.
- Số học viên thực tế.
- Tổng số ngày đào tạo.
- Tiến độ thực hiện kế hoạch năm.
- Cơ cấu lớp học theo hình thức đào tạo.
- Cơ cấu lớp học theo nhóm chương trình.
- Tình hình tổ chức đào tạo theo thời gian và đơn vị.

Phải phân biệt số lượt tham gia đào tạo với số học viên duy nhất.

Không sử dụng hai chỉ số này thay thế cho nhau.

## 5.3. Biểu đồ

- Biểu đồ phân bổ quy mô đào tạo theo đơn vị.
- Biểu đồ tiến độ thực hiện kế hoạch theo tháng.
- Biểu đồ cơ cấu chương trình đào tạo.
- Bảng chi tiết tình hình lớp học.

Chỉ hiển thị chỉ tiêu kế hoạch khi có nguồn kế hoạch tương ứng.

---

# 6. PHÂN HỆ 2 — ĐÁNH GIÁ CHẤT LƯỢNG GIẢNG VIÊN

## 6.1. Mục tiêu

Phân tích kết quả đánh giá giảng viên theo lớp, chương trình, chuyên đề và các tiêu chí đánh giá.

## 6.2. Chỉ số

- Điểm đánh giá bình quân.
- Số lượt hoặc số phiếu đánh giá.
- Điểm theo từng tiêu chí.
- Phân bố số phiếu theo mức đánh giá.
- So sánh điểm giữa các giảng viên.
- Xếp hạng theo tiêu chí được lựa chọn.

## 6.3. Các tiêu chí dự kiến

Căn cứ biểu mẫu đánh giá thực tế, có thể bao gồm:

- Kiến thức chuyên môn, nghiệp vụ.
- Kỹ năng sư phạm và phương pháp giảng dạy.
- Thái độ, tác phong của giảng viên.

Không mặc định tất cả lớp học đều có đủ các tiêu chí hoặc cùng thang điểm.

Cần xác định đúng thang điểm của từng loại biểu mẫu trước khi tính toán.

## 6.4. Tương tác

Cho phép lựa chọn giảng viên để xem danh sách lớp đã giảng dạy và kết quả đánh giá tương ứng.

Chỉ so sánh các chỉ số có cùng định nghĩa, cùng thang điểm và phạm vi đánh giá phù hợp.

---

# 7. PHÂN HỆ 3 — ĐÁNH GIÁ NỘI DUNG CHƯƠNG TRÌNH

## 7.1. Mục tiêu

Đánh giá mức độ phù hợp, tính thực tiễn và khả năng áp dụng kiến thức vào công việc.

## 7.2. Các tiêu chí cốt lõi

Theo sheet `NĐĐT` hiện có:

1. Nội dung đào tạo phù hợp với yêu cầu vị trí công việc và mục tiêu học tập.
2. Tính thực tiễn của nội dung đào tạo sát với yêu cầu công việc.
3. Kiến thức từ khóa học có thể áp dụng hiệu quả vào công việc thực tế.

## 7.3. Các chỉ số

- Điểm bình quân từng tiêu chí.
- Điểm tổng hợp nội dung đào tạo.
- Số phiếu đánh giá.
- Tỷ lệ phiếu theo từng mức điểm.
- Tỷ lệ phản hồi tích cực theo quy tắc được xác nhận.
- So sánh giữa chương trình, lớp học và hình thức đào tạo.

Với bộ tiêu chí có thang điểm 4, điểm bình quân của một tiêu chí được tính từ số lượng phiếu ở các mức điểm tương ứng.

Không được sử dụng thang điểm 5 của phần đánh giá giảng viên để tính chung với thang điểm 4 của nội dung đào tạo nếu chưa chuẩn hóa và nêu rõ phương pháp.

## 7.4. Trực quan hóa

- Biểu đồ phân bố đánh giá theo mức điểm.
- Biểu đồ so sánh điểm giữa các tiêu chí.
- Bảng xếp hạng lớp học theo điểm đánh giá.
- Bảng chi tiết theo chương trình và hình thức học.

---

# 8. PHÂN HỆ 4 — CÔNG TÁC TỔ CHỨC VÀ CƠ SỞ VẬT CHẤT

## 8.1. Mục tiêu

Theo dõi chất lượng tổ chức lớp học và điều kiện phục vụ học tập.

## 8.2. Các nhóm chỉ số

Tùy biểu mẫu nguồn, có thể bao gồm:

- Đánh giá công tác tổ chức lớp học.
- Đánh giá cơ sở vật chất.
- Đánh giá công tác hậu cần.
- Đánh giá đường truyền và thiết bị phục vụ học trực tuyến.
- Tình hình phát sinh và xử lý sự cố.

## 8.3. Trực quan hóa

- Biểu đồ phân bố mức đánh giá.
- Biểu đồ so sánh giữa các địa điểm.
- Bảng chi tiết lớp học.
- Bảng cảnh báo các tiêu chí có điểm thấp.

Các chỉ số SLA hoặc thời gian xử lý sự cố chỉ triển khai khi hệ thống có dữ liệu ghi nhận sự cố và thời điểm xử lý.

---

# 9. PHÂN HỆ 5 — PHƯƠNG PHÁP HỌC TẬP VÀ MỨC ĐỘ TƯƠNG TÁC

## 9.1. Mục tiêu

Phân tích phương pháp tổ chức học tập và mức độ phù hợp của hình thức đào tạo.

## 9.2. Các nhóm chỉ số

Tùy nguồn dữ liệu:

- Đánh giá hoạt động học tập, thảo luận và bài tập tình huống.
- Đánh giá hình thức đào tạo trực tiếp.
- Đánh giá hình thức đào tạo trực tuyến.
- Đánh giá hình thức đào tạo kết hợp.
- Mức độ tham gia các hoạt động học tập.
- Tình hình hoàn thành bài tập và hoạt động học tập.

Không suy diễn số lượt tương tác, thời gian hoàn thành hoặc tỷ lệ nộp bài nếu nguồn dữ liệu chưa ghi nhận các thông tin này.

---

# 10. PHÂN HỆ 6 — HIỆU QUẢ ĐẦU RA VÀ ỨNG DỤNG THỰC TIỄN

## 10.1. Mục tiêu

Theo dõi kết quả học tập và mức độ cải thiện kiến thức, kỹ năng sau đào tạo.

## 10.2. Các nhóm chỉ số

Khi có dữ liệu tương ứng:

- Kết quả kiểm tra đầu vào.
- Kết quả kiểm tra đầu ra.
- Tỷ lệ đạt yêu cầu.
- Tỷ lệ hoàn thành chương trình.
- Đánh giá mức độ cải thiện kiến thức.
- Đánh giá mức độ cải thiện kỹ năng làm việc.
- Mức độ cam kết áp dụng kiến thức vào thực tế.

## 10.3. Nguyên tắc

- Không mặc định có dữ liệu Pre-test và Post-test cho tất cả chương trình.
- Không đồng nhất đánh giá chủ quan sau khóa học với kết quả đo lường năng lực thực tế.
- Không gọi chỉ số là tỷ lệ ứng dụng thành công nếu dữ liệu chỉ phản ánh ý định hoặc cam kết áp dụng.
- Mỗi chỉ số phải có định nghĩa, mẫu số và phạm vi áp dụng rõ ràng.

---

# 11. PHÂN HỆ 7 — BÁO CÁO CHI TIẾT LỚP HỌC/CHƯƠNG TRÌNH

## 11.1. Mục tiêu nghiệp vụ

Xây dựng chức năng tra cứu, tổng hợp và xuất báo cáo đánh giá sau đào tạo theo cấu trúc biểu mẫu nghiệp vụ của Trường Đào tạo cán bộ Agribank.

Phân hệ này không chỉ hiển thị biểu đồ mà phải tái hiện được cấu trúc báo cáo chi tiết, bao gồm phần tiêu đề hành chính, thông tin lớp học, các nhóm tiêu chí đánh giá, số phiếu, điểm bình quân, tỷ lệ phần trăm và ý kiến nhận xét của học viên.

Báo cáo phải được tạo trực tiếp từ dữ liệu nguồn đã chuẩn hóa.

## 11.2. Cách thức truy cập

Bổ sung tab:

**Báo cáo chi tiết lớp học/chương trình**

Cho phép người dùng lựa chọn một trong hai cách tra cứu:

### Cách 1 — Tra cứu theo Mã lớp

Người dùng nhập hoặc lựa chọn Mã lớp.

Hệ thống hiển thị thông tin và kết quả đánh giá thuộc lớp được chọn, bao gồm các nhóm đánh giá tương ứng với dữ liệu thực tế.

Ví dụ:

- Mã lớp: `TTTM/26-02`.
- Chương trình: Nghiệp vụ thanh toán quốc tế và tài trợ thương mại chuyên sâu; Cơ chế cấp và thẩm định khoản cấp tín dụng tài trợ thương mại.
- Thời gian: 10/06/2026–12/06/2026.
- Địa điểm: Long Hải.
- Số phiếu đánh giá: 64.

Các giá trị trên chỉ là ví dụ minh họa cấu trúc báo cáo. Khi chạy hệ thống, phải lấy giá trị từ dữ liệu nguồn.

### Cách 2 — Tra cứu theo Mã chương trình

Người dùng lựa chọn hoặc nhập Mã chương trình.

Hệ thống xác định các lớp thuộc chương trình và cho phép:

- Xem danh sách lớp liên quan.
- Chọn một lớp để lập báo cáo chi tiết.
- Tổng hợp kết quả giữa các lớp khi phù hợp với yêu cầu báo cáo.
- Phân biệt các hình thức đào tạo nếu chương trình có nhiều lớp hoặc nhiều hình thức tổ chức.

Nếu chưa có Mã chương trình độc lập trong nguồn dữ liệu, cần xây dựng hoặc xác nhận bảng ánh xạ giữa Mã chương trình và Mã lớp.

Không tự suy ra quan hệ chỉ từ tên chương trình nếu có nguy cơ ghép sai dữ liệu.

### Quy tắc phạm vi báo cáo

Báo cáo phải xác định rõ:

- Đơn vị tổng hợp: lớp học hoặc chương trình.
- Mã lớp hoặc Mã chương trình được chọn.
- Hình thức đào tạo.
- Khoảng thời gian áp dụng nếu có bộ lọc thời gian.
- Số lượng bản ghi hoặc phiếu đánh giá thực tế được sử dụng.

Khi chọn một Mã lớp, hệ thống không được tự động cộng dữ liệu của các lớp khác chỉ vì cùng tên chương trình.

## 11.3. Xử lý hình thức đào tạo

Hệ thống phải hỗ trợ ba trường hợp:

1. Lớp đào tạo trực tiếp.
2. Lớp đào tạo trực tuyến.
3. Lớp đào tạo kết hợp trực tiếp và trực tuyến.

Đối với lớp đào tạo trực tiếp hoặc trực tuyến, báo cáo hiển thị kết quả đánh giá theo hình thức tương ứng.

Đối với lớp đào tạo kết hợp:

- Tách phần đánh giá trực tiếp.
- Tách phần đánh giá trực tuyến.
- Cho phép xem kết quả riêng từng hình thức.
- Cho phép tổng hợp toàn lớp nếu có đủ dữ liệu và việc tổng hợp có ý nghĩa nghiệp vụ.

Các nhóm đánh giá liên quan đến hình thức đào tạo, chẳng hạn đánh giá mức độ phù hợp của phương pháp trực tiếp hoặc trực tuyến, phải được trình bày theo đúng phạm vi mà câu hỏi khảo sát áp dụng.

Không mặc định rằng mọi tiêu chí đều có dữ liệu cho cả hai hình thức.

Không gộp phiếu của hai hình thức thành một nhóm khi chưa xác định được phạm vi đánh giá và tính hợp lệ của phép tổng hợp.

## 11.4. Cấu trúc báo cáo

Báo cáo được trình bày theo thứ tự sau.

### PHẦN ĐẦU — THỂ THỨC VÀ THÔNG TIN CHUNG

#### A. Phần tiêu đề hành chính

Trình bày theo mẫu báo cáo của Trường:

**Bên trái:**

TRƯỜNG ĐÀO TẠO CÁN BỘ AGRIBANK  
PHÒNG QUẢN LÝ ĐÀO TẠO VÀ THƯ VIỆN

**Bên phải:**

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM  
Độc lập - Tự do - Hạnh phúc

Giữ nguyên bố cục hai bên theo mẫu báo cáo chính thức.

Không tự thay đổi tên đơn vị, tên phòng hoặc thể thức hành chính khi xuất báo cáo.

#### B. Logo và thành phần hình ảnh

Cho phép hiển thị logo Agribank hoặc các hình ảnh có sẵn trong mẫu báo cáo.

Ưu tiên sử dụng tài nguyên hình ảnh chính thức đã được cung cấp trong dự án.

Không tạo logo thay thế hoặc sử dụng hình ảnh không rõ nguồn gốc.

#### C. Tiêu đề báo cáo

Tiêu đề chính:

**BẢNG TỔNG HỢP PHIẾU NHẬN XÉT, ĐÁNH GIÁ**

Phần trong ngoặc thể hiện hình thức đào tạo hoặc phạm vi đánh giá tương ứng, ví dụ:

- Trực tiếp.
- Trực tuyến.
- Tổng hợp trực tiếp và trực tuyến, nếu có dữ liệu và yêu cầu nghiệp vụ phù hợp.

#### D. Tên chương trình

Hiển thị tên đầy đủ của chương trình đào tạo theo dữ liệu danh mục.

Không tự rút gọn tên chương trình trong báo cáo chính thức nếu việc rút gọn làm mất thông tin nghiệp vụ.

#### E. Thông tin lớp học

Hiển thị:

- Mã lớp.
- Địa điểm tổ chức.
- Ngày bắt đầu.
- Ngày kết thúc.
- Số học viên tham gia đánh giá.
- Tổng số học viên thực tế, nếu có dữ liệu đối chiếu.

Cách thể hiện số phiếu:

`64/72 học viên tham gia đánh giá`

Trong đó:

- 64 là số học viên có phản hồi hợp lệ theo phạm vi báo cáo.
- 72 là tổng số học viên thực tế thuộc phạm vi tương ứng.

Không lấy số học viên kế hoạch làm mẫu số nếu báo cáo đang phản ánh tỷ lệ tham gia đánh giá của học viên thực tế.

Nếu chưa có dữ liệu tổng số học viên thực tế, chỉ hiển thị số phiếu đánh giá và không tự tạo mẫu số.

### PHẦN I — ĐÁNH GIÁ VỀ NỘI DUNG ĐÀO TẠO

Hiển thị bảng đánh giá theo thứ tự tiêu chí:

1. Nội dung đào tạo phù hợp với yêu cầu vị trí công việc và mục tiêu học tập.
2. Tính thực tiễn của nội dung đào tạo sát với yêu cầu công việc.
3. Kiến thức từ khóa học có thể áp dụng hiệu quả vào công việc thực tế.

Cấu trúc bảng:

| TT | Nội dung đánh giá | Tổng số phiếu | Điểm bình quân (tối đa 4 điểm) | Tốt (4 điểm) | Khá (3 điểm) | Bình thường (2 điểm) | Hạn chế (1 điểm) |
|---|---|---:|---:|---:|---:|---:|---:|

Mỗi mức điểm có hai thông tin:

- Số phiếu.
- Tỷ lệ phần trăm.

Có thể sử dụng tiêu đề nhóm nhiều tầng khi xuất Excel hoặc PDF để tái hiện mẫu báo cáo gốc.

Quy tắc tính điểm:

Điểm bình quân tiêu chí:

`Điểm bình quân = Tổng điểm các phiếu hợp lệ / Tổng số phiếu hợp lệ của tiêu chí`

Nếu dữ liệu nguồn chỉ có số lượng phiếu theo từng mức:

`Điểm bình quân = (4 × N4 + 3 × N3 + 2 × N2 + 1 × N1) / (N4 + N3 + N2 + N1)`

Trong đó `N4`, `N3`, `N2`, `N1` lần lượt là số phiếu hợp lệ theo các mức điểm.

Tỷ lệ từng mức:

`Tỷ lệ mức điểm = Số phiếu ở mức đó / Tổng số phiếu hợp lệ của tiêu chí × 100%`

Tổng số phiếu phải được tính theo từng tiêu chí. Không mặc định mọi tiêu chí đều có cùng số phiếu nếu dữ liệu nguồn có thể thiếu phản hồi.

### PHẦN II — ĐÁNH GIÁ VỀ PHƯƠNG PHÁP, HÌNH THỨC ĐÀO TẠO

Trình bày các tiêu chí có trong biểu mẫu đánh giá thực tế, bao gồm:

1. Đánh giá hoạt động học tập, thảo luận, bài tập và tình huống.
2. Đánh giá mức độ phù hợp, hiệu quả của hình thức đào tạo trực tiếp.
3. Đánh giá hình thức đào tạo trực tuyến hoặc các tiêu chí tương ứng nếu có trong biểu mẫu.

Cấu trúc bảng tương tự Phần I, nhưng sử dụng đúng thang điểm và nội dung của từng tiêu chí.

Không tự bổ sung câu hỏi khảo sát chưa có trong dữ liệu nguồn.

Đối với lớp kết hợp:

- Trình bày rõ hình thức mà tiêu chí đang đánh giá.
- Không nhân đôi một tiêu chí nếu biểu mẫu chỉ thu thập một kết quả chung.
- Không gán kết quả đánh giá trực tiếp cho hình thức trực tuyến hoặc ngược lại.

### PHẦN III — CÔNG TÁC TỔ CHỨC, CƠ SỞ VẬT CHẤT

Trình bày các tiêu chí theo đúng thứ tự trong biểu mẫu nguồn, có thể bao gồm:

1. Đánh giá công tác tổ chức lớp học.
2. Đánh giá cơ sở vật chất, phòng học, chỗ ở, thiết bị và đường truyền.
3. Đánh giá công tác hậu cần như ăn, nghỉ và nước uống giữa giờ.

Cấu trúc bảng:

| TT | Nội dung đánh giá | Tổng số phiếu | Điểm bình quân | Mức đánh giá 4 điểm | Mức đánh giá 3 điểm | Mức đánh giá 2 điểm | Mức đánh giá 1 điểm |
|---|---|---:|---:|---:|---:|---:|---:|

Mỗi mức điểm thể hiện số phiếu và tỷ lệ phần trăm.

Nếu biểu mẫu nguồn sử dụng thang điểm khác, hệ thống phải sử dụng đúng thang điểm của biểu mẫu đó.

Không tự động đưa các chỉ số SLA, thời gian xử lý sự cố hoặc chỉ số kỹ thuật vào báo cáo khi không có dữ liệu tương ứng.

### PHẦN IV — ĐÁNH GIÁ VỀ GIẢNG VIÊN

Trình bày kết quả đánh giá theo từng giảng viên và nội dung giảng dạy.

Cấu trúc nhóm:

**Tên giảng viên**

- Nội dung hoặc chuyên đề giảng dạy.

Các tiêu chí đánh giá:

1. Kiến thức chuyên môn, nghiệp vụ theo nội dung giảng dạy.
2. Kỹ năng sư phạm và phương pháp giảng dạy.
3. Thái độ, tác phong của giảng viên.

Cấu trúc bảng:

| TT | Nội dung đánh giá | Tổng số phiếu | Điểm bình quân (tối đa 5 điểm) | Xuất sắc (5 điểm) | Tốt (4 điểm) | Khá (3 điểm) | Bình thường (2 điểm) | Hạn chế (1 điểm) |
|---|---|---:|---:|---:|---:|---:|---:|---:|

Mỗi mức điểm hiển thị:

- Số phiếu.
- Tỷ lệ phần trăm.

Quy tắc:

- Giữ nguyên quan hệ giữa giảng viên, chuyên đề và lớp học.
- Không gộp kết quả của các giảng viên khác nhau thành một bản ghi.
- Không mặc định mỗi giảng viên đều có đủ ba tiêu chí nếu nguồn chưa có dữ liệu.
- Chỉ tính điểm bình quân trên các phiếu hợp lệ thuộc đúng giảng viên và tiêu chí.
- Phải xác định rõ mẫu số của từng tỷ lệ.

### PHẦN V — ĐÁNH GIÁ CHUNG

Trình bày theo thứ tự các tiêu chí đánh giá chung trong biểu mẫu.

Ví dụ:

1. Sau khóa học, học viên đã cải thiện về kiến thức ở mức độ nào?
2. Sau khóa học, học viên đã cải thiện về kỹ năng làm việc ở mức độ nào?
3. Theo học viên, nội dung hữu ích nhất của khóa học là gì?
4. Ý kiến góp ý khác.

Đối với câu hỏi định lượng, hiển thị:

- Tổng số phiếu.
- Điểm bình quân.
- Số phiếu theo từng mức điểm.
- Tỷ lệ phần trăm theo từng mức.

Đối với câu hỏi mở:

- Tổng hợp nội dung phản hồi.
- Giữ lại các ý kiến có ý nghĩa nghiệp vụ.
- Có thể nhóm các ý kiến tương đồng để hỗ trợ đọc và phân tích.
- Cho phép xem nội dung phản hồi gốc nếu dữ liệu nguồn có lưu.

Không đưa nội dung văn bản tự do vào công thức tính điểm.

Không tự tạo nhận xét hoặc suy diễn rằng học viên đã áp dụng kiến thức thành công nếu phản hồi chỉ đề cập mức độ cải thiện hoặc cam kết áp dụng.

## 11.5. Quy tắc tính toán chung

### A. Điểm bình quân

Đối với dữ liệu số phiếu theo từng mức điểm, sử dụng công thức bình quân gia quyền:

`Điểm bình quân = Tổng (Mức điểm × Số phiếu ở mức điểm) / Tổng số phiếu hợp lệ`

Mẫu số phải được tính riêng theo từng tiêu chí.

### B. Tỷ lệ phần trăm

`Tỷ lệ (%) = Số phiếu ở mức tương ứng / Tổng số phiếu hợp lệ của tiêu chí × 100%`

### C. Làm tròn

- Điểm bình quân: mặc định hiển thị 2 chữ số thập phân.
- Tỷ lệ phần trăm: mặc định hiển thị 1 chữ số thập phân.
- Các chỉ số phải được tính từ số liệu gốc trước khi làm tròn.
- Tổng các tỷ lệ hiển thị có thể chênh lệch nhẹ so với 100% do làm tròn.

### D. Xử lý dữ liệu thiếu

Phân biệt rõ:

- Số phiếu bằng 0.
- Trường dữ liệu chưa có.
- Tiêu chí chưa được đánh giá.
- Dữ liệu không áp dụng.
- Dữ liệu không hợp lệ.

Không tự động chuyển mọi giá trị trống thành 0 trong tất cả các phép tính.

Chỉ chuyển ô trống thành 0 khi đã xác định rằng ô đó biểu thị không có phiếu ở mức điểm tương ứng, thay vì chưa có dữ liệu hoặc chưa được cập nhật.

Nếu tổng số phiếu hợp lệ bằng 0, hiển thị `Chưa có đánh giá` hoặc `-`, không thực hiện phép chia.

### E. Điểm tổng hợp

Nếu cần tạo chỉ số tổng hợp giữa nhiều tiêu chí, phải xác định rõ:

- Các tiêu chí được đưa vào.
- Thang điểm của từng tiêu chí.
- Trọng số của từng tiêu chí.
- Phương pháp xử lý dữ liệu thiếu.

Không mặc định tính trung bình cộng giữa các thang điểm khác nhau.

Đối với báo cáo nghiệp vụ, ưu tiên hiển thị điểm bình quân của từng tiêu chí theo đúng biểu mẫu gốc.

## 11.6. Giao diện tra cứu báo cáo

Giao diện gồm các khu vực:

### A. Bộ lọc và lựa chọn báo cáo

- Loại báo cáo: Theo lớp hoặc theo chương trình.
- Mã chương trình.
- Mã lớp.
- Hình thức đào tạo.
- Thời gian tổ chức.
- Trạng thái dữ liệu đánh giá nếu có.

Khi người dùng chọn Mã chương trình, danh sách Mã lớp cần được giới hạn theo chương trình đó.

Khi người dùng chọn Mã lớp, tự động điền các thông tin có thể xác định từ dữ liệu nguồn.

Các bộ lọc phải phối hợp nhất quán và không được làm sai phạm vi dữ liệu báo cáo.

### B. Khu vực xem trước

Hiển thị báo cáo theo cấu trúc nghiệp vụ chính thức, bao gồm:

1. Tiêu đề hành chính.
2. Thông tin chương trình và lớp.
3. Phần I — Đánh giá về nội dung đào tạo.
4. Phần II — Đánh giá về phương pháp, hình thức đào tạo.
5. Phần III — Công tác tổ chức, cơ sở vật chất.
6. Phần IV — Đánh giá về giảng viên.
7. Phần V — Đánh giá chung.

Báo cáo phải giữ thứ tự trên, kể cả khi một số nhóm không có dữ liệu.

Nếu một nhóm không áp dụng hoặc chưa có dữ liệu, hiển thị thông báo phù hợp thay vì tự xóa hoặc tự tạo nội dung.

### C. Các thao tác

- Xem báo cáo.
- Làm mới dữ liệu.
- In báo cáo.
- Xuất PDF.
- Xuất Excel.
- Quay lại Dashboard.
- Chuyển sang lớp khác thuộc cùng chương trình.

Chỉ hiển thị thao tác phù hợp với chức năng thực tế đã triển khai.

## 11.7. Yêu cầu xuất báo cáo

### PDF

Ưu tiên tái hiện biểu mẫu báo cáo nghiệp vụ:

- Tiêu đề và thông tin đơn vị.
- Căn chỉnh tiêu đề hai bên.
- Phân cấp tiêu đề và nhóm đánh giá.
- Bảng nhiều tầng tiêu đề.
- Định dạng số liệu thống nhất.
- Hỗ trợ tiếng Việt.
- Không cắt mất nội dung bảng khi sang trang.
- Lặp lại tiêu đề cột khi bảng kéo dài qua nhiều trang nếu công cụ xuất hỗ trợ.
- Hạn chế tách tên giảng viên khỏi nhóm tiêu chí đánh giá của giảng viên đó.
- Có thể bổ sung ngày lập báo cáo nếu phù hợp với mẫu chính thức.

Không sử dụng ảnh chụp màn hình Dashboard làm nội dung chính của PDF. Báo cáo phải được kết xuất từ dữ liệu và component báo cáo.

### Excel

- Mỗi nhóm đánh giá được trình bày theo cấu trúc dễ đọc.
- Giữ kiểu dữ liệu số cho các trường điểm, số phiếu và tỷ lệ.
- Hạn chế gộp ô trong vùng dữ liệu cần xử lý tiếp.
- Có thể tổ chức nhiều sheet nếu cần, nhưng phải bảo đảm thứ tự nghiệp vụ.
- Đảm bảo số liệu trong Excel khớp với báo cáo xem trước.

### Quy tắc nhất quán

Dữ liệu của báo cáo xem trước, PDF và Excel phải được lấy từ cùng một tập dữ liệu và cùng bộ quy tắc tính toán.

Không triển khai ba bộ logic tính điểm độc lập cho ba định dạng xuất.

## 11.8. Kiểm tra chất lượng báo cáo

Trước khi xuất, hệ thống cần kiểm tra:

- Mã lớp hoặc Mã chương trình đã được xác định.
- Thông tin lớp có phù hợp với danh mục.
- Phạm vi hình thức đào tạo đã rõ ràng.
- Số phiếu và mẫu số không mâu thuẫn.
- Không có phép chia cho 0.
- Điểm bình quân nằm trong thang điểm hợp lệ.
- Tỷ lệ được tính từ đúng mẫu số.
- Dữ liệu của giảng viên không bị gán nhầm.
- Ý kiến mở không bị tính như dữ liệu số.
- Báo cáo không bị trộn dữ liệu giữa các lớp khác nhau.

Nếu phát hiện bất thường, cần cảnh báo người dùng và cho phép kiểm tra dữ liệu nguồn.

Không tự sửa số liệu gốc để làm cho báo cáo có vẻ hợp lý.

---

# 12. GLOBAL FILTERING VÀ KHẢ NĂNG TƯƠNG TÁC

## 12.1. Bộ lọc toàn hệ thống

Các bộ lọc được hỗ trợ tùy theo dữ liệu:

- Năm.
- Quý.
- Khoảng thời gian.
- Chương trình đào tạo.
- Mã lớp.
- Hình thức đào tạo.
- Đơn vị.
- Giảng viên.
- Cán bộ quản lý.

Chỉ hiển thị bộ lọc khi có trường dữ liệu tương ứng và có ý nghĩa nghiệp vụ.

## 12.2. Cross-filtering

Khi người dùng lựa chọn một nhóm dữ liệu trên biểu đồ hoặc bảng, các component liên quan phải được cập nhật theo phạm vi lọc đã chọn.

Ví dụ:

- Chọn một chương trình để lọc danh sách lớp.
- Chọn một lớp để xem kết quả đánh giá chi tiết.
- Chọn một giảng viên để xem kết quả theo giảng viên.
- Chọn một hình thức đào tạo để giới hạn phạm vi phản hồi.

Cần phân biệt:

- **Cross-filtering:** Loại bỏ dữ liệu ngoài phạm vi được chọn.
- **Cross-highlighting:** Giữ nguyên tổng thể nhưng nhấn mạnh phần dữ liệu được chọn.

Không bắt buộc mọi biểu đồ phải áp dụng cùng một kiểu tương tác. Hành vi cần phù hợp với loại biểu đồ và mục tiêu phân tích.

## 12.3. Quản lý trạng thái lọc

Bộ lọc phải có khả năng:

- Chọn một hoặc nhiều giá trị.
- Xóa từng điều kiện.
- Đặt lại bộ lọc.
- Hiển thị điều kiện lọc đang áp dụng.
- Giữ nhất quán giữa biểu đồ, bảng và KPI.

Khi chuyển giữa các phân hệ, trạng thái bộ lọc toàn hệ thống được giữ hoặc đặt lại theo một quy tắc thống nhất.

Phân hệ Báo cáo chi tiết phải có phạm vi báo cáo rõ ràng; không được vô tình kế thừa các bộ lọc ẩn làm thay đổi số liệu trong báo cáo chính thức.

---

# 13. KIẾN TRÚC KỸ THUẬT VÀ NGUYÊN TẮC LẬP TRÌNH

## 13.1. Nguyên tắc lựa chọn công nghệ

Trước khi triển khai hoặc thay đổi công nghệ, Agent phải kiểm tra:

- Cấu trúc thư mục hiện tại.
- Framework đang sử dụng.
- Các thư viện đã cài đặt.
- Cách quản lý trạng thái.
- Cách kết nối và đồng bộ dữ liệu.
- Các component đã có.
- Cách triển khai và chạy ứng dụng.

React, Vite, TypeScript, Apache ECharts, Zustand, TanStack Table và Tailwind CSS là các lựa chọn tham khảo khi phù hợp với workspace.

Không tự động thay thế công nghệ hiện tại chỉ để tuân theo tài liệu định hướng.

## 13.2. Phân tách các lớp xử lý

Kiến trúc cần phân biệt:

1. **Data Source:** Nguồn dữ liệu gốc.
2. **Data Adapter:** Đọc, chuyển đổi và chuẩn hóa dữ liệu.
3. **Domain Model:** Các thực thể và quan hệ nghiệp vụ.
4. **Metrics Layer:** Các công thức và chỉ số dùng chung.
5. **Filter/State Layer:** Quản lý bộ lọc và trạng thái tương tác.
6. **Visualization Layer:** Biểu đồ, KPI và bảng phân tích.
7. **Reporting Layer:** Tổng hợp và kết xuất báo cáo nghiệp vụ.
8. **Export Layer:** Xuất PDF, Excel hoặc định dạng được hỗ trợ.

Các lớp phải có ranh giới rõ ràng để có thể kiểm thử và bảo trì độc lập.

## 13.3. Công nghệ tham khảo

| Thành phần | Công nghệ tham khảo |
|---|---|
| Frontend | React + TypeScript |
| Build tool | Vite |
| Biểu đồ | Apache ECharts |
| Quản lý trạng thái | Zustand hoặc giải pháp đang có |
| Bảng dữ liệu | TanStack Table hoặc component tương đương |
| Styling | Tailwind CSS hoặc hệ thống CSS hiện tại |
| Icon | Lucide hoặc thư viện hiện có |
| Xuất Excel | Thư viện phù hợp với định dạng cần xuất |
| Xuất PDF | Giải pháp kết xuất PDF có hỗ trợ tiếng Việt và bảng nhiều trang |

Lựa chọn cuối cùng căn cứ vào workspace, yêu cầu triển khai và khả năng tương thích.

## 13.4. Quản lý dữ liệu lớn

Nếu dữ liệu thực tế có quy mô lớn:

- Tránh tính lại toàn bộ dữ liệu không cần thiết sau mỗi thao tác lọc.
- Tái sử dụng kết quả tính toán khi phù hợp.
- Cân nhắc Web Worker nếu việc tính toán gây ảnh hưởng đáng kể đến giao diện.
- Phân trang hoặc ảo hóa bảng khi cần.
- Không tạo dữ liệu giả quy mô lớn trong môi trường sản xuất.
- Không coi dữ liệu mock là dữ liệu nghiệp vụ chính thức.

---

# 14. ĐỒNG BỘ DỮ LIỆU VÀ TÍNH TIN CẬY

## 14.1. Nguyên tắc đồng bộ

- Nêu rõ nguồn dữ liệu đang sử dụng.
- Phân biệt thời điểm cập nhật dữ liệu nguồn và thời điểm làm mới giao diện.
- Hiển thị trạng thái đồng bộ thành công hoặc thất bại.
- Không hiển thị trạng thái Realtime nếu nguồn dữ liệu không bảo đảm cập nhật thời gian thực.
- Có cơ chế xử lý lỗi đọc dữ liệu.
- Không ghi đè dữ liệu gốc ngoài phạm vi được cho phép.

## 14.2. Trạng thái dữ liệu

Cần phân biệt:

- Đang tải dữ liệu.
- Đã tải thành công.
- Chưa có dữ liệu.
- Dữ liệu chưa đầy đủ.
- Lỗi kết nối.
- Dữ liệu không hợp lệ.

Các trạng thái phải có thông báo rõ ràng và không làm giao diện bị lỗi.

## 14.3. Kiểm soát truy cập

Khi hệ thống được triển khai cho nhiều người dùng:

- Không để lộ thông tin xác thực trong mã nguồn phía trình duyệt.
- Không lưu thông tin nhạy cảm trong các file cấu hình công khai.
- Chỉ cho phép truy cập nguồn dữ liệu theo cơ chế được phê duyệt.
- Xem xét phân quyền khi dữ liệu hoặc chức năng yêu cầu giới hạn người sử dụng.
- Không mặc định rằng ứng dụng hiện tại đã có hệ thống xác thực và phân quyền đầy đủ.

---

# 15. QUY TẮC PHÁT TRIỂN VỚI ANTIGRAVITY

## 15.1. Trước khi sửa mã nguồn

Agent phải:

1. Đọc `PROJECT_CONTEXT.md`.
2. Kiểm tra cấu trúc workspace.
3. Xác định các phân hệ đã được triển khai.
4. Kiểm tra nguồn dữ liệu và schema thực tế.
5. Xác định component và logic có thể tái sử dụng.
6. Phân tích ảnh hưởng của thay đổi tới các phân hệ khác.
7. Đề xuất phạm vi sửa đổi trước khi thực hiện các thay đổi có ảnh hưởng lớn.

## 15.2. Trong quá trình triển khai

- Ưu tiên thay đổi nhỏ, có kiểm soát.
- Tái sử dụng component dùng chung.
- Không tạo các công thức KPI trùng lặp ở nhiều nơi.
- Không đặt logic tính toán nghiệp vụ trực tiếp trong component giao diện nếu có thể tách thành hàm hoặc module dùng chung.
- Không thay đổi tên trường hoặc schema nguồn tùy tiện.
- Không tự tạo các trường dữ liệu chưa được xác nhận.
- Không loại bỏ chức năng hiện có nếu chưa xác định rõ lý do.
- Bảo đảm giao diện tiếng Việt và hiển thị dữ liệu đúng định dạng.

## 15.3. Sau khi triển khai

Agent phải kiểm tra:

- Ứng dụng khởi động thành công.
- Không có lỗi biên dịch hoặc lỗi runtime nghiêm trọng.
- Các bộ lọc hoạt động đúng.
- Các công thức KPI có kết quả hợp lệ.
- Các biểu đồ và bảng phản ánh đúng tập dữ liệu.
- Phân hệ mới không làm hỏng phân hệ hiện có.
- Chức năng xuất báo cáo tạo được tài liệu hợp lệ.
- Số liệu giữa màn hình, PDF và Excel nhất quán.

---

# 16. LỘ TRÌNH TRIỂN KHAI

Thứ tự triển khai thực tế phải căn cứ vào hiện trạng workspace và mức độ sẵn sàng của dữ liệu.

## Giai đoạn 1 — Khảo sát và chuẩn hóa dữ liệu

- Kiểm tra các nguồn dữ liệu.
- Xác định schema và quan hệ giữa các bảng.
- Chuẩn hóa mã lớp, mã chương trình và hình thức đào tạo.
- Xác định các trường còn thiếu.
- Kiểm tra dữ liệu trùng lặp và dữ liệu không hợp lệ.
- Xác lập định nghĩa các KPI.

## Giai đoạn 2 — Hoàn thiện kiến trúc nền

- Chuẩn hóa cách đọc và xử lý dữ liệu.
- Xây dựng lớp tính toán nghiệp vụ.
- Hoàn thiện bộ lọc dùng chung.
- Chuẩn hóa component và Design System.
- Bảo đảm khả năng mở rộng các phân hệ.

## Giai đoạn 3 — Hoàn thiện Dashboard tổng hợp

- Tình hình và quy mô đào tạo.
- Đánh giá chất lượng giảng viên.
- Đánh giá nội dung chương trình.
- Công tác tổ chức và cơ sở vật chất.
- Phương pháp học tập và tương tác.
- Hiệu quả đầu ra và ứng dụng thực tiễn.

## Giai đoạn 4 — Triển khai Báo cáo chi tiết lớp học/chương trình

- Xây dựng bộ lọc theo Mã lớp và Mã chương trình.
- Xác định quan hệ giữa chương trình, lớp và hình thức đào tạo.
- Xây dựng logic tổng hợp năm nhóm đánh giá.
- Xử lý riêng thang điểm 4 và thang điểm 5.
- Hỗ trợ báo cáo lớp trực tiếp, trực tuyến và kết hợp.
- Xây dựng giao diện xem trước báo cáo.
- Triển khai xuất Excel và PDF.
- Đối soát kết quả với báo cáo mẫu nghiệp vụ.

## Giai đoạn 5 — Tối ưu và kiểm thử

- Kiểm tra tính đúng đắn của các công thức.
- Kiểm tra khả năng lọc chéo.
- Kiểm tra hiệu năng.
- Kiểm tra khả năng hiển thị trên nhiều kích thước màn hình.
- Kiểm tra xử lý dữ liệu thiếu.
- Kiểm tra chất lượng tài liệu xuất.
- Hoàn thiện hướng dẫn sử dụng.

---

# 17. TIÊU CHÍ NGHIỆM THU TỔNG THỂ

Hệ thống được xem là đáp ứng yêu cầu khi:

1. Các phân hệ hiển thị dữ liệu từ nguồn đã cấu hình.
2. Các chỉ số được tính đúng theo định nghĩa nghiệp vụ.
3. Các bộ lọc và tương tác giữa các component hoạt động nhất quán.
4. Người dùng có thể tra cứu lớp học và chương trình theo mã định danh.
5. Hệ thống tổng hợp báo cáo theo đúng thứ tự năm nhóm đánh giá.
6. Các thang điểm được xử lý chính xác.
7. Các lớp kết hợp trực tiếp và trực tuyến được phân biệt đúng phạm vi.
8. Các trường dữ liệu thiếu được xử lý an toàn.
9. Báo cáo PDF và Excel nhất quán với dữ liệu hiển thị.
10. Có thể truy xuất và kiểm tra số liệu từ dữ liệu nguồn.
11. Phân hệ mới không làm ảnh hưởng các chức năng hiện có.
12. Hệ thống có thể tiếp tục mở rộng khi bổ sung nguồn dữ liệu hoặc yêu cầu nghiệp vụ mới.

---

# 18. NGUYÊN TẮC CUỐI CÙNG

`PROJECT_CONTEXT.md` xác định bối cảnh, mục tiêu, phạm vi nghiệp vụ và nguyên tắc phát triển của toàn dự án.

Tài liệu này không thay thế các đặc tả chi tiết về kiến trúc, dữ liệu, giao diện hoặc công thức nghiệp vụ.

Các tài liệu chuyên biệt nên được tổ chức riêng:

- `PROJECT_CONTEXT.md`: Bối cảnh, mục tiêu, phạm vi và nguyên tắc toàn dự án.
- `ARCHITECTURE.md`: Kiến trúc kỹ thuật và tổ chức mã nguồn.
- `DATA_MODEL.md`: Nguồn dữ liệu, schema, khóa định danh và quan hệ.
- `METRICS_SPEC.md`: Định nghĩa KPI và công thức tính toán.
- `UI_SPEC.md`: Design System, điều hướng và quy tắc giao diện.
- `REPORTING_SPEC.md`: Cấu trúc báo cáo, quy tắc tổng hợp và xuất tài liệu.
- `spec.md` hoặc các file đặc tả theo từng tính năng: Yêu cầu chi tiết cho từng phân hệ.

Nếu workspace chưa có các file trên, không bắt buộc phải tạo tất cả cùng lúc. Ưu tiên hoàn thiện tài liệu phù hợp với giai đoạn triển khai hiện tại.

Mọi thay đổi phải bảo đảm tính đúng đắn của dữ liệu, tính nhất quán của nghiệp vụ và khả năng mở rộng của hệ thống.
