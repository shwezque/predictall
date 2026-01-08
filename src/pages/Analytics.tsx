import { useMarkets } from "../hooks/useMarkets";
import { Card } from "../components/ui/Card";
import { BarChart, Activity } from "lucide-react";

export function Analytics() {
    const { isAuthenticated, login } = useMarkets();

    if (!isAuthenticated) return (
        <div className="container max-w-7xl mx-auto py-20 px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Analytics Locked</h2>
            <button onClick={login} className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow">
                Login to View Analytics
            </button>
        </div>
    );

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Performance Analytics</h1>
                    <p className="text-muted-foreground">Deep dive into your betting performance.</p>
                </div>
            </div>

            {/* Placeholder Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 h-[300px] flex flex-col justify-center items-center gap-4 bg-card/60">
                    <BarChart className="w-16 h-16 text-muted-foreground/20" />
                    <p className="font-bold text-muted-foreground">PnL History (Coming Soon)</p>
                </Card>
                <Card className="p-6 h-[300px] flex flex-col justify-center items-center gap-4 bg-card/60">
                    <Activity className="w-16 h-16 text-muted-foreground/20" />
                    <p className="font-bold text-muted-foreground">Volume Analysis (Coming Soon)</p>
                </Card>
            </div>
        </div>
    );
}
