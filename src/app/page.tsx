"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Box, Copy, Check, Play, Compass, Crown } from "lucide-react";
import { useApp } from "@/contexts/AppContext";



import Announcement from "@/components/Announcement";
import MinecraftHead from "@/components/MinecraftHead";

export default function HomePage() {
  const { settings, news, topSupporters, currentUser, coinPackages, creditLoads, users } = useApp();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [online, setOnline] = useState<number | null>(null);
  const ip = settings.serverIp || settings.serverIP || "play.plumya.net";
  const address = ip + (settings.serverPort && settings.serverPort !== "25565" ? ":" + settings.serverPort : "");
  const [openedNews, setOpenedNews] = useState<(typeof news)[number] | null>(null);

  useEffect(() => {
    let alive = true;
    async function refresh() {
      try {
        const response = await fetch("/api/mc-status?server=" + encodeURIComponent(ip));
        const data = await response.json();
        if (alive) setOnline(data.online ? data.playersOnline : null);
      } catch { if (alive) setOnline(null); }
    }
    void refresh();
    const timer = setInterval(refresh, 45000);
    return () => { alive = false; clearInterval(timer); };
  }, [ip]);

  useEffect(() => {
    if (!copied && !copyError) return;
    const timer = setTimeout(() => { setCopied(false); setCopyError(false); }, 2400);
    return () => clearTimeout(timer);
  }, [copied, copyError]);

  async function copy() {
    try { await navigator.clipboard.writeText(address); setCopied(true); }
    catch { setCopyError(true); }
  }

  const lead = news[0];

  return (
    <div className="atlas-landing">
      <Announcement />
        <div className="atlas-opening">
          <section className="atlas-hero" id="kesfet">
            <Image src="/plumya-world.webp" alt="Kalesi, erik ağaçları, şelaleleri ve köyüyle Plumya dünyası" fill preload sizes="(min-width: 1200px) 70vw, 100vw" className="atlas-world" />
            <div className="atlas-intro">
              <p className="atlas-eyebrow">{settings.siteName || "PLUMYA NETWORK"}</p>
              <h1>Bir sunucudan fazlası.<br /><strong>Keşfedilecek<br /><em>bir dünya.</em></strong></h1>
              <p className="atlas-description">Plumya Skyblock’ta kendi adanı sıfırdan kur. Kaynaklarını büyüt, adanı geliştir ve topluluğun bir parçası ol.</p>
              <div className="atlas-actions">
                <Link href={currentUser ? "/market" : "/register"} className="atlas-play"><Play size={17} fill="currentColor" /> Hemen Oyna</Link>
                <Link href="/about" className="atlas-book" aria-label="Plumya hakkında"><Compass size={21} /></Link>
              </div>
            </div>
            <a className="atlas-map-label survival" href="#ada-gelisimi"><Box size={20} /> Ada Gelişimi</a>
            <a className="atlas-map-label skyblock" href="#skyblock"><Box size={20} /> Skyblock</a>
            <a className="atlas-map-label events" href="https://wiki.plumya.net/" target="_blank" rel="noreferrer"><Compass size={20} /> Wiki</a>
            <div className="atlas-compass" aria-hidden="true">N<span>✧</span>S</div>
          </section>

          <aside className="atlas-right">
            <section className="atlas-status">
              <div><span className={online !== null ? "atlas-dot online" : "atlas-dot"} />{online !== null ? "Sunucu Çevrimiçi" : "Sunucu Bilgileri"}<span className="atlas-capacity">{online ?? settings.onlinePlayers} / {settings.maxPlayers} Oyuncu</span></div>
              <button onClick={copy} type="button"><Copy size={16} /><strong>{address}</strong>{copied ? <Check size={17} /> : <Copy size={17} />}</button>
              <span role="status" className="atlas-copy-status">{copied ? "Adres kopyalandı" : copyError ? "Kopyalanamadı. Adresi seçip kopyalayabilirsin." : ""}</span>
            </section>

            {settings.showNews !== false && <section className="atlas-paper atlas-news" id="haberler">
              <div className="atlas-card-heading"><h2>Bu hafta Plumya’da</h2><a href="#tum-haberler">Tüm Haberler <ArrowRight size={14} /></a></div>
              {lead ? <button type="button" className="atlas-news-open" onClick={() => setOpenedNews(lead)}>
                <img src={lead.image || "/scenes/news.webp"} alt="" />
                <h3>{lead.title}</h3><p>{lead.content.slice(0, 110)}{lead.content.length > 110 ? "…" : ""}</p>
                <span className="atlas-arrow"><ArrowRight size={18} /></span>
              </button> : <p>Yeni haberler yakında burada.</p>}
            </section>}

            {settings.showRecentCredits && <section className="atlas-paper" id="topluluk">
              <div className="atlas-card-heading"><h2>Topluluk Sıralaması</h2><Link href="/market">Destek ol <ArrowRight size={14} /></Link></div>
              {topSupporters.length ? <ol className="atlas-ranking">{topSupporters.slice(0, 3).map((player, index) => <li key={player.username}>
                <Crown size={19} /><span>{index + 1}</span><img src={"https://mc-heads.net/avatar/" + encodeURIComponent(player.username) + "/40"} width={27} height={27} alt="" /><strong>{player.username}</strong><span>{player.amount.toLocaleString("tr-TR")} kredi</span>
              </li>)}</ol> : <p className="atlas-empty">Plumya’ya ilk destek veren sen ol.</p>}
            </section>}
          </aside>
        </div>


      <section className="atlas-worlds" id="tum-haberler">
        <div className="atlas-section-heading"><h2><em>01 /</em> PLUMYA’DAN HABERLER</h2><p>Skyblock dünyasından son duyurular ve güncellemeler.</p></div>
        <div className="atlas-editorial-grid">
          {settings.showNews !== false && news.slice(0, 3).map((item, index) => (
            <article className="atlas-mode" key={item.id}>
              <div className="atlas-mode-image" style={{backgroundImage: `url(${JSON.stringify(item.image || (index % 2 ? "/scenes/castle.webp" : "/scenes/news.webp"))})`,backgroundPosition: "center", backgroundSize: "cover"}} />
              <div className="atlas-note"><h3>{item.title}</h3><p>{item.content.slice(0, 95)}…</p><button type="button" onClick={() => setOpenedNews(item)} aria-label={item.title + " haberini oku"}><ArrowRight size={19} /></button></div>
            </article>
          ))}
          {settings.showNews !== false && !news.length && <p className="atlas-empty">Henüz yayınlanmış bir haber yok.</p>}
        </div>
      </section>
      <section className="atlas-worlds atlas-wiki" id="wiki">
        <div className="atlas-section-heading">
          <h2>SKYBLOCK REHBERİ</h2>
          <a href="https://wiki.plumya.net/" target="_blank" rel="noreferrer">Plumya Wiki’yi aç ↗</a>
        </div>
        <p className="atlas-wiki-intro">İlk adımından ada gelişimine kadar, Plumya’daki sistemleri keşfet.</p>
        <div className="atlas-wiki-links">
          {[
            ["Başlangıç", "baslangic/", "Sunucuya katıl ve ilk adımlarını at."],
            ["Ada Sistemi", "ada/", "Kendi adanı kur, yönet ve geliştir."],
            ["Ada Yükseltmeleri", "ada-yukseltmeleri/", "Adanın gelişim seçeneklerini incele."],
            ["Para Birimleri", "para-birimleri/", "Ekonomi sistemini ve para birimlerini öğren."],
            ["Komutlar", "komutlar/", "Oyun içindeki komutlara hızlıca ulaş."],
            ["Zindanlar", "zindanlar/", "Zindan sisteminin ayrıntılarını keşfet."]
          ].map(([title, path, description]) => (
            <a key={path} href={"https://wiki.plumya.net/" + path} target="_blank" rel="noreferrer" className="atlas-guide-card">
              <div className="atlas-guide-scene" aria-hidden="true" />
              <div className="atlas-guide-caption"><h3>{title}</h3><p>{description}</p><ArrowRight size={18} /></div>
            </a>
          ))}
        </div>
      </section>

      <section className="atlas-ledger atlas-noticeboard">
        <div className="atlas-paper"><div className="atlas-card-heading"><h2>Mağaza Paketleri</h2><Link href="/market">Mağazaya git ↗</Link></div>
          {coinPackages.map(item => <Link className="atlas-ledger-row" href="/market" key={item.id}><span><strong>{item.name}</strong><small>{item.coins.toLocaleString("tr-TR")} kredi</small></span><b>{item.price} ₺</b></Link>)}
          {!coinPackages.length && <p className="atlas-empty">Paketler henüz yayınlanmadı.</p>}
        </div>
        {settings.showRecentCredits && <div className="atlas-paper"><h2>Son Bağışlar</h2>{creditLoads.slice(0,5).map(item => <div className="atlas-ledger-row atlas-player-row" key={item.id}><MinecraftHead key={item.username} username={item.username} /><span>{item.username}</span><b>+{item.amount.toLocaleString("tr-TR")}</b></div>)}{!creditLoads.length && <p className="atlas-empty">İlk destekçimiz sen ol.</p>}</div>}
        {settings.showRecentRegistrations && <div className="atlas-paper"><h2>Yeni Gelenler</h2>{users.slice(0,5).map(item => <div className="atlas-ledger-row atlas-player-row" key={item.id}><MinecraftHead key={item.username} username={item.username} /><strong>{item.username}</strong></div>)}</div>}
      </section>
      <section className="atlas-data-section">
        <h2>Sık sorulan sorular</h2>
        <p>Aradığını bulamazsan <Link href="/support">destek ekibimize ulaşabilirsin.</Link></p>
        {[
          ["Sunucuya nasıl katılabilirim?", "Minecraft çok oyunculu menüsüne " + address + " adresini ekle. Sürüm ve bağlantı ayrıntıları için wiki rehberini inceleyebilirsin."],
          ["Mağaza ürünleri ne zaman teslim edilir?", "Ödeme onaylandığında kredin hesabına yüklenir. Kredilerini oyun içindeki mağazada kullanabilirsin."],
          ["Yetkili alımı var mı?", "Alımlar açıldığında Discord duyuruları ve haber bölümünden bilgi veriyoruz."],
          ["Destek sistemine nasıl ulaşırım?", "Hesabına giriş yaptıktan sonra Destek sayfasından yeni talep oluşturabilirsin."]
        ].map(([question, answer]) => <details className="atlas-paper" key={question}><summary>{question}</summary><p>{answer}</p></details>)}
      </section>
      {openedNews && <div className="atlas-modal" role="dialog" aria-modal="true" aria-label={openedNews.title}><article className="atlas-paper"><button autoFocus onClick={() => setOpenedNews(null)} type="button">Kapat ×</button><h2>{openedNews.title}</h2><p>{openedNews.content}</p></article></div>}
    </div>
  );
}
