# Hướng dẫn cập nhật ảnh và video

Website đã tách dữ liệu media ra khỏi giao diện tại `client/src/content/media.ts`. Khi muốn thay ảnh của một chương trình, đặt file mới vào `client/public/media/phan/`, sau đó sửa trường `src` của mục tương ứng trong `eventMedia`. Trường `replaceFor` ghi rõ sự kiện mà ảnh đại diện để tránh nhầm khi nhận nhiều file.

Khi ảnh không thuộc một sự kiện đã có, thêm một object mới vào `extraMedia`. Khi thêm video, đặt file vào `client/public/media/phan/video/` rồi thêm object vào `videoMedia`, sử dụng `kind: "video"` và đường dẫn `src` tương ứng. Video sẽ xuất hiện trong tab **Video**, còn ảnh sẽ xuất hiện trong tab **Ảnh**.

Các file ảnh/video người dùng gửi thêm có thể được phân loại theo nội dung trước khi đưa vào đúng sự kiện. Nếu là ảnh dư hoặc chưa xác định được sự kiện, giữ trong `extraMedia` để hiển thị ở thư viện chung, không làm mất file gốc.

Lưu ý: GitHub Pages là website tĩnh nên thao tác chọn file ngay trên trình duyệt không thể tự ghi ngược vào website công khai. Cách cập nhật bền vững là thêm file vào thư mục media và chỉnh `media.ts`; trong quy trình này, bạn chỉ cần gửi file và nói tên sự kiện, phần phân loại/thay thế sẽ được thực hiện đúng vị trí.
