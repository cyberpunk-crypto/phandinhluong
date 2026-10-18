import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Award,
  Check,
  ChevronRight,
  Instagram,
  Linkedin,
  Menu,
  Mic2,
  PenLine,
  Play,
  Quote,
  Sparkles,
  Users,
  X,
  Youtube,
} from "lucide-react";

const siteAsset = (path: string) => {
  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/phandinhluong") ? "/phandinhluong/" : "/";
  return `${base}${path.replace(/^\/+/, "")}`;
};

const navItems = [
  { label: "Giới thiệu", href: "#gioi-thieu" },
  { label: "Năng lực", href: "#nang-luc" },
  { label: "Dấu ấn", href: "#dau-an" },
  { label: "Kết nối", href: "#ket-noi" },
];

const capabilities = [
  {
    number: "01",
    icon: Mic2,
    title: "MC sự kiện",
    text: "Làm chủ sân khấu lớn, xử lý tình huống linh hoạt và giữ nhịp chương trình trẻ trung, giàu năng lượng.",
    tags: ["Họp báo", "Gala", "Lễ hội"],
    image: siteAsset("/media/phan/stage.png"),
  },
  {
    number: "02",
    icon: Users,
    title: "Sân khấu & cuộc thi",
    text: "Đồng hành cùng các sân chơi văn hóa, thời trang và sắc đẹp bằng phong thái tự tin, linh hoạt.",
    tags: ["Miss Tourism", "Fashion show", "Cuộc thi"],
    image: siteAsset("/media/phan/event-tourism.jpg"),
  },
  {
    number: "03",
    icon: PenLine,
    title: "Kết nối thương hiệu",
    text: "Phối hợp cùng KOL, KOC, nghệ sĩ và đối tác truyền thông để biến thông điệp thành trải nghiệm.",
    tags: ["Công nghệ", "Giáo dục", "Kinh tế"],
    image: siteAsset("/media/phan/event-fashion.jpg"),
  },
];

const milestones = [
  { year: "2025", title: "Miss Tourism Ethnic Vietnam", text: "Đồng hành cùng cuộc thi Hoa hậu Du lịch Dân tộc Việt Nam 2025 trong vai trò MC." },
  { year: "2025", title: "Night Wonder Fashion Show", text: "Dẫn dắt đêm thời trang tại Vinpearl Nha Trang cùng Diễm Quỳnh." },
  { year: "2024", title: "Nhà hát Kịch Hà Nội", text: "Gia nhập môi trường sân khấu chuyên nghiệp sau khi tốt nghiệp Á khoa Diễn viên Kịch – Điện ảnh." },
];

const projects = [
  { category: "Cuộc thi sắc đẹp", title: "Hoa hậu Du lịch Dân tộc Việt Nam 2025", image: siteAsset("/media/phan/event-tourism.jpg"), tone: "terracotta" },
  { category: "Đêm thi tài năng", title: "The Talent Night — Mộc Châu Island", image: siteAsset("/media/phan/event-talent.jpg"), tone: "ink" },
  { category: "Fashion show", title: "Night Wonder — Vinpearl Nha Trang", image: siteAsset("/media/phan/event-fashion.jpg"), tone: "olive" },
  { category: "Sân khấu cuộc thi", title: "Bikini Show — Người đẹp biển", image: siteAsset("/media/phan/event-beach.jpg"), tone: "terracotta" },
];

function scrollToId(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("gioi-thieu");

  useEffect(() => {
    const sections = navItems.map((item) => document.querySelector(item.href)).filter(Boolean) as Element[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -60%", threshold: [0.12, 0.32, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    scrollToId(href);
  };

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
          <a className="nav-cta" href="#ket-noi" onClick={(event) => { event.preventDefault(); handleNav("#ket-noi"); }}>Đặt lịch <ArrowUpRight size={15} /></a>
        </nav>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? "Đóng menu" : "Mở menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      <main id="top">
        <section className="hero-section section-frame">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> Phan Đình Lương / 2026</p>
            <h1>MC kể chuyện<br /><em>bằng năng lượng.</em></h1>
            <p className="hero-lede">Tôi tin rằng một chương trình đáng nhớ bắt đầu từ sự hiện diện — rồi được dẫn dắt bằng năng lượng, sự linh hoạt và một chút bất ngờ.</p>
            <div className="hero-actions">
              <button className="button button-dark" type="button" onClick={() => scrollToId("#ket-noi")}>Đặt lịch cùng tôi <ArrowUpRight size={17} /></button>
              <button className="text-link" type="button" onClick={() => scrollToId("#dau-an")}>Xem dấu ấn <ArrowDown size={16} /></button>
            </div>
            <div className="hero-note"><span className="note-line" /><span>MC · Diễn viên · Nhà hát Kịch Hà Nội</span></div>
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
          <div className="ticker-track"><span>HOSTING</span><i>✳</i><span>STAGE</span><i>✳</i><span>FASHION</span><i>✳</i><span>ENERGY</span><i>✳</i><span>HOSTING</span><i>✳</i><span>STAGE</span><i>✳</i></div>
        </div>

        <section id="gioi-thieu" className="intro-section section-frame anchor-section">
          <div className="section-index">01 <span>/</span> câu chuyện</div>
          <div className="intro-layout">
            <div className="section-heading"><p className="eyebrow">Về Phan Lương</p><h2>Một gương mặt<br /><em>sinh ra cho sân khấu.</em></h2></div>
            <div className="intro-body"><p className="intro-lede">Từ sân khấu kịch đến những chương trình quy mô lớn, tôi luôn tìm kiếm khoảnh khắc một câu chuyện thật sự chạm đến khán giả.</p><p>Tôi là Phan Đình Lương — cử nhân Diễn viên Kịch – Điện ảnh, Á khoa đầu ra và hiện công tác tại Nhà hát Kịch Hà Nội. Với 03 năm kinh nghiệm MC, tôi mang đến chất giọng miền Bắc cùng phong cách trẻ trung, linh hoạt, giàu năng lượng.</p><div className="signature">Phan Lương <span>— born for the stage</span></div></div>
          </div>
          <div className="intro-collage"><div className="collage-main"><img src={siteAsset("/media/phan/stage-cropped.png")} alt="Phan Đình Lương trên sân khấu" /></div><div className="collage-card"><Sparkles size={20} /><strong>Điều tôi mang đến</strong><p>Không chỉ là nói hay. Là làm chủ không khí và tạo kết nối.</p></div><div className="collage-side"><span>Nhà hát Kịch Hà Nội</span><span>Thanh Hóa</span><span>Since 2001</span></div></div>
          <div className="profile-facts" aria-label="Thông tin hồ sơ Phan Đình Lương"><div><span>01</span><strong>Năm sinh</strong><p>2001</p></div><div><span>02</span><strong>Chiều cao</strong><p>175 cm</p></div><div><span>03</span><strong>Quê quán</strong><p>Thanh Hóa</p></div><div><span>04</span><strong>Chất giọng</strong><p>Miền Bắc</p></div><div><span>05</span><strong>Chuyên môn</strong><p>Cử nhân Diễn viên Kịch – Điện ảnh</p></div><div><span>06</span><strong>Đơn vị công tác</strong><p>Nhà hát Kịch Hà Nội</p></div><div><span>07</span><strong>Kinh nghiệm</strong><p>03 năm MC chuyên nghiệp</p></div><div><span>08</span><strong>Dấu ấn</strong><p>Á khoa đầu ra</p></div></div>
        </section>

        <section id="nang-luc" className="capability-section section-frame anchor-section">
          <div className="section-index">02 <span>/</span> năng lực</div>
          <div className="section-heading wide-heading"><p className="eyebrow">Phan Lương nhận lời dẫn ở đâu?</p><h2>Ba thế mạnh<br /><em>trên sân khấu.</em></h2></div>
          <div className="capability-grid">{capabilities.map((item) => { const Icon = item.icon; return <article className="capability-card" key={item.number}><div className="capability-top"><span>{item.number}</span><Icon size={21} strokeWidth={1.5} /></div><div className="capability-image"><img src={item.image} alt={item.title} /></div><h3>{item.title}</h3><p>{item.text}</p><div className="tag-list">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>; })}</div>
        </section>

        <section id="dau-an" className="work-section section-frame anchor-section">
          <div className="section-index">03 <span>/</span> dấu ấn</div>
          <div className="work-heading-row"><div className="section-heading"><p className="eyebrow">Những chương trình đã dẫn</p><h2>Những sân khấu<br /><em>còn ở lại.</em></h2></div><p className="work-intro">Mỗi chương trình là một lần kết nối với khán giả. Đây là vài dấu mốc nổi bật trong hành trình làm nghề.</p></div>
          <div className="project-grid">{projects.map((project, index) => <article className={`project-card project-${project.tone}`} key={project.title}><div className="project-image"><img src={project.image} alt={project.title} /><span className="project-index">0{index + 1}</span><button type="button" aria-label={`Xem ${project.title}`}><ArrowUpRight size={18} /></button></div><p>{project.category}</p><h3>{project.title}</h3></article>)}</div>
          <div className="milestone-strip"><div className="milestone-title"><Award size={22} /><span>Điểm nhấn<br />hành trình</span></div>{milestones.map((item) => <div className="milestone" key={`${item.year}-${item.title}`}><span>{item.year}</span><strong>{item.title}</strong><p>{item.text}</p></div>)}</div>
        </section>

        <section className="quote-section">
          <div className="quote-inner"><Quote size={36} /><blockquote>“Một MC tốt không chỉ dẫn chương trình. Họ dẫn cảm xúc của cả khán phòng.”</blockquote><div className="quote-author"><span /> Phan Đình Lương</div></div>
        </section>

        <section id="ket-noi" className="contact-section section-frame anchor-section">
          <div className="contact-copy"><div className="section-index">04 <span>/</span> kết nối</div><p className="eyebrow">Có một sân khấu đang chờ được dẫn?</p><h2>Hãy để tôi<br /><em>lên sân khấu.</em></h2><p className="contact-lede">Nếu bạn đang tìm một MC trẻ trung, linh hoạt và có kinh nghiệm xử lý sân khấu — hãy bắt đầu một cuộc trò chuyện.</p><a className="email-link" href="https://jobg.my.canva.site/profilemcphanluong" target="_blank" rel="noreferrer">profile Phan Lương <ArrowUpRight size={19} /></a></div>
          <div className="contact-card"><p className="eyebrow">Bắt đầu từ đây</p><h3>Chia sẻ với tôi<br />về chương trình của bạn.</h3><div className="contact-checks"><span><Check size={14} /> Sự kiện & sân khấu</span><span><Check size={14} /> Cuộc thi & fashion show</span><span><Check size={14} /> Họp báo & ra mắt sản phẩm</span></div><a href="https://jobg.my.canva.site/profilemcphanluong" target="_blank" rel="noreferrer" className="button button-light">Xem profile đầy đủ <ArrowUpRight size={17} /></a><span className="contact-small">Thông tin chi tiết có trong profile Canva</span></div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-top"><a className="wordmark footer-wordmark" href="#top" onClick={(event) => { event.preventDefault(); scrollToId("#top"); }}><span className="wordmark-mark">PL</span><span className="wordmark-copy"><strong>Phan Lương</strong><em>mc / actor</em></span></a><div className="footer-socials"><a href="https://jobg.my.canva.site/profilemcphanluong" target="_blank" rel="noreferrer">Canva Profile <ArrowUpRight size={14} /></a><a href="https://github.com/phandinhluong" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={14} /></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a></div></div><div className="footer-bottom"><span>© 2026 Phan Đình Lương</span><span>Made with intention in Hà Nội</span><a href="#top" onClick={(event) => { event.preventDefault(); scrollToId("#top"); }}>Lên đầu trang <ArrowUpRight size={14} /></a></div></footer>
    </div>
  );
}
