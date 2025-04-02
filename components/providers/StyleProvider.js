import { useEffect } from 'react';

// Critical CSS imports
import "/public/css/bootstrap.min.css"
import "/public/fonts/font-icons.css"
import "/public/fonts/fonts.css"

export default function StyleProvider() {
    useEffect(() => {
        // Defer non-critical CSS loading
        const loadNonCriticalCSS = async () => {
            await Promise.all([
                import("/public/css/swiper-bundle.min.css"),
                import("/public/css/animate.css"),
                import("/public/css/styles.css")
            ]);
        };
        
        // Load non-critical CSS after page load
        if (typeof window !== 'undefined') {
            window.requestIdleCallback(() => {
                loadNonCriticalCSS();
            });
        }
    }, []);

    return null;
}