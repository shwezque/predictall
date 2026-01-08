
import { useMarkets } from "../../hooks/useMarkets";
import { MarketCard } from "../market/MarketCard";
import { cn } from "../../lib/utils";

export function UnifiedView() {
    const { markets, filter } = useMarkets();

    if (markets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p>No markets found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className={cn(
            "grid gap-4",
            filter.viewMode === 'Card'
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        )}>
            {markets.map(market => (
                <MarketCard
                    key={market.id}
                    market={market}
                    viewMode={filter.viewMode}
                />
            ))}
        </div>
    );
}
