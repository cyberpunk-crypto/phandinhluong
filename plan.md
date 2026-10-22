# Kế hoạch cập nhật profile MC Phan Đình Lương

## Phạm vi
- Bỏ toàn bộ form Đặt lịch, liên kết Canva, GitHub, LinkedIn và các nút/profile Canva ở footer.
- Giữ website là landing page portfolio cá nhân với 4 phần điều hướng: Câu chuyện, Năng lực, Dấu ấn, Kết nối.
- Dùng nội dung trong PDF MCPH.LU.pdf làm nguồn chính cho hồ sơ, học vấn, kinh nghiệm, chương trình, lĩnh vực mở rộng và đơn vị hợp tác.

## Thiết kế và tương tác
- Giữ phong cách Warm Architectural hiện tại: nền giấy ấm, serif biên tập, terracotta làm màu nhấn.
- Điều hướng dùng trạng thái active được cập nhật ngay khi bấm và đồng bộ theo vị trí cuộn; mục đang chọn có gạch chân đỏ.
- Thông tin cá nhân hiển thị trong bảng 2 cột, không dùng các ô card rời.
- Khu vực Dấu ấn có hai tab Ảnh/Video. Nút mũi tên ở các thẻ media bật/tắt gallery mở rộng; khi đóng trả về bố cục gọn.
- Video hiện có khung chờ nội dung vì người dùng sẽ gửi file bổ sung sau.

## Nội dung mới từ PDF
- Chiều cao 175cm, cân nặng 65kg, giày 41, giọng miền Bắc, quê Thanh Hóa, sinh năm 2001.
- Á khoa ngành Diễn viên Kịch – Điện ảnh; chứng chỉ MC cơ bản/chuyên nghiệp tại Dream Draw; chứng chỉ giáo viên MC nhí tại ST Lighthouse.
- Kinh nghiệm tại VTVCab, Nhà hát Kịch Hà Nội, đào tạo MC nhí và kỹ năng thuyết trình.
- Các chương trình: Hoa hậu Biển đảo Việt Nam 2025, Night Wonder Fashion Show, Bikini Show, Hoa hậu Du lịch Dân tộc Việt Nam 2025, The Talent Night, talkshow Điểm chạm cảm xúc, Bản tin VTVCab, Samsung A36/A56 5G, Galaxy S25 Series, hoạt náo, thiện nguyện, sự kiện thiếu nhi và các hoạt động KOL/TVC/food review/diễn viên.
- Thêm mục Các đơn vị hợp tác, gồm Nhà hát Kịch Hà Nội, VTVCab, Samsung, Clickbuy, Mộc Châu Island, Vinpearl Nha Trang, Dream Draw, ST Lighthouse và các đối tác sự kiện/agency.

## Cấu trúc chính
- `client/src/pages/Home.tsx`: nội dung, điều hướng, gallery, media tabs và bảng hồ sơ.
- `client/src/index.css`: bảng 2 cột, media toggle/gallery, partners và responsive.
- `client/public/media/phan`: tái sử dụng asset hiện có; dành chỗ cho ảnh/video người dùng gửi bổ sung.
