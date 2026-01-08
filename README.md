# PredictAll - Prediction Market Aggregator

A unified interface for discovering and analyzing prediction markets across Kalshi, Polymarket, Myriad, Limitless, and Predict.

## Features

- **Unified Dashboard**: View markets from 5 major platforms in one place.
- **Dual Layouts**: Toggle between a consolidated "Unified" feed and a column-based "Comparison" view.
- **Arbitrage Detection**: Automatically highlights markets with significant price spreads.
- **Advanced Filtering**: Filter by Frequency, Status, Category, and specific Platforms.
- **Market Details**: Rich detail pages with mock historical price charts and outcome analysis.
- **Dark/Light Mode**: Fully thematic UI respecting system preferences.

## Tech Stack

- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS (Custom "Nansen-style" theme)
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Architecture

- **`src/types/market.ts`**: Core interfaces (`Market`, `Platform`, `Category`).
- **`src/store/marketStore.ts`**: Centralized mock data generator and state management (Singleton pattern). Generates ~200 mock markets on load.
- **`src/hooks/useMarkets.ts`**: React hook for subscribing to the store.
- **`src/components/ui`**: Atomic UI components (`Card`, `Button`, `Badge`).
- **`src/components/dashboard`**: High-level views (`UnifiedView`, `ComparisonView`, `HeroSection`).

## Mock Data API

The app currently uses a sophisticated internal generator (`generateMockMarkets`) to simulate a live environment.
To connect real APIs:
1. Update `MarketStore` to fetch from endpoints instead of generating data.
2. Normalize external API responses to the `Market` interface.
