import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ───
const ROUTES = [
  { from: "Vizag", to: "Araku Valley", sedan: 3500, suv: 5000, innova: 5500, km: 115, duration: "3h 30m", popular: true },
  { from: "Vizag", to: "Hyderabad", sedan: 7500, suv: 10000, innova: 11000, km: 620, duration: "9h", popular: true },
  { from: "Vizag", to: "Rajahmundry", sedan: 3000, suv: 4500, innova: 5000, km: 190, duration: "3h 45m", popular: false },
  { from: "Vizag", to: "Tirupati", sedan: 8000, suv: 11000, innova: 12000, km: 700, duration: "10h", popular: true },
  { from: "Vizag", to: "Vijayawada", sedan: 5000, suv: 7000, innova: 7500, km: 350, duration: "5h 30m", popular: true },
  { from: "Vizag", to: "Srisailam", sedan: 7000, suv: 9500, innova: 10500, km: 550, duration: "8h", popular: false },
  { from: "Vizag", to: "Bhadrachalam", sedan: 5500, suv: 7500, innova: 8000, km: 380, duration: "6h", popular: false },
  { from: "Vizag", to: "Kakinada", sedan: 2800, suv: 4000, innova: 4500, km: 165, duration: "3h", popular: false },
  { from: "Vizag Airport", to: "City Center", sedan: 800, suv: 1200, innova: 1400, km: 18, duration: "35m", popular: true },
  { from: "Vizag", to: "Simhachalam Temple", sedan: 500, suv: 800, innova: 900, km: 16, duration: "30m", popular: false },
  { from: "Vizag", to: "Borra Caves", sedan: 3200, suv: 4800, innova: 5200, km: 92, duration: "3h", popular: true },
  { from: "Vizag", to: "Lambasingi", sedan: 3000, suv: 4500, innova: 5000, km: 100, duration: "3h 15m", popular: false },
];

const SERVICES = [
  { icon: "✈️", title: "Airport Transfers", desc: "Flight-tracked pickups & drops at Vizag Airport. Pre-book for zero wait time. Fixed fares, no surge.", tag: "MOST BOOKED" },
  { icon: "🏔️", title: "Outstation Trips", desc: "One-way & round trips to Araku, Hyderabad, Tirupati & 50+ cities. Transparent per-km pricing.", tag: "POPULAR" },
  { icon: "🕐", title: "Hourly Rentals", desc: "4hr, 8hr, 12hr packages for shopping, meetings, hospital visits. Use as you need within the city.", tag: null },
  { icon: "💒", title: "Wedding Convoy", desc: "Decorated cars & coordinated convoy for weddings, receptions & functions. Premium fleet available.", tag: null },
  { icon: "🏖️", title: "Vizag Sightseeing", desc: "Full-day curated tours — RK Beach, Kailasagiri, Submarine Museum, Borra Caves & more.", tag: "TOURIST FAVORITE" },
  { icon: "🏢", title: "Corporate Plans", desc: "Monthly employee transport, executive car service & dedicated fleet for businesses.", tag: null },
  { icon: "🚐", title: "Group Travel", desc: "Tempo travellers for 12-17 passengers. Perfect for pilgrimages, family trips & team outings.", tag: null },
  { icon: "🔄", title: "Round Trip Packages", desc: "Multi-day packages with driver stay included. Best rates for 2-5 day trips from Vizag.", tag: "BEST VALUE" },
];

const FLEET = [
  { name: "Sedan", models: "Dzire · Amaze · Etios", seats: 4, bags: 2, rate: 11, best: "City rides & couples", color: "#3b82f6" },
  { name: "SUV", models: "Ertiga · Marazzo · XUV", seats: 6, bags: 3, rate: 14, best: "Family trips", color: "#8b5cf6" },
  { name: "Innova", models: "Innova · Crysta", seats: 7, bags: 4, rate: 16, best: "Premium & long trips", color: "#f59e0b" },
  { name: "Tempo", models: "Force Traveller", seats: 17, bags: 10, rate: 22, best: "Group & events", color: "#10b981" },
];

const STEPS = [
  { num: "01", title: "Tell Us Your Trip", desc: "Share pickup, drop, date & car preference" },
  { num: "02", title: "Get Instant Quote", desc: "Transparent fare with no hidden charges" },
  { num: "03", title: "Confirm & Relax", desc: "Driver details shared before pickup" },
  { num: "04", title: "Enjoy Your Ride", desc: "Clean car, professional driver, safe journey" },
];

const TESTIMONIALS = [
  { name: "Rajesh Kumar", location: "Vizag → Araku", text: "Driver was on time, car was spotless. The Araku valley drive was beautiful and stress-free. Karun Cabs is my go-to now.", rating: 5, avatar: "R" },
  { name: "Priya Sharma", location: "Airport Transfer", text: "4 AM flight — driver was waiting 15 minutes early. Tracked my flight delay and adjusted. Exceptional service!", rating: 5, avatar: "P" },
  { name: "Suresh Babu", location: "Wedding Convoy", text: "Arranged 8 cars for my daughter's wedding. Every car was decorated perfectly and arrived on time. Thank you team!", rating: 5, avatar: "S" },
  { name: "Deepika Reddy", location: "Vizag → Hyderabad", text: "Long drive but the Innova was super comfortable. Driver knew all the good food stops. Will book again for sure.", rating: 5, avatar: "D" },
  { name: "Anil Varma", location: "Corporate Monthly", text: "Using Karun Cabs for our office transport. Reliable, punctual, and the monthly billing is very convenient.", rating: 5, avatar: "A" },
];

// ─── HOOKS ───
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, direction = "up" }) {
  const [ref, visible] = useInView();
  const transforms = { up: "translateY(50px)", down: "translateY(-50px)", left: "translateX(50px)", right: "translateX(-50px)", scale: "scale(0.9)" };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : transforms[direction],
      transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
    }}>{children}</div>
  );
}

// ─── MAIN ───
export default function KarunCabsPremium() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFleet, setSelectedFleet] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [fareCalc, setFareCalc] = useState({ km: "", type: 0 });
  const [bookingStep, setBookingStep] = useState(0);
  const [booking, setBooking] = useState({ pickup: "", drop: "", date: "", time: "", car: "Sedan", name: "", phone: "", tripType: "one-way" });

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  const calcFare = () => {
    if (!fareCalc.km) return 0;
    return Math.round(Number(fareCalc.km) * FLEET[fareCalc.type].rate);
  };

  const whatsappBook = () => {
    const msg = `Hi Karun Cabs! 🚕\n\n📍 Pickup: ${booking.pickup}\n📍 Drop: ${booking.drop}\n📅 Date: ${booking.date}\n⏰ Time: ${booking.time}\n🚗 Car: ${booking.car}\n↔️ Trip: ${booking.tripType}\n👤 Name: ${booking.name}\n📱 Phone: ${booking.phone}`;
    window.open(`https://wa.me/917981080813?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const whatsappGeneral = () => window.open(`https://wa.me/917981080813?text=${encodeURIComponent("Hi! I'd like to book a cab in Vizag.")}`, "_blank");

  const filteredRoutes = activeTab === "all" ? ROUTES : activeTab === "popular" ? ROUTES.filter(r => r.popular) : ROUTES.filter(r => r.to.toLowerCase().includes("airport") || r.from.toLowerCase().includes("airport"));

  const NAV = ["home", "services", "fleet", "routes", "fare", "booking", "contact"];

  return (
    <div style={{ background: "#050508", color: "#eaeaea", fontFamily: "'Satoshi', 'General Sans', system-ui, sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', system-ui, sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #d4a853, #b8903a); border-radius: 2px; }
        ::-webkit-scrollbar-track { background: #050508; }

        @keyframes float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(1deg); } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.6); } 100% { box-shadow: 0 0 0 20px rgba(37,211,102,0); } }
        @keyframes grain { 0%,100% { transform: translate(0,0); } 10% { transform: translate(-5%,-10%); } 30% { transform: translate(3%,-15%); } 50% { transform: translate(-10%,5%); } 70% { transform: translate(8%,10%); } 90% { transform: translate(-3%,8%); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes fadeSlide { 0% { opacity:0; transform: translateY(20px); } 100% { opacity:1; transform: translateY(0); } }
        @keyframes glow { 0%,100% { opacity:0.4; } 50% { opacity:0.7; } }

        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.06); }
        .glass-strong { background: rgba(255,255,255,0.05); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.08); }

        .btn-gold { background: linear-gradient(135deg, #d4a853, #c49a45, #b8903a); color: #050508; border: none; padding: 15px 36px; border-radius: 60px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); font-family: 'DM Sans', sans-serif; letter-spacing: 0.8px; text-transform: uppercase; }
        .btn-gold:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(212,168,83,0.3); }
        .btn-ghost { background: transparent; color: #d4a853; border: 1.5px solid rgba(212,168,83,0.4); padding: 14px 34px; border-radius: 60px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.4s; font-family: 'DM Sans', sans-serif; letter-spacing: 0.5px; }
        .btn-ghost:hover { background: rgba(212,168,83,0.1); border-color: #d4a853; }

        .field { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #eaeaea; padding: 14px 18px; border-radius: 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; width: 100%; outline: none; transition: all 0.3s; }
        .field:focus { border-color: rgba(212,168,83,0.5); background: rgba(255,255,255,0.06); box-shadow: 0 0 0 3px rgba(212,168,83,0.08); }
        .field::placeholder { color: rgba(255,255,255,0.2); }
        select.field { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23d4a853' d='M5 7L0 2h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; }
        select.field option { background: #111; color: #eaeaea; }

        .nav-item { color: rgba(255,255,255,0.45); font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; padding: 8px 14px; border-radius: 8px; transition: all 0.3s; }
        .nav-item:hover { color: #d4a853; background: rgba(212,168,83,0.06); }

        .section-label { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #d4a853; margin-bottom: 12px; display: flex; align-items: center; gap: 12px; }
        .section-label::before { content: ''; width: 30px; height: 1px; background: linear-gradient(90deg, transparent, #d4a853); }

        .serif { font-family: 'Playfair Display', Georgia, serif; }

        .whatsapp-btn { position: fixed; bottom: 28px; right: 28px; width: 62px; height: 62px; border-radius: 50%; background: #25d366; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999; animation: pulse-ring 2s infinite; box-shadow: 0 6px 24px rgba(37,211,102,0.35); border: none; transition: transform 0.3s; }
        .whatsapp-btn:hover { transform: scale(1.12); }

        .call-btn { position: fixed; bottom: 28px; left: 28px; height: 50px; border-radius: 25px; background: linear-gradient(135deg, #d4a853, #b8903a); display: flex; align-items: center; gap: 10px; padding: 0 22px; cursor: pointer; z-index: 999; text-decoration: none; box-shadow: 0 6px 24px rgba(212,168,83,0.25); transition: all 0.3s; border: none; }
        .call-btn:hover { transform: scale(1.05); box-shadow: 0 8px 32px rgba(212,168,83,0.4); }

        .grain-overlay { position: fixed; top: -50%; left: -50%; width: 200%; height: 200%; pointer-events: none; z-index: 9999; opacity: 0.015; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); animation: grain 8s steps(10) infinite; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mob-btn { display: flex !important; }
          .hero-flex { flex-direction: column !important; text-align: center !important; }
          .hero-h1 { font-size: 38px !important; }
          .section-h2 { font-size: 32px !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hide-mob { display: none !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-row { gap: 24px !important; }
          .section-label { justify-content: center; }
          .hero-btns { justify-content: center !important; }
        }
        @media (min-width: 769px) {
          .mob-btn { display: none !important; }
          .mob-nav { display: none !important; }
        }
      `}</style>

      <div className="grain-overlay" />

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", transition: "all 0.4s",
        background: scrolled ? "rgba(5,5,8,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.04)" : "1px solid transparent",
      }}>
        <div onClick={() => scrollTo("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "10px",
            background: "linear-gradient(135deg, #d4a853, #b8903a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", fontWeight: 900, color: "#050508",
            fontFamily: "'Playfair Display', serif",
          }}>K</div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", letterSpacing: "1px" }}>KARUN</div>
            <div style={{ fontSize: "9px", fontWeight: 600, color: "rgba(212,168,83,0.7)", letterSpacing: "3px" }}>CABS</div>
          </div>
        </div>

        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {NAV.map(n => <span key={n} className="nav-item" onClick={() => scrollTo(n)}>{n}</span>)}
          <button className="btn-gold" onClick={() => scrollTo("booking")} style={{ marginLeft: "16px", padding: "10px 28px", fontSize: "11px" }}>Book Now</button>
        </div>

        <button className="mob-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "flex", flexDirection: "column", gap: "5px", cursor: "pointer", background: "none", border: "none", padding: "8px",
        }}>
          <span style={{ width: "22px", height: "1.5px", background: "#d4a853", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translateY(6.5px)" : "none" }} />
          <span style={{ width: "22px", height: "1.5px", background: "#d4a853", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ width: "22px", height: "1.5px", background: "#d4a853", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-6.5px)" : "none" }} />
        </button>
      </nav>

      {menuOpen && (
        <div className="mob-nav" style={{
          position: "fixed", inset: 0, background: "rgba(5,5,8,0.96)", backdropFilter: "blur(30px)",
          zIndex: 998, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px",
        }}>
          {NAV.map(n => <span key={n} className="nav-item" onClick={() => scrollTo(n)} style={{ fontSize: "16px" }}>{n.charAt(0).toUpperCase() + n.slice(1)}</span>)}
          <button className="btn-gold" onClick={() => { scrollTo("booking"); setMenuOpen(false); }}>Book Now</button>
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section id="home" style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "120px 32px 80px", position: "relative", overflow: "hidden",
      }}>
        {/* Background orbs */}
        <div style={{ position: "absolute", top: "10%", right: "5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,168,83,0.07) 0%, transparent 70%)", animation: "glow 6s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "10%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "60%", right: "30%", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="hero-flex" style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: "60px", position: "relative" }}>
          <div style={{ flex: 1.2 }}>
            <Reveal>
              <div className="section-label" style={{ marginBottom: "20px" }}>
                Visakhapatnam's Premium Cab Service
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="hero-h1 serif" style={{ fontSize: "56px", fontWeight: 900, lineHeight: 1.05, color: "#fff", marginBottom: "24px" }}>
                Travel Vizag<br />
                <span style={{ color: "#d4a853", fontStyle: "italic" }}>in Style</span> &<br />
                Comfort
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px", lineHeight: 1.8, marginBottom: "36px", maxWidth: "460px" }}>
                Premium cabs for airport transfers, outstation journeys, city rides
                & special occasions. Professional drivers. Transparent fares. Available 24/7.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="hero-btns" style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <button className="btn-gold" onClick={() => scrollTo("booking")}>Book Your Ride</button>
                <button className="btn-ghost" onClick={whatsappGeneral} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp Us
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.45}>
              <div className="stats-row" style={{
                display: "flex", gap: "48px", marginTop: "56px",
                borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "32px",
              }}>
                {[
                  { val: "5+", label: "Years Experience" },
                  { val: "24/7", label: "Always Available" },
                  { val: "1000+", label: "Happy Riders" },
                  { val: "50+", label: "Routes Covered" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="serif" style={{ fontSize: "28px", fontWeight: 800, color: "#d4a853" }}>{s.val}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontWeight: 500, letterSpacing: "0.5px", marginTop: "4px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="hide-mob" style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Reveal delay={0.3} direction="scale">
              <div style={{
                width: "380px", height: "380px", borderRadius: "50%", position: "relative",
                background: "radial-gradient(circle at 30% 30%, rgba(212,168,83,0.08), transparent 60%)",
                border: "1px solid rgba(212,168,83,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "float 6s ease-in-out infinite",
              }}>
                <div style={{
                  position: "absolute", inset: "20px", borderRadius: "50%",
                  border: "1px dashed rgba(212,168,83,0.12)",
                }} />
                <span style={{ fontSize: "120px", filter: "drop-shadow(0 20px 40px rgba(212,168,83,0.15))" }}>🚕</span>
                {/* Floating badges */}
                <div style={{
                  position: "absolute", top: "20px", right: "20px",
                  padding: "8px 14px", borderRadius: "10px", fontSize: "11px", fontWeight: 700,
                }} className="glass-strong">
                  <span style={{ color: "#25d366" }}>●</span> <span style={{ color: "rgba(255,255,255,0.6)" }}>Online Now</span>
                </div>
                <div className="glass-strong" style={{
                  position: "absolute", bottom: "40px", left: "-10px",
                  padding: "10px 16px", borderRadius: "12px", fontSize: "12px",
                }}>
                  <div style={{ color: "#d4a853", fontWeight: 700 }}>₹11/km</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>Starting fare</div>
                </div>
                <div className="glass-strong" style={{
                  position: "absolute", bottom: "100px", right: "-20px",
                  padding: "10px 16px", borderRadius: "12px",
                }}>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#d4a853", fontSize: "12px" }}>★</span>)}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", marginTop: "2px" }}>4.9 Rating</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "16px 0", background: "rgba(212,168,83,0.02)" }}>
        <div style={{ display: "flex", animation: "marquee 30s linear infinite", whiteSpace: "nowrap" }}>
          {[...Array(2)].map((_, rep) => (
            <div key={rep} style={{ display: "flex", gap: "48px", marginRight: "48px" }}>
              {["Airport Transfers", "Araku Valley", "Outstation Trips", "Wedding Convoy", "City Rides", "Borra Caves", "Corporate Travel", "Sightseeing Tours", "Tirupati", "Hyderabad", "Group Travel", "24/7 Service"].map((t, i) => (
                <span key={i} style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.15)", letterSpacing: "1px" }}>
                  {t} <span style={{ color: "rgba(212,168,83,0.3)", margin: "0 4px" }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SERVICES ═══ */}
      <section id="services" style={{ padding: "100px 32px", background: "#050508" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <div className="section-label" style={{ justifyContent: "center" }}>Our Services</div>
              <h2 className="section-h2 serif" style={{ fontSize: "42px", fontWeight: 800, color: "#fff" }}>Everything You Need,<br /><span style={{ color: "#d4a853", fontStyle: "italic" }}>One Call Away</span></h2>
            </div>
          </Reveal>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="glass" style={{
                  borderRadius: "18px", padding: "28px 22px", height: "100%",
                  transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)", cursor: "default", position: "relative", overflow: "hidden",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,168,83,0.2)"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {s.tag && <span style={{ position: "absolute", top: "14px", right: "14px", fontSize: "8px", fontWeight: 700, letterSpacing: "1px", color: "#d4a853", background: "rgba(212,168,83,0.1)", padding: "4px 8px", borderRadius: "6px" }}>{s.tag}</span>}
                  <span style={{ fontSize: "32px", display: "block", marginBottom: "16px" }}>{s.icon}</span>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{s.title}</h3>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: "80px 32px", background: "rgba(212,168,83,0.02)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="section-label" style={{ justifyContent: "center" }}>How It Works</div>
              <h2 className="section-h2 serif" style={{ fontSize: "42px", fontWeight: 800, color: "#fff" }}>Book in <span style={{ color: "#d4a853", fontStyle: "italic" }}>4 Simple</span> Steps</h2>
            </div>
          </Reveal>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {STEPS.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ textAlign: "center", position: "relative" }}>
                  <div className="serif" style={{ fontSize: "48px", fontWeight: 900, color: "rgba(212,168,83,0.08)", marginBottom: "-10px" }}>{s.num}</div>
                  <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>{s.title}</h4>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FLEET ═══ */}
      <section id="fleet" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <div className="section-label" style={{ justifyContent: "center" }}>Our Fleet</div>
              <h2 className="section-h2 serif" style={{ fontSize: "42px", fontWeight: 800, color: "#fff" }}>Choose Your <span style={{ color: "#d4a853", fontStyle: "italic" }}>Perfect</span> Ride</h2>
            </div>
          </Reveal>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {FLEET.map((f, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  onClick={() => setSelectedFleet(i)}
                  style={{
                    borderRadius: "20px", padding: "32px 22px", textAlign: "center",
                    cursor: "pointer", transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                    background: selectedFleet === i ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
                    border: selectedFleet === i ? `1px solid ${f.color}33` : "1px solid rgba(255,255,255,0.05)",
                    transform: selectedFleet === i ? "translateY(-8px)" : "none",
                    boxShadow: selectedFleet === i ? `0 20px 60px ${f.color}15` : "none",
                  }}
                >
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "50%", margin: "0 auto 18px",
                    background: `${f.color}12`, border: `1px solid ${f.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "28px",
                  }}>
                    {["🚗", "🚙", "🚐", "🚌"][i]}
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", marginBottom: "2px" }}>{f.name}</h3>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginBottom: "18px" }}>{f.models}</p>

                  <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "18px" }}>
                    <div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>Seats</div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>{f.seats}</div>
                    </div>
                    <div style={{ width: "1px", background: "rgba(255,255,255,0.06)" }} />
                    <div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>Bags</div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>{f.bags}</div>
                    </div>
                  </div>

                  <div style={{
                    background: `${f.color}10`, borderRadius: "10px", padding: "10px",
                    border: `1px solid ${f.color}15`,
                  }}>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: f.color }}>₹{f.rate}<span style={{ fontSize: "12px", fontWeight: 500 }}>/km</span></div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", marginTop: "2px" }}>{f.best}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ROUTES ═══ */}
      <section id="routes" style={{ padding: "100px 32px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="section-label" style={{ justifyContent: "center" }}>Route Pricing</div>
              <h2 className="section-h2 serif" style={{ fontSize: "42px", fontWeight: 800, color: "#fff" }}>Popular Routes <span style={{ color: "#d4a853", fontStyle: "italic" }}>& Fares</span></h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
              {[["all", "All Routes"], ["popular", "Popular"], ["airport", "Airport"]].map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)} style={{
                  padding: "9px 22px", borderRadius: "30px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  border: activeTab === key ? "1px solid rgba(212,168,83,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  background: activeTab === key ? "rgba(212,168,83,0.1)" : "rgba(255,255,255,0.02)",
                  color: activeTab === key ? "#d4a853" : "rgba(255,255,255,0.35)",
                  transition: "all 0.3s", fontFamily: "'DM Sans', sans-serif",
                }}>{label}</button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div style={{ borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                      {["Route", "Distance", "Duration", "Sedan", "SUV", "Innova", ""].map((h, i) => (
                        <th key={i} style={{ padding: "16px", fontSize: "10px", fontWeight: 700, color: "rgba(212,168,83,0.7)", letterSpacing: "2px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoutes.map((r, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(212,168,83,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                          {r.from} <span style={{ color: "rgba(212,168,83,0.5)", margin: "0 6px" }}>→</span> {r.to}
                          {r.popular && <span style={{ marginLeft: "8px", fontSize: "8px", background: "rgba(212,168,83,0.1)", color: "#d4a853", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>HOT</span>}
                        </td>
                        <td style={{ padding: "16px", fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>{r.km} km</td>
                        <td style={{ padding: "16px", fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>{r.duration}</td>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: 700, color: "#3b82f6" }}>₹{r.sedan.toLocaleString()}</td>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: 700, color: "#8b5cf6" }}>₹{r.suv.toLocaleString()}</td>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: 700, color: "#f59e0b" }}>₹{r.innova.toLocaleString()}</td>
                        <td style={{ padding: "16px" }}>
                          <button className="btn-gold" onClick={() => { setBooking({ ...booking, pickup: r.from, drop: r.to }); scrollTo("booking"); }} style={{ padding: "8px 18px", fontSize: "10px", borderRadius: "8px" }}>Book</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.15)", marginTop: "14px" }}>
              * Fares are approximate one-way. Toll, parking & 5% GST extra. Final fare confirmed at booking.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ FARE CALCULATOR ═══ */}
      <section id="fare" style={{ padding: "80px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div className="section-label" style={{ justifyContent: "center" }}>Fare Estimator</div>
              <h2 className="section-h2 serif" style={{ fontSize: "36px", fontWeight: 800, color: "#fff" }}>Quick Fare <span style={{ color: "#d4a853", fontStyle: "italic" }}>Calculator</span></h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass-strong" style={{ borderRadius: "22px", padding: "36px 28px" }}>
              <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontWeight: 600, marginBottom: "6px", display: "block", letterSpacing: "1px" }}>DISTANCE (KM)</label>
                  <input className="field" type="number" placeholder="e.g. 120" value={fareCalc.km} onChange={e => setFareCalc({ ...fareCalc, km: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontWeight: 600, marginBottom: "6px", display: "block", letterSpacing: "1px" }}>CAR TYPE</label>
                  <select className="field" value={fareCalc.type} onChange={e => setFareCalc({ ...fareCalc, type: Number(e.target.value) })}>
                    {FLEET.map((f, i) => <option key={i} value={i}>{f.name} — ₹{f.rate}/km</option>)}
                  </select>
                </div>
              </div>
              <div style={{
                background: "rgba(212,168,83,0.06)", borderRadius: "16px", padding: "24px",
                border: "1px solid rgba(212,168,83,0.1)", textAlign: "center",
              }}>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginBottom: "4px", letterSpacing: "1px" }}>ESTIMATED FARE</div>
                <div className="serif" style={{ fontSize: "48px", fontWeight: 900, color: "#d4a853" }}>
                  ₹{calcFare().toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "4px" }}>+ toll, parking & 5% GST</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ BOOKING ═══ */}
      <section id="booking" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="section-label" style={{ justifyContent: "center" }}>Reserve Your Ride</div>
              <h2 className="section-h2 serif" style={{ fontSize: "42px", fontWeight: 800, color: "#fff" }}>Book <span style={{ color: "#d4a853", fontStyle: "italic" }}>Now</span></h2>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", marginTop: "8px" }}>Fill your trip details — we'll confirm instantly via WhatsApp</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass-strong" style={{ borderRadius: "24px", padding: "40px 32px" }}>
              {/* Step indicators */}
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "32px" }}>
                {["Trip Details", "Car & Time", "Your Info"].map((step, i) => (
                  <div key={i} onClick={() => setBookingStep(i)} style={{
                    display: "flex", alignItems: "center", gap: "8px", cursor: "pointer",
                    padding: "8px 16px", borderRadius: "20px",
                    background: bookingStep === i ? "rgba(212,168,83,0.1)" : "transparent",
                    border: bookingStep === i ? "1px solid rgba(212,168,83,0.2)" : "1px solid transparent",
                    transition: "all 0.3s",
                  }}>
                    <div style={{
                      width: "22px", height: "22px", borderRadius: "50%", fontSize: "11px", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: bookingStep >= i ? "#d4a853" : "rgba(255,255,255,0.08)",
                      color: bookingStep >= i ? "#050508" : "rgba(255,255,255,0.2)",
                    }}>{i + 1}</div>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: bookingStep === i ? "#d4a853" : "rgba(255,255,255,0.25)" }}>{step}</span>
                  </div>
                ))}
              </div>

              {/* Step 1 */}
              {bookingStep === 0 && (
                <div style={{ animation: "fadeSlide 0.4s ease" }}>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontWeight: 600, marginBottom: "6px", display: "block", letterSpacing: "1px" }}>PICKUP LOCATION</label>
                    <input className="field" placeholder="e.g. Dwaraka Nagar, Vizag Airport..." value={booking.pickup} onChange={e => setBooking({ ...booking, pickup: e.target.value })} />
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontWeight: 600, marginBottom: "6px", display: "block", letterSpacing: "1px" }}>DROP LOCATION</label>
                    <input className="field" placeholder="e.g. Araku Valley, Hyderabad..." value={booking.drop} onChange={e => setBooking({ ...booking, drop: e.target.value })} />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontWeight: 600, marginBottom: "8px", display: "block", letterSpacing: "1px" }}>TRIP TYPE</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {["one-way", "round-trip"].map(t => (
                        <button key={t} onClick={() => setBooking({ ...booking, tripType: t })} style={{
                          flex: 1, padding: "12px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                          background: booking.tripType === t ? "rgba(212,168,83,0.1)" : "rgba(255,255,255,0.03)",
                          border: booking.tripType === t ? "1px solid rgba(212,168,83,0.3)" : "1px solid rgba(255,255,255,0.06)",
                          color: booking.tripType === t ? "#d4a853" : "rgba(255,255,255,0.3)",
                          fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s",
                        }}>{t === "one-way" ? "↗ One Way" : "↔ Round Trip"}</button>
                      ))}
                    </div>
                  </div>
                  <button className="btn-gold" onClick={() => setBookingStep(1)} style={{ width: "100%" }}>Continue →</button>
                </div>
              )}

              {/* Step 2 */}
              {bookingStep === 1 && (
                <div style={{ animation: "fadeSlide 0.4s ease" }}>
                  <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontWeight: 600, marginBottom: "6px", display: "block", letterSpacing: "1px" }}>DATE</label>
                      <input className="field" type="date" value={booking.date} onChange={e => setBooking({ ...booking, date: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontWeight: 600, marginBottom: "6px", display: "block", letterSpacing: "1px" }}>TIME</label>
                      <input className="field" type="time" value={booking.time} onChange={e => setBooking({ ...booking, time: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontWeight: 600, marginBottom: "8px", display: "block", letterSpacing: "1px" }}>SELECT CAR</label>
                    <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      {FLEET.map((f, i) => (
                        <div key={i} onClick={() => setBooking({ ...booking, car: f.name })} style={{
                          padding: "14px", borderRadius: "14px", cursor: "pointer", textAlign: "center", transition: "all 0.3s",
                          background: booking.car === f.name ? "rgba(212,168,83,0.1)" : "rgba(255,255,255,0.02)",
                          border: booking.car === f.name ? "1px solid rgba(212,168,83,0.3)" : "1px solid rgba(255,255,255,0.05)",
                        }}>
                          <div style={{ fontSize: "24px", marginBottom: "4px" }}>{["🚗", "🚙", "🚐", "🚌"][i]}</div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: booking.car === f.name ? "#d4a853" : "#fff" }}>{f.name}</div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>₹{f.rate}/km</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn-ghost" onClick={() => setBookingStep(0)} style={{ flex: 1 }}>← Back</button>
                    <button className="btn-gold" onClick={() => setBookingStep(2)} style={{ flex: 2 }}>Continue →</button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {bookingStep === 2 && (
                <div style={{ animation: "fadeSlide 0.4s ease" }}>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontWeight: 600, marginBottom: "6px", display: "block", letterSpacing: "1px" }}>YOUR NAME</label>
                    <input className="field" placeholder="Full name" value={booking.name} onChange={e => setBooking({ ...booking, name: e.target.value })} />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontWeight: 600, marginBottom: "6px", display: "block", letterSpacing: "1px" }}>PHONE NUMBER</label>
                    <input className="field" type="tel" placeholder="e.g. 9876543210" value={booking.phone} onChange={e => setBooking({ ...booking, phone: e.target.value })} />
                  </div>

                  {/* Summary */}
                  <div style={{ background: "rgba(212,168,83,0.04)", borderRadius: "14px", padding: "18px", marginBottom: "20px", border: "1px solid rgba(212,168,83,0.08)" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a853", marginBottom: "10px", letterSpacing: "1px" }}>BOOKING SUMMARY</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px" }}>
                      {[
                        ["Pickup", booking.pickup || "—"],
                        ["Drop", booking.drop || "—"],
                        ["Date", booking.date || "—"],
                        ["Time", booking.time || "—"],
                        ["Car", booking.car],
                        ["Trip", booking.tripType],
                      ].map(([k, v], i) => (
                        <div key={i}><span style={{ color: "rgba(255,255,255,0.2)" }}>{k}: </span><span style={{ color: "#fff", fontWeight: 600 }}>{v}</span></div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button className="btn-ghost" onClick={() => setBookingStep(1)} style={{ flex: 1, minWidth: "120px" }}>← Back</button>
                    <button className="btn-gold" onClick={whatsappBook} style={{ flex: 2, minWidth: "200px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#050508"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Confirm via WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section style={{ padding: "100px 32px", background: "rgba(212,168,83,0.02)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="section-label" style={{ justifyContent: "center" }}>Testimonials</div>
              <h2 className="section-h2 serif" style={{ fontSize: "42px", fontWeight: 800, color: "#fff" }}>Riders <span style={{ color: "#d4a853", fontStyle: "italic" }}>Love</span> Us</h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass-strong" style={{ borderRadius: "22px", padding: "36px 32px", position: "relative", minHeight: "200px" }}>
              <div style={{ fontSize: "48px", color: "rgba(212,168,83,0.15)", position: "absolute", top: "16px", left: "28px", fontFamily: "Georgia, serif" }}>"</div>
              <div key={testimonialIdx} style={{ animation: "fadeSlide 0.5s ease" }}>
                <div style={{ display: "flex", gap: "2px", marginBottom: "16px" }}>
                  {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#d4a853", fontSize: "14px" }}>★</span>)}
                </div>
                <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: "24px", fontStyle: "italic" }}>
                  {TESTIMONIALS[testimonialIdx].text}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #d4a853, #b8903a)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", fontWeight: 800, color: "#050508",
                  }}>{TESTIMONIALS[testimonialIdx].avatar}</div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{TESTIMONIALS[testimonialIdx].name}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>{TESTIMONIALS[testimonialIdx].location}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "24px" }}>
                {TESTIMONIALS.map((_, i) => (
                  <div key={i} onClick={() => setTestimonialIdx(i)} style={{
                    width: i === testimonialIdx ? "24px" : "8px", height: "8px", borderRadius: "4px",
                    background: i === testimonialIdx ? "#d4a853" : "rgba(255,255,255,0.1)",
                    cursor: "pointer", transition: "all 0.3s",
                  }} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div className="section-label" style={{ justifyContent: "center" }}>Contact</div>
              <h2 className="section-h2 serif" style={{ fontSize: "42px", fontWeight: 800, color: "#fff" }}>Get In <span style={{ color: "#d4a853", fontStyle: "italic" }}>Touch</span></h2>
            </div>
          </Reveal>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { icon: "📞", title: "Call Us", sub: "24/7 Available", value: "7981080813", link: "tel:7981080813" },
              { icon: "💬", title: "WhatsApp", sub: "Instant Reply", value: "Chat Now", link: null, action: whatsappGeneral },
              { icon: "✉️", title: "Email", sub: "We respond fast", value: "karun@karuncabs.com", link: "mailto:karun@karuncabs.com" },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div onClick={c.action || (() => c.link && window.open(c.link))} className="glass" style={{
                  borderRadius: "20px", padding: "36px 24px", textAlign: "center", cursor: "pointer",
                  transition: "all 0.4s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,168,83,0.2)"; e.currentTarget.style.transform = "translateY(-6px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "none"; }}
                >
                  <span style={{ fontSize: "36px", display: "block", marginBottom: "16px" }}>{c.icon}</span>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{c.title}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginBottom: "12px" }}>{c.sub}</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#d4a853" }}>{c.value}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "60px 32px 28px", background: "#030305", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="footer-grid" style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "40px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #d4a853, #b8903a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 900, color: "#050508", fontFamily: "'Playfair Display', serif" }}>K</div>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff", letterSpacing: "1px" }}>KARUN CABS</span>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", lineHeight: 1.8, maxWidth: "280px" }}>
              Visakhapatnam's premium cab service. Reliable rides for airport transfers, outstation journeys, city travel & special occasions. Available 24/7.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: 700, color: "#d4a853", letterSpacing: "2px", marginBottom: "16px" }}>NAVIGATE</h4>
            {["Home", "Services", "Fleet", "Routes", "Fare", "Booking", "Contact"].map(l => (
              <div key={l} style={{ marginBottom: "10px" }}>
                <span onClick={() => scrollTo(l.toLowerCase())} style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "#d4a853"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.2)"}>{l}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: 700, color: "#d4a853", letterSpacing: "2px", marginBottom: "16px" }}>TOP ROUTES</h4>
            {["Vizag → Araku", "Vizag → Hyderabad", "Vizag → Tirupati", "Vizag → Borra Caves", "Airport Transfer", "City Sightseeing"].map(r => (
              <div key={r} style={{ marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>{r}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: 700, color: "#d4a853", letterSpacing: "2px", marginBottom: "16px" }}>CONTACT</h4>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", lineHeight: 2.2 }}>
              <div>📞 7981080813</div>
              <div>✉️ karun@karuncabs.com</div>
              <div>🌐 www.karuncabs.com</div>
              <div>📍 Visakhapatnam, AP</div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.1)" }}>© {new Date().getFullYear()} Karun Cabs. All rights reserved.</span>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.1)" }}>Visakhapatnam, Andhra Pradesh</span>
        </div>
      </footer>

      {/* ═══ FLOATING ═══ */}
      <button className="whatsapp-btn" onClick={whatsappGeneral}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </button>

      <a href="tel:7981080813" className="call-btn">
        <span style={{ fontSize: "16px" }}>📞</span>
        <span style={{ color: "#050508", fontSize: "13px", fontWeight: 700 }}>Call Now</span>
      </a>
    </div>
  );
}
