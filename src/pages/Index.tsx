import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

/* ──────────────── DATA ──────────────── */
const NAV = [
  { id: "home", label: "Главная" },
  { id: "catalog", label: "Каталог" },
  { id: "about", label: "О магазине" },
  { id: "delivery", label: "Доставка" },
  { id: "reviews", label: "Отзывы" },
  { id: "contacts", label: "Контакты" },
];
const CDN = "https://cdn.poehali.dev/projects/f4e2daab-9496-4ae3-80e9-a2bd1e4ce1b2/files";
const PRODUCTS = [
  { id: 1, name: "Алые розы", sub: "Классическая элегантность", price: "3 200 ₽", img: `${CDN}/d1d693ba-8a93-4e5f-ae75-6a4bc96b8f8b.jpg`, tag: "Хит" },
  { id: 2, name: "Весенняя", sub: "Нежная композиция", price: "4 800 ₽", img: `${CDN}/f25908fe-14a0-41e4-8902-9ac032183b52.jpg`, tag: "Новинка" },
  { id: 3, name: "Мастерская", sub: "Авторская коллекция", price: "2 600 ₽", img: `${CDN}/7f529e13-12d1-449a-b063-419c88c1d6ea.jpg`, tag: "Limited" },
];
const REVIEWS = [
  { name: "Мария К.", city: "Москва", text: "Цветы просто невероятные! Стоят уже третий год и выглядят как живые. Все гости восхищаются.", stars: 5 },
  { name: "Анна П.", city: "СПб", text: "Заказала на юбилей маме — она была в восторге. Упаковка роскошная, доставка быстрая.", stars: 5 },
  { name: "Ирина Д.", city: "Казань", text: "Уже третий заказ у Эльмиры. Качество на высшем уровне, всегда точно в срок.", stars: 5 },
];

/* ──────────────── HOOKS ──────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    o.observe(el);
    return () => o.disconnect();
  }, [threshold]);
  return { ref, inView: v };
}

function useParallax() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return offset;
}

function useTilt(intensity = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    setTilt({ x: y * -intensity, y: x * intensity, active: true });
  }, [intensity]);

  const onLeave = useCallback(() => setTilt({ x: 0, y: 0, active: false }), []);

  return { ref, tilt, onMove, onLeave };
}

/* ──────────────── ANIMATION COMPONENTS ──────────────── */
function Reveal({ children, delay = 0, className = "", type = "up" }: {
  children: React.ReactNode; delay?: number; className?: string; type?: "up" | "left" | "right" | "scale" | "rotate";
}) {
  const { ref, inView } = useInView();
  const transforms: Record<string, [string, string]> = {
    up: ["translateY(60px) translateZ(-50px)", "translateY(0) translateZ(0)"],
    left: ["translateX(-80px) rotateY(8deg)", "translateX(0) rotateY(0)"],
    right: ["translateX(80px) rotateY(-8deg)", "translateX(0) rotateY(0)"],
    scale: ["scale(0.85) translateZ(-80px)", "scale(1) translateZ(0)"],
    rotate: ["rotateX(15deg) translateY(40px)", "rotateX(0) translateY(0)"],
  };
  return (
    <div
      ref={ref}
      className={`perspective-1500 ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? transforms[type][1] : transforms[type][0],
        transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

function MagneticButton({ children, className = "", onClick }: {
  children: React.ReactNode; className?: string; onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <button
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setPos({ x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3 });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, transition: "transform 0.35s cubic-bezier(0.33,1,0.68,1)" }}
    >
      {children}
    </button>
  );
}

/* ──────────────── MAIN COMPONENT ──────────────── */
export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [cart, setCart] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", comment: "" });
  const [orderSent, setOrderSent] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [heroLoaded, setHeroLoaded] = useState(false);
  const scrollY = useParallax();

  useEffect(() => { setHeroLoaded(true); }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const fn = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const go = (id: string) => { setActiveSection(id); setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const addToCart = (id: number) => setCart((p) => [...p, id]);
  const removeFromCart = (id: number) => { const idx = cart.lastIndexOf(id); if (idx !== -1) setCart((p) => p.filter((_, i) => i !== idx)); };

  return (
    <div className="min-h-screen bg-[#0A0806] text-white font-body overflow-x-hidden">

      {/* ─── Cursor ─── */}
      <div className="fixed pointer-events-none z-[9999]" style={{ left: cursor.x, top: cursor.y }}>
        <div className="w-80 h-80 -ml-40 -mt-40 rounded-full" style={{
          background: "radial-gradient(circle, rgba(193,41,46,0.07) 0%, rgba(242,166,90,0.03) 40%, transparent 70%)",
          transition: "0.12s linear",
        }} />
      </div>

      {/* ─── Navbar ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-700" style={{
        background: scrolled ? "rgba(10,8,6,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(1.8)" : "none",
        borderBottom: scrolled ? "1px solid rgba(193,41,46,0.12)" : "1px solid transparent",
      }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          <button onClick={() => go("home")} className="group flex items-center gap-3 perspective-1000">
            <div className="w-8 h-8 rounded-full bg-elm-crimson flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-700">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
            <span className="font-display text-2xl font-bold tracking-[0.15em] text-white group-hover:tracking-[0.25em] transition-all duration-500">ЭЛЬМИРА</span>
          </button>
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => go(n.id)} className={`text-xs uppercase tracking-[0.15em] transition-all duration-300 relative group ${activeSection === n.id ? "text-elm-gold" : "text-white/40 hover:text-white"}`}>
                {n.label}
                <span className={`absolute -bottom-1.5 left-0 h-px bg-elm-gold transition-all duration-500 ${activeSection === n.id ? "w-full" : "w-0 group-hover:w-full"}`} />
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <MagneticButton onClick={() => go("cart")} className="relative flex items-center gap-2 border border-white/15 rounded-full px-5 py-2.5 text-xs uppercase tracking-widest text-white/60 hover:border-elm-crimson hover:text-white transition-all duration-400 hover:shadow-[0_0_30px_rgba(193,41,46,0.2)]">
              <Icon name="ShoppingBag" size={14} /><span>Корзина</span>
              {cart.length > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-elm-crimson rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">{cart.length}</span>}
            </MagneticButton>
            <button className="md:hidden text-white/60" onClick={() => setMenuOpen(!menuOpen)}>
              <Icon name={menuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-[#0A0806]/98 backdrop-blur-xl border-t border-white/5 px-6 py-6 flex flex-col gap-4">
            {NAV.map((n, i) => (
              <button key={n.id} onClick={() => go(n.id)} className="text-left text-sm uppercase tracking-widest text-white/50 hover:text-white transition-colors py-1"
                style={{ opacity: 0, animation: `slideInNav 0.4s ease ${i * 60}ms forwards` }}>
                <span className="text-elm-crimson/50 mr-3 text-xs">0{i + 1}</span>{n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ─── HERO ─── */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={`${CDN}/0101f4b2-1954-45cb-81fc-d86af4124747.jpg`} alt="" className="w-full h-full object-cover"
            style={{ opacity: 0.35, filter: "saturate(0.6)", transform: `scale(1.1) translateY(${scrollY * 0.15}px)`, transition: "transform 0.05s linear" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0806] via-[#0A0806]/80 to-[#0A0806]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0806] via-transparent to-[#0A0806]/50" />
        </div>

        {/* 3D Orbs */}
        <div className="absolute top-[20%] right-[15%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #C1292E 0%, transparent 60%)", transform: `translate(${Math.sin(scrollY * 0.003) * 30}px, ${Math.cos(scrollY * 0.003) * 20}px)`, transition: "transform 0.3s" }} />
        <div className="absolute bottom-[15%] left-[10%] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #F2A65A 0%, transparent 60%)", transform: `translate(${Math.cos(scrollY * 0.004) * 20}px, ${Math.sin(scrollY * 0.004) * 25}px)`, transition: "transform 0.3s" }} />

        {/* Vertical line decoration */}
        <div className="absolute left-12 top-0 bottom-0 hidden md:flex flex-col items-center z-10">
          <div className="h-32 w-px bg-gradient-to-b from-transparent to-white/20" />
          <div className="writing-vertical text-[10px] tracking-[0.3em] text-white/20 uppercase my-4"
            style={{ writingMode: "vertical-lr" }}>Wax flowers since 2021</div>
          <div className="flex-1 w-px bg-gradient-to-b from-white/20 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 w-full perspective-2000">
          <div className="max-w-3xl preserve-3d">
            <div style={{ opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0) rotateX(0)" : "translateY(60px) rotateX(8deg)", transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s" }}>
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-elm-crimson to-transparent" />
                <span className="text-elm-gold/80 text-[11px] uppercase tracking-[0.3em]">Авторские восковые цветы</span>
              </div>
            </div>

            <h1 className="font-display leading-[0.88] mb-10 preserve-3d">
              <span className="block overflow-hidden">
                <span className="block text-[clamp(4rem,10vw,9rem)] font-bold text-white"
                  style={{ opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0) rotateX(0)" : "translateY(100%) rotateX(-15deg)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.5s", transformOrigin: "bottom" }}>
                  Цветы,
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="block text-[clamp(4rem,10vw,9rem)] font-bold italic"
                  style={{ color: "transparent", WebkitTextStroke: "1.5px #C1292E", opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0) rotateX(0)" : "translateY(100%) rotateX(-15deg)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.7s", transformOrigin: "bottom" }}>
                  что живут
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="block text-[clamp(4rem,10vw,9rem)] font-bold"
                  style={{ background: "linear-gradient(135deg, #C1292E, #F2A65A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0) rotateX(0)" : "translateY(100%) rotateX(-15deg)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.9s", transformOrigin: "bottom" }}>
                  вечно
                </span>
              </span>
            </h1>

            <p className="text-white/40 text-lg max-w-lg leading-relaxed mb-12"
              style={{ opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0)" : "translateY(30px)", transition: "all 1s ease 1.1s" }}>
              Каждая композиция — произведение искусства из натурального воска, которое никогда не завянет.
            </p>

            <div className="flex flex-wrap items-center gap-5"
              style={{ opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0)" : "translateY(30px)", transition: "all 1s ease 1.3s" }}>
              <MagneticButton onClick={() => go("catalog")}
                className="group relative overflow-hidden bg-elm-crimson text-white px-10 py-4 rounded-full text-sm uppercase tracking-[0.15em] font-semibold hover:shadow-[0_0_50px_rgba(193,41,46,0.5)] transition-shadow duration-500">
                <span className="relative z-10 flex items-center gap-2">
                  Смотреть каталог
                  <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-elm-coral to-elm-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-600" />
              </MagneticButton>
              <MagneticButton onClick={() => go("about")}
                className="group flex items-center gap-4 text-white/40 hover:text-white text-sm uppercase tracking-widest transition-colors duration-400">
                <div className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center group-hover:border-elm-gold group-hover:bg-elm-gold/10 group-hover:scale-110 transition-all duration-400">
                  <Icon name="Play" size={12} className="ml-0.5" />
                </div>
                О нас
              </MagneticButton>
            </div>

            {/* Stats counter */}
            <div className="flex items-center gap-12 mt-20 pt-8 border-t border-white/5"
              style={{ opacity: heroLoaded ? 1 : 0, transition: "opacity 1s ease 1.6s" }}>
              {[["500+", "Клиентов"], ["3 года", "Опыта"], ["100%", "Хэнд-мейд"], ["4.9★", "Рейтинг"]].map(([n, l]) => (
                <div key={l} className="group">
                  <p className="font-display text-3xl font-bold text-white group-hover:text-elm-crimson transition-colors duration-300">{n}</p>
                  <p className="text-white/20 text-[10px] uppercase tracking-widest mt-1 group-hover:text-white/40 transition-colors">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={{ opacity: heroLoaded ? 0.4 : 0, transition: "opacity 1s ease 2s" }}>
          <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5">
            <div className="w-0.5 h-2 bg-white/60 rounded-full animate-scrollDot" />
          </div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <div className="relative overflow-hidden py-5 border-y border-white/5">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="text-white/15 font-display text-2xl italic mx-10 flex-shrink-0 flex items-center gap-6">
              <span className="text-elm-crimson/40">✦</span> Восковые цветы
              <span className="text-elm-gold/40">✦</span> Ручная работа
              <span className="text-elm-crimson/40">✦</span> Доставка по России
              <span className="text-elm-gold/40">✦</span> Вечная красота &nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ─── CATALOG ─── */}
      <section id="catalog" className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex flex-col md:flex-row items-end justify-between mb-20 gap-6">
            <div>
              <p className="text-elm-crimson text-[11px] uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
                <span className="h-px w-8 bg-elm-crimson" /> Наши работы
              </p>
              <h2 className="font-display text-6xl md:text-8xl font-bold text-white leading-none">Каталог</h2>
            </div>
            <p className="hidden md:block text-white/25 text-sm max-w-xs text-right leading-relaxed">
              Каждое изделие — результат многих часов ручной работы и внимания к мелочам
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {PRODUCTS.map((p, i) => {
              const count = cart.filter((id) => id === p.id).length;
              return <ProductCard key={p.id} p={p} count={count} i={i} addToCart={addToCart} removeFromCart={removeFromCart} />;
            })}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-1/2 w-px h-full bg-white" />
          <div className="absolute left-0 top-1/2 w-full h-px bg-white" />
          {Array(10).fill(null).map((_, i) => (
            <div key={i} className="absolute h-px bg-white" style={{ top: `${10 + i * 10}%`, left: 0, right: 0, opacity: 0.5 }} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <Reveal type="left">
            <div className="relative perspective-1500 preserve-3d">
              <div className="rounded-2xl overflow-hidden h-[600px] relative group">
                <img src={`${CDN}/6936f247-bc9f-4ac1-bb4b-2e5427705a51.jpg`} alt="Мастерская"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0806]/70 via-transparent to-transparent" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: "linear-gradient(135deg, rgba(193,41,46,0.15), transparent)" }} />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#0A0806] border border-elm-crimson/30 rounded-2xl p-6 shadow-2xl z-10 backdrop-blur-xl"
                style={{ animation: "gentleFloat 6s ease-in-out infinite" }}>
                <p className="font-display text-5xl font-bold text-elm-crimson">3+</p>
                <p className="text-white/50 text-sm mt-1">лет мастерства</p>
              </div>
              <div className="absolute -left-4 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-elm-gold/50 to-transparent" />
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-xl rounded-full px-4 py-2 border border-white/10 z-10">
                <span className="text-[10px] text-white/60 uppercase tracking-widest">Мастерская</span>
              </div>
            </div>
          </Reveal>

          <Reveal type="right" delay={150}>
            <div>
              <p className="text-elm-gold text-[11px] uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-elm-gold" /> Наша история
              </p>
              <h2 className="font-display text-6xl md:text-7xl font-bold leading-[0.95] mb-10">
                <span className="text-white">О</span>{" "}
                <span className="italic" style={{ background: "linear-gradient(135deg, #C1292E, #E07A5F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>магазине</span><br />
                <span className="text-white">Эльмира</span>
              </h2>

              <div className="space-y-4 text-white/40 leading-relaxed mb-10 text-[15px]">
                <p>Мы создаём восковые цветы с 2021 года. Каждая композиция — результат многолетнего опыта и искренней любви к творчеству.</p>
                <p>Наши цветы не вянут, не пылятся и сохраняют яркость годами. Идеальный подарок и украшение для дома.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-10">
                {[
                  { icon: "Leaf", label: "Натуральный воск" },
                  { icon: "Heart", label: "С любовью" },
                  { icon: "Award", label: "Авторские дизайны" },
                  { icon: "Truck", label: "По всей России" },
                ].map((item, i) => (
                  <div key={item.label}
                    className="flex items-center gap-3 border border-white/8 rounded-xl px-4 py-3.5 hover:border-elm-crimson/40 hover:bg-elm-crimson/5 transition-all duration-500 group"
                    style={{ transitionDelay: `${i * 50}ms` }}>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-elm-crimson/20 transition-colors duration-500">
                      <Icon name={item.icon} fallback="Star" size={14} className="text-elm-gold/70 group-hover:text-elm-gold transition-colors group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-white/50 text-sm group-hover:text-white/80 transition-colors">{item.label}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => go("catalog")} className="group flex items-center gap-4 text-sm uppercase tracking-widest text-white/40 hover:text-white transition-all duration-500">
                <span>Смотреть каталог</span>
                <div className="h-px w-12 bg-white/20 group-hover:w-24 group-hover:bg-elm-crimson transition-all duration-600" />
                <Icon name="ArrowRight" size={14} className="opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-500 text-elm-crimson" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── CART ─── */}
      <section id="cart" className="py-32 px-6 md:px-12 bg-[#0E0B08]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16">
            <p className="text-elm-crimson text-[11px] uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-elm-crimson" /> Ваш выбор
            </p>
            <h2 className="font-display text-6xl md:text-8xl font-bold text-white">Корзина</h2>
          </Reveal>

          {cart.length === 0 ? (
            <Reveal type="scale">
              <div className="border border-dashed border-white/10 rounded-3xl p-24 text-center">
                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <Icon name="ShoppingBag" size={32} className="text-white/15" />
                </div>
                <p className="font-display text-4xl text-white/15 mb-8">Корзина пуста</p>
                <MagneticButton onClick={() => go("catalog")} className="bg-elm-crimson text-white px-10 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-elm-coral transition-colors">
                  В каталог
                </MagneticButton>
              </div>
            </Reveal>
          ) : (
            <div className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-3 space-y-3">
                {PRODUCTS.filter((p) => cart.includes(p.id)).map((p, i) => {
                  const count = cart.filter((id) => id === p.id).length;
                  return (
                    <Reveal key={p.id} delay={i * 80}>
                      <div className="flex items-center gap-5 border border-white/8 rounded-2xl p-5 hover:border-elm-crimson/30 transition-all duration-500 group">
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-xl text-white truncate">{p.name}</p>
                          <p className="text-elm-gold font-bold mt-0.5">{p.price}</p>
                        </div>
                        <div className="flex items-center gap-3 border border-white/10 rounded-full px-4 py-2">
                          <button onClick={() => removeFromCart(p.id)} className="text-white/30 hover:text-white transition-colors"><Icon name="Minus" size={12} /></button>
                          <span className="text-white font-bold w-5 text-center">{count}</span>
                          <button onClick={() => addToCart(p.id)} className="text-white/30 hover:text-white transition-colors"><Icon name="Plus" size={12} /></button>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
              <div className="md:col-span-2">
                <Reveal type="right">
                  <div className="border border-white/8 rounded-2xl p-8 sticky top-24">
                    <h3 className="font-display text-2xl text-white mb-6">Оформить заказ</h3>
                    {orderSent ? (
                      <div className="text-center py-10">
                        <div className="w-16 h-16 rounded-full border border-elm-crimson/40 bg-elm-crimson/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <Icon name="Check" size={24} className="text-elm-crimson" />
                        </div>
                        <p className="font-display text-2xl text-white mb-2">Принято!</p>
                        <p className="text-white/30 text-sm">Свяжемся скоро</p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => { e.preventDefault(); setOrderSent(true); }} className="space-y-3">
                        {[{ k: "name", ph: "Имя" }, { k: "phone", ph: "Телефон" }].map((f) => (
                          <input key={f.k} placeholder={f.ph} required value={orderForm[f.k as keyof typeof orderForm]}
                            onChange={(e) => setOrderForm({ ...orderForm, [f.k]: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-elm-crimson/50 transition-all duration-400" />
                        ))}
                        <textarea placeholder="Комментарий" rows={3} value={orderForm.comment}
                          onChange={(e) => setOrderForm({ ...orderForm, comment: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-elm-crimson/50 transition-all duration-400 resize-none" />
                        <button type="submit" className="w-full bg-elm-crimson text-white py-4 rounded-xl text-sm uppercase tracking-widest font-semibold hover:bg-elm-coral transition-all duration-300 hover:shadow-[0_10px_30px_rgba(193,41,46,0.3)]">
                          Оформить
                        </button>
                      </form>
                    )}
                  </div>
                </Reveal>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── DELIVERY ─── */}
      <section id="delivery" className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-20">
            <p className="text-elm-crimson text-[11px] uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-elm-crimson" /> Как мы работаем
            </p>
            <h2 className="font-display text-6xl md:text-8xl font-bold text-white">Доставка</h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "Package", num: "01", title: "Бережная упаковка", desc: "Фирменная коробка с защитным наполнителем. Цветы прибудут идеально." },
              { icon: "Truck", num: "02", title: "По всей России", desc: "СДЭК, Почта России. 3–7 дней. Экспресс в МСК и СПб — 1 день." },
              { icon: "Bell", num: "03", title: "Email-трекинг", desc: "Уведомление на каждом этапе: от оформления до вручения." },
            ].map((item, i) => (
              <Reveal key={item.num} delay={i * 120} type="rotate">
                <div className="group border border-white/8 rounded-2xl p-8 relative overflow-hidden hover:border-elm-crimson/30 transition-all duration-600 h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-elm-crimson/0 to-elm-crimson/0 group-hover:from-elm-crimson/5 group-hover:to-transparent transition-all duration-700" />
                  <span className="absolute top-4 right-6 font-display text-7xl font-bold text-white/[0.03] group-hover:text-elm-crimson/10 transition-colors duration-600">
                    {item.num}
                  </span>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl border border-white/8 flex items-center justify-center mb-6 group-hover:border-elm-crimson/40 group-hover:bg-elm-crimson/10 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Icon name={item.icon} fallback="Star" size={18} className="text-white/30 group-hover:text-elm-crimson transition-all duration-500" />
                    </div>
                    <h3 className="font-display text-2xl text-white mb-3 group-hover:translate-x-1 transition-transform duration-500">{item.title}</h3>
                    <p className="text-white/30 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal type="scale">
            <div className="relative overflow-hidden rounded-2xl border border-elm-crimson/20 bg-gradient-to-r from-elm-crimson/15 to-elm-crimson/5 p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="absolute inset-0 opacity-[0.06]">
                <img src={`${CDN}/38f8636d-46de-4b9b-a0b5-d5dea5d9ced6.jpg`} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="relative">
                <p className="font-display text-4xl md:text-5xl font-bold text-white">Бесплатная доставка</p>
                <p className="text-white/40 mt-2">при заказе от 5 000 ₽</p>
              </div>
              <MagneticButton onClick={() => go("catalog")}
                className="relative bg-white text-[#0A0806] px-10 py-4 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-elm-gold transition-colors duration-300 whitespace-nowrap">
                Выбрать цветы
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section id="reviews" className="py-32 px-6 md:px-12 bg-[#0E0B08]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-20">
            <p className="text-elm-crimson text-[11px] uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-elm-crimson" /> Клиенты о нас
            </p>
            <h2 className="font-display text-6xl md:text-8xl font-bold text-white">Отзывы</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={i * 130} type="rotate">
                <div className="group border border-white/8 rounded-2xl p-8 hover:border-elm-gold/20 transition-all duration-600 relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-elm-gold/0 to-transparent group-hover:from-elm-gold/5 transition-all duration-700" />
                  <div className="relative">
                    <div className="flex gap-1 mb-6">
                      {Array(r.stars).fill(null).map((_, j) => (
                        <span key={j} className="text-elm-gold text-sm" style={{ animationDelay: `${j * 100}ms` }}>★</span>
                      ))}
                    </div>
                    <p className="font-display text-lg text-white/60 leading-relaxed italic mb-8 group-hover:text-white/80 transition-colors duration-500">
                      «{r.text}»
                    </p>
                    <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-elm-crimson to-elm-coral flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{r.name}</p>
                        <p className="text-white/25 text-xs">{r.city}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SUBSCRIBE ─── */}
      <section className="py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={`${CDN}/38f8636d-46de-4b9b-a0b5-d5dea5d9ced6.jpg`} alt=""
            className="w-full h-full object-cover opacity-10" style={{ transform: `translateY(${scrollY * 0.05}px)` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0806] via-[#0A0806]/80 to-[#0A0806]" />
        </div>
        <Reveal type="scale" className="relative max-w-2xl mx-auto text-center">
          <p className="text-elm-gold text-[11px] uppercase tracking-[0.3em] mb-4">— Оставайтесь в курсе</p>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Новые коллекции<br />
            <span className="italic" style={{ background: "linear-gradient(135deg, #C1292E, #F2A65A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>первыми</span>
          </h2>
          <p className="text-white/30 mb-10 leading-relaxed">
            Подпишитесь — получайте уведомления о новых коллекциях и акциях
          </p>
          {subscribed ? (
            <div className="border border-elm-gold/20 bg-elm-gold/5 rounded-2xl p-8">
              <Icon name="CheckCircle" size={36} className="text-elm-gold mx-auto mb-3" />
              <p className="font-display text-2xl text-white">Подписка оформлена!</p>
              <p className="text-white/30 text-sm mt-2">{email}</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }} className="flex gap-3">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ваш email" required
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-full px-6 py-4 text-white text-sm placeholder-white/20 focus:outline-none focus:border-elm-gold/50 transition-all duration-400" />
              <MagneticButton className="bg-elm-crimson text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-elm-coral transition-colors whitespace-nowrap">
                Подписаться
              </MagneticButton>
            </form>
          )}
        </Reveal>
      </section>

      {/* ─── CONTACTS ─── */}
      <section id="contacts" className="py-32 px-6 md:px-12 bg-[#0E0B08]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-20">
            <p className="text-elm-crimson text-[11px] uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-elm-crimson" /> Мы рядом
            </p>
            <h2 className="font-display text-6xl md:text-8xl font-bold text-white">Контакты</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-16">
            <Reveal type="left">
              <div className="space-y-3">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 (900) 000-00-00", sub: "Пн–Пт 9:00–19:00" },
                  { icon: "Mail", label: "Email", value: "info@elmira-flowers.ru", sub: "Ответим за 2 часа" },
                  { icon: "Instagram", label: "Instagram", value: "@elmira.flowers", sub: "Подписывайтесь!" },
                  { icon: "MapPin", label: "Адрес", value: "Москва", sub: "Работаем по всей России" },
                ].map((c, i) => (
                  <div key={c.label} className="flex items-center gap-5 p-5 border border-white/8 rounded-2xl hover:border-elm-crimson/30 transition-all duration-500 group"
                    style={{ transitionDelay: `${i * 50}ms` }}>
                    <div className="w-12 h-12 rounded-xl border border-white/8 flex items-center justify-center flex-shrink-0 group-hover:border-elm-crimson/40 group-hover:bg-elm-crimson/10 group-hover:rotate-6 transition-all duration-500">
                      <Icon name={c.icon} fallback="Star" size={18} className="text-white/30 group-hover:text-elm-crimson transition-colors" />
                    </div>
                    <div>
                      <p className="text-white/20 text-[10px] uppercase tracking-widest mb-0.5">{c.label}</p>
                      <p className="text-white font-medium group-hover:translate-x-1 transition-transform duration-300">{c.value}</p>
                      <p className="text-white/20 text-xs mt-0.5">{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal type="right" delay={100}>
              <div className="border border-white/8 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-elm-crimson/5 blur-3xl" />
                <h3 className="font-display text-3xl text-white mb-2 relative">Напишите нам</h3>
                <p className="text-white/25 text-sm mb-8 relative">Ответим в течение 2 часов</p>
                <form className="space-y-3 relative" onSubmit={(e) => e.preventDefault()}>
                  <input placeholder="Имя" className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-elm-crimson/50 transition-all duration-400" />
                  <input type="email" placeholder="Email" className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-elm-crimson/50 transition-all duration-400" />
                  <textarea placeholder="Сообщение" rows={4} className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-elm-crimson/50 transition-all duration-400 resize-none" />
                  <button type="submit" className="w-full bg-elm-crimson text-white py-4 rounded-xl text-sm uppercase tracking-widest font-semibold hover:bg-elm-coral transition-all duration-300 hover:shadow-[0_10px_30px_rgba(193,41,46,0.3)]">
                    Отправить
                  </button>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-elm-crimson flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-[0.15em] text-white">ЭЛЬМИРА</span>
          </div>
          <div className="flex items-center gap-8 flex-wrap justify-center">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => go(n.id)} className="text-white/20 hover:text-white text-xs uppercase tracking-widest transition-colors duration-300">
                {n.label}
              </button>
            ))}
          </div>
          <p className="text-white/15 text-xs">© 2024 Эльмира</p>
        </div>
      </footer>

      {/* ─── Global animations ─── */}
      <style>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-0.5deg); }
        }
        @keyframes scrollDot {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(6px); }
        }
        .animate-scrollDot { animation: scrollDot 1.8s ease-in-out infinite; }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 40s linear infinite; }
        @keyframes slideInNav {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

/* ──────────────── PRODUCT CARD (3D Tilt) ──────────────── */
function ProductCard({ p, count, i, addToCart, removeFromCart }: {
  p: typeof PRODUCTS[0]; count: number; i: number;
  addToCart: (id: number) => void; removeFromCart: (id: number) => void;
}) {
  const { ref, tilt, onMove, onLeave } = useTilt(14);
  const { ref: viewRef, inView } = useInView();

  return (
    <div ref={viewRef} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(50px)", transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 130}ms` }}>
      <div
        ref={ref}
        className="perspective-1500 cursor-pointer"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div
          className="group relative rounded-2xl overflow-hidden preserve-3d"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${tilt.active ? "scale(1.03)" : "scale(1)"}`,
            transition: tilt.active ? "transform 0.1s ease" : "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
            boxShadow: tilt.active
              ? `${tilt.y * -2}px ${tilt.x * 2}px 40px rgba(193,41,46,0.25), 0 0 80px rgba(193,41,46,0.08)`
              : "0 0 0 rgba(0,0,0,0)",
          }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle at ${50 + tilt.y * 3}% ${50 + tilt.x * 3}%, rgba(255,255,255,0.08) 0%, transparent 50%)` }} />

          <div className="relative h-80 overflow-hidden">
            <img src={p.img} alt={p.name} className="w-full h-full object-cover"
              style={{ transform: tilt.active ? `scale(1.1) translate(${tilt.y * -2}px, ${tilt.x * -2}px)` : "scale(1)", transition: tilt.active ? "0.1s ease" : "0.6s ease", filter: tilt.active ? "saturate(1.2) brightness(1.05)" : "saturate(0.85)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,8,6,0.95) 0%, rgba(10,8,6,0.2) 50%, transparent 100%)" }} />
            <div className="absolute top-4 left-4 bg-elm-crimson/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full z-10">
              {p.tag}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">{p.sub}</p>
            <h3 className="font-display text-3xl font-bold text-white mb-4">{p.name}</h3>
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-bold" style={{ background: "linear-gradient(135deg, #F2A65A, #E07A5F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{p.price}</span>
              {count === 0 ? (
                <button onClick={() => addToCart(p.id)} className="bg-white text-[#0A0806] text-[10px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-full font-bold hover:bg-elm-crimson hover:text-white transition-all duration-400 hover:shadow-[0_0_20px_rgba(193,41,46,0.4)]">
                  В корзину
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/15">
                  <button onClick={() => removeFromCart(p.id)} className="text-white/60 hover:text-white"><Icon name="Minus" size={12} /></button>
                  <span className="text-white font-bold text-sm w-4 text-center">{count}</span>
                  <button onClick={() => addToCart(p.id)} className="text-white/60 hover:text-white"><Icon name="Plus" size={12} /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
