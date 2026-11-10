"use client";

import Link from "next/link";
import { useApp } from "@/contexts/AppContext";

const Avatar = ({ name }: { name: string }) => (
  <img
    src={`https://mc-heads.net/avatar/${encodeURIComponent(name)}/64`}
    alt=""
    width={36}
    height={36}
    className="w-9 h-9 bg-[var(--surface-3)] shrink-0"
    onError={(e) => {
      e.currentTarget.style.visibility = "hidden";
    }}
  />
);

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="notch bg-[var(--surface-2)] p-6 min-h-[320px] flex flex-col">
      <h3 className="text-xl font-extrabold mb-5">{title}</h3>
      {children}
    </div>
  );
}

export default function Supporters() {
  const { creditLoads, coinPackages } = useApp();

  const totals = new Map<string, number>();
  creditLoads.forEach((l) => totals.set(l.username, (totals.get(l.username) || 0) + l.amount));
  const lords = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const recent = [...creditLoads]
    .sort((a, b) => new Date(b.date || b.createdAt || 0).getTime() - new Date(a.date || a.createdAt || 0).getTime())
    .slice(0, 5);

  const packs = coinPackages.slice(0, 5);

  const empty = "text-[var(--muted)] my-auto text-center";
  const row = "flex items-center gap-3 py-2.5";

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Column title="En çok destek verenler">
        {lords.length === 0 ? (
          <p className={empty}>Henüz kimse destek vermedi.</p>
        ) : (
          <ol>
            {lords.map(([name, total], i) => (
              <li key={name} className={row}>
                <span className="w-6 font-display text-3xl font-semibold text-[var(--accent)] tabular-nums">{i + 1}</span>
                <Avatar name={name} />
                <span className="flex-1 min-w-0 font-bold truncate">{name}</span>
                <span className="text-sm font-bold tabular-nums">{total.toLocaleString("tr-TR")}</span>
              </li>
            ))}
          </ol>
        )}
      </Column>

      <Column title="Son bağışlar">
        {recent.length === 0 ? (
          <p className={empty}>Henüz bağış yok.</p>
        ) : (
          <ul>
            {recent.map((l) => (
              <li key={l.id} className={row}>
                <Avatar name={l.username} />
                <span className="flex-1 min-w-0">
                  <span className="block font-bold truncate">{l.username}</span>
                  <span className="block text-xs text-[var(--muted)]">
                    {new Date(l.date || l.createdAt || 0).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                  </span>
                </span>
                <span className="text-sm font-bold text-[var(--accent)] tabular-nums">+{l.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </Column>

      <Column title="Mağaza paketleri">
        {packs.length === 0 ? (
          <p className={empty}>Mağazada ürün yok.</p>
        ) : (
          <ul>
            {packs.map((p) => (
              <li key={p.id} className={row}>
                <span className="flex-1 min-w-0">
                  <span className="block font-bold truncate">{p.name}</span>
                  <span className="block text-xs text-[var(--muted)]">{p.coins.toLocaleString("tr-TR")} kredi</span>
                </span>
                <span className="text-sm font-bold tabular-nums">{p.price} ₺</span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/market" className="btn-accent mt-auto self-start px-5 h-11 flex items-center text-sm">
          Markete git
        </Link>
      </Column>
    </div>
  );
}
