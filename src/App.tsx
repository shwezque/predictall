import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { MarketDetail } from "./pages/MarketDetail";
import { Navbar } from "./components/layout/Navbar";
import { Portfolio } from "./pages/Portfolio";
import { Analytics } from "./pages/Analytics";
import { preloadImages } from "./constants/images";

function App() {
    useEffect(() => {
        preloadImages();
    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-background text-foreground font-sans antialiased">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/market/:id" element={<MarketDetail />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/analytics" element={<Analytics />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
