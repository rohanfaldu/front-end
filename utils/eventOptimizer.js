export const createEventManager = () => {
    const events = new Map();
    let frame;
    const processEvents = () => {
        events.forEach((handler, event) => {
            handler();
        });
        frame = null;
    };

    return {
        add: (eventName, handler) => {
            events.set(eventName, handler);
            if (!frame) {
                frame = requestAnimationFrame(processEvents);
            }
        },
        remove: (eventName) => {
            events.delete(eventName);
        },
        clear: () => {
            events.clear();
            if (frame) {
                cancelAnimationFrame(frame);
                frame = null;
            }
        }
    };
};

export const batchDOMUpdates = (updates) => {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            updates();
            resolve();
        });
    });
};