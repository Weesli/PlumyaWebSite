"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, Plus } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import Announcement from "@/components/Announcement";
import PixelBlossom from "@/components/PixelBlossom";
import NewsCard from "@/components/NewsCard";
import Supporters from "@/components/Supporters";
import RecentRegistrations from "@/components/RecentRegistrations";
import Reveal from "@/components/Reveal";

const DiscordMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const FAQ = (ip: string, port: string) => [
  {
    q: "Sunucuya nasıl katılabilirim?",
    a: `Minecraft'ı 1.20 veya üstü bir sürümde açın, çok oyunculu menüsüne ${ip}${port && port !== "25565" ? ":" + port : ""} adresini ekleyin. Bedrock oyuncuları da aynı adresle bağlanabilir.`,
  },
  {
    q: "Mağaza ürünleri ne zaman teslim edilir?",
    a: "Ödeme onaylandığı anda krediniz hesabınıza yüklenir. Kredilerinizi oyun içindeki mağaza menüsünden dilediğiniz gibi harcayabilirsiniz.",
  },
  {
    q: "Yetkili alımı var mı?",
    a: "Alımlar açıldığında Discord duyurularından ve haber bölümünden haber veriyoruz. Başvurular destek sistemi üzerinden alınır.",
  },
  {
    q: "Destek sistemine nasıl ulaşırım?",
    a: "Hesabınıza giriş yaptıktan sonra Destek sayfasından yeni bir talep oluşturun. Yetkililer yanıtladığında aynı sayfada görürsünüz.",
  },
];

export default function HomePage() {
  const { settings, news, users, currentUser } = useApp();
  const [copied, setCopied] = useState(false);
  const [online, setOnline] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const ip = settings.serverIp || settings.serverIP || "play.plumya.net";
  const invite = settings.discordInviteUrl || "https://discord.gg";

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/mc-status?server=${encodeURIComponent(ip)}`);
        if (!res.ok) return;
        const d = await res.json();
        if (alive && d.online) setOnline(d.playersOnline);
      } catch {
        /* fall back to settings */
      }
    };
    load();
    const t = setInterval(load, 45000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [ip]);

  const copy = () => {
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const players = online ?? settings.onlinePlayers ?? 0;
  const [lead, ...rest] = news;
  const restShown = showAll ? rest : rest.slice(0, 2);
  const faq = FAQ(ip, settings.serverPort);

  return (
    <div>
      <Announcement />

      {/* ---------- Hero ---------- */}
      <section className="wrap grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14 items-center pt-10 pb-16 lg:pt-14 lg:pb-24">
        <div>
          <h1 className="font-extrabold leading-[1.02] text-[clamp(38px,5.3vw,76px)] max-w-[13ch] text-balance rise">
            Emeğin değer gördüğü diyar
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-[var(--muted)] rise rise-2">
            Survival ve emek SkyBlock sunucusu. 128 tickrate altyapı, dengeli pazar ekonomisi ve hilesiz, rekabetçi bir oyun dünyası.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3 rise rise-3">
            {currentUser ? (
              <Link href="/market" className="btn-accent h-14 px-8 flex items-center justify-center text-base">
                Mağazaya git
              </Link>
            ) : (
              <Link href="/register" className="btn-accent h-14 px-8 flex items-center justify-center text-base">
                Hemen kayıt ol
              </Link>
            )}
            <button type="button" onClick={copy} className="btn-soft h-14 px-8 flex items-center justify-center gap-2.5 text-base cursor-pointer">
              {copied ? "Adres kopyalandı" : ip}
              {copied ? <Check size={17} className="text-[var(--grass)]" /> : <Copy size={16} />}
            </button>
          </div>

          <dl className="mt-12 flex gap-12 rise rise-4">
            <div>
              <dd className="font-display text-6xl font-semibold tabular-nums leading-none">{players.toLocaleString("tr-TR")}</dd>
              <dt className="mt-2 text-sm text-[var(--muted)]">şu an oyunda</dt>
            </div>
            <div>
              <dd className="font-display text-6xl font-semibold tabular-nums leading-none">{(settings.maxPlayers || 200).toLocaleString("tr-TR")}</dd>
              <dt className="mt-2 text-sm text-[var(--muted)]">oyuncu kapasitesi</dt>
            </div>
          </dl>
        </div>

        <div className="relative aspect-[6/5] lg:aspect-[5/6] w-full overflow-hidden bg-[var(--surface)] notch-lg rise rise-2">
          <PixelBlossom />
        </div>
      </section>

      {/* ---------- News ---------- */}
      <section className="wrap py-16 lg:py-24">
        <Reveal className="flex items-end justify-between gap-4 mb-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-none">Son güncellemeler</h2>
          {rest.length > 2 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] cursor-pointer"
            >
              {showAll ? "Daha az göster" : "Tümünü gör"}
            </button>
          )}
        </Reveal>

        {!lead ? (
          <p className="text-[var(--muted)] py-12">Henüz yayınlanmış bir duyuru yok.</p>
        ) : (
          <div className="space-y-3">
            <Reveal>
              <NewsCard news={lead} index={0} variant="feature" />
            </Reveal>
            {restShown.length > 0 && (
              <div className={`grid gap-3 ${restShown.length > 1 ? "md:grid-cols-2" : ""}`}>
                {restShown.map((item, i) => (
                  <Reveal key={item.id} delay={i * 80}>
                    <NewsCard news={item} index={i + 1} variant="compact" />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ---------- Ranking ---------- */}
      <div className="bg-[var(--surface)]">
      <section className="wrap py-16 lg:py-24">
        <Reveal className="mb-10 max-w-2xl">
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-none">Sıralama ve aktivite</h2>
          <p className="mt-4 text-lg text-[var(--muted)]">Sunucunun en çok destek veren oyuncuları ve mağazadaki son hareketler.</p>
        </Reveal>
        <Reveal>
          {settings.showRecentCredits ? (
            <Supporters />
          ) : (
            <p className="text-[var(--muted)]">Bu bölüm şu an gizli.</p>
          )}
        </Reveal>

        <Reveal className="mt-14">
          <h3 className="text-2xl font-extrabold mb-5">
            Yeni gelenler <span className="text-[var(--muted)] font-semibold">· {users.length}</span>
          </h3>
          <RecentRegistrations />
        </Reveal>
      </section>
      </div>

      {/* ---------- FAQ ---------- */}
      <section className="wrap py-16 lg:py-24 grid lg:grid-cols-[1fr_1.35fr] gap-12">
        <Reveal>
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-[1.02]">Sık sorulan sorular</h2>
          <p className="mt-4 text-lg text-[var(--muted)] max-w-sm">
            Aradığını bulamazsan destek ekibimiz yardımcı olmaktan memnuniyet duyar.
          </p>
          <Link href="/support" className="btn-soft mt-7 h-12 px-6 inline-flex items-center text-sm">
            Destek al
          </Link>
        </Reveal>

        <Reveal delay={80}>
          <ul className="space-y-3">
            {faq.map((f) => (
              <li key={f.q}>
                <details className="group notch bg-[var(--surface)] open:bg-[var(--surface-2)] transition-colors">
                  <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer text-lg font-semibold">
                    {f.q}
                    <Plus size={20} className="shrink-0 text-[var(--accent)] transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="px-6 pb-6 text-[var(--muted)] leading-relaxed max-w-xl">{f.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ---------- Call to action ---------- */}
      <section className="bg-[var(--accent)] text-[var(--accent-ink)] mt-8">
        <div className="wrap py-16 lg:py-20 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-none">Maceraya hazır mısın?</h2>
            <p className="mt-3 text-lg max-w-md opacity-85">Hemen kayıt ol, ilk adımını at ve diyarın bir parçası ol.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {!currentUser && (
              <Link href="/register" className="bg-[var(--accent-ink)] text-white hover:bg-black transition-colors h-14 px-8 flex items-center justify-center font-bold whitespace-nowrap">
                Kayıt ol
              </Link>
            )}
            <Link href="/market" className="bg-black/15 hover:bg-black/25 transition-colors h-14 px-8 flex items-center justify-center font-bold whitespace-nowrap">
              Mağaza
            </Link>
            <a
              href={invite}
              target="_blank"
              rel="noreferrer"
              className="bg-black/15 hover:bg-black/25 transition-colors h-14 px-8 flex items-center justify-center gap-2.5 font-bold whitespace-nowrap"
            >
              <DiscordMark />
              Discord&apos;a katıl
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
