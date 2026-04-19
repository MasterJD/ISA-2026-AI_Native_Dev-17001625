"use client";

import React, { useMemo, useState } from "react";

type AssetKey = "AAPL" | "MSFT" | "NVDA";

const assetSnapshots: Record<AssetKey, { price: number; change: number; volume: number; series: number[] }> = {
  AAPL: { price: 202.33, change: 0.72, volume: 40234232, series: [41, 52, 46, 60, 58, 67, 73] },
  MSFT: { price: 514.21, change: 1.04, volume: 19233518, series: [32, 36, 48, 44, 53, 57, 64] },
  NVDA: { price: 978.44, change: 2.61, volume: 53992104, series: [50, 58, 55, 63, 71, 76, 84] },
};

const levelTable = [
  { level: 1, requiredXp: 0, rank: "Novice Trader" },
  { level: 2, requiredXp: 500, rank: "Market Explorer" },
  { level: 3, requiredXp: 1000, rank: "Quant Analyst" },
  { level: 4, requiredXp: 1500, rank: "Portfolio Strategist" },
  { level: 5, requiredXp: 2200, rank: "Trading Elite" },
];

function buildPolylinePoints(values: number[]): string {
  return values
    .map((value, index) => {
      const x = 20 + index * 48;
      const y = 120 - value;
      return `${x},${y}`;
    })
    .join(" ");
}

export default function Page() {
  const [selectedAsset, setSelectedAsset] = useState<AssetKey>("AAPL");
  const [timeframe, setTimeframe] = useState<"1W" | "1M" | "3M">("1W");
  const [simulatedTrades, setSimulatedTrades] = useState<number>(0);

  const market = assetSnapshots[selectedAsset];
  const baseXp = 1240;
  const xp = baseXp + simulatedTrades * 25;

  const gamification = useMemo(() => {
    const current = [...levelTable].reverse().find((item) => xp >= item.requiredXp) ?? levelTable[0];
    const next = levelTable.find((item) => item.level === current.level + 1);
    const nextRequired = next?.requiredXp ?? current.requiredXp;
    const span = Math.max(nextRequired - current.requiredXp, 1);
    const progress = Math.max(0, Math.min(100, ((xp - current.requiredXp) / span) * 100));
    return {
      level: current.level,
      rank: current.rank,
      progress,
      nextRequired,
    };
  }, [xp]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #070b1a 0%, #0c1123 55%, #070a16 100%)",
        color: "#eef2ff",
        fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        padding: "1.5rem",
      }}
    >
      <div style={{ margin: "0 auto", maxWidth: 1120, display: "grid", gap: "1rem" }}>
        <header
          style={{
            border: "1px solid #26304f",
            borderRadius: 16,
            padding: "1rem",
            background: "rgba(16, 23, 49, 0.7)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "clamp(1.9rem, 4.8vw, 2.8rem)" }}>TraderPulse Dashboard</h1>
          <p style={{ margin: "0.5rem 0 0", opacity: 0.86 }}>
            AI market analytics with metrics cards, portfolio tracking, chart visualization, and gamification.
          </p>
        </header>

        <nav
          aria-label="Dashboard navigation"
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            border: "1px solid #26304f",
            borderRadius: 14,
            padding: "0.75rem 1rem",
            background: "rgba(16, 23, 49, 0.65)",
          }}
        >
          <a href="#overview" style={{ color: "#c7d2fe" }}>
            Overview
          </a>
          <a href="#market" style={{ color: "#c7d2fe" }}>
            Market
          </a>
          <a href="#gamification" style={{ color: "#c7d2fe" }}>
            Gamification
          </a>
          <a href="#activity" style={{ color: "#c7d2fe" }}>
            Activity
          </a>
        </nav>

        <section
          id="activity"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            alignItems: "center",
            border: "1px solid #26304f",
            borderRadius: 14,
            padding: "0.75rem",
            background: "rgba(16, 23, 49, 0.65)",
          }}
        >
          <label htmlFor="asset-select" style={{ fontSize: 14, opacity: 0.9 }}>
            Asset:
          </label>
          <select
            id="asset-select"
            value={selectedAsset}
            onChange={(event) => setSelectedAsset(event.target.value as AssetKey)}
            style={{ borderRadius: 8, padding: "0.35rem 0.5rem" }}
          >
            <option value="AAPL">AAPL</option>
            <option value="MSFT">MSFT</option>
            <option value="NVDA">NVDA</option>
          </select>

          <button type="button" onClick={() => setTimeframe("1W")} style={{ borderRadius: 8, padding: "0.4rem 0.65rem" }}>
            1W
          </button>
          <button type="button" onClick={() => setTimeframe("1M")} style={{ borderRadius: 8, padding: "0.4rem 0.65rem" }}>
            1M
          </button>
          <button type="button" onClick={() => setTimeframe("3M")} style={{ borderRadius: 8, padding: "0.4rem 0.65rem" }}>
            3M
          </button>

          <button
            type="button"
            onClick={() => setSimulatedTrades((current) => current + 1)}
            style={{ borderRadius: 8, padding: "0.4rem 0.65rem" }}
          >
            Simulate Trade (+25 XP)
          </button>

          <span style={{ fontSize: 14, opacity: 0.8 }}>Selected timeframe: {timeframe}</span>
        </section>

        <section
          id="overview"
          style={{
            display: "grid",
            gap: "0.75rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <article style={{ border: "1px solid #26304f", borderRadius: 14, padding: "0.85rem", background: "#0f1733" }}>
            <h2 style={{ margin: 0, fontSize: 15, opacity: 0.85 }}>Price</h2>
            <p style={{ margin: "0.35rem 0 0", fontSize: 25, fontWeight: 700 }}>${market.price.toFixed(2)}</p>
          </article>

          <article style={{ border: "1px solid #26304f", borderRadius: 14, padding: "0.85rem", background: "#0f1733" }}>
            <h2 style={{ margin: 0, fontSize: 15, opacity: 0.85 }}>Daily Change</h2>
            <p style={{ margin: "0.35rem 0 0", fontSize: 25, fontWeight: 700 }}>{market.change.toFixed(2)}%</p>
          </article>

          <article style={{ border: "1px solid #26304f", borderRadius: 14, padding: "0.85rem", background: "#0f1733" }}>
            <h2 style={{ margin: 0, fontSize: 15, opacity: 0.85 }}>Volume</h2>
            <p style={{ margin: "0.35rem 0 0", fontSize: 25, fontWeight: 700 }}>{market.volume.toLocaleString("en-US")}</p>
          </article>

          <article style={{ border: "1px solid #26304f", borderRadius: 14, padding: "0.85rem", background: "#0f1733" }}>
            <h2 style={{ margin: 0, fontSize: 15, opacity: 0.85 }}>Portfolio Value</h2>
            <p style={{ margin: "0.35rem 0 0", fontSize: 25, fontWeight: 700 }}>$154,820.55</p>
          </article>
        </section>

        <section
          id="market"
          style={{
            border: "1px solid #26304f",
            borderRadius: 16,
            padding: "1rem",
            background: "rgba(16, 23, 49, 0.7)",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "0.6rem" }}>Market Chart and Visualization</h2>
          <svg
            aria-label="Price chart"
            role="img"
            viewBox="0 0 340 130"
            width="100%"
            height="180"
            style={{ borderRadius: 12, background: "#0c1430", border: "1px solid #253058" }}
          >
            <polyline
              fill="none"
              stroke="#34d399"
              strokeWidth="3"
              points={buildPolylinePoints(market.series)}
            />
            {market.series.map((value, index) => {
              const x = 14 + index * 48;
              const height = Math.max(4, value - 26);
              return (
                <rect key={x} x={x} y={122 - height} width="10" height={height} fill="#60a5fa" opacity="0.35" />
              );
            })}
          </svg>
        </section>

        <section
          id="gamification"
          style={{
            border: "1px solid #26304f",
            borderRadius: 16,
            padding: "1rem",
            background: "rgba(16, 23, 49, 0.7)",
            display: "grid",
            gap: "0.75rem",
          }}
        >
          <h2 style={{ margin: 0 }}>Gamification Challenge</h2>
          <p style={{ margin: 0 }}>
            Experience Points (XP): <strong>{xp}</strong>
          </p>
          <p style={{ margin: 0 }}>
            User Level: <strong>{gamification.level}</strong> | Rank: <strong>{gamification.rank}</strong>
          </p>

          <div
            role="progressbar"
            aria-label="XP progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(gamification.progress)}
            style={{
              width: "100%",
              maxWidth: 540,
              height: 14,
              borderRadius: 999,
              overflow: "hidden",
              background: "#1f2b54",
              border: "1px solid #2e3d70",
            }}
          >
            <div
              style={{
                width: `${gamification.progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #22d3ee, #34d399)",
              }}
            />
          </div>

          <p style={{ margin: 0, fontSize: 14, opacity: 0.86 }}>
            Progress: {gamification.progress.toFixed(1)}% to next level at {gamification.nextRequired} XP.
          </p>

          <div>
            <h3 style={{ marginBottom: "0.5rem" }}>Badges and Achievements</h3>
            <ul style={{ margin: 0, paddingLeft: "1.2rem", display: "grid", gap: "0.35rem" }}>
              <li>Market Scout Badge</li>
              <li>Momentum Analyst Achievement</li>
              <li>Risk Guardian Badge</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
