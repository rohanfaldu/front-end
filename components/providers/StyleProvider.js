import { useEffect } from 'react';

export default function StyleProvider() {
    useEffect(() => {
        const loadStylesheet = (href) => {
            return new Promise((resolve) => {
                if (!document.querySelector(`link[href="${href}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = href;
                    link.onload = resolve;
                    link.onerror = resolve; // Continue even if error
                    document.head.insertBefore(link, document.head.firstChild);
                } else {
                    resolve();
                }
            });
        };

        const loadAllStyles = async () => {
            // Critical styles
            await Promise.all([
                loadStylesheet("/public/css/bootstrap.min.css"),
                loadStylesheet("/public/fonts/font-icons.css"),
                loadStylesheet("/public/fonts/fonts.css")
            ]);

            // Non-critical styles
            await Promise.all([
                loadStylesheet("/public/css/swiper-bundle.min.css"),
                loadStylesheet("/public/css/animate.css"),
                loadStylesheet("/public/css/styles.css")
            ]);

            document.documentElement.classList.add('styles-loaded');
        };

        loadAllStyles();
    }, []);

    return null;
}