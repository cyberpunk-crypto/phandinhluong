# Kế hoạch website portfolio MC Phan Đình Lương

## Phạm vi triển khai
- Giữ landing page portfolio tiếng Việt theo phong cách Warm Architectural hiện tại, với 6 mục: Câu chuyện, Năng lực, Dấu ấn, Hình ảnh & Video, Hoạt động khác và Kết nối.
- Chuyển phần ảnh và video từ danh sách tĩnh sang nguồn dữ liệu động từ database; giữ media mẫu hiện có làm fallback để landing page không bị trống khi database chưa có nội dung.
- Thêm route `/admin/videos` dành cho chủ website. Người dùng phải đăng nhập Manus OAuth và có role `admin`; người dùng thường không được xem hoặc thao tác quản trị.
- Cho phép admin chọn tệp ảnh hoặc video, nhập tiêu đề và danh mục, upload qua server vào Manus Storage, lưu metadata và storage key vào MySQL, xem trạng thái công khai/lưu trữ và ẩn/hiện media.

## Thiết kế và trải nghiệm
- Giữ bảng màu giấy ấm, terracotta, xanh mực và olive; khu vực admin dùng cùng ngôn ngữ hình ảnh nhưng ưu tiên rõ ràng, thao tác nhanh và không thêm hình minh họa trang trí.
- Trang admin có tiêu đề “Quản trị video”, thẻ trạng thái đăng nhập, form upload rõ ràng, giới hạn 2 GB/định dạng file được nói ngay cạnh input và danh sách video đã tải lên.
- Gallery công khai hiển thị ảnh đã publish trong tab Ảnh và video đã publish trong tab Video; video vuông, có tiêu đề/danh mục bên dưới và mở player lớn khi bấm.

## Kiến trúc
- `drizzle/schema.ts`: bảng `videos` lưu cả media `image`/`video` với kind, title, category, storageKey, contentType, fileSize kiểu BIGINT, createdByOpenId, isPublished và timestamps.
- `server/db.ts`: thêm truy vấn list public/admin, insert video và cập nhật trạng thái/metadata.
- `server/routers.ts`: public query `videos.list`; admin procedures `admin.videos.list`, `create`, `update` và `archive` dùng `adminProcedure`.
- `server/storage.ts`: tái sử dụng `storagePut`, không đưa API key lên browser; browser gửi nội dung ảnh/video theo base64 với giới hạn file 2 GB và body request 3 GB có headroom tương ứng.
- `client/src/pages/AdminVideos.tsx`: Manus OAuth state, form upload ảnh/video và danh sách quản lý.
- `client/src/pages/Home.tsx`: query video động và fallback sang `videoMedia` tĩnh.
- `client/src/App.tsx`: đăng ký route admin và route manifest `/manus-routes.json`.

## Ràng buộc dữ liệu và phục vụ
- Manus OAuth/session hiện có được giữ nguyên; `OWNER_OPEN_ID`/role hiện tại quyết định quyền admin, không tạo bypass theo môi trường.
- Server/Database đã được bật. Migration mới là additive và dùng database quản lý chung của dự án; không xóa dữ liệu cũ.
- Storage key là dữ liệu bền vững trong database, URL trình duyệt dùng `/manus-storage/<key>`.
- Website chạy bằng Express/tRPC ở port 3000; production dùng Dockerfile hiện có và `/api/health`.

## Design direction
- **Design Movement:** editorial portfolio ấm, bất đối xứng và giàu nhịp sân khấu (0.07); **Swiss utility admin** (0.04); **minimal monochrome dashboard** (0.03). Chọn hướng editorial portfolio ấm để admin và landing page cùng một thương hiệu.
- **Core Principles:** rõ ràng trước trang trí; nội dung và hình ảnh là trung tâm; nhịp điệu dọc như một trang tạp chí; tương tác có phản hồi trực quan.
- **Color Philosophy:** nền giấy và kem tạo cảm giác hồ sơ in; terracotta là dấu nhấn sân khấu và trạng thái hành động; xanh mực giữ độ tin cậy cho chữ và thao tác.
- **Layout Paradigm:** landing page dùng các dải bất đối xứng và collage; admin dùng cột form cố định bên trái và danh sách nội dung bên phải.
- **Signature Elements:** số thứ tự lớn, đường kẻ mảnh, chip danh mục bo tròn và khung media vuông.
- **Interaction Philosophy:** mọi thao tác quản trị phải có trạng thái đang tải/thành công/lỗi; archive là thao tác ẩn mềm, không hứa xóa vật lý storage.
- **Animation:** giữ marquee liên tục; admin chỉ dùng chuyển màu, translate nhẹ và skeleton/opacity ngắn, không dùng animation gây chậm upload.
- **Typography System:** Cormorant Garamond cho tiêu đề và tên nội dung; IBM Plex Sans cho form, metadata, trạng thái và hướng dẫn.
- **Brand Essence:** MC và diễn viên kể chuyện bằng năng lượng, dành cho doanh nghiệp và chương trình cần một người dẫn chuyên nghiệp; ấm áp, linh hoạt, có chiều sâu.
- **Brand Voice:** headline giàu hình ảnh, CTA ngắn và trực tiếp. Ví dụ: “Thêm một sân khấu vào hành trình.” và “Tải video lên thư viện”.
- **Wordmark & Logo:** vòng tròn chữ PL làm dấu hiệu nhận diện, đi cùng wordmark Phan Lương.
- **Signature Brand Color:** terracotta `#a5442d`.
