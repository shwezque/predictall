import { Platform } from "../../types/market";
import { cn } from "../../lib/utils";

interface PlatformLogoProps {
    platform: Platform;
    className?: string;
    showName?: boolean;
}

export function PlatformLogo({ platform, className, showName = false }: PlatformLogoProps) {
    const getLogo = (p: Platform) => {
        switch (p) {
            case 'Polymarket':
                return (
                    // Blue Abstract 'P'
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#007AFF]">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.5 13H11V16H15.5C16.88 16 18 14.88 18 13.5V13C18 11.62 16.88 10.5 15.5 10.5H11V8H15.5C16.88 8 18 9.12 18 10.5V13C18 11.62 16.88 13 15.5 13Z" fill="currentColor" />
                        <rect x="9" y="7" width="2" height="10" rx="1" fill="currentColor" />
                    </svg>
                );
            case 'Kalshi':
                return (
                    // Green 'K' geometric
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#00D166]">
                        <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
                        <path d="M8 7V17M8 12H10M10 12L15 7M10 12L15 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'Myriad':
                return (
                    // Purple Multi-dot 'M'
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#A855F7]">
                        <path d="M4 19V7L10 18L12 18L14 18L20 7V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'Limitless':
                return (
                    // Orange Infinity
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#F97316]">
                        <path d="M7 8C4.79 8 3 9.79 3 12C3 14.21 4.79 16 7 16C9.21 16 11 14.21 11 12C11 9.79 9.21 8 7 8ZM17 8C14.79 8 13 9.79 13 12C13 14.21 14.79 16 17 16C19.21 16 21 14.21 21 12C21 9.79 19.21 8 17 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'Predict':
                return (
                    // Indigo Eye/Prediction
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#6366F1]">
                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                        <path d="M21 12C21 12 18 18 12 18C6 18 3 12 3 12C3 12 6 6 12 6C18 6 21 12 21 12Z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                );
        }
    };

    return (
        <div className={cn("flex items-center gap-1.5", className)}>
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {getLogo(platform)}
            </div>
            {showName && (
                <span className="font-bold text-xs uppercase tracking-wider">{platform}</span>
            )}
        </div>
    );
}
