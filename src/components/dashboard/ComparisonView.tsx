import { Market, Platform } from "../../types/market";
import { useMarkets } from "../../hooks/useMarkets";
import { MarketCard } from "../market/MarketCard";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";
import { PlatformLogo } from "../ui/PlatformLogo";

export function ComparisonView() {
    const { markets, filter } = useMarkets();
    const activePlatforms = filter.platforms;

    // 1. Group markets by Cluster ID (or fallback to Title for unclustered noise)
    const matrix: Record<string, Record<Platform, Market>> = {};
    const clusterMeta: Record<string, { title: string, category: string }> = {};

    markets.forEach(m => {
        // Only consider if platform is active
        if (!activePlatforms.includes(m.platform as Platform)) return;

        const key = m.clusterId || m.title; // Grouping key

        if (!matrix[key]) {
            matrix[key] = {} as Record<Platform, Market>;
            clusterMeta[key] = { title: m.title, category: m.category };
        }

        // If multiple matches for same platform (rare in this logic), just take first
        if (!matrix[key][m.platform as Platform]) {
            matrix[key][m.platform as Platform] = m;
        }
    });

    // 2. Ordered Rows
    const rowKeys = Object.keys(matrix);

    // Let's sort by "Cluster" first (Canonical) then randoms
    rowKeys.sort((a, b) => {
        const isClusterA = a.startsWith('cluster') || a.startsWith('event');
        const isClusterB = b.startsWith('cluster') || b.startsWith('event');
        if (isClusterA && !isClusterB) return -1;
        if (!isClusterA && isClusterB) return 1;
        return 0;
    });

    if (rowKeys.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-muted-foreground border rounded-lg border-dashed">
                <p>No matching markets found for comparison.</p>
                <p className="text-sm">Try selecting more platforms or clearing filters.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto pb-4">
            <div className="min-w-max">
                {/* Header Row */}
                <div className="grid gap-4 mb-2 sticky top-0 z-10 bg-background/95 backdrop-blur py-3 border-b-4 border-foreground/10 shadow-sm"
                    style={{ gridTemplateColumns: `200px repeat(${activePlatforms.length}, minmax(280px, 1fr))` }}>
                    <div className="flex items-center font-black text-sm text-foreground px-4 uppercase tracking-wider">
                        Event
                    </div>
                    {activePlatforms.map(p => (
                        <div key={p} className="flex items-center justify-center px-2 border-l-4 border-foreground/10 first:border-l-0 text-foreground">
                            <PlatformLogo platform={p as Platform} showName={true} className="scale-110" />
                        </div>
                    ))}
                </div>

                {/* Data Rows */}
                <div className="space-y-4 px-1">
                    {rowKeys.map(key => {
                        const rowData = matrix[key];
                        const meta = clusterMeta[key];

                        // Check if row has any visible markets (it should)
                        const hasData = activePlatforms.some(p => rowData[p as Platform]);
                        if (!hasData) return null;

                        // Check for arb opportunity in this row (any market is arb)
                        const isArbRow = activePlatforms.some(p => rowData[p as Platform]?.isArbitrage);

                        return (
                            <div key={key}
                                className={cn(
                                    "grid gap-4 py-0 border-2 rounded-xl shadow-sm bg-card hover:shadow-md transition-all overflow-hidden",
                                    isArbRow ? "border-violet-500/50 ring-4 ring-violet-500/5" : "border-foreground/10 hover:border-foreground/30"
                                )}
                                style={{ gridTemplateColumns: `200px repeat(${activePlatforms.length}, minmax(280px, 1fr))` }}
                            >
                                {/* Event Label Column */}
                                <div className={cn("px-4 py-3 flex flex-col justify-center h-full border-r-4 border-foreground/10", isArbRow ? "bg-violet-500/5" : "bg-muted/10")}>
                                    <div className="font-bold text-sm line-clamp-3 leading-snug mb-2 text-foreground" title={meta.title}>
                                        {meta.title}
                                    </div>
                                    <Badge variant="secondary" className="w-fit text-[10px] scale-90 origin-left opacity-90 font-mono">
                                        {meta.category}
                                    </Badge>
                                    {isArbRow && <Badge className="mt-2 w-fit bg-violet-500 hover:bg-violet-600 text-white font-black border-none animate-pulse shadow-violet-500/50">ARB OPP</Badge>}
                                </div>

                                {/* Platform Columns */}
                                {activePlatforms.map(p => {
                                    const market = rowData[p as Platform];
                                    return (
                                        <div key={`${key}-${p}`} className="px-2 py-1.5 h-full flex flex-col justify-center border-l-4 first:border-l-0 border-foreground/10 bg-card">
                                            {market ? (
                                                <MarketCard
                                                    market={market}
                                                    viewMode={filter.viewMode}
                                                    compact={true} // Always compact in comparison to fit
                                                />
                                            ) : (
                                                <div className="h-full min-h-[60px] rounded-lg border-2 border-dashed border-foreground/5 flex flex-col items-center justify-center gap-1 opacity-30 bg-muted/5">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                        —
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
