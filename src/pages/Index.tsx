import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "catalog", label: "Каталог" },
  { id: "about", label: "О магазине" },
  { id: "delivery", label: "Доставка" },
  { id: "reviews", label: "Отзывы" },
  { id: "contacts", label: "Контакты" },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Алые розы",
    subtitle: "Классическая элегантность",
    price: "3 200 ₽",
    img: "https://cdn.poehali.dev/projects/f4e2daab-9496-4ae3-80e9-a2bd1e4ce1b2/files/d1d693ba-8a93-4e5f-ae75-6a4bc96b8f8b.jpg",
    tag: "Хит",
  },
  {
    id: 2,
    name: "Весенняя",
    subtitle: "Нежная композиция",
    price: "4 800 ₽",
    img: "https://cdn.poehali.dev/projects/f4e2daab-9496-4ae3-80e9-a2bd1e4ce1b2/files/f25908fe-14a0-41e4-8902-9ac032183b52.jpg",
    tag: "Новинка",
  },
  {
    id: 3,
    name: "Мастерская",
    subtitle: "Авторская коллекция",
    price: "2 600 ₽",
    img: "https://cdn.poehali.dev/projects/f4e2daab-9496-4ae3-80e9-a2bd1e4ce1b2/files/7f529e13-12d1-449a-b063-419c88c1d6ea.jpg",
    tag: "Limited",
  },
];

const REVIEWS = [
  { name: "Мария К.", city: "Москва", text: "Цветы просто невероятные! Стоят уже третий год и выглядят как живые. Все гости восхищаются.", stars: 5 },
  { name: "Анна П.", city: "Санкт-Петербург", text: "Заказала на юбилей маме — она была в восторге. Упаковка роскошная, доставка быстрая.", stars: 5 },
  { name: "Ирина Д.", city: "Казань", text: "Уже третий заказ у Эльмиры. Качество на высшем уровне, всегда точно в срок.", stars: 5 },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function SlideIn({ children, delay = 0, from = "left", className = "" }: { children: React.ReactNode; delay?: number; from?: "left" | "right"; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : `translateX(${from === "left" ? "-60px" : "60px"})`,
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [cart, setCart] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", comment: "" });
  const [orderSent, setOrderSent] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const addToCart = (id: number) => setCart((p) => [...p, id]);
  const removeFromCart = (id: number) => {
    const idx = cart.lastIndexOf(id);
    if (idx !== -1) setCart((p) => p.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-[#0D0906] text-white font-body overflow-x-hidden">

      {/* Custom cursor glow */}
      <div
        className="fixed pointer-events-none z-[9999] w-64 h-64 rounded-full"
        style={{
          left: cursorPos.x - 128,
          top: cursorPos.y - 128,
          background: "radial-gradient(circle, rgba(193,41,46,0.08) 0%, transparent 70%)",
          transition: "left 0.15s ease, top 0.15s ease",
        }}
      />

      {/* NAVBAR */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(13,9,6,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(193,41,46,0.15)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          <button onClick={() => scrollTo("home")} className="group flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-elm-crimson flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <span className="font-display text-2xl font-bold tracking-widest text-white">ЭЛЬМИРА</span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-xs uppercase tracking-[0.15em] transition-all duration-300 relative group ${
                  activeSection === item.id ? "text-elm-gold" : "text-white/50 hover:text-white"
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-elm-gold transition-all duration-300 ${activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"}`} />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollTo("cart")}
              className="relative group flex items-center gap-2 border border-white/20 rounded-full px-5 py-2.5 text-xs uppercase tracking-widest text-white/70 hover:border-elm-crimson hover:text-white transition-all duration-300"
            >
              <Icon name="ShoppingBag" size={14} />
              <span>Корзина</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-elm-crimson rounded-full text-[10px] font-bold flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="md:hidden text-white/70 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
              <Icon name={menuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#0D0906]/98 border-t border-white/10 px-6 py-6 flex flex-col gap-4">
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left text-sm uppercase tracking-widest text-white/60 hover:text-white transition-colors py-1"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        {/* BG image */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.poehali.dev/projects/f4e2daab-9496-4ae3-80e9-a2bd1e4ce1b2/files/0101f4b2-1954-45cb-81fc-d86af4124747.jpg"
            alt=""
            className="w-full h-full object-cover opacity-40"
            style={{ filter: "saturate(0.7)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0906] via-[#0D0906]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0906] via-transparent to-transparent" />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #C1292E 0%, transparent 70%)", animation: "float 8s ease-in-out infinite" }} />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #F2A65A 0%, transparent 70%)", animation: "float 10s ease-in-out infinite reverse" }} />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20 w-full">
          <div className="max-w-3xl">
            {/* Label */}
            <div
              className="inline-flex items-center gap-3 mb-8"
              style={{ opacity: 1, animation: "fadeUp 0.8s ease 0.2s both" }}
            >
              <div className="h-px w-12 bg-elm-crimson" />
              <span className="text-elm-gold text-xs uppercase tracking-[0.25em]">Авторские восковые цветы</span>
            </div>

            {/* Headline */}
            <h1
              className="font-display leading-[0.9] mb-8"
              style={{ animation: "fadeUp 0.9s ease 0.4s both" }}
            >
              <span className="block text-[clamp(4rem,10vw,8rem)] font-bold text-white">Цветы,</span>
              <span className="block text-[clamp(4rem,10vw,8rem)] font-bold italic text-elm-crimson" style={{ WebkitTextStroke: "0px" }}>что живут</span>
              <span className="block text-[clamp(4rem,10vw,8rem)] font-bold text-white/20" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)" }}>вечно</span>
            </h1>

            <p
              className="text-white/50 text-lg max-w-lg leading-relaxed mb-10"
              style={{ animation: "fadeUp 0.9s ease 0.6s both" }}
            >
              Каждая композиция создаётся вручную из натурального воска. Это не просто букет — это произведение искусства, которое никогда не завянет.
            </p>

            <div
              className="flex flex-wrap items-center gap-4"
              style={{ animation: "fadeUp 0.9s ease 0.8s both" }}
            >
              <button
                onClick={() => scrollTo("catalog")}
                className="group relative overflow-hidden bg-elm-crimson text-white px-10 py-4 rounded-full text-sm uppercase tracking-widest font-semibold transition-all duration-500 hover:shadow-[0_0_40px_rgba(193,41,46,0.5)]"
              >
                <span className="relative z-10">Смотреть каталог</span>
                <div className="absolute inset-0 bg-elm-coral scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="flex items-center gap-3 text-white/50 hover:text-white text-sm uppercase tracking-widest transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/60 transition-all duration-300 group-hover:bg-white/5">
                  <Icon name="Play" size={12} />
                </div>
                О нас
              </button>
            </div>

            {/* Stats */}
            <div
              className="flex items-center gap-12 mt-16 pt-10 border-t border-white/10"
              style={{ animation: "fadeUp 0.9s ease 1s both" }}
            >
              {[["500+", "Клиентов"], ["3 года", "Опыта"], ["100%", "Хэнд-мейд"], ["4.9★", "Рейтинг"]].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-3xl font-bold text-white">{n}</p>
                  <p className="text-white/30 text-xs uppercase tracking-wider mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" style={{ animation: "float 2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="relative overflow-hidden bg-elm-crimson py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="text-white/90 font-display text-xl italic mx-12 flex-shrink-0">
              ✦ Восковые цветы ручной работы &nbsp;
              ✦ Доставка по всей России &nbsp;
              ✦ Вечная красота &nbsp;
              ✦ Авторские композиции &nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* CATALOG */}
      <section id="catalog" className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="flex items-end justify-between mb-16">
            <div>
              <p className="text-elm-crimson text-xs uppercase tracking-[0.25em] mb-3">— Наши работы</p>
              <h2 className="font-display text-6xl md:text-7xl font-bold text-white leading-none">Каталог</h2>
            </div>
            <p className="hidden md:block text-white/30 text-sm max-w-xs text-right leading-relaxed">
              Каждое изделие создаётся с нуля и несёт в себе характер мастера
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {PRODUCTS.map((p, i) => {
              const count = cart.filter((id) => id === p.id).length;
              const isHovered = hoveredCard === p.id;
              return (
                <FadeIn key={p.id} delay={i * 120}>
                  <div
                    className="group relative rounded-2xl overflow-hidden cursor-pointer"
                    onMouseEnter={() => setHoveredCard(p.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      transform: isHovered ? "scale(1.02) translateY(-8px)" : "scale(1) translateY(0)",
                      transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      boxShadow: isHovered ? "0 30px 60px rgba(193,41,46,0.3)" : "0 0 0 rgba(0,0,0,0)",
                    }}
                  >
                    {/* Image */}
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        style={{
                          transform: isHovered ? "scale(1.1)" : "scale(1)",
                          transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                          filter: isHovered ? "saturate(1.2) brightness(1.05)" : "saturate(0.9)",
                        }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: isHovered
                            ? "linear-gradient(to top, rgba(13,9,6,0.95) 0%, rgba(13,9,6,0.3) 50%, transparent 100%)"
                            : "linear-gradient(to top, rgba(13,9,6,0.8) 0%, transparent 60%)",
                          transition: "background 0.5s ease",
                        }}
                      />
                      {/* Tag */}
                      <div className="absolute top-4 left-4 bg-elm-crimson/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {p.tag}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">{p.subtitle}</p>
                      <h3 className="font-display text-3xl font-bold text-white mb-4">{p.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-2xl font-bold text-elm-gold">{p.price}</span>
                        {count === 0 ? (
                          <button
                            onClick={() => addToCart(p.id)}
                            className="bg-white text-[#0D0906] text-xs uppercase tracking-widest px-5 py-2.5 rounded-full font-bold hover:bg-elm-crimson hover:text-white transition-all duration-300"
                          >
                            В корзину
                          </button>
                        ) : (
                          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                            <button onClick={() => removeFromCart(p.id)} className="text-white/70 hover:text-white transition-colors">
                              <Icon name="Minus" size={12} />
                            </button>
                            <span className="text-white font-bold text-sm w-4 text-center">{count}</span>
                            <button onClick={() => addToCart(p.id)} className="text-white/70 hover:text-white transition-colors">
                              <Icon name="Plus" size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-32 px-6 md:px-12 relative overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/2 w-px h-full bg-white" />
          <div className="absolute left-0 top-1/2 w-full h-px bg-white" />
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <SlideIn from="left">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden h-[600px] relative">
                <img
                  src="https://cdn.poehali.dev/projects/f4e2daab-9496-4ae3-80e9-a2bd1e4ce1b2/files/6936f247-bc9f-4ac1-bb4b-2e5427705a51.jpg"
                  alt="Мастерская"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0906]/60 to-transparent" />
              </div>
              {/* Floating card */}
              <div
                className="absolute -bottom-6 -right-6 bg-elm-crimson rounded-2xl p-6 shadow-2xl"
                style={{ animation: "float 5s ease-in-out infinite" }}
              >
                <p className="font-display text-4xl font-bold text-white">3+</p>
                <p className="text-white/70 text-sm mt-1">лет мастерства</p>
              </div>
              {/* Gold accent line */}
              <div className="absolute -left-3 top-16 bottom-16 w-0.5 bg-gradient-to-b from-transparent via-elm-gold to-transparent" />
            </div>
          </SlideIn>

          <SlideIn from="right" delay={100}>
            <div>
              <p className="text-elm-gold text-xs uppercase tracking-[0.25em] mb-4">— Наша история</p>
              <h2 className="font-display text-6xl md:text-7xl font-bold leading-tight mb-8">
                <span className="text-white">О</span>{" "}
                <span className="text-elm-crimson italic">магазине</span>{" "}
                <span className="text-white">Эльмира</span>
              </h2>

              <div className="space-y-5 text-white/50 leading-relaxed mb-10">
                <p>Мы создаём восковые цветы с 2021 года. Каждая композиция — это результат многолетнего опыта и искренней любви к творчеству.</p>
                <p>Наши цветы не вянут, не пылятся и сохраняют свою яркость годами. Идеальный подарок и украшение для дома.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-10">
                {[
                  { icon: "Leaf", label: "Натуральный воск" },
                  { icon: "Heart", label: "С любовью" },
                  { icon: "Award", label: "Авторские дизайны" },
                  { icon: "Truck", label: "По всей России" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 border border-white/10 rounded-xl px-4 py-3 hover:border-elm-crimson/50 hover:bg-elm-crimson/5 transition-all duration-300 group">
                    <Icon name={item.icon} fallback="Star" size={16} className="text-elm-gold group-hover:scale-110 transition-transform" />
                    <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">{item.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scrollTo("catalog")}
                className="group flex items-center gap-4 text-sm uppercase tracking-widest text-white/60 hover:text-white transition-colors duration-300"
              >
                <span>Смотреть каталог</span>
                <div className="h-px w-12 bg-white/30 group-hover:w-24 group-hover:bg-elm-crimson transition-all duration-500" />
              </button>
            </div>
          </SlideIn>
        </div>
      </section>

      {/* CART */}
      <section id="cart" className="py-32 px-6 md:px-12 bg-[#100C09]">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-16">
            <p className="text-elm-crimson text-xs uppercase tracking-[0.25em] mb-3">— Ваш выбор</p>
            <h2 className="font-display text-6xl md:text-7xl font-bold text-white">Корзина</h2>
          </FadeIn>

          {cart.length === 0 ? (
            <FadeIn>
              <div className="border border-white/10 rounded-2xl p-20 text-center">
                <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6">
                  <Icon name="ShoppingBag" size={28} className="text-white/20" />
                </div>
                <p className="font-display text-3xl text-white/20 mb-6">Корзина пуста</p>
                <button onClick={() => scrollTo("catalog")} className="bg-elm-crimson text-white px-8 py-3 rounded-full text-sm uppercase tracking-widest hover:bg-elm-coral transition-colors">
                  Перейти в каталог
                </button>
              </div>
            </FadeIn>
          ) : (
            <div className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-3 space-y-3">
                {PRODUCTS.filter((p) => cart.includes(p.id)).map((p) => {
                  const count = cart.filter((id) => id === p.id).length;
                  return (
                    <div key={p.id} className="flex items-center gap-5 border border-white/10 rounded-2xl p-4 hover:border-elm-crimson/30 transition-all duration-300 group">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display text-xl text-white">{p.name}</p>
                        <p className="text-elm-gold font-bold mt-0.5">{p.price}</p>
                      </div>
                      <div className="flex items-center gap-3 border border-white/15 rounded-full px-4 py-2">
                        <button onClick={() => removeFromCart(p.id)} className="text-white/40 hover:text-white transition-colors"><Icon name="Minus" size={12} /></button>
                        <span className="text-white font-bold w-5 text-center">{count}</span>
                        <button onClick={() => addToCart(p.id)} className="text-white/40 hover:text-white transition-colors"><Icon name="Plus" size={12} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="md:col-span-2">
                <div className="border border-white/10 rounded-2xl p-8 sticky top-24">
                  <h3 className="font-display text-2xl text-white mb-6">Оформить заказ</h3>
                  {orderSent ? (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 rounded-full bg-elm-crimson/20 border border-elm-crimson/50 flex items-center justify-center mx-auto mb-4">
                        <Icon name="Check" size={24} className="text-elm-crimson" />
                      </div>
                      <p className="font-display text-2xl text-white mb-2">Заказ принят!</p>
                      <p className="text-white/40 text-sm">Свяжемся в ближайшее время</p>
                    </div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); setOrderSent(true); }} className="space-y-3">
                      {[
                        { key: "name", ph: "Ваше имя" },
                        { key: "phone", ph: "Телефон" },
                      ].map((f) => (
                        <input
                          key={f.key}
                          placeholder={f.ph}
                          required
                          value={orderForm[f.key as keyof typeof orderForm]}
                          onChange={(e) => setOrderForm({ ...orderForm, [f.key]: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-elm-crimson/60 transition-colors"
                        />
                      ))}
                      <textarea
                        placeholder="Комментарий"
                        rows={3}
                        value={orderForm.comment}
                        onChange={(e) => setOrderForm({ ...orderForm, comment: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-elm-crimson/60 transition-colors resize-none"
                      />
                      <button type="submit" className="w-full bg-elm-crimson text-white py-4 rounded-xl text-sm uppercase tracking-widest font-semibold hover:bg-elm-coral transition-colors duration-300">
                        Оформить
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* DELIVERY */}
      <section id="delivery" className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-16">
            <p className="text-elm-crimson text-xs uppercase tracking-[0.25em] mb-3">— Как мы работаем</p>
            <h2 className="font-display text-6xl md:text-7xl font-bold text-white">Доставка</h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "Package", num: "01", title: "Бережная упаковка", desc: "Каждый заказ упаковывается в фирменную коробку с защитным наполнителем." },
              { icon: "Truck", num: "02", title: "По всей России", desc: "СДЭК, Почта России, курьер. Доставка 3–7 дней. Экспресс в Москве и СПб — 1 день." },
              { icon: "Bell", num: "03", title: "Email-уведомления", desc: "На каждом этапе вы получаете письмо: оформление, отправка, доставка." },
            ].map((item, i) => (
              <FadeIn key={item.num} delay={i * 120}>
                <div className="group border border-white/10 rounded-2xl p-8 hover:border-elm-crimson/40 hover:bg-elm-crimson/5 transition-all duration-500 relative overflow-hidden">
                  <span className="absolute top-4 right-6 font-display text-6xl font-bold text-white/5 group-hover:text-elm-crimson/10 transition-colors duration-500">
                    {item.num}
                  </span>
                  <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center mb-6 group-hover:border-elm-crimson/50 transition-colors duration-300">
                    <Icon name={item.icon} fallback="Star" size={20} className="text-white/50 group-hover:text-elm-crimson transition-colors duration-300" />
                  </div>
                  <h3 className="font-display text-2xl text-white mb-3">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="relative overflow-hidden rounded-2xl border border-elm-crimson/30 bg-elm-crimson/10 p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="absolute inset-0 opacity-10">
                <img src="https://cdn.poehali.dev/projects/f4e2daab-9496-4ae3-80e9-a2bd1e4ce1b2/files/38f8636d-46de-4b9b-a0b5-d5dea5d9ced6.jpg" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="relative">
                <p className="font-display text-4xl font-bold text-white">Бесплатная доставка</p>
                <p className="text-white/50 mt-1">при заказе от 5 000 ₽</p>
              </div>
              <button
                onClick={() => scrollTo("catalog")}
                className="relative bg-white text-[#0D0906] px-10 py-4 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-elm-gold transition-colors duration-300 whitespace-nowrap"
              >
                Выбрать цветы
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-32 px-6 md:px-12 bg-[#100C09]">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-16">
            <p className="text-elm-crimson text-xs uppercase tracking-[0.25em] mb-3">— Клиенты о нас</p>
            <h2 className="font-display text-6xl md:text-7xl font-bold text-white">Отзывы</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <FadeIn key={r.name} delay={i * 120}>
                <div className="border border-white/10 rounded-2xl p-8 hover:border-elm-gold/30 transition-all duration-500 group">
                  <div className="flex gap-1 mb-6">
                    {Array(r.stars).fill(null).map((_, j) => (
                      <span key={j} className="text-elm-gold text-sm">★</span>
                    ))}
                  </div>
                  <p className="font-display text-xl text-white/70 leading-relaxed italic mb-8 group-hover:text-white/90 transition-colors duration-300">
                    «{r.text}»
                  </p>
                  <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                    <div className="w-9 h-9 rounded-full bg-elm-crimson flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{r.name}</p>
                      <p className="text-white/30 text-xs">{r.city}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section className="py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://cdn.poehali.dev/projects/f4e2daab-9496-4ae3-80e9-a2bd1e4ce1b2/files/38f8636d-46de-4b9b-a0b5-d5dea5d9ced6.jpg" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0906] via-transparent to-[#0D0906]" />
        </div>
        <FadeIn className="relative max-w-2xl mx-auto text-center">
          <p className="text-elm-gold text-xs uppercase tracking-[0.25em] mb-4">— Оставайтесь в курсе</p>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
            Новые коллекции<br />
            <span className="text-elm-crimson italic">первыми</span>
          </h2>
          <p className="text-white/40 mb-10 leading-relaxed">
            Подпишитесь и получайте уведомления о новых коллекциях, акциях и специальных предложениях на вашу почту
          </p>
          {subscribed ? (
            <div className="border border-elm-gold/30 rounded-2xl p-8">
              <Icon name="CheckCircle" size={36} className="text-elm-gold mx-auto mb-3" />
              <p className="font-display text-2xl text-white">Вы подписаны!</p>
              <p className="text-white/40 text-sm mt-2">{email}</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email"
                required
                className="flex-1 bg-white/5 border border-white/15 rounded-full px-6 py-4 text-white text-sm placeholder-white/25 focus:outline-none focus:border-elm-gold/60 transition-colors"
              />
              <button type="submit" className="bg-elm-crimson text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-elm-coral transition-colors whitespace-nowrap">
                Подписаться
              </button>
            </form>
          )}
        </FadeIn>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-32 px-6 md:px-12 bg-[#100C09]">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-16">
            <p className="text-elm-crimson text-xs uppercase tracking-[0.25em] mb-3">— Мы рядом</p>
            <h2 className="font-display text-6xl md:text-7xl font-bold text-white">Контакты</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-16">
            <SlideIn from="left">
              <div className="space-y-4">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 (900) 000-00-00", sub: "Пн–Пт 9:00–19:00" },
                  { icon: "Mail", label: "Email", value: "info@elmira-flowers.ru", sub: "Ответим за 2 часа" },
                  { icon: "Instagram", label: "Instagram", value: "@elmira.flowers", sub: "Подписывайтесь!" },
                  { icon: "MapPin", label: "Адрес", value: "Москва", sub: "Работаем по всей России" },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-5 p-5 border border-white/10 rounded-2xl hover:border-elm-crimson/40 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-elm-crimson/50 group-hover:bg-elm-crimson/10 transition-all duration-300">
                      <Icon name={c.icon} fallback="Star" size={18} className="text-white/40 group-hover:text-elm-crimson transition-colors" />
                    </div>
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-widest mb-0.5">{c.label}</p>
                      <p className="text-white font-medium">{c.value}</p>
                      <p className="text-white/30 text-xs mt-0.5">{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SlideIn>

            <SlideIn from="right" delay={100}>
              <div className="border border-white/10 rounded-2xl p-8">
                <h3 className="font-display text-3xl text-white mb-2">Напишите нам</h3>
                <p className="text-white/30 text-sm mb-8">Ответим в течение 2 часов</p>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <input placeholder="Имя" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-elm-crimson/60 transition-colors" />
                  <input type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-elm-crimson/60 transition-colors" />
                  <textarea placeholder="Сообщение" rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-elm-crimson/60 transition-colors resize-none" />
                  <button type="submit" className="w-full bg-elm-crimson text-white py-4 rounded-xl text-sm uppercase tracking-widest font-semibold hover:bg-elm-coral transition-colors">
                    Отправить
                  </button>
                </form>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-elm-crimson flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-widest text-white">ЭЛЬМИРА</span>
          </div>
          <div className="flex items-center gap-8 flex-wrap justify-center">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className="text-white/30 hover:text-white text-xs uppercase tracking-widest transition-colors">
                {item.label}
              </button>
            ))}
          </div>
          <p className="text-white/20 text-xs">© 2024 Эльмира</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
      `}</style>
    </div>
  );
}
