export type Platform = 'Kalshi' | 'Polymarket' | 'Myriad' | 'Limitless' | 'Predict';
export type Frequency = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Annually';
export type MarketStatus = 'Active' | 'Closed' | 'Resolved';
export type Category =
    | 'Politics'
    | 'Sports'
    | 'Culture'
    | 'Crypto'
    | 'Climate'
    | 'Economics'
    | 'Mentions'
    | 'Companies'
    | 'Financials'
    | 'Tech & Science'
    | 'Health'
    | 'World';

export interface Outcome {
    name: string;
    price: number;
    color?: string;
}

export interface Market {
    id: string;
    platform: Platform;
    title: string;
    description?: string; // New: Full description
    image?: string;      // New: Market image/icon
    category: Category;
    frequency?: Frequency;
    status: MarketStatus;
    endTime: string;
    liquidity: number;
    volume: number;
    yesPrice: number;
    noPrice: number;
    clusterId?: string; // For arbitrage grouping
    url?: string;
    isArbitrage?: boolean; // Highlight if it's an arb opportunity
    probabilityHistory?: { timestamp: number; value: number }[]; // New: Mock history for charts
    type: 'BINARY' | 'MULTIPLE_CHOICE'; // New: Distinguish market structure
    outcomes: Outcome[]; // Required for all
}

export interface MarketFilter {
    frequency: Frequency | 'All';
    status: MarketStatus | 'All' | MarketStatus[]; // Updated for multi-select
    category: Category | 'All' | Category[];       // Updated for multi-select
    platforms: Platform[];
    sortBy: 'Liquidity' | 'Newest' | 'Ending Soon' | 'Trending' | 'Competitive';
    viewMode: 'Card' | 'List';
    layoutMode: 'Unified' | 'Comparison';
    searchQuery?: string; // New: Global search
}
