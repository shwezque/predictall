import { useMarkets } from "../hooks/useMarkets";
import { MarketCard } from "../components/market/MarketCard";
import { Card } from "../components/ui/Card";
import { PieChart, Wallet, ArrowUpRight } from "lucide-react";

export function Portfolio() {
    const { isAuthenticated, login, getWatchlistMarkets } = useMarkets();
    const watchlist = getWatchlistMarkets();

    if (!isAuthenticated) {
        return (
            <div className="container max-w-7xl mx-auto py-20 px-4 text-center">
                <div className="max-w-md mx-auto bg-card border rounded-2xl p-8 shadow-sm">
                    <Wallet className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
                    <p className="text-muted-foreground mb-6">
                        Login to track your positions, manage your watchlist, and analyze your performance.
                    </p>
                    <button
                        onClick={login}
                        className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow hover:bg-primary/90 transition-all"
                    >
                        Login / Connect
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">My Portfolio</h1>
                <p className="text-muted-foreground">Track your active positions and watchlist.</p>
            </div>

            {/* Stats Overview (Mock) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-bold">Total Value</p>
                        <p className="text-2xl font-black text-foreground">$12,450.00</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <ArrowUpRight className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-bold">Total Profit</p>
                        <p className="text-2xl font-black text-green-500">+$2,105.50</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <PieChart className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-bold">Active Markets</p>
                        <p className="text-2xl font-black text-foreground">8</p>
                    </div>
                </Card>
            </div>

            {/* Watchlist */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="w-2 h-6 bg-yellow-400 rounded-full" />
                        Watchlist
                    </h2>
                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">{watchlist.length} items</span>
                </div>

                {watchlist.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted-foreground/20">
                        <p className="text-muted-foreground font-medium">Your watchlist is empty.</p>
                        <p className="text-sm text-muted-foreground/70">Star markets on the dashboard to track them here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {watchlist.map(market => (
                            <MarketCard key={market.id} market={market} viewMode="Card" />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
