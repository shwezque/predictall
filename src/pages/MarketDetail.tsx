import { useParams } from "react-router-dom";
import { useState } from "react";
import { useMarkets } from "../hooks/useMarkets";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { ArrowLeft, ExternalLink, Share2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export function MarketDetail() {
    const { id } = useParams();
    const { markets } = useMarkets();
    const market = markets.find((m) => m.id === id);
    const [imgError, setImgError] = useState(false);

    if (!market) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Market Not Found</h2>
                <Button asChild>
                    <Link to="/">Back to Dashboard</Link>
                </Button>
            </div>
        );
    }

    // Use stored history or fallback
    const historyData = market.probabilityHistory || [];

    return (
        <div className="container py-8 px-4 md:px-8 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                <div className="space-y-4 flex-1">
                    <Button variant="ghost" size="sm" asChild className="-ml-3 text-muted-foreground">
                        <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Link>
                    </Button>

                    <div className="flex items-center gap-3 flex-wrap">
                        {imgError ? (
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground border border-foreground/10">
                                {market.category[0]}
                            </div>
                        ) : (
                            <img
                                src={market.image}
                                onError={() => setImgError(true)}
                                alt={market.title}
                                className="w-12 h-12 rounded-lg object-cover shadow-sm border border-foreground/10"
                            />
                        )}

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20">
                                {market.platform[0]}
                            </div>
                            <Badge variant="outline" className="text-xs">{market.platform}</Badge>
                            <span className="text-muted-foreground text-xs">•</span>
                            <Badge variant="secondary" className="text-xs">{market.category}</Badge>
                            {market.status !== 'Active' && <Badge variant={market.status === 'Resolved' ? 'secondary' : 'destructive'} className="text-xs">{market.status}</Badge>}
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight">{market.title}</h1>
                </div>

                <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="icon"><Share2 className="w-4 h-4" /></Button>
                    <Button className="gap-2 font-semibold shadow-lg shadow-primary/20">
                        Trade on {market.platform} <ExternalLink className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {market.isArbitrage && (
                <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-md flex items-start gap-3 shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-yellow-700 dark:text-yellow-400">Arbitrage Opportunity Detected</h3>
                        <p className="text-sm text-yellow-700/80 dark:text-yellow-400/80">
                            Prices for this event differ significantly across platforms. Check {market.clusterId ? 'linked markets' : 'other platforms'} for spread.
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Chart Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="pb-2 border-b bg-muted/20">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Price History</CardTitle>
                                <div className="flex gap-4 text-sm font-medium">
                                    <span className="text-green-500">Yes: {(market.yesPrice * 100).toFixed(0)}%</span>
                                    <span className="text-red-500">No: {(market.noPrice * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[350px] pt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={historyData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="date" hide />
                                    <YAxis domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                        formatter={(value: number) => [`${(value * 100).toFixed(0)}%`, 'Probability']}
                                        labelFormatter={() => ''}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Outcomes List - Interactive Looking */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            Market Outcomes
                        </h3>
                        {market.outcomes ? (
                            market.outcomes.map((outcome, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors cursor-pointer group shadow-sm">
                                    <span className="font-bold text-lg group-hover:text-primary transition-colors">{outcome.name}</span>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="text-2xl font-bold tracking-tight">{(outcome.price * 100).toFixed(0)}%</div>
                                            <div className="text-xs text-muted-foreground uppercase font-medium">Probability</div>
                                        </div>
                                        <Button size="sm" variant={outcome.name === 'Yes' ? 'default' : 'destructive'} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            Buy {outcome.name}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-green-500/50 transition-colors cursor-pointer group shadow-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                                    <span className="font-bold text-lg group-hover:text-green-500 transition-colors">Yes</span>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="text-2xl font-bold tracking-tight text-green-600">{(market.yesPrice * 100).toFixed(0)}%</div>
                                            <div className="text-xs text-muted-foreground uppercase font-medium">Probability</div>
                                        </div>
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700">Buy Yes</Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-red-500/50 transition-colors cursor-pointer group shadow-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                                    <span className="font-bold text-lg group-hover:text-red-500 transition-colors">No</span>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="text-2xl font-bold tracking-tight text-red-600">{(market.noPrice * 100).toFixed(0)}%</div>
                                            <div className="text-xs text-muted-foreground uppercase font-medium">Probability</div>
                                        </div>
                                        <Button variant="destructive" size="sm">Buy No</Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats Column */}
                <div className="space-y-6">
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle>Market Data</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Volume</span>
                                <span className="font-mono font-medium">${(market.volume / 1000).toFixed(1)}k</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Liquidity</span>
                                <span className="font-mono font-medium">${(market.liquidity / 1000).toFixed(1)}k</span>
                            </div>
                            <div className="w-full h-px bg-border/50" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Start Date</span>
                                <span className="font-mono text-sm">{new Date(Date.now() - 100000000).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Resolution Date</span>
                                <span className="font-mono text-sm">{new Date(market.endTime).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30 border-none shadow-inner">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">About this market</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed text-foreground/80">
                                {market.description || `This market resolves to "Yes" if the event described in the title occurs by the resolution date. Rules are defined by ${market.platform}.`}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
