# SPEC — Website FixNow

Dịch vụ sửa chữa & bảo trì laptop/PC tận nơi.

---

## 1. Mục tiêu website

Website là kênh **giới thiệu dịch vụ + đặt lịch + tra cứu giá** cho FixNow.
Khách hàng phần lớn dùng điện thoại, không rành kỹ thuật → web phải **đơn giản, rõ ràng, minh bạch giá, dễ đặt lịch**.

Giá trị cốt lõi cần thể hiện xuyên suốt: **Tiện lợi – Minh bạch – Nhanh chóng – An toàn dữ liệu**.

---

## 2. Đối tượng người dùng

| Nhóm | Nhu cầu trên web |
|------|------------------|
| Sinh viên | Xem giá, đặt lịch sửa máy chậm / cài phần mềm |
| Nhân viên VP / WFH | Đặt lịch nhanh, xem khu vực phục vụ |
| Hộ gia đình | Xem dịch vụ, gọi/Zalo nhanh |
| Hộ kinh doanh nhỏ | Tìm hiểu gói bảo trì định kỳ |

---

## 3. Danh sách trang (6 trang MVP)

| # | Trang | Nội dung chính |
|---|-------|----------------|
| 1 | **Trang chủ** | Giới thiệu FixNow, giá trị cốt lõi, nút "Đặt lịch ngay", quy trình 6 bước |
| 2 | **Dịch vụ** | 6 nhóm dịch vụ: kiểm tra máy, sửa phần mềm, bảo trì phần cứng, nâng cấp, hỗ trợ thiết bị VP, hỗ trợ từ xa |
| 3 | **Bảng giá dịch vụ** | Giá tham khảo từng dịch vụ + ghi chú "báo giá trước khi sửa" |
| 4 | **Giá linh kiện (tra cứu)** | Tra cứu RAM, SSD, HDD, pin, phụ kiện — có tìm kiếm & lọc |
| 5 | **Đặt lịch** | Form yêu cầu sửa chữa |
| 6 | **Liên hệ** | Zalo, hotline, khu vực phục vụ (3–5km), bản đồ |

---

## 4. Tính năng cơ bản (MVP)

> Website FixNow là web đặt lịch sửa chữa, không phải sàn thương mại điện tử. MVP ưu tiên khách xem dịch vụ, xem giá, đăng ký/đăng nhập, đặt lịch, lưu dữ liệu thật vào database cơ bản, xem lại lịch hẹn, liên hệ nhanh.

### 4.0 Danh sách feature cần làm

| Feature | Mô tả | MVP? | Ghi chú |
|---------|-------|------|---------|
| Xem trang chủ | Khách xem giới thiệu FixNow, slogan, lợi ích, quy trình sửa chữa | Có | Trang đầu tiên khi vào web |
| Xem dịch vụ | Khách xem các nhóm dịch vụ FixNow cung cấp | Có | Dạng card dễ đọc trên điện thoại |
| Xem bảng giá dịch vụ | Khách xem giá tham khảo từng dịch vụ | Có | Luôn ghi rõ "báo giá trước khi sửa" |
| Tra cứu giá linh kiện | Khách tìm RAM, SSD, HDD, pin, phụ kiện | Có | Có tìm kiếm + lọc loại linh kiện |
| Đăng ký tài khoản khách | Khách tạo tài khoản bằng họ tên, SĐT, email/mật khẩu | Có | Cần để khách đặt hẹn và xem lại lịch hẹn |
| Đăng nhập khách | Khách đăng nhập bằng SĐT/email + mật khẩu | Có | Nếu chưa đăng nhập mà bấm đặt lịch → chuyển tới đăng nhập/đăng ký |
| Đăng xuất | Khách thoát tài khoản | Có | Hiển thị trong menu khi đã đăng nhập |
| Đặt lịch sửa chữa | Khách đã đăng nhập gửi thông tin lỗi máy, địa chỉ, thời gian mong muốn | Có | Feature quan trọng nhất |
| Validate form đặt lịch | Kiểm tra họ tên, SĐT, địa chỉ bắt buộc | Có | Có thể tự điền họ tên/SĐT từ tài khoản |
| Tạo đơn đặt hẹn | Sau khi gửi form, hệ thống tạo mã lịch hẹn/đơn hẹn | Có | Ví dụ: FN-2026-0001 |
| Lưu database | Lưu tài khoản, lịch hẹn, linh kiện, bảng giá vào database cơ bản | Có | Không chỉ demo/localStorage |
| Thông báo gửi thành công | Sau khi đặt lịch, hiện thông báo FixNow sẽ liên hệ lại | Có | Hiển thị mã lịch hẹn cho khách |
| Xem lịch hẹn của tôi | Khách đăng nhập xem danh sách lịch hẹn đã đặt | Có | Tối thiểu: mã hẹn, dịch vụ/lỗi, thời gian, trạng thái |
| Liên hệ nhanh | Nút gọi hotline + Zalo nổi trên màn hình | Có | Ưu tiên mobile |
| Xem khu vực phục vụ | Khách biết FixNow phục vụ bán kính 3–5km | Có | Trang liên hệ |
| Responsive mobile | Giao diện chạy tốt trên điện thoại, tablet, desktop | Có | Bắt buộc vì khách dùng điện thoại nhiều |
| Admin xem lịch hẹn | KTV xem danh sách yêu cầu đã gửi | Điểm cộng | Làm nếu còn thời gian |
| Cập nhật trạng thái lịch hẹn | Admin đổi trạng thái: đã nhận / đang xử lý / hoàn thành | Điểm cộng | Cần có lưu dữ liệu |
| Đăng nhập admin | Admin đăng nhập để xem lịch hẹn | Điểm cộng | Tách role admin và khách |
| Tra cứu lịch hẹn không cần tài khoản | Khách nhập SĐT/mã lịch hẹn để xem trạng thái | Sau MVP | Tùy chọn nếu muốn hỗ trợ khách quên đăng nhập |
| Đánh giá dịch vụ | Khách gửi sao + phản hồi sau khi sửa | Sau MVP | Có thể hiển thị ở trang chủ |
| Gói bảo trì định kỳ | Khách/hộ kinh doanh đăng ký gói bảo trì | Sau MVP | Giai đoạn 3 |

### 4.1 Điều hướng & giao diện
- Thanh menu (navbar) liên kết 6 trang, cố định trên cùng.
- **Responsive**: hiển thị tốt trên điện thoại và máy tính.
- **Nút liên hệ nhanh** nổi ở góc màn hình: gọi hotline + chat Zalo.

### 4.2 Trang chủ
- Banner giới thiệu + slogan + nút "Đặt lịch ngay".
- Khối "Tại sao chọn FixNow" (4 giá trị cốt lõi).
- Khối quy trình 6 bước: gửi yêu cầu → mô tả lỗi → đặt lịch → KTV kiểm tra → báo giá → sửa khi đồng ý.

### 4.3 Trang dịch vụ
- Hiển thị 6 nhóm dịch vụ dạng thẻ (card): tên + mô tả ngắn + icon.

### 4.4 Bảng giá dịch vụ
- Bảng: Tên dịch vụ | Giá tham khảo | Ghi chú.
- Câu nhắc minh bạch: *"Giá tham khảo, KTV báo giá chính xác sau khi kiểm tra máy."*

### 4.5 Giá linh kiện (tra cứu)
- Danh sách linh kiện dạng bảng/thẻ.
- **Mỗi linh kiện gồm:** Loại | Tên/thông số | Giá tham khảo | Bảo hành | Ghi chú.
- **Thanh tìm kiếm** theo tên (vd: "RAM 8GB").
- **Bộ lọc theo loại**: RAM / SSD / HDD / Phụ kiện.
- Ghi chú giá tham khảo (thị trường thay đổi liên tục).

### 4.6 Đăng ký / đăng nhập khách
- Khách cần có tài khoản để đặt lịch và xem lại lịch hẹn.
- **Form đăng ký gồm:**
  - Họ tên (bắt buộc)
  - Số điện thoại (bắt buộc, duy nhất)
  - Email (tùy chọn hoặc bắt buộc nếu dùng email login)
  - Mật khẩu (bắt buộc)
  - Xác nhận mật khẩu (bắt buộc)
- **Form đăng nhập gồm:**
  - Số điện thoại hoặc email
  - Mật khẩu
- Kiểm tra dữ liệu cơ bản:
  - SĐT đúng định dạng.
  - Mật khẩu tối thiểu 6 ký tự.
  - Xác nhận mật khẩu phải khớp.
- Sau đăng nhập: hiển thị tên khách trên navbar + nút "Đăng xuất".

### 4.7 Đặt lịch / order đặt hẹn
- Nếu khách chưa đăng nhập mà bấm "Đặt lịch ngay": chuyển tới trang đăng nhập/đăng ký.
- Nếu khách đã đăng nhập: mở form đặt lịch.
- **Form gồm các trường:**
  - Họ tên (tự điền từ tài khoản, cho phép sửa)
  - Số điện thoại (tự điền từ tài khoản, bắt buộc)
  - Địa chỉ (bắt buộc)
  - Loại thiết bị (Laptop / PC / Máy in / Khác)
  - Nhóm dịch vụ cần sửa
  - Mô tả lỗi
  - Thời gian mong muốn
- Kiểm tra dữ liệu cơ bản (bắt buộc nhập SĐT hợp lệ + địa chỉ + thời gian).
- Sau khi gửi: tạo **mã lịch hẹn/order** và hiển thị thông báo:
  - "Đã nhận yêu cầu, FixNow sẽ liên hệ lại. Mã lịch hẹn: FN-YYYY-XXXX".
- Lịch hẹn mặc định có trạng thái: **Đã nhận**.

### 4.8 Lịch hẹn của tôi
- Khách đăng nhập xem danh sách lịch hẹn đã đặt.
- **Mỗi lịch hẹn gồm:**
  - Mã lịch hẹn
  - Ngày tạo
  - Loại thiết bị
  - Mô tả lỗi
  - Địa chỉ
  - Thời gian mong muốn
  - Trạng thái: Đã nhận / Đang xử lý / Hoàn thành / Đã hủy
- Khách có thể xem chi tiết lịch hẹn.
- (Tùy chọn) Khách hủy lịch hẹn nếu trạng thái còn "Đã nhận".

### 4.9 Liên hệ
- Thông tin: hotline, Zalo, email, khu vực phục vụ.
- (Tùy chọn) nhúng bản đồ khu vực.

### 4.10 Database cơ bản
- Website phải có database thật để lưu dữ liệu, không chỉ demo bằng localStorage.
- Khuyến nghị cho đồ án: **SQLite** nếu chạy local, hoặc **Firebase Firestore** nếu muốn cloud nhanh.
- MVP cần tối thiểu các bảng/collection:

#### users
| Field | Kiểu | Ghi chú |
|-------|------|---------|
| id | string/int | Khóa chính |
| full_name | string | Họ tên khách |
| phone | string | SĐT, duy nhất |
| email | string | Có thể duy nhất nếu dùng email login |
| password_hash | string | Không lưu mật khẩu plain text |
| role | string | customer / admin |
| created_at | datetime | Ngày tạo tài khoản |

#### appointments
| Field | Kiểu | Ghi chú |
|-------|------|---------|
| id | string/int | Khóa chính |
| appointment_code | string | Mã hẹn, ví dụ FN-2026-0001 |
| user_id | string/int | Liên kết users.id |
| customer_name | string | Tên người đặt |
| phone | string | SĐT liên hệ |
| address | string | Địa chỉ sửa |
| device_type | string | Laptop / PC / Máy in / Khác |
| service_group | string | Nhóm dịch vụ |
| issue_description | text | Mô tả lỗi |
| preferred_time | datetime/string | Thời gian mong muốn |
| status | string | Đã nhận / Đang xử lý / Hoàn thành / Đã hủy |
| created_at | datetime | Ngày tạo lịch hẹn |
| updated_at | datetime | Ngày cập nhật |

#### service_prices
| Field | Kiểu | Ghi chú |
|-------|------|---------|
| id | string/int | Khóa chính |
| service_name | string | Tên dịch vụ |
| price_from | number/string | Giá tham khảo |
| note | string | Ghi chú |
| is_active | boolean | Ẩn/hiện dịch vụ |

#### parts
| Field | Kiểu | Ghi chú |
|-------|------|---------|
| id | string/int | Khóa chính |
| type | string | RAM / SSD / HDD / Pin / Phụ kiện |
| name | string | Tên/thông số linh kiện |
| price | number/string | Giá tham khảo |
| warranty | string | Bảo hành |
| note | string | Ghi chú |
| is_active | boolean | Ẩn/hiện linh kiện |

- Quy tắc dữ liệu:
  - Đăng ký tạo record trong `users`.
  - Đặt lịch tạo record trong `appointments`.
  - Trang "Lịch hẹn của tôi" chỉ hiện `appointments` theo `user_id` đang đăng nhập.
  - Admin có thể xem toàn bộ `appointments` nếu làm trang admin.
  - Mật khẩu phải hash trước khi lưu.

---

## 5. Tính năng nâng cao (làm sau nếu còn thời gian)

- **Trang admin**: KTV xem danh sách lịch hẹn đã đặt.
- **Trạng thái yêu cầu**: đã nhận / đang xử lý / hoàn thành.
- **Đánh giá / phản hồi** sau khi sửa.
- **Gói bảo trì định kỳ** (giai đoạn 3) — trang giới thiệu + đăng ký gói.
- Lưu dữ liệu đặt lịch & linh kiện vào cơ sở dữ liệu.

---

## 6. Phạm vi MVP (chốt cho đồ án)

> **Làm trước:** 6 trang ở mục 3 + toàn bộ tính năng cơ bản ở mục 4, đăng ký/đăng nhập, database cơ bản, giao diện responsive, nút Zalo/hotline.
>
> **Điểm cộng:** trang admin xem lịch hẹn + cập nhật trạng thái.

---

## 7. Cần quyết định trước khi code

| Hạng mục | Lựa chọn cần chốt |
|----------|-------------------|
| Công nghệ | HTML/CSS/JS thuần *(đơn giản, dễ demo)* **hay** React/Next.js *(hiện đại hơn)* |
| Database | SQLite / MySQL / PostgreSQL / Firebase Firestore |
| Lưu tài khoản khách | Lưu trong database, mật khẩu hash |
| Lưu dữ liệu đặt lịch | Lưu trong database |
| Luồng đặt hẹn | Bắt buộc đăng nhập trước khi đặt **hay** cho đặt nhanh không cần tài khoản |
| Dữ liệu giá linh kiện | Nhập tay ban đầu rồi seed vào database **hay** quản lý trực tiếp trong DB |
