import { useState } from "react";
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
    name: "Букет «Алые розы»",
    price: "3 200 ₽",
    img: "https://cdn.poehali.dev/projects/f4e2daab-9496-4ae3-80e9-a2bd1e4ce1b2/files/d1d693ba-8a93-4e5f-ae75-6a4bc96b8f8b.jpg",
    tag: "Хит продаж",
    tagColor: "bg-elm-crimson",
  },
  {
    id: 2,
    name: "Композиция «Весна»",
    price: "4 800 ₽",
    img: "https://cdn.poehali.dev/projects/f4e2daab-9496-4ae3-80e9-a2bd1e4ce1b2/files/f25908fe-14a0-41e4-8902-9ac032183b52.jpg",
    tag: "Новинка",
    tagColor: "bg-elm-gold",
  },
  {
    id: 3,
    name: "Мастерская коллекция",
    price: "2 600 ₽",
    img: "https://cdn.poehali.dev/projects/f4e2daab-9496-4ae3-80e9-a2bd1e4ce1b2/files/7f529e13-12d1-449a-b063-419c88c1d6ea.jpg",
    tag: "Ручная работа",
    tagColor: "bg-elm-coral",
  },
];

const REVIEWS = [
  {
    name: "Мария К.",
    city: "Москва",
    text: "Цветы просто невероятные! Стоят уже третий год и выглядят как живые. Все гости восхищаются.",
    stars: 5,
  },
  {
    name: "Анна П.",
    city: "Санкт-Петербург",
    text: "Заказала на юбилей маме — она была в восторге. Упаковка роскошная, доставка быстрая.",
    stars: 5,
  },
  {
    name: "Ирина Д.",
    city: "Казань",
    text: "Уже третий заказ у Эльмиры. Качество на высшем уровне, всегда точно в срок.",
    stars: 5,
  },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [cart, setCart] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", comment: "" });
  const [orderSent, setOrderSent] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const addToCart = (id: number) => setCart((prev) => [...prev, id]);
  const removeFromCart = (id: number) => {
    const idx = cart.lastIndexOf(id);
    if (idx !== -1) setCart((prev) => prev.filter((_, i) => i !== idx));
  };
  const cartCount = cart.length;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSent(true);
  };

  return (
    <div className="min-h-screen bg-elm-cream font-body">
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-elm-cream/90 backdrop-blur-md border-b border-elm-blush">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <button
            onClick={() => scrollTo("home")}
            className="font-display text-2xl font-bold text-elm-crimson tracking-wide hover:text-elm-coral transition-colors"
          >
            Эльмира
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-sm font-medium transition-all duration-200 hover:text-elm-crimson relative ${
                  activeSection === item.id
                    ? "text-elm-crimson after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-elm-crimson after:rounded"
                    : "text-elm-dark/70"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo("cart")}
              className="relative flex items-center gap-1.5 bg-elm-crimson text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-elm-coral transition-colors"
            >
              <Icon name="ShoppingBag" size={16} />
              Корзина
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-elm-gold text-elm-dark text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-elm-blush"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-elm-cream border-t border-elm-blush px-4 py-4 flex flex-col gap-3 animate-fade-in">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left py-2 text-elm-dark font-medium hover:text-elm-crimson transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-elm-blush via-elm-cream to-orange-50" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-elm-crimson/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-elm-gold/15 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 w-full grid md:grid-cols-2 gap-12 items-center py-20">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-elm-crimson/10 border border-elm-crimson/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-elm-crimson animate-pulse" />
              <span className="text-elm-crimson text-sm font-medium">Ручная работа · Авторский дизайн</span>
            </div>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-elm-dark leading-none mb-4">
              Цветы,<br />
              <span className="text-elm-crimson italic">которые</span><br />
              живут вечно
            </h1>
            <p className="text-elm-dark/60 text-lg mt-6 mb-8 max-w-md leading-relaxed">
              Авторские восковые цветы ручной работы. Каждая композиция — это произведение искусства, которое сохранит свою красоту навсегда.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("catalog")}
                className="bg-elm-crimson text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-elm-coral transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-elm-crimson/30"
              >
                Смотреть каталог
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="border-2 border-elm-dark/20 text-elm-dark px-8 py-4 rounded-full text-base font-semibold hover:border-elm-crimson hover:text-elm-crimson transition-all duration-300"
              >
                О нас
              </button>
            </div>
            <div className="flex items-center gap-8 mt-10">
              {[["500+", "Довольных клиентов"], ["3 года", "На рынке"], ["100%", "Ручная работа"]].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display text-3xl font-bold text-elm-crimson">{num}</p>
                  <p className="text-elm-dark/50 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in delay-300">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl hover-lift">
              <img
                src="https://cdn.poehali.dev/projects/f4e2daab-9496-4ae3-80e9-a2bd1e4ce1b2/files/f25908fe-14a0-41e4-8902-9ac032183b52.jpg"
                alt="Восковые цветы"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-elm-dark/20 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl animate-float z-20">
              <p className="font-display text-2xl font-bold text-elm-crimson">4.9 ★</p>
              <p className="text-xs text-elm-dark/60">120 отзывов</p>
            </div>
            <div className="absolute -top-4 -right-4 bg-elm-gold rounded-2xl p-4 shadow-xl z-20">
              <p className="text-elm-dark font-bold text-sm">Новая</p>
              <p className="text-elm-dark font-bold text-sm">коллекция!</p>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-elm-crimson py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="text-white font-display text-lg mx-8 inline-flex items-center gap-3">
              ✦ Восковые цветы ручной работы
              ✦ Доставка по всей России
              ✦ Вечная красота
              ✦ Авторские композиции &nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* CATALOG */}
      <section id="catalog" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14 animate-fade-up">
          <span className="text-elm-crimson font-medium text-sm uppercase tracking-widest">Наши работы</span>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-elm-dark mt-2">Каталог</h2>
          <p className="text-elm-dark/50 mt-4 max-w-xl mx-auto">Каждое изделие создаётся с любовью и вниманием к деталям</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PRODUCTS.map((p, i) => {
            const count = cart.filter((id) => id === p.id).length;
            return (
              <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover-lift group">
                <div className="relative overflow-hidden h-64">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-4 left-4 ${p.tagColor} text-white text-xs font-bold px-3 py-1.5 rounded-full`}>
                    {p.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-semibold text-elm-dark">{p.name}</h3>
                  <p className="text-elm-dark/50 text-sm mt-1">Восковые цветы, ручная работа</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-display text-2xl font-bold text-elm-crimson">{p.price}</span>
                    {count === 0 ? (
                      <button
                        onClick={() => addToCart(p.id)}
                        className="bg-elm-crimson text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-elm-coral transition-colors"
                      >
                        В корзину
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(p.id)}
                          className="w-8 h-8 rounded-full border-2 border-elm-crimson text-elm-crimson flex items-center justify-center hover:bg-elm-crimson hover:text-white transition-colors"
                        >
                          <Icon name="Minus" size={14} />
                        </button>
                        <span className="font-bold text-elm-dark w-4 text-center">{count}</span>
                        <button
                          onClick={() => addToCart(p.id)}
                          className="w-8 h-8 rounded-full bg-elm-crimson text-white flex items-center justify-center hover:bg-elm-coral transition-colors"
                        >
                          <Icon name="Plus" size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-elm-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-elm-crimson/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <img
              src="https://cdn.poehali.dev/projects/f4e2daab-9496-4ae3-80e9-a2bd1e4ce1b2/files/7f529e13-12d1-449a-b063-419c88c1d6ea.jpg"
              alt="Мастерская"
              className="rounded-3xl w-full h-[450px] object-cover shadow-2xl"
            />
          </div>
          <div>
            <span className="text-elm-gold font-medium text-sm uppercase tracking-widest">Наша история</span>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white mt-2 mb-6">
              О магазине<br /><span className="text-elm-crimson italic">Эльмира</span>
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              Мы создаём восковые цветы с 2021 года. Каждая композиция — это результат многолетнего опыта и искренней любви к творчеству.
            </p>
            <p className="text-white/60 leading-relaxed mb-8">
              Наши цветы не вянут, не пылятся и сохраняют свою яркость годами. Идеальный подарок и украшение для дома.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "Leaf", text: "Натуральный воск" },
                { icon: "Heart", text: "С любовью к деталям" },
                { icon: "Award", text: "Авторские дизайны" },
                { icon: "Truck", text: "Доставка по России" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
                  <Icon name={item.icon} fallback="Star" size={18} className="text-elm-gold flex-shrink-0" />
                  <span className="text-white/80 text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CART */}
      <section id="cart" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-elm-crimson font-medium text-sm uppercase tracking-widest">Ваш выбор</span>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-elm-dark mt-2">Корзина</h2>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-elm-blush rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="ShoppingBag" size={36} className="text-elm-crimson" />
            </div>
            <p className="font-display text-2xl text-elm-dark/40">Корзина пока пуста</p>
            <button
              onClick={() => scrollTo("catalog")}
              className="mt-6 bg-elm-crimson text-white px-8 py-3 rounded-full hover:bg-elm-coral transition-colors"
            >
              Перейти в каталог
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {PRODUCTS.filter((p) => cart.includes(p.id)).map((p) => {
                const count = cart.filter((id) => id === p.id).length;
                return (
                  <div key={p.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                    <img src={p.img} alt={p.name} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-1">
                      <p className="font-display text-xl font-semibold text-elm-dark">{p.name}</p>
                      <p className="text-elm-crimson font-bold">{p.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(p.id)} className="w-8 h-8 rounded-full border border-elm-crimson text-elm-crimson flex items-center justify-center">
                        <Icon name="Minus" size={14} />
                      </button>
                      <span className="w-6 text-center font-bold">{count}</span>
                      <button onClick={() => addToCart(p.id)} className="w-8 h-8 rounded-full bg-elm-crimson text-white flex items-center justify-center">
                        <Icon name="Plus" size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-elm-dark rounded-3xl p-8 text-white h-fit">
              <h3 className="font-display text-2xl font-bold mb-6">Оформить заказ</h3>
              {orderSent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-elm-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Check" size={28} className="text-elm-dark" />
                  </div>
                  <p className="text-white font-semibold text-lg">Заказ принят!</p>
                  <p className="text-white/60 text-sm mt-2">Мы свяжемся с вами в ближайшее время</p>
                </div>
              ) : (
                <form onSubmit={handleOrder} className="space-y-4">
                  <input
                    value={orderForm.name}
                    onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                    placeholder="Ваше имя"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-elm-gold"
                  />
                  <input
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    placeholder="Телефон"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-elm-gold"
                  />
                  <textarea
                    value={orderForm.comment}
                    onChange={(e) => setOrderForm({ ...orderForm, comment: e.target.value })}
                    placeholder="Комментарий к заказу"
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-elm-gold resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-elm-crimson text-white py-4 rounded-xl font-semibold hover:bg-elm-coral transition-colors"
                  >
                    Оформить заказ
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>

      {/* DELIVERY */}
      <section id="delivery" className="py-24 bg-gradient-to-br from-elm-blush to-orange-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="text-elm-crimson font-medium text-sm uppercase tracking-widest">Как мы работаем</span>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-elm-dark mt-2">Доставка</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "Package",
                title: "Бережная упаковка",
                desc: "Каждый заказ упаковывается в фирменную коробку с защитным наполнителем. Ваши цветы прибудут в идеальном состоянии.",
                num: "01",
              },
              {
                icon: "Truck",
                title: "Доставка по России",
                desc: "Работаем с СДЭК, Почтой России и курьерскими службами. Доставка 3–7 дней. Экспресс-доставка в Москве и СПб — 1 день.",
                num: "02",
              },
              {
                icon: "Bell",
                title: "Статус заказа",
                desc: "Вы получите email-уведомление на каждом этапе: оформление, отправка, прибытие. Всегда знаете, где ваш заказ.",
                num: "03",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-3xl p-8 shadow-sm relative overflow-hidden hover-lift">
                <span className="absolute top-4 right-4 font-display text-5xl font-bold text-elm-crimson/10">
                  {item.num}
                </span>
                <div className="w-14 h-14 bg-elm-crimson/10 rounded-2xl flex items-center justify-center mb-6">
                  <Icon name={item.icon} fallback="Star" size={24} className="text-elm-crimson" />
                </div>
                <h3 className="font-display text-2xl font-bold text-elm-dark mb-3">{item.title}</h3>
                <p className="text-elm-dark/60 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-elm-crimson rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display text-3xl font-bold text-white">Бесплатная доставка</p>
              <p className="text-white/70 mt-1">при заказе от 5 000 ₽</p>
            </div>
            <button
              onClick={() => scrollTo("catalog")}
              className="bg-white text-elm-crimson px-8 py-4 rounded-full font-semibold hover:bg-elm-blush transition-colors whitespace-nowrap"
            >
              Выбрать цветы
            </button>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-elm-crimson font-medium text-sm uppercase tracking-widest">Клиенты о нас</span>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-elm-dark mt-2">Отзывы</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((r) => (
            <div key={r.name} className="bg-white rounded-3xl p-8 shadow-sm hover-lift">
              <div className="flex items-center gap-1 mb-4">
                {Array(r.stars).fill(null).map((_, i) => (
                  <span key={i} className="text-elm-gold text-lg">★</span>
                ))}
              </div>
              <p className="text-elm-dark/70 leading-relaxed italic font-display text-lg mb-6">
                «{r.text}»
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-elm-crimson rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{r.name[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-elm-dark text-sm">{r.name}</p>
                  <p className="text-elm-dark/40 text-xs">{r.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section className="py-16 bg-elm-dark">
        <div className="max-w-2xl mx-auto px-4 md:px-8 text-center">
          <span className="text-elm-gold font-medium text-sm uppercase tracking-widest">Оставайтесь в курсе</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Новые коллекции<br />первыми
          </h2>
          <p className="text-white/50 mb-8">
            Подпишитесь и получайте уведомления о новых коллекциях, акциях и специальных предложениях
          </p>
          {subscribed ? (
            <div className="bg-white/10 rounded-2xl p-6 border border-elm-gold/30">
              <Icon name="CheckCircle" size={40} className="text-elm-gold mx-auto mb-3" />
              <p className="text-white font-semibold text-lg">Вы подписаны!</p>
              <p className="text-white/50 text-sm mt-1">Ждите письмо на {email}</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email"
                required
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/40 focus:outline-none focus:border-elm-gold"
              />
              <button
                type="submit"
                className="bg-elm-crimson text-white px-8 py-4 rounded-xl font-semibold hover:bg-elm-coral transition-colors whitespace-nowrap"
              >
                Подписаться
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-elm-crimson font-medium text-sm uppercase tracking-widest">Мы рядом</span>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-elm-dark mt-2">Контакты</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: "Phone", label: "Телефон", value: "+7 (900) 000-00-00", sub: "Пн–Пт 9:00–19:00" },
                { icon: "Mail", label: "Email", value: "info@elmira-flowers.ru", sub: "Ответим за 2 часа" },
                { icon: "Instagram", label: "Instagram", value: "@elmira.flowers", sub: "Подписывайтесь!" },
                { icon: "MapPin", label: "Адрес", value: "Москва", sub: "Работаем по всей России" },
              ].map((c) => (
                <div key={c.label} className="bg-white rounded-2xl p-6 shadow-sm hover-lift">
                  <div className="w-10 h-10 bg-elm-crimson/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon name={c.icon} fallback="Star" size={20} className="text-elm-crimson" />
                  </div>
                  <p className="text-elm-dark/40 text-xs uppercase tracking-wider mb-1">{c.label}</p>
                  <p className="font-semibold text-elm-dark text-sm">{c.value}</p>
                  <p className="text-elm-dark/40 text-xs mt-1">{c.sub}</p>
                </div>
              ))}
            </div>
            <div className="bg-elm-dark rounded-3xl p-8 text-white">
              <h3 className="font-display text-3xl font-bold mb-2">Напишите нам</h3>
              <p className="text-white/50 mb-6 text-sm">Ответим в течение 2 часов</p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  placeholder="Ваше имя"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-elm-gold"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-elm-gold"
                />
                <textarea
                  placeholder="Ваше сообщение"
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-elm-gold resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-elm-crimson text-white py-4 rounded-xl font-semibold hover:bg-elm-coral transition-colors"
                >
                  Отправить сообщение
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-elm-dark border-t border-white/10 py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display text-3xl font-bold text-elm-crimson">Эльмира</p>
            <p className="text-white/40 text-sm mt-1">Восковые цветы ручной работы</p>
          </div>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-white/50 hover:text-white text-sm transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="text-white/30 text-xs">© 2024 Эльмира. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}