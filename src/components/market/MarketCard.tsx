import { Link } from "react-router-dom";
import { useState } from "react";
import { Market } from "../../types/market";
import { Button } from "../ui/Button";
import { Activity, Star, ThumbsUp, ThumbsDown, Trophy } from "lucide-react";
import { cn } from "../../lib/utils";
import { useMarkets } from "../../hooks/useMarkets";

interface MarketCardProps {
    market: Market;
    viewMode: 'Card' | 'List';
    compact?: boolean;
}

export function MarketCard({ market, viewMode, compact = false }: MarketCardProps) {
    const { toggleWatchlist, isWatched } = useMarkets();
    const isStarred = isWatched(market.id);
    const [imgError, setImgError] = useState(false);

    const handleWatchlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist(market.id);
    };

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case 'Polymarket': return 'bg-blue-500 text-white shadow-blue-500/50';
            case 'Kalshi': return 'bg-green-600 text-white shadow-green-600/50';
            case 'Myriad': return 'bg-purple-500 text-white shadow-purple-500/50';
            case 'Limitless': return 'bg-orange-500 text-white shadow-orange-500/50';
            case 'Predict': return 'bg-indigo-500 text-white shadow-indigo-500/50';
            default: return 'bg-gray-500 text-white';
        }
    };

    const platformColor = getPlatformColor(market.platform);

    // Speedometer / Gauge for Binary
    const Gauge = ({ value }: { value: number }) => {
        // Traffic Light Logic
        let colorClass = "text-yellow-500"; // Medium probability (40-60%)
        if (value >= 0.6) colorClass = "text-green-500"; // High probability (>60%)
        if (value <= 0.4) colorClass = "text-red-500";   // Low probability (<40%)

        return (
            <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                        className="text-muted/20"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    {/* Progress Circle */}
                    <path
                        className={colorClass}
                        strokeDasharray={`${value * 100}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-[9px] font-black leading-none">{(value * 100).toFixed(0)}%</span>
                </div>
            </div>
        );
    };

    // List Layout (Comparison View usually)
    if (viewMode === 'List') {
        return (
            <div className={cn(
                "group flex flex-col gap-1.5 p-2 rounded-lg border-2 border-foreground/10 bg-card shadow-sm hover:shadow-md hover:border-primary/50 transition-all text-xs relative",
                market.isArbitrage && "border-yellow-500 bg-yellow-500/10 shadow-yellow-500/20"
            )}>
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2 flex-1">
                        {/* Event Icon */}
                        <div className="relative shrink-0">
                            {imgError ? (
                                <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground border border-foreground/10">
                                    {market.category[0]}
                                </div>
                            ) : (
                                <img src={market.image} onError={() => setImgError(true)} alt="icon" className="w-8 h-8 rounded-md object-cover border border-foreground/10" />
                            )}
                            <div className={cn("absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-bold shrink-0 ring-1 ring-card", platformColor)}>
                                {market.platform[0]}
                            </div>
                        </div>

                        <div className="flex flex-col min-w-0">
                            <span className="text-[9px] text-muted-foreground uppercase leading-none mb-0.5">{market.platform}</span>
                            <Link to={`/market/${market.id}`} className="font-bold hover:underline line-clamp-2 leading-3 text-[11px]">
                                {market.title}
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-1">
                    {market.type === 'BINARY' ? (
                        <div className="flex items-center gap-1.5">
                            <div className="flex-1 flex items-center justify-between bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                                <span className="text-green-700 font-bold text-[9px]">Yes</span>
                                <span className="font-black text-green-700 text-[10px]">{(market.yesPrice * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex-1 flex items-center justify-between bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                                <span className="text-red-700 font-bold text-[9px]">No</span>
                                <span className="font-black text-red-700 text-[10px]">{(market.noPrice * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-0.5">
                            {market.outcomes?.slice(0, 2).map((outcome, i) => (
                                <div key={i} className="flex items-center justify-between bg-foreground/5 rounded px-2 py-0.5">
                                    <span className="truncate flex-1 font-medium text-[10px]">{outcome.name}</span>
                                    <span className="font-bold text-[10px]">{(outcome.price * 100).toFixed(0)}%</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Card Layout (Standard)
    return (
        <div className={cn(
            "group flex flex-col p-0 rounded-xl border-2 border-foreground/10 bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all overflow-hidden relative",
            compact ? "min-h-[160px]" : "min-h-[220px]",
            market.isArbitrage && "border-yellow-500 ring-4 ring-yellow-500/10"
        )}>
            {/* Header */}
            <div className="flex px-2 pt-2 pb-1 gap-2 border-b border-foreground/5 bg-gradient-to-b from-muted/30 to-transparent items-start">
                {/* Event Icon with Platform Badge */}
                <div className="relative shrink-0">
                    {imgError ? (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-foreground/10">
                            {market.category[0]}
                        </div>
                    ) : (
                        <img
                            src={market.image}
                            onError={() => setImgError(true)}
                            alt="Event"
                            className="w-10 h-10 rounded-lg object-cover shadow-sm border border-foreground/10"
                        />
                    )}
                    <div className={cn("absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm ring-2 ring-card z-10", platformColor)}>
                        {market.platform[0]}
                    </div>
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="font-bold text-sm leading-4 line-clamp-2 group-hover:underline mb-0">
                        <Link to={`/market/${market.id}`}>{market.title}</Link>
                    </h3>
                </div>

                {/* Binary Only: Gauge Top Right */}
                {market.type === 'BINARY' && (
                    <div className="shrink-0 pl-1">
                        <Gauge value={market.yesPrice} />
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex-1 px-3 md:px-2 pb-3 md:pb-2 pt-2 md:pt-1 flex flex-col">
                {/* Main Logic / Buttons */}
                <div className="mt-auto w-full">
                    {market.type === 'BINARY' ? (
                        // Binary: Big Buttons
                        <div className="grid grid-cols-2 gap-1.5 h-full">
                            <Button className="h-10 bg-green-500/10 hover:bg-green-500/20 text-green-700 border-green-500/20 border flex justify-between items-center px-2 group/btn">
                                <div className="flex items-center gap-1 text-xs md:text-[10px] font-black uppercase">
                                    <ThumbsUp className="w-3.5 h-3.5" /> Yes
                                </div>
                                <span className="text-lg md:text-base font-black tracking-tight">{(market.yesPrice * 100).toFixed(0)}</span>
                            </Button>
                            <Button className="h-10 bg-red-500/10 hover:bg-red-500/20 text-red-700 border-red-500/20 border flex justify-between items-center px-2 group/btn">
                                <div className="flex items-center gap-1 text-xs md:text-[10px] font-black uppercase">
                                    <ThumbsDown className="w-3.5 h-3.5" /> No
                                </div>
                                <span className="text-lg md:text-base font-black tracking-tight">{(market.noPrice * 100).toFixed(0)}</span>
                            </Button>
                        </div>
                    ) : (
                        // Multi-Choice: Top Options
                        <div className="space-y-1.5">
                            {market.outcomes?.slice(0, 2).map((outcome, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-4 md:gap-3 p-2 md:p-1.5 rounded-lg bg-muted/30 border border-foreground/5">
                                    <span className="text-xs md:text-[10px] font-bold truncate flex-1 flex items-center gap-1.5">
                                        {idx === 0 && <Trophy className="w-3 h-3 text-yellow-500 fill-current" />}
                                        {outcome.name}
                                    </span>

                                    <div className="flex items-center gap-3">
                                        <span className="text-sm md:text-xs font-black min-w-[24px] text-right">{(outcome.price * 100).toFixed(0)}%</span>
                                        <div className="flex gap-1">
                                            <button className="h-8 w-8 md:h-6 md:w-6 rounded flex items-center justify-center bg-green-500 text-white text-[10px] md:text-[9px] font-bold hover:bg-green-600 transition-colors">Y</button>
                                            <button className="h-8 w-8 md:h-6 md:w-6 rounded flex items-center justify-center bg-red-500 text-white text-[10px] md:text-[9px] font-bold hover:bg-red-600 transition-colors">N</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {market.outcomes && market.outcomes.length > 2 && (
                                <div className="text-center text-[9px] text-muted-foreground font-medium">
                                    + {market.outcomes.length - 2} more options
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Metadata (Moved from Header) */}
            <div className="px-2 py-1 bg-muted/20 border-t border-foreground/5 flex items-center justify-between text-[11px] md:text-[9px] text-muted-foreground">
                <span className="uppercase tracking-wider font-bold opacity-70">{market.category}</span>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5">
                        <Activity className="w-3 h-3 md:w-2.5 md:h-2.5 opacity-70" />
                        ${(market.volume / 1000).toFixed(1)}k
                    </span>
                </div>
            </div>


            {/* Watchlist Star */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                        "h-6 w-6 rounded-full bg-background/80 backdrop-blur shadow-sm hover:bg-background",
                        isStarred ? "text-yellow-500 opacity-100" : "text-muted-foreground"
                    )}
                    onClick={handleWatchlist}
                >
                    <Star className={cn("h-3 w-3", isStarred && "fill-current")} />
                </Button>
            </div>
            {isStarred && (
                <div className="absolute top-2 right-2 transition-opacity z-20">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 rounded-full bg-background/80 backdrop-blur shadow-sm text-yellow-500"
                        onClick={handleWatchlist}
                    >
                        <Star className="h-3 w-3 fill-current" />
                    </Button>
                </div>
            )}
        </div>
    );
}
