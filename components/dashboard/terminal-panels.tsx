"use client"

import { useState } from "react"

import { TvWidget } from "@/components/dashboard/tv-widget"

/**
 * Paneles del terminal (spec §Dashboard terminal): heatmap, calendario
 * económico y screener. Tabs accesibles; solo el panel activo monta su
 * widget (lazy real: los otros no cargan ningún script).
 */

const PANEL_HEIGHT = 520

const PANELS = [
  {
    id: "heatmap",
    label: "Heatmap",
    title: "Mapa de calor de acciones",
    widget: "stock-heatmap",
    config: {
      dataSource: "SPX500",
      grouping: "sector",
      blockSize: "market_cap_basic",
      blockColor: "change",
      hasTopBar: false,
      isDataSetEnabled: false,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
    },
  },
  {
    id: "calendario",
    label: "Calendario",
    title: "Calendario económico",
    widget: "events",
    config: {
      isTransparent: false,
      importanceFilter: "-1,0,1",
      countryFilter: "us,eu,es,mx,br,ar,co,gb,jp,cn",
    },
  },
  {
    id: "screener",
    label: "Screener",
    title: "Explorador de activos",
    widget: "screener",
    config: {
      defaultColumn: "overview",
      defaultScreen: "most_capitalized",
      market: "america",
      showToolbar: true,
    },
  },
  {
    id: "cripto",
    label: "Cripto",
    title: "Mapa de calor de cripto",
    widget: "crypto-coins-heatmap",
    config: {
      dataSource: "Crypto",
      blockSize: "market_cap_calc",
      blockColor: "change",
      hasTopBar: false,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
    },
  },
  {
    id: "etf",
    label: "ETF",
    title: "Mapa de calor de ETF",
    widget: "etf-heatmap",
    config: {
      dataSource: "AllUSEtf",
      blockSize: "aum",
      blockColor: "change",
      hasTopBar: false,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
    },
  },
  {
    id: "forex",
    label: "Forex",
    title: "Tasas cruzadas de divisas",
    widget: "forex-cross-rates",
    config: {
      currencies: ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "MXN"],
      isTransparent: false,
    },
  },
  {
    id: "mercados",
    label: "Mercados",
    title: "Resumen de mercados",
    widget: "market-overview",
    config: {
      showChart: true,
      showFloatingTooltip: true,
    },
  },
  {
    id: "noticias",
    label: "Noticias",
    title: "Noticias de mercado",
    widget: "timeline",
    config: {
      feedMode: "all_symbols",
      displayMode: "regular",
    },
  },
] as const

export function TerminalPanels() {
  const [active, setActive] = useState<(typeof PANELS)[number]["id"]>("heatmap")

  return (
    <section className="flex flex-col gap-3">
      <div
        role="tablist"
        aria-label="Paneles del terminal"
        className="flex flex-wrap gap-2"
      >
        {PANELS.map((panel) => (
          <button
            key={panel.id}
            role="tab"
            id={`tab-${panel.id}`}
            aria-selected={active === panel.id}
            aria-controls={`panel-${panel.id}`}
            onClick={() => setActive(panel.id)}
            className={
              active === panel.id
                ? "border-gold/60 bg-gold/10 text-gold rounded-md border px-3 py-1.5 font-mono text-xs tracking-wide"
                : "border-border text-muted-foreground hover:text-foreground rounded-md border bg-transparent px-3 py-1.5 font-mono text-xs tracking-wide"
            }
          >
            {panel.label}
          </button>
        ))}
      </div>
      {PANELS.map((panel) =>
        active === panel.id ? (
          <div
            key={panel.id}
            role="tabpanel"
            id={`panel-${panel.id}`}
            aria-labelledby={`tab-${panel.id}`}
          >
            <TvWidget
              widget={panel.widget}
              config={panel.config}
              height={PANEL_HEIGHT}
              title={panel.title}
              className="border-border/60 bg-card overflow-hidden rounded-lg border"
            />
          </div>
        ) : null
      )}
      <p className="text-muted-foreground text-right font-mono text-xs">
        Datos{" "}
        <a
          href="https://www.tradingview.com/"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-gold underline-offset-4 hover:underline"
        >
          by TradingView
        </a>
      </p>
    </section>
  )
}
