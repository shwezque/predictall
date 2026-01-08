import { useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, LogOut, LayoutDashboard, LineChart, PieChart } from "lucide-react";
import { useMarkets } from "../../hooks/useMarkets";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";

export function Navbar() {
    const { updateFilter, filter, user, login, logout, isAuthenticated } = useMarkets();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Portfolio', path: '/portfolio', icon: PieChart },
        { label: 'Analytics', path: '/analytics', icon: LineChart },
    ];

    return (
        <nav className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container h-full max-w-7xl mx-auto flex items-center justify-between px-4 gap-4">
                {/* Logo & Nav */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-primary-foreground">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg tracking-tight hidden md:block">PredictAll</span>
                    </div>

                    <div className="flex items-center gap-1">
                        {navItems.map(item => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={cn(
                                        "px-2 md:px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <Icon className="w-5 h-5 md:w-4 md:h-4" />
                                    <span className="hidden md:inline">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Search & Actions */}
                <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
                    <div className="relative w-full max-w-md hidden md:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search markets..."
                            className="w-full h-9 pl-9 pr-4 rounded-full bg-muted/50 border-none focus:ring-1 focus:ring-ring text-sm transition-all text-foreground placeholder:text-muted-foreground/70"
                            value={filter.searchQuery || ''}
                            onChange={(e) => updateFilter({ searchQuery: e.target.value })}
                        />
                    </div>

                    <Button variant="ghost" size="icon" className="shrink-0">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <ThemeToggle />

                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold hidden md:inline-block">{user?.name}</span>
                            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                                <LogOut className="w-4 h-4" />
                            </Button>
                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 overflow-hidden">
                                <img src={user?.avatar} alt="User" />
                            </div>
                        </div>
                    ) : (
                        <Button size="sm" onClick={login} className="font-bold">
                            Login
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
