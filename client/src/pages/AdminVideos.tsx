import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Film, Image as ImageIcon, LogIn, Save, Shield, Trash2, Upload, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { startLogin } from "../const";
import { trpc } from "../lib/trpc";

const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
type MediaKind = "image" | "video";

type MediaDraft = {
  title: string;
  category: string;
  isPublished: boolean;
};

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(new Error("Không thể đọc file tư liệu"));
    reader.readAsDataURL(file);
  });
}

export default function AdminVideos() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("MC sự kiện");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedKind, setSelectedKind] = useState<MediaKind | null>(null);
  const [drafts, setDrafts] = useState<Record<string, MediaDraft>>({});

  const meQuery = trpc.auth.me.useQuery();
  const isAdmin = meQuery.data?.role === "admin";
  const mediaQuery = trpc.admin.videos.list.useQuery(undefined, {
    enabled: isAdmin,
    retry: false,
  });
  const utils = trpc.useUtils();
  const createMutation = trpc.admin.videos.create.useMutation({
    onSuccess: async () => {
      toast.success("Đã tải tư liệu lên thư viện");
      setTitle("");
      setSelectedFile(null);
      setSelectedKind(null);
      if (fileInput.current) fileInput.current.value = "";
      await utils.admin.videos.list.invalidate();
      await utils.videos.list.invalidate();
    },
    onError: error => toast.error(error.message || "Không thể tải tư liệu lên"),
  });
  const updateMutation = trpc.admin.videos.update.useMutation({
    onSuccess: async () => {
      toast.success("Đã lưu thay đổi");
      await utils.admin.videos.list.invalidate();
      await utils.videos.list.invalidate();
    },
    onError: error => toast.error(error.message || "Không thể lưu thay đổi"),
  });
  const archiveMutation = trpc.admin.videos.archive.useMutation({
    onSuccess: async () => {
      toast.success("Đã ẩn tư liệu khỏi thư viện công khai");
      await utils.admin.videos.list.invalidate();
      await utils.videos.list.invalidate();
    },
    onError: error => toast.error(error.message || "Không thể ẩn tư liệu"),
  });

  useEffect(() => {
    if (!mediaQuery.data) return;
    setDrafts(Object.fromEntries(mediaQuery.data.map(media => [media.id, {
      title: media.title,
      category: media.category,
      isPublished: media.isPublished,
    }])));
  }, [mediaQuery.data]);

  const onSelectFile = (file: File | undefined) => {
    if (!file) {
      setSelectedFile(null);
      setSelectedKind(null);
      return;
    }
    const kind: MediaKind | null = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : null;
    if (!kind) {
      toast.error("Vui lòng chọn file ảnh hoặc video");
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    const maxBytes = kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
    if (file.size > maxBytes) {
      toast.error(kind === "image" ? "Ảnh cần nhỏ hơn hoặc bằng 15 MB" : "Video cần nhỏ hơn hoặc bằng 50 MB");
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    setSelectedFile(file);
    setSelectedKind(kind);
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile || !selectedKind) {
      toast.error("Hãy chọn một file ảnh hoặc video trước khi tải lên");
      return;
    }
    try {
      const data = await readFileAsBase64(selectedFile);
      createMutation.mutate({
        title: title.trim() || selectedFile.name.replace(/\.[^/.]+$/, ""),
        category: category.trim() || (selectedKind === "image" ? "Hình ảnh sự kiện" : "MC sự kiện"),
        fileName: selectedFile.name,
        kind: selectedKind,
        contentType: selectedFile.type,
        data,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể đọc file tư liệu");
    }
  };

  if (meQuery.isLoading) {
    return <main className="admin-shell"><div className="admin-loading">Đang xác thực quyền truy cập…</div></main>;
  }

  if (!meQuery.data) {
    return (
      <main className="admin-shell">
        <div className="admin-gate">
          <div className="admin-gate-icon"><Shield size={24} /></div>
          <p className="eyebrow"><span className="eyebrow-dot" /> Khu vực riêng của chủ website</p>
          <h1>Đăng nhập để<br /><em>quản lý media.</em></h1>
          <p>Trang quản trị sử dụng Manus OAuth. Chỉ tài khoản được cấp quyền admin mới có thể đăng ảnh hoặc video lên thư viện.</p>
          <button className="button button-dark" type="button" onClick={startLogin}><LogIn size={16} /> Đăng nhập Manus</button>
          <Link className="admin-back-link" href="/">← Về trang portfolio</Link>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="admin-shell">
        <div className="admin-gate">
          <div className="admin-gate-icon"><UserRound size={24} /></div>
          <p className="eyebrow"><span className="eyebrow-dot" /> Đã đăng nhập</p>
          <h1>Tài khoản này<br /><em>chưa được cấp quyền.</em></h1>
          <p>{meQuery.data.name || meQuery.data.email || "Tài khoản Manus"} đã đăng nhập thành công, nhưng không có quyền admin cho website Phan Đình Lương.</p>
          <Link className="button button-dark" href="/">Về trang portfolio</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link className="wordmark" href="/"><span className="wordmark-mark">PL</span><span className="wordmark-copy"><strong>Phan Lương</strong><em>media admin</em></span></Link>
        <div className="admin-header-meta"><span><span className="admin-status-dot" /> Admin</span><Link href="/"><ArrowLeft size={15} /> Portfolio</Link></div>
      </header>

      <div className="admin-layout">
        <section className="admin-intro">
          <div className="section-index">01 <span>/</span> media studio</div>
          <h1>Thêm một sân khấu<br /><em>vào hành trình.</em></h1>
          <p>Tải ảnh và video sự kiện lên thư viện Hình ảnh &amp; Video. Tư liệu mới sẽ được hiển thị công khai ngay sau khi đăng.</p>
          <div className="admin-owner"><div className="admin-owner-icon"><UserRound size={15} /></div><div><span>Đang đăng nhập</span><strong>{meQuery.data.name || meQuery.data.email || "Chủ website"}</strong></div></div>
        </section>

        <section className="admin-upload-card">
          <div className="admin-card-heading"><div><p className="eyebrow"><span className="eyebrow-dot" /> Tư liệu mới</p><h2>Tải ảnh hoặc video</h2></div><Film size={22} /></div>
          <form onSubmit={handleUpload}>
            <label className="admin-field"><span>Tiêu đề</span><input value={title} onChange={event => setTitle(event.target.value)} placeholder="Ví dụ: Hoa hậu Du lịch Dân tộc 2025" maxLength={255} /></label>
            <label className="admin-field"><span>Danh mục</span><input value={category} onChange={event => setCategory(event.target.value)} placeholder="Hình ảnh sự kiện, MC truyền hình…" maxLength={120} /></label>
            <label className="admin-file-field"><span>File ảnh hoặc video</span><input ref={fileInput} type="file" accept="image/*,video/*" onChange={event => onSelectFile(event.target.files?.[0])} /><span className="admin-file-drop">{selectedKind === "image" ? <ImageIcon size={19} /> : <Film size={19} />}<strong>{selectedFile ? selectedFile.name : "Chọn ảnh hoặc video từ máy"}</strong><small>{selectedFile ? `${selectedKind === "image" ? "Ảnh" : "Video"} · ${formatBytes(selectedFile.size)}` : "Ảnh tối đa 15 MB · Video tối đa 50 MB"}</small></span></label>
            <button className="button button-dark admin-submit" type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Đang tải lên…" : <><Upload size={16} /> Tải lên thư viện</>}</button>
          </form>
          <p className="admin-storage-note">Ảnh và video được lưu trong Manus Storage. API key và storage key không được đưa xuống trình duyệt.</p>
        </section>
      </div>

      <section className="admin-list-section">
        <div className="admin-list-heading"><div><div className="section-index">02 <span>/</span> thư viện media</div><h2>Ảnh &amp; video đã tải lên</h2></div><span className="admin-count">{mediaQuery.data?.length ?? 0} tư liệu</span></div>
        {mediaQuery.isLoading ? <div className="admin-empty">Đang tải danh sách tư liệu…</div> : mediaQuery.data?.length ? <div className="admin-video-list">{mediaQuery.data.map(media => { const draft = drafts[media.id] ?? { title: media.title, category: media.category, isPublished: media.isPublished }; return <article className={`admin-video-row ${draft.isPublished ? "" : "is-archived"}`} key={media.id}><div className="admin-video-preview">{media.kind === "image" ? <img src={media.src} alt={media.title} /> : <video src={media.src} preload="metadata" />}</div><div className="admin-video-fields"><label><span>{media.kind === "image" ? "Ảnh" : "Video"}</span><input value={draft.title} onChange={event => setDrafts(current => ({ ...current, [media.id]: { ...draft, title: event.target.value } }))} /></label><label><span>Danh mục</span><input value={draft.category} onChange={event => setDrafts(current => ({ ...current, [media.id]: { ...draft, category: event.target.value } }))} /></label><div className="admin-video-meta"><span>{formatBytes(media.fileSize)}</span><span>{draft.isPublished ? <><Check size={13} /> Đang hiển thị</> : "Đã ẩn"}</span></div></div><div className="admin-video-actions"><button className="admin-icon-button" type="button" title="Lưu thay đổi" onClick={() => updateMutation.mutate({ id: Number(media.id), ...draft })} disabled={updateMutation.isPending}><Save size={16} /></button><button className="admin-icon-button danger" type="button" title={draft.isPublished ? "Ẩn tư liệu" : "Hiện tư liệu"} onClick={() => draft.isPublished ? archiveMutation.mutate({ id: Number(media.id) }) : updateMutation.mutate({ id: Number(media.id), ...draft, isPublished: true })} disabled={updateMutation.isPending || archiveMutation.isPending}>{draft.isPublished ? <Trash2 size={16} /> : <Check size={16} />}</button></div></article>; })}</div> : <div className="admin-empty"><Film size={23} /><p>Chưa có ảnh/video upload động. Hãy tải tư liệu đầu tiên ở form phía trên.</p></div>}
      </section>
    </main>
  );
}
