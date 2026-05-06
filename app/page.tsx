"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Trip } from "@/types";
import TripCard from "@/components/trips/TripCard";
import Button from "@/components/ui/Button";
import SunflowerDecor from "@/components/ui/SunflowerDecor";
import Topbar from "@/components/ui/Topbar";
import { getTrips, deleteTrip } from "@/lib/supabase";

// Polaroid SVG illustrations — inline, sem dependência externa
function HeroPolaroids() {
  return (
    <div className="relative" style={{ height: 500 }}>
      {/* pol-1: pôr do sol */}
      <div
        className="polaroid absolute"
        style={{ width: 260, top: 0, right: 40, transform: "rotate(4deg)" }}
      >
        <div style={{ aspectRatio: "4/5" }}>
          <svg viewBox="0 0 100 125" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="sky1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#f5cd84" />
                <stop offset=".5" stopColor="#e89858" />
                <stop offset="1" stopColor="#a04428" />
              </linearGradient>
            </defs>
            <rect width="100" height="125" fill="url(#sky1)" />
            <circle cx="50" cy="55" r="14" fill="#fde9a8" opacity=".9" />
            <path d="M0 95 Q25 78 50 88 T100 92 V125 H0 Z" fill="#3d2509" />
            <path d="M0 100 Q30 90 55 96 T100 100 V125 H0 Z" fill="#2b1f12" />
            <g fill="#1a1108">
              <circle cx="42" cy="92" r="3.5" /><rect x="39.5" y="95" width="5" height="14" rx="2" />
              <circle cx="52" cy="91" r="3.5" /><rect x="49.5" y="94" width="5" height="15" rx="2" />
            </g>
          </svg>
        </div>
        <div className="font-hand text-birk-ink text-center mt-2 text-xl">pôr do sol, Cambará</div>
      </div>

      {/* pol-2: girassóis */}
      <div
        className="polaroid absolute"
        style={{ width: 220, top: 170, left: 0, transform: "rotate(-6deg)" }}
      >
        <div style={{ aspectRatio: "4/5" }}>
          <svg viewBox="0 0 100 125" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="sf-bg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#a8c66a" /><stop offset="1" stopColor="#5a6b3a" />
              </linearGradient>
            </defs>
            <rect width="100" height="125" fill="url(#sf-bg)" />
            <g transform="translate(10,20)"><circle cx="15" cy="15" r="15" fill="#f2b134" /><circle cx="15" cy="15" r="7" fill="#5a3a14" /></g>
            <g transform="translate(40,5)"><circle cx="15" cy="15" r="18" fill="#f2b134" /><circle cx="15" cy="15" r="8" fill="#5a3a14" /></g>
            <g transform="translate(70,25)"><circle cx="12" cy="12" r="12" fill="#e89c1f" /><circle cx="12" cy="12" r="5" fill="#5a3a14" /></g>
            <rect y="105" width="100" height="20" fill="#3d4a26" />
          </svg>
        </div>
        <div className="font-hand text-birk-ink text-center mt-2 text-xl">campo de girassóis</div>
      </div>

      {/* pol-3: cabana */}
      <div
        className="polaroid absolute"
        style={{ width: 200, bottom: 10, right: 0, transform: "rotate(-3deg)" }}
      >
        <div style={{ aspectRatio: "4/5" }}>
          <svg viewBox="0 0 100 125" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            <rect width="100" height="125" fill="#2a3a4a" />
            <circle cx="20" cy="20" r=".8" fill="#f5ecd9" /><circle cx="40" cy="14" r=".5" fill="#f5ecd9" />
            <circle cx="65" cy="22" r=".7" fill="#f5ecd9" /><circle cx="85" cy="16" r=".6" fill="#f5ecd9" />
            <circle cx="30" cy="35" r=".4" fill="#f5ecd9" /><circle cx="78" cy="38" r=".5" fill="#f5ecd9" />
            <path d="M30 80 L50 65 L70 80 V95 H30 Z" fill="#3a2410" />
            <path d="M28 80 L50 63 L72 80 L70 80 L50 65 L30 80 Z" fill="#2a1808" />
            <rect x="46" y="82" width="8" height="13" fill="#f2b134" />
            <rect x="36" y="83" width="6" height="6" fill="#e89c1f" />
            <path d="M0 95 Q50 90 100 95 V125 H0Z" fill="#1a1408" />
          </svg>
        </div>
        <div className="font-hand text-birk-ink text-center mt-2 text-xl">a cabana</div>
      </div>

      {/* pol-4: café */}
      <div
        className="polaroid absolute"
        style={{ width: 170, bottom: 30, left: 100, transform: "rotate(7deg)" }}
      >
        <div style={{ aspectRatio: "4/5" }}>
          <svg viewBox="0 0 100 125" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            <rect width="100" height="125" fill="#d4825a" />
            <circle cx="50" cy="62" r="36" fill="#fffbf0" />
            <circle cx="50" cy="62" r="32" fill="#3a1a08" />
            <circle cx="50" cy="62" r="28" fill="#5a2a10" opacity=".4" />
            <ellipse cx="44" cy="58" rx="6" ry="3" fill="#c98858" opacity=".6" />
          </svg>
        </div>
        <div className="font-hand text-birk-ink text-center mt-2 text-xl">café da estrada</div>
      </div>

      {/* Girassóis decorativos */}
      <SunflowerDecor
        size={110}
        rotation={-8}
        opacity={0.85}
        className="absolute"
        style={{ left: -40, top: 180 }}
      />
      <SunflowerDecor
        size={80}
        rotation={12}
        opacity={0.75}
        className="absolute"
        style={{ right: -30, bottom: -10 }}
      />
      <SunflowerDecor
        size={55}
        rotation={-4}
        opacity={0.7}
        className="absolute"
        style={{ right: "32%", top: 60 }}
      />

      {/* Doodle */}
      <span
        className="absolute font-hand text-birk-ink-soft text-lg pointer-events-none"
        style={{ top: 270, left: "46%", transform: "rotate(-12deg)" }}
      >
        ↘ a primeira vez
      </span>
    </div>
  );
}

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTrips()
      .then(setTrips)
      .catch(() => setError("Não conseguimos carregar suas viagens. Configure o Supabase."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar essa viagem? Não tem volta.")) return;
    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen paper-bg"
    >
      <Topbar />

      <div
        className="max-w-[1240px] mx-auto px-6 md:px-14 pb-24"
        style={{ paddingTop: 0 }}
      >
        {/* ── HERO ── */}
        <section className="hero-grid" style={{ paddingTop: 48 }}>
          {/* Coluna esquerda — texto editorial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="eyebrow">um diário de estrada</div>

            <h1
              className="font-serif text-birk-ink"
              style={{
                fontWeight: 300,
                fontSize: "clamp(3rem, 7vw, 6rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
                margin: "0 0 8px",
              }}
            >
              algum ritmo<br />em comum<br />
              <em
                className="italic font-serif"
                style={{
                  fontWeight: 400,
                  color: "#8a3a26",
                  position: "relative",
                }}
              >
                fez nos encontrar.
              </em>
            </h1>

            <p
              className="font-serif text-birk-ink-soft"
              style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 500, margin: "24px 0 36px" }}
            >
              a gente colecionou cafés de beira de estrada, manhãs frias na
              serra, risadas dentro do carro e{" "}
              <span className="font-hand text-birk-ink text-2xl">muitos girassóis pelo caminho</span>.
              este é o nosso caderno — pra revisitar tudo o que vivemos
              e marcar o que ainda falta viver.
            </p>

            <div className="flex gap-3 items-center flex-wrap">
              <Link href="#viagens">
                <Button variant="primary" size="lg">
                  ver nossas viagens
                  <span className="font-hand text-xl leading-none">→</span>
                </Button>
              </Link>
              <Link href="/trips/new">
                <Button variant="ghost" size="lg" className="italic">
                  ou criar nova viagem
                </Button>
              </Link>
            </div>

            {/* Meta stats */}
            {!loading && trips.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 gap-x-8 gap-y-5 mt-10 pt-7"
                style={{ borderTop: "1px solid #d9c79c" }}
              >
                {[
                  { k: "viagens no diário", v: `${trips.length}`, sub: "e contando" },
                  { k: "próxima parada", v: trips[0]?.destination ?? "—", sub: "" },
                ].map((cell) => (
                  <div key={cell.k}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-birk-ink-faint mb-1">
                      {cell.k}
                    </div>
                    <div className="font-serif text-birk-ink text-2xl italic">
                      {cell.v}{" "}
                      {cell.sub && (
                        <small className="font-serif text-sm text-birk-ink-faint not-italic">
                          ({cell.sub})
                        </small>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Coluna direita — composição de polaroids */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden lg:block"
          >
            <HeroPolaroids />
          </motion.div>
        </section>

        {/* ── SEÇÃO VIAGENS ── */}
        <div className="section-head" id="viagens">
          <h2>
            <span className="num">02 / viagens</span>
            <em>onde a gente já esteve.</em>
          </h2>
          <span className="aside">role pra lembrar ✿</span>
        </div>

        <section>
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="font-hand text-birk-terra text-xl mb-1" style={{ fontWeight: 600 }}>
                {trips.length > 0 ? "onde já fomos e pra onde vamos" : "pra onde vamos dessa vez?"}
              </p>
            </div>
            <Link href="/trips/new" className="flex-shrink-0">
              <Button variant="primary">
                <Plus size={16} />
                nova viagem
              </Button>
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-birk-paper-deep rounded h-32 animate-pulse" style={{ opacity: 0.5 }} />
              ))}
            </div>
          )}

          {/* Erro */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-red-200 rounded p-5"
              style={{ background: "rgba(254,226,226,0.5)" }}
            >
              <p className="font-serif text-red-700 italic text-lg mb-1">Ops!</p>
              <p className="text-red-600 text-sm">{error}</p>
              <p className="font-mono text-red-400 text-xs mt-2 uppercase tracking-[0.1em]">
                Configure as variáveis do Supabase no painel da Vercel.
              </p>
            </motion.div>
          )}

          {/* Lista de viagens */}
          {!loading && !error && (
            <AnimatePresence>
              {trips.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="font-hand text-7xl mb-6">✈️</div>
                  <h3 className="font-serif text-birk-ink text-2xl italic mb-3" style={{ fontWeight: 300 }}>
                    ainda não tem nenhuma viagem
                  </h3>
                  <p className="font-hand text-birk-ink-faint text-xl mb-8 max-w-xs mx-auto">
                    cada aventura começa com um primeiro passo 💛
                  </p>
                  <Link href="/trips/new">
                    <Button variant="primary" size="lg">
                      <Plus size={18} />
                      criar primeira viagem
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((trip, i) => (
                    <TripCard key={trip.id} trip={trip} onDelete={handleDelete} index={i} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          )}
        </section>
      </div>

      {/* ── FOOTER ── */}
      <footer
        className="paper-bg"
        style={{
          marginTop: 80,
          paddingTop: 32,
          paddingBottom: 32,
          borderTop: "1px solid #d9c79c",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "max(24px, calc((100% - 1240px) / 2 + 56px))",
          paddingRight: "max(24px, calc((100% - 1240px) / 2 + 56px))",
        }}
      >
        <div className="font-mono text-birk-ink-faint text-[11px] tracking-[0.14em] uppercase">
          Birkianos Trips · Caderno
        </div>
        <div className="font-hand text-birk-terra text-xl">
          ♥ feito por nós, pra nós.
        </div>
        <div className="font-mono text-birk-ink-faint text-[11px] tracking-[0.14em] uppercase">
          São Paulo → onde der
        </div>
      </footer>
    </motion.div>
  );
}
