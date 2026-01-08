import { Badge } from "../ui/Badge"
import { useMarkets } from "../../hooks/useMarkets"
import { Category, MarketStatus, Platform } from "../../types/market"
import { LayoutGrid, List, Filter } from "lucide-react"
import { cn } from "../../lib/utils"
import { PlatformLogo } from "../ui/PlatformLogo"

export function HeroSection() {
    const { filter, updateFilter } = useMarkets()

    const togglePlatform = (p: Platform) => {
        const current = filter.platforms;
        if (current.includes(p)) {
            if (current.length > 1) {
                updateFilter({ platforms: current.filter(pl => pl !== p) });
            }
        } else {
            updateFilter({ platforms: [...current, p] });
        }
    }

    const toggleCategory = (c: Category | 'All') => {
        if (c === 'All') {
            updateFilter({ category: 'All' });
            return;
        }

        let current = Array.isArray(filter.category) ? filter.category : (filter.category === 'All' ? [] : [filter.category]);
        if (current.includes(c)) {
            current = current.filter(cat => cat !== c);
        } else {
            current = [...current, c];
        }
        updateFilter({ category: current.length > 0 ? current : 'All' });
    }

    const toggleStatus = (s: MarketStatus | 'All') => {
        if (s === 'All') {
            updateFilter({ status: 'All' });
            return;
        }

        let current = Array.isArray(filter.status) ? filter.status : (filter.status === 'All' ? [] : [filter.status]);
        if (current.includes(s)) {
            current = current.filter(stat => stat !== s);
        } else {
            current = [...current, s];
        }
        updateFilter({ status: current.length > 0 ? current : 'All' });
    }

    const isCategorySelected = (c: Category | 'All') => {
        if (c === 'All') return filter.category === 'All' || (Array.isArray(filter.category) && filter.category.length === 0);
        if (filter.category === 'All') return false;
        return Array.isArray(filter.category) ? filter.category.includes(c) : filter.category === c;
    }

    return (
        <div className="space-y-4">
            <section className="py-1 space-y-1">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter whitespace-nowrap">
                    The One-Stop Hub for Global Prediction Markets
                </h1>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                    <p className="text-muted-foreground font-medium shrink-0">
                        Aggregate, analyze, and discover opportunities across major prediction market platforms
                    </p>

                    {/* Right: Distinct Filter Groups */}
                    <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0">

                        {/* Sort Group */}
                        <div className="flex items-center bg-card border-2 border-foreground/10 rounded-lg p-1 shadow-sm h-9 px-2">
                            <span className="text-[10px] text-muted-foreground mr-2 font-black uppercase tracking-wider hidden md:inline-block">Sort</span>
                            <select
                                value={filter.sortBy}
                                onChange={(e) => updateFilter({ sortBy: e.target.value as any })}
                                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer text-foreground max-w-[100px]"
                            >
                                <option value="Liquidity">Liquidity</option>
                                <option value="Newest">Newest</option>
                                <option value="Ending Soon">Ending Soon</option>
                                <option value="Trending">Trending</option>
                                <option value="Competitive">Competitive</option>
                            </select>
                        </div>

                        {/* View Group */}
                        <div className="flex items-center bg-card border-2 border-foreground/10 rounded-lg p-1 shadow-sm h-9 gap-1">
                            <button
                                onClick={() => updateFilter({ viewMode: 'Card' })}
                                className={cn(
                                    "p-1.5 rounded-md text-foreground/70 hover:text-foreground transition-all",
                                    filter.viewMode === 'Card' && "bg-foreground/10 text-foreground shadow-sm ring-1 ring-inset ring-foreground/20"
                                )}
                                title="Card View"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => updateFilter({ viewMode: 'List' })}
                                className={cn(
                                    "p-1.5 rounded-md text-foreground/70 hover:text-foreground transition-all",
                                    filter.viewMode === 'List' && "bg-foreground/10 text-foreground shadow-sm ring-1 ring-inset ring-foreground/20"
                                )}
                                title="List View"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Layout Group */}
                        <div className="flex items-center bg-card border-2 border-foreground/10 rounded-lg p-1 shadow-sm h-9 gap-1">
                            <button
                                onClick={() => updateFilter({ layoutMode: 'Unified' })}
                                className={cn(
                                    "px-3 py-1 rounded-md text-xs font-bold transition-all",
                                    filter.layoutMode === 'Unified' ? "bg-foreground text-background shadow-sm" : "hover:bg-muted text-muted-foreground"
                                )}
                            >
                                Unified
                            </button>
                            <button
                                onClick={() => updateFilter({ layoutMode: 'Comparison' })}
                                className={cn(
                                    "px-3 py-1 rounded-md text-xs font-bold transition-all",
                                    filter.layoutMode === 'Comparison' ? "bg-foreground text-background shadow-sm" : "hover:bg-muted text-muted-foreground"
                                )}
                            >
                                Compare
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Combined Filter Bar */}
            <div className="rounded-lg border bg-card/50 px-3 py-2 flex flex-col gap-2 md:flex-row md:items-center md:gap-4 overflow-x-auto no-scrollbar">

                {/* Platforms */}
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase mr-1">Exchanges</span>
                    {(['Kalshi', 'Polymarket', 'Myriad', 'Limitless', 'Predict'] as Platform[]).map(p => (
                        <Badge
                            key={p}
                            variant={filter.platforms.includes(p) ? 'default' : 'outline'}
                            className={cn(
                                "cursor-pointer text-[10px] py-1 px-2.5 transition-all",
                                filter.platforms.includes(p) ? "shadow-sm ring-1 ring-border/20" : "hover:bg-muted"
                            )}
                            onClick={() => togglePlatform(p)}
                        >
                            <PlatformLogo platform={p} showName={true} className="gap-1.5" />
                        </Badge>
                    ))}
                </div>

                <div className="hidden md:block w-px h-4 bg-border shrink-0" />

                {/* Categories & Status Mixed (Space Saver) */}
                <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
                    <Filter className="w-3 h-3 text-muted-foreground shrink-0" />
                    <Badge
                        variant={isCategorySelected('All') ? 'secondary' : 'outline'}
                        className="cursor-pointer whitespace-nowrap text-[10px] h-5 px-2"
                        onClick={() => toggleCategory('All')}
                    >
                        All
                    </Badge>
                    {(['Politics', 'Sports', 'Culture', 'Crypto', 'Economics', 'Tech & Science', 'World'] as Category[]).map(c => {
                        const selected = isCategorySelected(c);
                        return (
                            <Badge
                                key={c}
                                variant={selected ? 'secondary' : 'outline'}
                                className={cn("cursor-pointer whitespace-nowrap text-[10px] h-5 px-2",
                                    selected ? "bg-accent text-accent-foreground border-accent" : "text-muted-foreground"
                                )}
                                onClick={() => toggleCategory(c)}
                            >
                                {c}
                            </Badge>
                        )
                    })}
                    <div className="w-px h-3 bg-border mx-1 shrink-0" />
                    {(['Active', 'Resolved'] as MarketStatus[]).map(s => {
                        const isSelected = Array.isArray(filter.status) ? filter.status.includes(s) : filter.status === s;
                        return (
                            <Badge
                                key={s}
                                variant={isSelected ? 'default' : 'outline'}
                                className={cn("cursor-pointer whitespace-nowrap text-[10px] h-5 px-2",
                                    isSelected ? "bg-green-600 hover:bg-green-700 border-transparent text-white" : "text-muted-foreground"
                                )}
                                onClick={() => toggleStatus(s)}
                            >
                                {s}
                            </Badge>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
