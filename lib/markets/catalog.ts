/**
 * Catálogo de símbolos del navegador de mercados.
 *
 * Los símbolos están VERIFICADOS uno por uno contra la API de búsqueda de
 * TradingView (symbol-search.tradingview.com). Esto no es ceremonia: un símbolo
 * que TradingView no resuelve deja el gráfico y el panel de análisis técnico en
 * "no existen datos" (mismo bug que motivó exigir EXCHANGE:TICKER en
 * `lib/watchlist/actions.ts`). **Al agregar un símbolo, validalo antes.**
 *
 * Las 6 categorías corresponden a las 6 clases de activo que promete la landing
 * (índices, forex, acciones, materias primas, ETF y cripto). Antes faltaba ETF.
 *
 * Módulo puro (sin React ni iconos) para poder testear la búsqueda en aislamiento.
 */

export type MarketSymbol = {
  /** Formato TradingView EXCHANGE:TICKER. Obligatorio el prefijo de mercado. */
  symbol: string
  /** Nombre legible en español. Es lo que el usuario busca cuando no sabe el ticker. */
  label: string
}

export type MarketCategoryId =
  | "forex"
  | "indices"
  | "commodities"
  | "stocks"
  | "crypto"
  | "etf"

export type MarketCategory = {
  id: MarketCategoryId
  name: string
  symbols: readonly MarketSymbol[]
}

export const MARKET_CATEGORIES: readonly MarketCategory[] = [
  {
    id: "forex",
    name: "Forex",
    symbols: [
      { symbol: "FX:EURUSD", label: "Euro / Dólar" },
      { symbol: "FX:GBPUSD", label: "Libra / Dólar" },
      { symbol: "FX:USDJPY", label: "Dólar / Yen" },
      { symbol: "FX:AUDUSD", label: "Dólar australiano / Dólar" },
      { symbol: "FX:USDCAD", label: "Dólar / Dólar canadiense" },
      { symbol: "FX:USDCHF", label: "Dólar / Franco suizo" },
      { symbol: "FX:NZDUSD", label: "Dólar neozelandés / Dólar" },
      { symbol: "FX:EURGBP", label: "Euro / Libra" },
      { symbol: "FX:EURJPY", label: "Euro / Yen" },
      { symbol: "FX:GBPJPY", label: "Libra / Yen" },
    ],
  },
  {
    id: "indices",
    name: "Índices",
    symbols: [
      { symbol: "SP:SPX", label: "S&P 500" },
      { symbol: "NASDAQ:NDX", label: "Nasdaq 100" },
      { symbol: "DJ:DJI", label: "Dow Jones" },
      { symbol: "XETR:DAX", label: "DAX (Alemania)" },
      { symbol: "TVC:UKX", label: "FTSE 100 (Reino Unido)" },
      { symbol: "TVC:NI225", label: "Nikkei 225 (Japón)" },
      { symbol: "TVC:SX5E", label: "Euro Stoxx 50" },
      { symbol: "TVC:DXY", label: "Índice del dólar" },
      { symbol: "TVC:VIX", label: "VIX (volatilidad)" },
    ],
  },
  {
    id: "commodities",
    name: "Materias primas",
    symbols: [
      { symbol: "OANDA:XAUUSD", label: "Oro" },
      { symbol: "OANDA:XAGUSD", label: "Plata" },
      { symbol: "TVC:GOLD", label: "Oro (spot US$/oz)" },
      { symbol: "TVC:SILVER", label: "Plata (spot US$/oz)" },
      { symbol: "TVC:PLATINUM", label: "Platino" },
      { symbol: "OANDA:XCUUSD", label: "Cobre" },
      { symbol: "TVC:USOIL", label: "Petróleo WTI" },
      { symbol: "TVC:UKOIL", label: "Petróleo Brent" },
      { symbol: "OANDA:NATGASUSD", label: "Gas natural" },
    ],
  },
  {
    id: "stocks",
    name: "Acciones",
    symbols: [
      { symbol: "NASDAQ:AAPL", label: "Apple" },
      { symbol: "NASDAQ:MSFT", label: "Microsoft" },
      { symbol: "NASDAQ:NVDA", label: "NVIDIA" },
      { symbol: "NASDAQ:AMZN", label: "Amazon" },
      { symbol: "NASDAQ:GOOGL", label: "Alphabet (Google)" },
      { symbol: "NASDAQ:META", label: "Meta" },
      { symbol: "NASDAQ:TSLA", label: "Tesla" },
      { symbol: "NASDAQ:AMD", label: "AMD" },
      { symbol: "NYSE:JPM", label: "JPMorgan Chase" },
      { symbol: "NYSE:KO", label: "Coca-Cola" },
    ],
  },
  {
    id: "crypto",
    name: "Cripto",
    symbols: [
      { symbol: "BINANCE:BTCUSDT", label: "Bitcoin" },
      { symbol: "BINANCE:ETHUSDT", label: "Ethereum" },
      { symbol: "BINANCE:SOLUSDT", label: "Solana" },
      { symbol: "BINANCE:BNBUSDT", label: "BNB" },
      { symbol: "BINANCE:XRPUSDT", label: "XRP" },
      { symbol: "BINANCE:ADAUSDT", label: "Cardano" },
      { symbol: "BINANCE:DOGEUSDT", label: "Dogecoin" },
      { symbol: "BINANCE:LINKUSDT", label: "Chainlink" },
    ],
  },
  {
    id: "etf",
    name: "ETF",
    symbols: [
      { symbol: "AMEX:SPY", label: "SPDR S&P 500" },
      { symbol: "NASDAQ:QQQ", label: "Invesco Nasdaq 100" },
      { symbol: "AMEX:VOO", label: "Vanguard S&P 500" },
      { symbol: "AMEX:IVV", label: "iShares Core S&P 500" },
      { symbol: "AMEX:VTI", label: "Vanguard mercado total" },
      { symbol: "AMEX:GLD", label: "SPDR Oro" },
      { symbol: "AMEX:EEM", label: "iShares mercados emergentes" },
      { symbol: "AMEX:XLF", label: "SPDR sector financiero" },
      { symbol: "AMEX:ARKK", label: "ARK Innovation" },
    ],
  },
] as const

/**
 * Normaliza para buscar: sin mayúsculas y sin acentos, para que "indices"
 * encuentre "Índices" y "dolar" encuentre "Dólar".
 */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
}

/**
 * Filtra el catálogo por símbolo O por nombre legible.
 *
 * Buscar por nombre es el punto: antes solo se podía filtrar por el ticker crudo,
 * así que "oro" o "bitcoin" no encontraban nada y había que saber `TVC:GOLD` de memoria.
 *
 * Query vacía → catálogo completo. Categorías sin coincidencias → se omiten.
 */
export function searchCatalog(query: string): MarketCategory[] {
  const q = normalize(query)
  if (!q) return [...MARKET_CATEGORIES]

  return MARKET_CATEGORIES.map((category) => ({
    ...category,
    symbols: category.symbols.filter(
      (entry) =>
        normalize(entry.symbol).includes(q) ||
        normalize(entry.label).includes(q)
    ),
  })).filter((category) => category.symbols.length > 0)
}

/** Todos los símbolos del catálogo, aplanados. */
export function allSymbols(): MarketSymbol[] {
  return MARKET_CATEGORIES.flatMap((category) => [...category.symbols])
}

/** Nombre legible de un símbolo; `null` si no está en el catálogo. */
export function labelForSymbol(symbol: string): string | null {
  const match = allSymbols().find(
    (entry) => entry.symbol.toUpperCase() === symbol.toUpperCase()
  )
  return match?.label ?? null
}
