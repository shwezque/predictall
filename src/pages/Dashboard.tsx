import { UnifiedView } from "../components/dashboard/UnifiedView";
import { ComparisonView } from "../components/dashboard/ComparisonView";
import { HeroSection } from "../components/dashboard/HeroSection";
import { useMarkets } from "../hooks/useMarkets";

export function Dashboard() {
    const { filter } = useMarkets();

    return (
        <div className="container py-6 space-y-8 px-4 md:px-8">
            <HeroSection />

            <main className="min-h-[500px]">
                {filter.layoutMode === 'Unified' ? (
                    <UnifiedView />
                ) : (
                    <ComparisonView />
                )}
            </main>
        </div>
    );
}
