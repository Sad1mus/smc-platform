"use client"

import { useState, useTransition } from "react"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"

import { addSymbol, removeSymbol } from "@/lib/watchlist/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { PanelHeader } from "@/components/dashboard/panel-header"

type WatchlistPanelProps = {
  symbols: string[]
  activeSymbol: string
  onSelect: (symbol: string) => void
}

export function WatchlistPanel({
  symbols,
  activeSymbol,
  onSelect,
}: WatchlistPanelProps) {
  const [newSymbol, setNewSymbol] = useState("")
  const [pending, startTransition] = useTransition()

  function handleAdd(event: React.FormEvent) {
    event.preventDefault()
    const symbol = newSymbol.trim()
    if (!symbol) return

    startTransition(async () => {
      const result = await addSymbol(symbol)
      if (result.error) {
        toast.error(result.error)
        return
      }
      setNewSymbol("")
      toast.success(`${symbol.toUpperCase()} agregado a tu lista`)
    })
  }

  function handleRemove(symbol: string) {
    startTransition(async () => {
      const result = await removeSymbol(symbol)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(`${symbol} eliminado de tu lista`)
    })
  }

  return (
    <section
      aria-label="Mi lista de símbolos"
      className="border-border/60 bg-card overflow-hidden rounded-md border"
    >
      <PanelHeader
        label="Mi lista"
        hint={symbols.length > 0 ? `${symbols.length}` : undefined}
      />
      <div className="flex flex-col gap-3 p-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            value={newSymbol}
            onChange={(event) => setNewSymbol(event.target.value)}
            placeholder="NASDAQ:AAPL"
            aria-label="Agregar símbolo"
            data-testid="watchlist-input"
            className="h-9 font-mono text-sm uppercase"
            disabled={pending}
          />
          <Button
            type="submit"
            size="icon"
            variant="outline"
            aria-label="Agregar símbolo a la lista"
            data-testid="watchlist-add"
            disabled={pending || !newSymbol.trim()}
            className="size-9 shrink-0 active:scale-95"
          >
            <Plus className="size-4" />
          </Button>
        </form>

        {symbols.length === 0 ? (
          <p className="text-muted-foreground py-2 text-sm leading-relaxed">
            Agrega símbolos para tenerlos siempre a mano. Por ejemplo:
            NASDAQ:AAPL, BINANCE:BTCUSDT, FX:EURUSD.
          </p>
        ) : (
          <ul className="flex flex-col gap-1" data-testid="watchlist-items">
            {symbols.map((symbol) => (
              <li key={symbol} className="group flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onSelect(symbol)}
                  aria-pressed={symbol === activeSymbol}
                  className={cn(
                    "flex-1 rounded-md px-3 py-2 text-left font-mono text-sm transition-colors duration-150",
                    symbol === activeSymbol
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  {symbol}
                </button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={`Eliminar ${symbol} de la lista`}
                  onClick={() => handleRemove(symbol)}
                  disabled={pending}
                  className="text-muted-foreground hover:text-destructive size-7 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100 active:scale-95"
                >
                  <X className="size-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
