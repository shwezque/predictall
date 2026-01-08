import { Market, MarketFilter, Platform, Category } from '../types/market';
// Removed unused constants
const PLATFORMS: Platform[] = ['Kalshi', 'Polymarket', 'Myriad', 'Limitless', 'Predict'];

// Helper to generate history
const generateHistory = (points: number, startPrice: number, endPrice: number) => {
    const history = [];
    let currentPrice = startPrice;
    const now = Date.now();
    const interval = 3600000; // 1 hour

    for (let i = 0; i < points; i++) {
        history.push({
            timestamp: now - ((points - i) * interval),
            value: currentPrice
        });
        // Random walk towards endPrice
        const move = (Math.random() - 0.5) * 0.05;
        const bias = (endPrice - currentPrice) * 0.02; // Small pull towards destination
        currentPrice = Math.max(0.01, Math.min(0.99, currentPrice + move + bias));
    }
    return history;
};

const EVENTS_DATA = [
    { title: "2024 US Presidential Election Winner", category: "Politics", type: 'MULTIPLE_CHOICE', options: ['Trump', 'Biden', 'Kennedy', 'Newsom'] },
    { title: "Fed Interest Rate Cut in March", category: "Economics", type: 'BINARY' },
    { title: "Bitcoin to hit $100k by Q4", category: "Crypto", type: 'BINARY' },
    { title: "Super Bowl LVIII Winner", category: "Sports", type: 'MULTIPLE_CHOICE', options: ['49ers', 'Chiefs', 'Ravens', 'Lions'] },
    { title: "Oscars 2025: Best Picture", category: "Culture", type: 'MULTIPLE_CHOICE', options: ['Oppenheimer', 'Barbie', 'Killers of the Flower Moon', 'Poor Things'] },
    { title: "SpaceX Starship orbital launch success", category: "Tech & Science", type: 'BINARY' },
    { title: "China GDP Growth > 5%", category: "Economics", type: 'BINARY' },
    { title: "Next Pandemic declared by WHO?", category: "World", type: 'BINARY' },
    { title: "Taylor Swift new album release 2024", category: "Culture", type: 'BINARY' },
    { title: "Ether ETF Approval", category: "Crypto", type: 'BINARY' },
    { title: "Next James Bond Actor", category: "Culture", type: 'MULTIPLE_CHOICE', options: ['Aaron Taylor-Johnson', 'Henry Cavill', 'Idris Elba', 'James Norton'] },
    { title: "Highest Grossing Movie 2024", category: "Culture", type: 'MULTIPLE_CHOICE', options: ['Dune: Part Two', 'Deadpool 3', 'Despicable Me 4', 'Inside Out 2'] },
    { title: "Will AI surpass human intelligence by 2030?", category: "Tech & Science", type: 'BINARY' },
    { title: "Champions League Winner 2024", category: "Sports", type: 'MULTIPLE_CHOICE', options: ['Man City', 'Real Madrid', 'Bayern Munich', 'Arsenal'] },
    { title: "SOL to flip ETH market cap in 2024?", category: "Crypto", type: 'BINARY' },
] as const;

import { CATEGORY_IMAGES } from '../constants/images';

// Event-Centric Generation
const generateMockMarkets = (): Market[] => {
    const markets: Market[] = [];
    let marketIdCounter = 0;

    // We generate "Clusters" first from our detailed event list
    EVENTS_DATA.forEach((event, i) => {
        const clusterId = `event-${i}`;

        // Is this an Arbitrage Opportunity?
        const isArbEvent = Math.random() > 0.85; // 15% chance

        // Determine active platforms for this event
        let numPlatforms = Math.floor(Math.random() * 4) + 1; // 1 to 4
        if (isArbEvent && numPlatforms < 2) numPlatforms = 2;

        // Shuffle platforms
        const shuffledPlatforms = [...PLATFORMS].sort(() => 0.5 - Math.random());
        const selectedPlatforms = shuffledPlatforms.slice(0, numPlatforms);

        // Base Probabilities
        let outcomes: { name: string, price: number, color?: string }[] = [];

        if (event.type === 'BINARY') {
            const trueProb = Math.random();
            outcomes = [
                { name: 'Yes', price: trueProb },
                { name: 'No', price: 1 - trueProb }
            ];
        } else {
            // Generate random sum=1 probabilities for options
            let remaining = 1.0;
            event.options.forEach((opt, idx) => {
                if (idx === event.options.length - 1) {
                    outcomes.push({ name: opt, price: remaining });
                } else {
                    const p = Math.random() * remaining * 0.8; // Skewed
                    remaining -= p;
                    outcomes.push({ name: opt, price: p });
                }
            });
            // Sort by price desc to simulate favorites
            outcomes.sort((a, b) => b.price - a.price);
        }

        const baseTitle = event.title;
        const category = event.category as Category;

        // Consistent Image for this Event Cluster
        const eventImage = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Default'];

        selectedPlatforms.forEach(platform => {
            // Deviation logic
            let platformOutcomes = outcomes.map(o => ({ ...o })); // Clone

            // Apply noise/arb
            if (event.type === 'BINARY') {
                let deviation = (Math.random() - 0.5) * 0.1;
                if (isArbEvent) {
                    const direction = Math.random() > 0.5 ? 1 : -1;
                    deviation = direction * (0.15 + Math.random() * 0.15);
                }
                platformOutcomes[0].price = Math.max(0.01, Math.min(0.99, platformOutcomes[0].price + deviation));
                platformOutcomes[1].price = 1 - platformOutcomes[0].price;
            } else {
                // For multi, just slight noise, harder to Arb consistently in mock without complex logic
                platformOutcomes.forEach(o => {
                    o.price = Math.max(0.01, Math.min(0.99, o.price + (Math.random() - 0.5) * 0.05));
                });
                // Normalize roughly
                const total = platformOutcomes.reduce((s, o) => s + o.price, 0);
                platformOutcomes.forEach(o => o.price /= total);
            }

            // Create Market Object
            const yesPrice = platformOutcomes[0].price; // Primary metric for binary, or top option for list?
            const noPrice = event.type === 'BINARY' ? platformOutcomes[1].price : 0;

            // Colors for Multi
            const colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
            platformOutcomes.forEach((o, idx) => { o.color = colors[idx % colors.length]; });

            markets.push({
                id: `mkt-${marketIdCounter++}`,
                platform,
                title: baseTitle,
                category,
                type: event.type as 'BINARY' | 'MULTIPLE_CHOICE',
                status: 'Active',
                endTime: new Date(Date.now() + Math.random() * 10000000000).toISOString(),
                liquidity: Math.floor(Math.random() * 1000000) + 10000,
                volume: Math.floor(Math.random() * 5000000),
                yesPrice,
                noPrice,
                clusterId,
                isArbitrage: isArbEvent,
                image: eventImage,
                description: `This market predicts ${baseTitle}.`,
                outcomes: platformOutcomes,
                probabilityHistory: generateHistory(24, Math.random(), yesPrice)
            });
        });
    });

    return markets;
};

class MarketStore {
    private markets: Market[] = [];
    private listeners: (() => void)[] = [];

    // Auth State
    isAuthenticated: boolean = false;
    user: { name: string, avatar: string } | null = null;

    // Watchlist State (Set of IDs)
    watchlist: Set<string> = new Set();

    filter: MarketFilter = {
        frequency: 'All',
        status: 'All',
        category: 'All',
        platforms: ['Kalshi', 'Polymarket', 'Myriad', 'Limitless', 'Predict'],
        sortBy: 'Liquidity',
        viewMode: 'Card',
        layoutMode: 'Unified',
        searchQuery: ''
    };

    constructor() {
        this.markets = generateMockMarkets();
    }

    getMarkets(): Market[] {
        let filtered = this.markets.filter(m => {
            // Search
            if (this.filter.searchQuery) {
                const q = this.filter.searchQuery.toLowerCase();
                if (!m.title.toLowerCase().includes(q) && !m.category.toLowerCase().includes(q)) return false;
            }

            // Status (Multi-select)
            if (this.filter.status !== 'All') {
                const allowedStatus = Array.isArray(this.filter.status) ? this.filter.status : [this.filter.status];
                if (!allowedStatus.includes(m.status)) return false;
            }
            // Category (Multi-select)
            if (this.filter.category !== 'All') {
                const allowedCats = Array.isArray(this.filter.category) ? this.filter.category : [this.filter.category];
                if (!allowedCats.includes(m.category)) return false;
            }

            // Platform
            if (!this.filter.platforms.includes(m.platform)) return false;

            return true;
        });

        // Sorting logic
        filtered = filtered.sort((a, b) => {
            switch (this.filter.sortBy) {
                case 'Liquidity': return b.liquidity - a.liquidity;
                case 'Newest': return new Date(b.endTime).getTime() - new Date(a.endTime).getTime(); // Rough proxy
                case 'Ending Soon': return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
                case 'Trending': return b.volume - a.volume;
                case 'Competitive': return Math.abs(0.5 - a.yesPrice) - Math.abs(0.5 - b.yesPrice); // Closer to 50/50
                default: return 0;
            }
        });

        return filtered;
    }

    setFilter(newFilter: Partial<MarketFilter>) {
        this.filter = { ...this.filter, ...newFilter };
        this.notify();
    }

    // Actions
    login() {
        this.isAuthenticated = true;
        this.user = { name: "Demo Trader", avatar: "https://github.com/shadcn.png" };
        this.notify();
    }

    logout() {
        this.isAuthenticated = false;
        this.user = null;
        this.notify();
    }

    toggleWatchlist(marketId: string) {
        if (this.watchlist.has(marketId)) {
            this.watchlist.delete(marketId);
        } else {
            this.watchlist.add(marketId);
        }
        this.notify();
    }

    isWatched(marketId: string) {
        return this.watchlist.has(marketId);
    }

    getWatchlistMarkets(): Market[] {
        return this.markets.filter(m => this.watchlist.has(m.id));
    }

    subscribe(listener: () => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify() {
        this.listeners.forEach(l => l());
    }
}

export const marketStore = new MarketStore();
