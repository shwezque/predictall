import { useState, useEffect } from 'react';
import { marketStore } from '../store/marketStore';

export const useMarkets = () => {
    const [markets, setMarkets] = useState(marketStore.getMarkets());
    const [filter, setFilter] = useState(marketStore.filter);
    const [user, setUser] = useState(marketStore.user);
    const [isAuthenticated, setIsAuthenticated] = useState(marketStore.isAuthenticated);
    const [watchlist, setWatchlist] = useState(marketStore.watchlist);

    useEffect(() => {
        const unsub = marketStore.subscribe(() => {
            setMarkets([...marketStore.getMarkets()]);
            setFilter({ ...marketStore.filter });
            setUser(marketStore.user);
            setIsAuthenticated(marketStore.isAuthenticated);
            setWatchlist(new Set(marketStore.watchlist)); // New Set to trigger render if needed
        });
        return unsub;
    }, []);

    const updateFilter = (newFilter: Partial<typeof filter>) => {
        marketStore.setFilter(newFilter);
    };

    return {
        markets,
        filter,
        updateFilter,
        user,
        isAuthenticated,
        watchlist,
        login: () => marketStore.login(),
        logout: () => marketStore.logout(),
        toggleWatchlist: (id: string) => marketStore.toggleWatchlist(id),
        isWatched: (id: string) => marketStore.isWatched(id),
        getWatchlistMarkets: () => marketStore.getWatchlistMarkets()
    };
};
