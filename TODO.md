# TODO

## Landing page portfolio MC Phan Đình Lương
- [x] Profile dùng tên Phan Đình Lương, nội dung tiếng Việt và phong cách Warm Architectural terracotta/cream/serif.
- [x] Có đủ 6 mục điều hướng ngang: 01 Câu chuyện, 02 Năng lực, 03 Dấu ấn, 04 Hình ảnh & Video, 05 Hoạt động khác, 06 Kết nối; mục đang chọn được gạch chân đỏ.
- [x] Bảng thông tin cá nhân hiển thị theo 2 cột; không còn form đặt lịch, Canva, LinkedIn hoặc GitHub.
- [x] Khu vực hình ảnh và video tách tab; ảnh bấm xem toàn màn hình; video vuông, có tiêu đề bên dưới và có nút mở player lớn.
- [x] Marquee lĩnh vực chạy liên tục không khoảng trắng; thư viện ảnh có trạng thái mở rộng/thu nhỏ.
- [x] Nhập ảnh hồ sơ, ảnh sự kiện, video VTVcab và partner board; partner board đặt lớn ở trên danh sách các đơn vị hợp tác.

## Quản trị video full-stack
- [x] Người sở hữu mở `/admin/videos`, đăng nhập bằng Manus OAuth và chỉ user có role `admin` mới nhìn thấy form/danh sách quản trị; user thường nhận thông báo không có quyền.
- [x] Admin upload được file video hợp lệ với tiêu đề và danh mục; giao diện nêu rõ giới hạn 50 MB và định dạng video; trạng thái đang tải và lỗi/thành công hiển thị rõ.
- [x] Server nhận file, kiểm tra quyền admin, lưu bytes qua Manus Storage, không gửi API key xuống browser, sau đó lưu title/category/storage key/content type/file size/createdByOpenId vào database.
- [x] Landing page gọi query public để hiển thị các video `isPublished`; nếu chưa có bản ghi database thì vẫn hiển thị video tĩnh hiện có.
- [x] Admin xem danh sách video đã upload, biết trạng thái công khai/lưu trữ, có thể cập nhật tiêu đề/danh mục/trạng thái và archive mềm; archive không giả vờ xóa object storage.
- [x] Database migration additive cho bảng videos chạy được trên database managed hiện tại; `/api/health` tiếp tục trả 2xx.
- [x] Có `public/manus-routes.json` khai báo `/` và `/admin/videos`.

## Kiểm tra và bàn giao
- [x] Chạy typecheck, build và kiểm tra HTTP health/routes sau khi backend hoạt động.
- [ ] Commit checkpoint lên canonical remote; chỉ publish khi người dùng yêu cầu.
