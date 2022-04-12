type Idebounce = (cb: (...args: Array<{}>) => void, wait?: number, immediate?: boolean) => (...args: Array<{}>) => void;

export interface SwipingEvent {
    x: number;
    y: number;
    dx: number;
    dy: number;
}

const debounce: Idebounce = (callback, wait, immediate) => {
    let timeout: unknown;

    return (...args) => {
        const later = () => {
            timeout = undefined;
            if (!immediate) callback(...args);
        };

        const callNow = immediate && !timeout;

        clearTimeout(timeout as ReturnType<typeof setTimeout>);

        timeout = setTimeout(later, wait);
        if (callNow) callback(...args);
    };
};

export enum SwipingEvents {
    onSwipe = '@thejsguy:swipe',
    onSwiping = '@thejsguy:swiping'
}

const createSwipeEvent = (direction: string) =>
    new CustomEvent(SwipingEvents.onSwipe, { detail: { direction } });

const createSwipingEvent = (detail: SwipingEvent) =>
    new CustomEvent<SwipingEvent>(SwipingEvents.onSwiping, { detail });

enum TouchStatus {
    started = "@thejsguy:swiper:touchStarted",
    ended = "@thejsguy:swiper:touchEnded"
};

export const detectSwipe = () => {
    let detect = {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        minX: 30, // min X swipe for horizontal swipe
        maxX: 30, // max X difference for vertical swipe
        minY: 50, // min Y swipe for vertial swipe
        maxY: 60, // max Y difference for horizontal swipe
    };
    let direction: string | undefined;
    let element: HTMLElement;
    let touchStatus = TouchStatus.ended;

    let initialiseDetect = () => {
        detect = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            minX: 30,
            maxX: 30,
            minY: 50,
            maxY: 60,
        };
    };

    let initialiseDirection = () => {
        direction = undefined;
    };

    const debouncedCallback = debounce((direction) => {
        document.dispatchEvent(createSwipeEvent(direction as string));
    }, 50);

    const debouncedSwiping = debounce((event) => {
        document.dispatchEvent(createSwipingEvent(event as SwipingEvent));
    }, 5);

    const getSwipeDirection = () => {
        if (
            // Horizontal move.
            Math.abs(detect.endX - detect.startX) > detect.minX &&
            Math.abs(detect.endY - detect.startY) < detect.maxY
        ) {
            return detect.endX > detect.startX ? "right" : "left";
        } else if (
            // Vertical move.
            Math.abs(detect.endY - detect.startY) > detect.minY &&
            Math.abs(detect.endX - detect.startX) < detect.maxX
        ) {
            return detect.endY > detect.startY ? "down" : "up";
        }
        return;
    };

    const onTouchStart = (event: TouchEvent) => {
        const [touch] = event.touches as unknown as Touch[];
        detect.startX = touch.screenX;
        detect.startY = touch.screenY;
        touchStatus = TouchStatus.started;
    };

    const onTouchMove = (event: TouchEvent) => {
        const [touch] = event.touches as unknown as Touch[];
        detect.endX = touch.screenX;
        detect.endY = touch.screenY;
        if (getSwipeDirection() === "left" || getSwipeDirection() === "right") {
            event.preventDefault();
        }

        if (touchStatus === TouchStatus.started) {
            debouncedSwiping({
                x: touch.screenX,
                y: touch.screenY,
                dx: touch.screenX - detect.startX,
                dy: touch.screenY - detect.startY,
            });
        }
    };

    const onTouchEnd = (event: TouchEvent) => {
        touchStatus = TouchStatus.ended;
        direction = getSwipeDirection();

        if (direction && typeof debouncedCallback === "function") {
            debouncedCallback(direction);
        }
    };

    return {
        startSwiper: (el: HTMLElement) => {
            element = el;
            initialiseDetect();
            initialiseDirection();
            element.addEventListener("touchstart", onTouchStart);
            element.addEventListener("touchmove", onTouchMove);
            element.addEventListener("touchend", onTouchEnd);
        },
        stopSwiper: () => {
            element.removeEventListener("touchstart", onTouchStart);
            element.removeEventListener("touchmove", onTouchMove);
            element.removeEventListener("touchend", onTouchEnd);
        },
    };
};
