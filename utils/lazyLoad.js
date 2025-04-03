export const lazyLoadImage = (imageRef) => {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            },
            { rootMargin: '50px' }
        );
        observer.observe(imageRef);
    }
};

export const lazyLoadComponent = (componentRef) => {
    const options = {
        threshold: 0.1,
        rootMargin: '20px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    if (componentRef.current) {
        observer.observe(componentRef.current);
    }

    return () => {
        if (componentRef.current) {
            observer.unobserve(componentRef.current);
        }
    };
};

export const deferredLoad = (callback, delay = 1000) => {
    if (window.requestIdleCallback) {
        window.requestIdleCallback(callback);
    } else {
        setTimeout(callback, delay);
    }
};