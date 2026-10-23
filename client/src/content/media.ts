export type MediaKind = "image" | "video";

export type MediaItem = {
  id: string;
  title: string;
  category: string;
  kind: MediaKind;
  src: string;
  poster?: string;
  replaceFor?: string;
};

// Media sự kiện chính: dùng đúng ảnh đại diện của từng chương trình.
export const eventMedia: MediaItem[] = [
  { id: "tourism-2025", title: "Hoa hậu Du lịch Dân tộc Việt Nam 2025", category: "Cuộc thi sắc đẹp", kind: "image", src: "/media/phan/event-tourism.jpg", replaceFor: "Hoa hậu Du lịch Dân tộc Việt Nam 2025" },
  { id: "talent-night", title: "The Talent Night — Mộc Châu Island", category: "Đêm thi tài năng", kind: "image", src: "/media/phan/event-talent.jpg", replaceFor: "The Talent Night — Mộc Châu Island" },
  { id: "night-wonder", title: "Night Wonder — Vinpearl Nha Trang", category: "Fashion show", kind: "image", src: "/media/phan/event-fashion.jpg", replaceFor: "Night Wonder — Vinpearl Nha Trang" },
  { id: "bikini-show", title: "Bikini Show — Người đẹp biển", category: "Sân khấu cuộc thi", kind: "image", src: "/media/phan/event-beach.jpg", replaceFor: "Bikini Show — Người đẹp biển" },
];

// 47 ảnh đã được đối chiếu lại theo thứ tự file thực tế trong hồ sơ DOCX.
const profileCaptions = [
  "Chân dung MC chính diện trong vest sọc tối màu",
  "Year End Party 2025 — Bảo hiểm VietinBank (VBI) — chụp hình tại backdrop",
  "Sự kiện Chúc Mừng Năm Mới 2026 — H.O.P.E — ảnh toàn thân",
  "Sự kiện Chúc Mừng Năm Mới 2026 — H.O.P.E — ảnh bán thân",
  "Sự kiện Chúc Mừng Năm Mới 2026 — H.O.P.E — chụp cùng khách mời",
  "Year End Party Mẹ Gấu Pilates — cận cảnh tác nghiệp",
  "Sự kiện Tân niên & Bốc thăm trúng thưởng — chân dung",
  "Sự kiện Tân niên & Bốc thăm trúng thưởng — dẫn dắt",
  "Lễ Ký Cam Kết Mục Tiêu Doanh Số 2026 — QCBEST",
  "Gala Tài Năng Nhí YO Group — toàn cảnh sân khấu",
  "Gala Tài Năng Nhí YO Group — chụp cùng Quán quân & Á quân",
  "Chân dung MC vẫy tay chào thân thiện",
  "Gala Tài Năng Nhí YO Group — cùng khách mời và thí sinh nhí",
  "Year End Party Mẹ Gấu Pilates — khoảnh khắc dẫn chương trình",
  "OHLALA Fashion Show — Thăng Hoa by Trinh Trinh",
  "Trình diễn áo dài nghệ thuật họa tiết làng quê",
  "Trình diễn trang phục thổ cẩm cách tân",
  "Year End Party Hệ thống Phòng khám Da liễu Hà Nội — toàn cảnh",
  "Year End Party Hệ thống Phòng khám Da liễu Hà Nội — dẫn sân khấu",
  "Team Building & Dã ngoại — khuấy động và giao lưu",
  "Chung kết Miss Heritage Ao Dai Global 2026 — thảm đỏ",
  "Chung kết Miss Galaxy Vietnam 2026 — thảm đỏ",
  "Chân dung MC trong áo dài đỏ thêu hoa sen",
  "Chung kết Miss Galaxy Vietnam 2026 — trung cảnh thảm đỏ",
  "Biểu diễn tại Nhà hát Kịch Hà Nội — hóa thân nhân vật",
  "Vở diễn về lực lượng Cảnh sát PCCC và CNCH — toàn cảnh",
  "Vở diễn về lực lượng Cảnh sát PCCC và CNCH — phân cảnh diễn xuất",
  "Chân dung studio trong vest xám than",
  "Nhiếp ảnh thời trang trong thiết kế áo vest trắng",
  "Trình diễn áo dài nghệ thuật — toàn thân",
  "Chân dung MC với áo dài đỏ thêu hoa sen",
  "Chung kết Miss Galaxy Vietnam 2026 — trao giải",
  "Chung kết Miss Galaxy Vietnam 2026 — đeo dải băng danh hiệu",
  "Chương trình nghệ thuật kỷ niệm 96 năm Ngày thành lập Đảng — toàn cảnh",
  "OHLALA Fashion Show — chân dung thời trang ngoài trời",
  "OHLALA Fashion Show — dẫn đôi nam nữ",
  "Sự kiện tiệc cưới / gala — dẫn dắt trên sân khấu",
  "Sự kiện gala — dẫn đôi nam nữ",
  "Sự kiện hội nghị — kết nối tại khu vực khán giả",
  "Hội Chợ Xuân — Tết Sum Vầy 2026 — toàn cảnh sân khấu",
  "Hội Chợ Xuân — Tết Sum Vầy 2026 — trung cảnh dẫn dắt",
  "Team Building Play is a must — Chơi là Chất",
  "Chương trình nghệ thuật kỷ niệm 96 năm Ngày thành lập Đảng — dẫn đôi",
  "Họp báo khởi động Miss Heritage Ao Dai Global 2026",
  "Year End Party 2025 — Bảo hiểm VietinBank (VBI) — dẫn đơn",
  "Year End Party 2025 — Bảo hiểm VietinBank (VBI) — đồng hành cùng đại diện phát biểu",
  "Year End Party 2025 — Bảo hiểm VietinBank (VBI) — giao lưu cùng khách mời",
];

export const profileGallery: MediaItem[] = profileCaptions.map((title, index) => ({
  id: `docx-profile-${String(index + 1).padStart(2, "0")}`,
  title,
  category: "Hồ sơ hình ảnh MC sự kiện",
  kind: "image",
  src: `/media/profile-docx/profile-${String(index + 1).padStart(2, "0")}.jpg`,
}));

export const extraMedia: MediaItem[] = [];

export const videoMedia: MediaItem[] = [
  { id: "vtvcab-news", title: "Bản tin VTVcab", category: "MC truyền hình", kind: "video", src: "/media/phan/video/vtvcab-news.mp4", poster: "/media/phan/video/vtvcab-news-poster.jpg" },
];

export const partnerUnits = [
  "VTVCab News", "Hoa hậu Biển Việt Nam 2025", "Night Wonder", "WinMart", "Bimat Media", "Clickbuy", "Miss Tourism Ethnic Vietnam", "NUAE — Đại học Kiến trúc Hà Nội", "Trung tâm Hỗ trợ Khởi nghiệp Quốc gia", "ICT Skill", "ST Lighthouse", "Nhật Minh Food", "Bảo tàng Phụ nữ Việt Nam", "Nhà hát Kịch Hà Nội", "OCOP An Bài Việt", "Oatway", "muWono", "VBI", "Phòng khám đa khoa", "Thiên Hà", "QCBEST", "VO Group Event & Media", "Samsung", "Mộc Châu Island / Vinpearl Nha Trang", "Dream Draw", "Các agency và đối tác sự kiện",
];

export const partnerBoardImage = "/media/partners/partner-board.png";
