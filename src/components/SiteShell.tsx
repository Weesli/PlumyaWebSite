"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Box, Newspaper, ShoppingCart, User, Compass, LifeBuoy, LogOut, Shield, Coins } from "lucide-react";
import { useApp } from "@/contexts/AppContext";


function PlayerHead({ username }: { username: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <User size={21} />;
  return (
    <img
      src={`https://mc-heads.net/avatar/${encodeURIComponent(username)}/64`}
      alt=""
      width={26}
      height={26}
      className="atlas-player-head"
      onError={() => setFailed(true)}
    />
  );
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings, currentUser, logout } = useApp();
  if (pathname.startsWith("/yonetim-plumya")) return <>{children}</>;
  const menu = [
    { label: "Ana Sayfa", href: "/", icon: Compass },
    { label: "Market", href: "/market", icon: ShoppingCart },
    { label: "Destek", href: "/support", icon: LifeBuoy },
    { label: "Hakkımızda", href: "/about", icon: User },
    { label: "Wiki", href: "/#wiki", icon: Box },
  ];
  return (
    <div className="atlas-home atlas-site">
      <aside className="atlas-sidebar">
        <Link href="/" className="atlas-brand"><img src="/plumya-wiki-logo.png" alt="Plumya logosu" width={64} height={64} /><strong>{settings.siteName === "Plumya Network" || !settings.siteName ? "Plumya" : settings.siteName}</strong><span>Network</span></Link>
        <div className="atlas-rule" aria-hidden="true">◇</div>
        <nav aria-label="Ana menü">
          {menu.map(({ label, href, icon: Icon }) => <Link key={label} className={"atlas-nav" + (pathname === href ? " active" : "")} href={href}><Icon size={22} /><span>{label}</span></Link>)}
        </nav>
        <div className="atlas-sidebar-scene" aria-hidden="true" />
        <a href="https://wiki.plumya.net/" target="_blank" rel="noreferrer" className="atlas-help"><Compass size={18} /> Plumya Wiki ↗</a>

      </aside>
      <div className="atlas-content">
        <header className="atlas-topbar">
          {currentUser && <Link href="/market" className="atlas-balance"><Coins size={18} />{currentUser.credits.toLocaleString("tr-TR")} kredi</Link>}
          <Link href="/market" aria-label="Mağaza"><ShoppingCart size={23} /></Link>
          <Link href="/#tum-haberler" aria-label="Haberler"><Newspaper size={22} /></Link>
          <Link className="atlas-account" href={currentUser ? "/profile" : "/login"}>{currentUser ? <PlayerHead key={currentUser.username} username={currentUser.username} /> : <User size={21} />}{currentUser?.username || "Giriş Yap"}</Link>
          {!currentUser && <Link href="/register" className="atlas-register">Kayıt ol</Link>}
          {currentUser?.role === "admin" && <Link href="/yonetim-plumya" className="atlas-admin-link"><Shield size={18} /> Yönetim</Link>}
          {currentUser && <button type="button" onClick={() => void logout()} aria-label="Çıkış yap" className="atlas-logout"><LogOut size={19} /></button>}
        </header>
        <main className={pathname === "/" ? "atlas-page" : "atlas-page atlas-interior"}>{children}</main>
        <footer className="atlas-footer"><span>© {new Date().getFullYear()} {settings.siteName || "Plumya Network"}</span><Link href="/kvkk">KVKK ve sözleşme</Link><Link href="/support">Destek</Link></footer>
      </div>
    </div>
  );
}
