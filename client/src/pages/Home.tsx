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
    title: "Dẫn chương trình",
    text: "Kiến tạo nhịp điệu, cảm xúc và sự kết nối để mỗi chương trình có một câu chuyện riêng.",
    tags: ["Sự kiện", "Tọa đàm", "Lễ tốt nghiệp"],
    image: "/media/skills-1.webp",
  },
  {
    number: "02",
    icon: Users,
    title: "Đào tạo & mentoring",
    text: "Đồng hành cùng những người trẻ đang tìm thấy tiếng nói tự tin và phong cách dẫn của riêng mình.",
    tags: ["Mentor", "Kỹ năng mềm", "On The Mic"],
    image: "/media/skills-2.webp",
  },
  {
    number: "03",
    icon: PenLine,
    title: "Biên tập nội dung",
    text: "Chắt lọc thông điệp, viết nên lời dẫn tự nhiên và biến ý tưởng thành trải nghiệm đáng nhớ.",
    tags: ["Kịch bản", "Biên tập", "Kể chuyện"],
    image: "/media/profile.webp",
  },
];

const milestones = [
  { year: "2026", title: "Mentor On The Mic", text: "Đồng hành cùng các gương mặt dẫn chương trình trẻ tại Đại học Bách khoa Hà Nội." },
  { year: "2025", title: "Quán quân MC Truyền hình", text: "Học viện Kỹ năng mềm ST Lighthouse — dấu mốc mở ra một hành trình mới." },
  { year: "2024", title: "Top 20 MC Volunteer", text: "Góp tiếng nói và năng lượng trong một sân chơi dành cho những người yêu nghề dẫn." },
];

const projects = [
  { category: "Sự kiện thương hiệu", title: "Honda — Chạm tới trải nghiệm", image: "/media/event-1.webp", tone: "terracotta" },
  { category: "Sự kiện cộng đồng", title: "Dấu ấn Việt Nam", image: "/media/event-2.webp", tone: "ink" },
  { category: "Sân khấu & lễ hội", title: "Những khoảnh khắc ở lại", image: "/media/event-3.webp", tone: "olive" },
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
          <span className="wordmark-mark">ĐT</span>
          <span className="wordmark-copy"><strong>Đăng Tình</strong><em>storyteller / host</em></span>
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
            <p className="eyebrow"><span className="eyebrow-dot" /> Nguyễn Đăng Tình / 2026</p>
            <h1>Người kể chuyện<br /><em>bằng giọng nói.</em></h1>
            <p className="hero-lede">Tôi tin rằng một chương trình đáng nhớ bắt đầu từ sự lắng nghe — rồi được kể lại bằng sự chân thành, tinh tế và một chút bất ngờ.</p>
            <div className="hero-actions">
              <button className="button button-dark" type="button" onClick={() => scrollToId("#ket-noi")}>Đặt lịch cùng tôi <ArrowUpRight size={17} /></button>
              <button className="text-link" type="button" onClick={() => scrollToId("#dau-an")}>Xem dấu ấn <ArrowDown size={16} /></button>
            </div>
            <div className="hero-note"><span className="note-line" /><span>MC · Mentor · Biên tập viên</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-arch" />
            <img src="/media/hero-portrait.webp" alt="Nguyễn Đăng Tình trong trang phục vest" />
            <div className="hero-stamp"><span>listen</span><span>connect</span><span>retell</span></div>
            <div className="hero-caption"><Quote size={17} fill="currentColor" /><span>“Lắng nghe, kết nối và kể lại những điều có ý nghĩa.”</span></div>
          </div>
          <div className="hero-scroll"><span>Cuộn để khám phá</span><span className="scroll-line" /></div>
        </section>

        <div className="ticker" aria-label="Lĩnh vực hoạt động">
          <div className="ticker-track"><span>HOSTING</span><i>✳</i><span>MENTORING</span><i>✳</i><span>STORYTELLING</span><i>✳</i><span>CONTENT</span><i>✳</i><span>HOSTING</span><i>✳</i><span>MENTORING</span><i>✳</i></div>
        </div>

        <section id="gioi-thieu" className="intro-section section-frame anchor-section">
          <div className="section-index">01 <span>/</span> câu chuyện</div>
          <div className="intro-layout">
            <div className="section-heading"><p className="eyebrow">Về Đăng Tình</p><h2>Một giọng nói<br /><em>có điều muốn kể.</em></h2></div>
            <div className="intro-body"><p className="intro-lede">Từ những sân khấu đầu tiên đến những buổi trò chuyện nhiều chiều, tôi luôn tìm kiếm khoảnh khắc con người thật xuất hiện sau ánh đèn.</p><p>Tôi làm MC, mentor và biên tập nội dung. Ba vai trò khác nhau nhưng cùng bắt đầu từ một điều: đặt câu hỏi đúng, lắng nghe đủ sâu và kể lại câu chuyện theo cách gần gũi nhất.</p><div className="signature">Đăng Tình <span>— keep it human</span></div></div>
          </div>
          <div className="intro-collage"><div className="collage-main"><img src="/media/profile.webp" alt="Chân dung Nguyễn Đăng Tình" /></div><div className="collage-card"><Sparkles size={20} /><strong>Điều tôi theo đuổi</strong><p>Không chỉ là nói hay. Là tạo ra cảm giác được lắng nghe.</p></div><div className="collage-side"><span>Hà Nội</span><span>Việt Nam</span><span>Since 2020</span></div></div>
        </section>

        <section id="nang-luc" className="capability-section section-frame anchor-section">
          <div className="section-index">02 <span>/</span> năng lực</div>
          <div className="section-heading wide-heading"><p className="eyebrow">Tôi có thể đồng hành ở đâu?</p><h2>Ba cách để một<br /><em>ý tưởng cất tiếng.</em></h2></div>
          <div className="capability-grid">{capabilities.map((item) => { const Icon = item.icon; return <article className="capability-card" key={item.number}><div className="capability-top"><span>{item.number}</span><Icon size={21} strokeWidth={1.5} /></div><div className="capability-image"><img src={item.image} alt={item.title} /></div><h3>{item.title}</h3><p>{item.text}</p><div className="tag-list">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>; })}</div>
        </section>

        <section id="dau-an" className="work-section section-frame anchor-section">
          <div className="section-index">03 <span>/</span> dấu ấn</div>
          <div className="work-heading-row"><div className="section-heading"><p className="eyebrow">Một vài chương đã đi qua</p><h2>Những khoảnh khắc<br /><em>ở lại sau sân khấu.</em></h2></div><p className="work-intro">Mỗi chương trình là một bài tập về sự hiện diện. Đây là vài dấu mốc tôi trân trọng trên hành trình ấy.</p></div>
          <div className="project-grid">{projects.map((project, index) => <article className={`project-card project-${project.tone}`} key={project.title}><div className="project-image"><img src={project.image} alt={project.title} /><span className="project-index">0{index + 1}</span><button type="button" aria-label={`Xem ${project.title}`}><ArrowUpRight size={18} /></button></div><p>{project.category}</p><h3>{project.title}</h3></article>)}</div>
          <div className="milestone-strip"><div className="milestone-title"><Award size={22} /><span>Điểm nhấn<br />hành trình</span></div>{milestones.map((item) => <div className="milestone" key={item.year}><span>{item.year}</span><strong>{item.title}</strong><p>{item.text}</p></div>)}</div>
        </section>

        <section className="quote-section">
          <div className="quote-inner"><Quote size={36} /><blockquote>“Sân khấu không cần một người nói nhiều nhất. Sân khấu cần một người biết khi nào nên cất lời.”</blockquote><div className="quote-author"><span /> Nguyễn Đăng Tình</div></div>
        </section>

        <section id="ket-noi" className="contact-section section-frame anchor-section">
          <div className="contact-copy"><div className="section-index">04 <span>/</span> kết nối</div><p className="eyebrow">Có một chương trình đang chờ được kể?</p><h2>Hãy để tôi<br /><em>đồng hành.</em></h2><p className="contact-lede">Nếu bạn đang tìm một người dẫn biết lắng nghe, một mentor tận tâm hoặc một biên tập viên hiểu tinh thần thương hiệu — chúng ta nên nói chuyện.</p><a className="email-link" href="mailto:hello@dangtinhspeaks.vn">hello@dangtinhspeaks.vn <ArrowUpRight size={19} /></a></div>
          <div className="contact-card"><p className="eyebrow">Bắt đầu từ đây</p><h3>Gửi tôi vài dòng<br />về ý tưởng của bạn.</h3><div className="contact-checks"><span><Check size={14} /> Sự kiện & sân khấu</span><span><Check size={14} /> Đào tạo & mentoring</span><span><Check size={14} /> Nội dung & kịch bản</span></div><a href="mailto:hello@dangtinhspeaks.vn?subject=Đặt lịch cùng Đăng Tình" className="button button-light">Đặt lịch ngay <ArrowUpRight size={17} /></a><span className="contact-small">Phản hồi trong vòng 24 giờ làm việc</span></div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-top"><a className="wordmark footer-wordmark" href="#top" onClick={(event) => { event.preventDefault(); scrollToId("#top"); }}><span className="wordmark-mark">ĐT</span><span className="wordmark-copy"><strong>Đăng Tình</strong><em>storyteller / host</em></span></a><div className="footer-socials"><a href="https://www.facebook.com/dangtinh199/" target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={14} /></a><a href="https://www.youtube.com/@mcdangtinh" target="_blank" rel="noreferrer">YouTube <ArrowUpRight size={14} /></a><a href="https://www.instagram.com/dangtinh199/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={14} /></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a></div></div><div className="footer-bottom"><span>© 2026 Nguyễn Đăng Tình</span><span>Made with intention in Hà Nội</span><a href="#top" onClick={(event) => { event.preventDefault(); scrollToId("#top"); }}>Lên đầu trang <ArrowUpRight size={14} /></a></div></footer>
    </div>
  );
}
