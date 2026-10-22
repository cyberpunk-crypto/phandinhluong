import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Award,
  Check,
  ChevronRight,
  Menu,
  Maximize2,
  Mic2,
  PenLine,
  Play,
  Quote,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { eventMedia, extraMedia, partnerBoardImage, partnerUnits, profileGallery, videoMedia } from "../content/media";

const siteAsset = (path: string) => {
  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/phandinhluong") ? "/phandinhluong/" : "/";
  return `${base}${path.replace(/^\/+/, "")}`;
};

const navItems = [
  { label: "Câu chuyện", href: "#gioi-thieu" },
  { label: "Năng lực", href: "#nang-luc" },
  { label: "Dấu ấn", href: "#dau-an" },
  { label: "Hình ảnh & Video", href: "#media" },
  { label: "Hoạt động khác", href: "#hoat-dong" },
  { label: "Kết nối", href: "#ket-noi" },
];

const capabilities = [
  {
    number: "01",
    icon: Mic2,
    title: "MC sự kiện",
    text: "Dẫn event, sự kiện, talkshow, gala dinner, chương trình hoạt náo, bản tin và livestream.",
    tags: ["Event", "Talkshow", "Gala", "Livestream"],
    image: siteAsset("/media/phan/stage.png"),
  },
  {
    number: "02",
    icon: Users,
    title: "Sân khấu & cuộc thi",
    text: "Đồng hành cùng các sân chơi văn hóa, thời trang, sắc đẹp và những đêm thi giàu cảm xúc.",
    tags: ["Beauty pageant", "Fashion show", "Sân khấu"],
    image: siteAsset("/media/phan/event-tourism.jpg"),
  },
  {
    number: "03",
    icon: PenLine,
    title: "Nội dung & thương hiệu",
    text: "KOL, mẫu ảnh, TVC, food review, diễn viên và nội dung công nghệ, giáo dục, đời sống.",
    tags: ["KOL", "TVC", "Food review", "Công nghệ"],
    image: siteAsset("/media/phan/event-fashion.jpg"),
  },
];

const milestones = [
  { year: "2025", title: "Miss Tourism Ethnic Vietnam", text: "Master of ceremonies cho Hoa hậu Du lịch Dân tộc Việt Nam 2025." },
  { year: "2025", title: "Night Wonder Fashion Show", text: "Dẫn dắt sân khấu thời trang tại Vinpearl Nha Trang cùng Diễm Quỳnh." },
  { year: "2025", title: "Mộc Châu Island — The Talent Night", text: "Đêm thi tài năng trong khuôn khổ cuộc thi Hoa hậu Du lịch Dân tộc Việt Nam 2025." },
  { year: "2024", title: "Nhà hát Kịch Hà Nội", text: "Gia nhập môi trường sân khấu chuyên nghiệp sau khi tốt nghiệp Á khoa." },
];

const projects = eventMedia.map((item, index) => ({
  category: item.category,
  title: item.title,
  image: siteAsset(item.src),
  tone: ["terracotta", "ink", "olive", "terracotta"][index % 4],
}));

const profileFacts = [
  ["Năm sinh", "2001"],
  ["Chiều cao", "175 cm"],
  ["Cân nặng", "65 kg"],
  ["Cỡ giày", "41"],
  ["Quê quán", "Thanh Hóa"],
  ["Chất giọng", "Miền Bắc"],
  ["Học vấn", "Á khoa ngành Diễn viên Kịch – Điện ảnh"],
  ["Đơn vị công tác", "Nhà hát Kịch Hà Nội"],
  ["Kinh nghiệm", "03 năm MC; từng học tập và làm việc trong lĩnh vực MC truyền hình tại VTVCab"],
  ["Đào tạo", "Chứng chỉ MC cơ bản và chuyên nghiệp tại Dream Draw; chứng chỉ giáo viên MC nhí tại ST Lighthouse"],
  ["Lĩnh vực", "MC sự kiện, diễn viên, đào tạo MC nhí và kỹ năng thuyết trình"],
  ["Phong cách", "Trẻ trung, chuyên nghiệp, linh hoạt, giàu năng lượng"],
];

const videoTopics = [
  "Bản tin VTVcab và MC truyền hình",
  "Sự kiện khám phá AI cùng Galaxy S25 Series",
  "Ra mắt Samsung Galaxy A36/A56 5G",
  "Talkshow Điểm chạm cảm xúc",
  "Mẫu livestream giới thiệu sản phẩm",
  "MC hoạt náo và sự kiện thiếu nhi",
];

const experienceExtras = [
  "Talkshow Điểm chạm cảm xúc — dự án giao thoa giữa hội họa, nghệ thuật và không gian nội thất",
  "Sự kiện 41 năm thành lập Ngày Nhà giáo Việt Nam",
  "Bảo tàng Phụ nữ Việt Nam — chương trình giáo dục lịch sử Một thời hoa lửa",
  "Chung kết cuộc thi Sinh viên NUAE với ý tưởng khởi nghiệp",
  "MC sự kiện thiện nguyện Hành trình kết nối yêu thương",
  "MC chương trình casting CLB C&A và bản tin Tin tức quốc tế",
  "Sự kiện khám phá AI cùng Galaxy S25 Series với các khách mời công nghệ",
  "Hoạt động KOL, dự sự kiện, mẫu ảnh, TVC, food review và diễn viên",
];

function scrollToId(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("gioi-thieu");
  const [mediaTab, setMediaTab] = useState<"images" | "videos">("images");
  const [expandedMedia, setExpandedMedia] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);
  const [videoLightbox, setVideoLightbox] = useState<(typeof videoMedia)[number] | null>(null);

  useEffect(() => {
    const sections = navItems.map((item) => document.querySelector(item.href)).filter(Boolean) as Element[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-28% 0px -58%", threshold: [0.15, 0.35, 0.65] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    setActiveSection(href.slice(1));
    scrollToId(href);
  };

  const toggleMedia = () => setExpandedMedia((expanded) => !expanded);
  const galleryItems = [
    ...projects.map((item, index) => ({ id: `event-${index}`, title: item.title, category: item.category, kind: "image" as const, src: item.image })),
    ...profileGallery,
    ...extraMedia.filter((item) => item.kind === "image"),
  ];

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" onClick={(event) => { event.preventDefault(); scrollToId("#top"); }} aria-label="Về đầu trang">
          <span className="wordmark-mark">PL</span>
          <span className="wordmark-copy"><strong>Phan Lương</strong><em>mc / actor</em></span>
        </a>
        <nav className={`desktop-nav ${menuOpen ? "is-open" : ""}`} aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <a key={item.href} className={activeSection === item.href.slice(1) ? "is-active" : ""} href={item.href} onClick={(event) => { event.preventDefault(); handleNav(item.href); }}>
              {item.label}
            </a>
          ))}
        </nav>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? "Đóng menu" : "Mở menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      <main id="top">
        <section className="hero-section section-frame">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> Phan Đình Lương / MC Ph.Lu</p>
            <h1>MC kể chuyện<br /><em>bằng năng lượng.</em></h1>
            <p className="hero-lede">Á khoa Diễn viên Kịch – Điện ảnh, MC sự kiện và diễn viên Nhà hát Kịch Hà Nội với phong cách trẻ trung, chuyên nghiệp, linh hoạt.</p>
            <div className="hero-actions hero-section-links"><button className="button button-dark" type="button" onClick={() => handleNav("#gioi-thieu")}>01 Câu chuyện <ArrowUpRight size={17} /></button>{navItems.slice(1).map((item, index) => <button className="text-link" key={item.href} type="button" onClick={() => handleNav(item.href)}>{String(index + 2).padStart(2, "0")} {item.label} <ArrowDown size={14} /></button>)}</div>
            <div className="hero-note"><span className="note-line" /><span>MC · Diễn viên · Đào tạo MC nhí · Nội dung</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-arch" />
            <img src={siteAsset("/media/phan/hero-cropped.png")} alt="Phan Đình Lương trong vai trò MC" />
            <div className="hero-stamp"><span>listen</span><span>connect</span><span>retell</span></div>
            <div className="hero-caption"><Quote size={17} fill="currentColor" /><span>“Trẻ trung trong năng lượng. Chuyên nghiệp trong từng khoảnh khắc.”</span></div>
          </div>
          <div className="hero-scroll"><span>Cuộn để khám phá</span><span className="scroll-line" /></div>
        </section>

        <div className="ticker" aria-label="Lĩnh vực hoạt động">
          <div className="ticker-track"><div className="ticker-group"><span>HOSTING</span><i>✳</i><span>STAGE</span><i>✳</i><span>FASHION</span><i>✳</i><span>CONTENT</span><i>✳</i><span>EDUCATION</span><i>✳</i><span>ENERGY</span><i>✳</i></div><div className="ticker-group" aria-hidden="true"><span>HOSTING</span><i>✳</i><span>STAGE</span><i>✳</i><span>FASHION</span><i>✳</i><span>CONTENT</span><i>✳</i><span>EDUCATION</span><i>✳</i><span>ENERGY</span><i>✳</i></div></div>
        </div>

        <section id="gioi-thieu" className="intro-section section-frame anchor-section">
          <div className="section-index">01 <span>/</span> câu chuyện</div>
          <div className="intro-layout">
            <div className="section-heading"><p className="eyebrow">Về Phan Lương</p><h2>Một gương mặt<br /><em>sinh ra cho sân khấu.</em></h2></div>
            <div className="intro-body"><p className="intro-lede">Từ sân khấu kịch đến những chương trình quy mô lớn, tôi luôn tìm kiếm khoảnh khắc một câu chuyện thật sự chạm đến khán giả.</p><p>Tôi là Phan Đình Lương — tốt nghiệp Á khoa ngành Diễn viên Kịch – Điện ảnh, hoàn thành chứng chỉ MC cơ bản và chuyên nghiệp tại Dream Draw, đồng thời sở hữu chứng chỉ giáo viên MC nhí tại ST Lighthouse.</p><p>Phan Lương từng học tập và làm việc trong lĩnh vực MC truyền hình tại VTVCab, hiện là diễn viên tại Nhà hát Kịch Hà Nội và đào tạo kỹ năng thuyết trình, dẫn chương trình cho trẻ em và người lớn tại Hà Nội.</p><div className="signature">Phan Lương <span>— born for the stage</span></div></div>
          </div>
          <div className="intro-collage"><div className="collage-main"><img src={siteAsset("/media/phan/stage-cropped.png")} alt="Phan Đình Lương trên sân khấu" /></div><div className="collage-card"><Sparkles size={20} /><strong>Điều tôi mang đến</strong><p>Không chỉ là nói hay. Là làm chủ không khí, truyền cảm xúc và tạo kết nối.</p></div><div className="collage-side"><span>Nhà hát Kịch Hà Nội</span><span>Thanh Hóa</span><span>Since 2001</span></div></div>
          <div className="profile-table-wrap"><table className="profile-table"><tbody>{profileFacts.map(([label, value]) => <tr key={label}><th>{label}</th><td>{value}</td></tr>)}</tbody></table></div>
        </section>

        <section id="nang-luc" className="capability-section section-frame anchor-section">
          <div className="section-index">02 <span>/</span> năng lực</div>
          <div className="section-heading wide-heading"><p className="eyebrow">Phan Lương nhận lời dẫn ở đâu?</p><h2>Ba thế mạnh<br /><em>trên sân khấu.</em></h2></div>
          <div className="capability-grid">{capabilities.map((item) => { const Icon = item.icon; return <article className="capability-card" key={item.number}><div className="capability-top"><span>{item.number}</span><Icon size={21} strokeWidth={1.5} /></div><div className="capability-image"><img src={item.image} alt={item.title} /></div><h3>{item.title}</h3><p>{item.text}</p><div className="tag-list">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>; })}</div>
          <div className="capability-note"><strong>Nhóm lĩnh vực mở rộng</strong><span>Công nghệ · Giáo dục · Thời trang · Kinh tế · Xuất nhập khẩu · Âm nhạc · Bất động sản · Đời sống</span></div>
        </section>

        <section id="dau-an" className="work-section section-frame anchor-section">
          <div className="section-index">03 <span>/</span> dấu ấn</div>
          <div className="work-heading-row"><div className="section-heading"><p className="eyebrow">Những chương trình đã dẫn</p><h2>Những sân khấu<br /><em>còn ở lại.</em></h2></div><p className="work-intro">Từ hoa hậu, fashion show, talkshow đến sự kiện công nghệ và hoạt náo, mỗi chương trình là một lần kết nối với khán giả.</p></div>
          <div className="project-grid">{projects.map((project, index) => <article className={`project-card project-${project.tone}`} key={project.title}><div className="project-image"><img src={project.image} alt={project.title} /><span className="project-index">0{index + 1}</span><button type="button" onClick={toggleMedia} aria-label={expandedMedia ? "Thu nhỏ thư viện media" : "Xem toàn bộ thư viện media"}><ArrowUpRight className={expandedMedia ? "icon-rotated" : ""} size={18} /></button></div><p>{project.category}</p><h3>{project.title}</h3></article>)}</div>
          <div className="milestone-strip"><div className="milestone-title"><Award size={22} /><span>Điểm nhấn<br />hành trình</span></div>{milestones.map((item) => <div className="milestone" key={`${item.year}-${item.title}`}><span>{item.year}</span><strong>{item.title}</strong><p>{item.text}</p></div>)}</div>

          <div className="media-library" id="media">
            <div className="media-library-head"><div><div className="section-index">04 <span>/</span> hình ảnh & video</div><h3>Hình ảnh &amp; Video</h3></div><button className="media-toggle" type="button" onClick={toggleMedia}>{expandedMedia ? "Thu nhỏ" : "Xem toàn bộ"} <ChevronRight className={expandedMedia ? "icon-rotated" : ""} size={18} /></button></div>
            <div className="media-tabs" role="tablist" aria-label="Chọn loại tư liệu"><button className={mediaTab === "images" ? "is-active" : ""} type="button" onClick={() => setMediaTab("images")}>Ảnh</button><button className={mediaTab === "videos" ? "is-active" : ""} type="button" onClick={() => setMediaTab("videos")}>Video</button></div>
            {mediaTab === "images" ? <div className={`expanded-gallery ${expandedMedia ? "is-expanded" : ""}`}>{galleryItems.map((item) => { const src = siteAsset(item.src); return <figure key={`gallery-${item.title}-${item.id}`}><button className="gallery-image-button" type="button" onClick={() => setLightbox({ src, title: item.title })}><img src={src} alt={item.title} /><span className="gallery-zoom">Xem toàn màn hình</span></button><figcaption>{item.title}</figcaption></figure>; })}</div> : <div className={`video-gallery ${expandedMedia ? "is-expanded" : ""}`}>{videoMedia.length > 0 ? videoMedia.map((item) => <article className="video-card" key={item.id}><div className="video-frame"><video controls preload="metadata" poster={item.poster ? siteAsset(item.poster) : undefined}><source src={siteAsset(item.src)} /></video><button className="video-fullscreen" type="button" aria-label="Mở video lớn" onClick={() => setVideoLightbox(item)}><Maximize2 size={17} /><span>Mở lớn</span></button></div><strong>{item.title}</strong><span>{item.category}</span></article>) : videoTopics.map((topic) => <article className="video-placeholder" key={topic}><div className="video-placeholder-icon"><Play size={18} fill="currentColor" /></div><div><strong>{topic}</strong><span>Video sẽ được bổ sung vào thư viện này</span></div></article>)}</div>}
          </div>
          <div className="experience-extras" id="hoat-dong"><div className="section-index">05 <span>/</span> hoạt động khác</div><div className="experience-extras-grid">{experienceExtras.map((item, index) => <div className="experience-extra" key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div></div>
        </section>

        <section className="quote-section"><div className="quote-inner"><Quote size={36} /><blockquote>“Một MC tốt không chỉ dẫn chương trình. Họ dẫn cảm xúc của cả khán phòng.”</blockquote><div className="quote-author"><span /> Phan Đình Lương</div></div></section>

        <section id="ket-noi" className="contact-section section-frame anchor-section">
          <div className="contact-copy"><div className="section-index">06 <span>/</span> kết nối</div><p className="eyebrow">Đồng hành trong những chương trình đáng nhớ</p><h2>Hãy để tôi<br /><em>lên sân khấu.</em></h2><p className="contact-lede">Phan Lương mong muốn được đồng hành cùng doanh nghiệp, đối tác và agency trong các sự kiện, chương trình khách hàng, gameshow và hoạt động giải trí.</p><div className="contact-checks contact-checks-dark"><span><Check size={14} /> Sự kiện & sân khấu</span><span><Check size={14} /> Cuộc thi & fashion show</span><span><Check size={14} /> Họp báo, ra mắt sản phẩm & talkshow</span></div></div>
          <div className="partners-card"><p className="eyebrow">Các đơn vị hợp tác</p><h3>Những kết nối<br /><em>đã đồng hành.</em></h3><div className="partners-layout"><img className="partner-board" src={siteAsset(partnerBoardImage)} alt="Bảng logo các đơn vị hợp tác" /><div className="partner-list">{partnerUnits.map((partner, index) => <span key={partner}><b>{String(index + 1).padStart(2, "0")}</b>{partner}</span>)}</div></div><p className="partner-note">Danh sách được tổng hợp từ hồ sơ và bảng logo bạn gửi; các đơn vị chưa có logo riêng vẫn được liệt kê để bổ sung sau.</p></div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-top"><a className="wordmark footer-wordmark" href="#top" onClick={(event) => { event.preventDefault(); scrollToId("#top"); }}><span className="wordmark-mark">PL</span><span className="wordmark-copy"><strong>Phan Lương</strong><em>mc / actor</em></span></a><span className="footer-role">MC · DIỄN VIÊN · NHÀ HÁT KỊCH HÀ NỘI</span></div><div className="footer-bottom"><span>© 2026 Phan Đình Lương</span><span>Made with intention in Hà Nội</span><a href="#top" onClick={(event) => { event.preventDefault(); scrollToId("#top"); }}>Lên đầu trang <ArrowUpRight size={14} /></a></div></footer>
      {lightbox && <div className="lightbox" role="dialog" aria-modal="true" aria-label={lightbox.title} onClick={() => setLightbox(null)}><button type="button" className="lightbox-close" aria-label="Đóng ảnh" onClick={() => setLightbox(null)}><X size={26} /></button><img src={lightbox.src} alt={lightbox.title} onClick={(event) => event.stopPropagation()} /><p>{lightbox.title}</p></div>}
      {videoLightbox && <div className="lightbox video-lightbox" role="dialog" aria-modal="true" aria-label={videoLightbox.title} onClick={() => setVideoLightbox(null)}><button type="button" className="lightbox-close" aria-label="Đóng video" onClick={() => setVideoLightbox(null)}><X size={26} /></button><video controls autoPlay playsInline poster={videoLightbox.poster ? siteAsset(videoLightbox.poster) : undefined} onClick={(event) => event.stopPropagation()}><source src={siteAsset(videoLightbox.src)} /></video><p>{videoLightbox.title}</p></div>}
    </div>
  );
}
