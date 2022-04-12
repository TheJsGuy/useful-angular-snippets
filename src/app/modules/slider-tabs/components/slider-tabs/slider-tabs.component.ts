import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, filter } from "rxjs";
import { detectSwipe, SwipingEvent, SwipingEvents } from "../../utils/slider-util";


@Component({
    selector: 'thejsguy-slider-tabs',
    templateUrl: './slider-tabs.component.html',
    styleUrls: ['./slider-tabs.component.scss']
})
export class SliderComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild('swipeArea', { static: false }) swipeArea?: ElementRef<HTMLDivElement>;
    @ViewChild('dynamicStyle', { static: false }) dynamicStyle?: ElementRef<HTMLStyleElement>;

    tabs = ['Tab 1', 'Tab 2', 'Tab3'];
    activeIndex = 0;
    swiper;

    swipeStarted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    swipePosition: BehaviorSubject<SwipingEvent> = new BehaviorSubject({
        dx: 0,
        dy: 0,
        x: 0,
        y: 0
    })

    constructor() {
        this.swiper = detectSwipe();
    }

    ngOnInit(): void {
        this.swipePosition.pipe(filter(() => {
            return this.swipeStarted.value;
        })).subscribe(_ => {
            // @ts-ignore
            this.dynamicStyle?.nativeElement.innerHTML = `
            <style>
                    .active-tab-content {
                        transform: translateX(${_.dx}px) !important;
                        transition-duration: 0ms !important;
                    }

                    .before-active {
                        transform: translateX(calc(-100% + ${_.dx}px)) !important;
                        transition-duration: 0ms !important;
                    }

                    .after-active {
                        transform: translateX(calc(100% + ${_.dx}px)) !important;
                        transition-duration: 0ms !important;
                    }

                   
            </style>
                `;
        });

        this.swipeStarted.pipe(filter(_ => !_)).subscribe(_ => {
            // @ts-ignore
            this.dynamicStyle?.nativeElement.innerHTML = '';
        });
    }


    selectTab(index: number): void {
        this.activeIndex = index;
    }

    ngAfterViewInit(): void {
        this.swiper.startSwiper(this.swipeArea?.nativeElement as HTMLElement);

        document.addEventListener(SwipingEvents.onSwipe, this.onSwipe as () => void);
        document.addEventListener(SwipingEvents.onSwiping, this.onSwiping as () => void);
    }

    ngOnDestroy(): void {
        document.removeEventListener(SwipingEvents.onSwipe, this.onSwipe as () => void);
        document.removeEventListener(SwipingEvents.onSwiping, this.onSwiping as () => void);
    }


    onSwiping = (event: CustomEvent<SwipingEvent>) => {
        if ((this.activeIndex === 0 && event.detail.dx > 0) || (this.activeIndex === this.tabs.length - 1 && event.detail.dx < 0)) {
            return;
        }

        this.swipeTabs(event);
    }

    swipeTabs = (event: CustomEvent<SwipingEvent>) => {

        if (!this.swipeStarted.value) {
            this.swipeStarted.next(true);
        }
        this.swipePosition.next(event.detail);
    }

    onSwipe = (event: CustomEvent<{direction: string}>) => {
        this.swipeStarted.next(false);
        console.log(event);
        if (event.detail.direction === 'left' && this.activeIndex < this.tabs.length) {
            this.selectTab(this.activeIndex + 1);
        }

        if (event.detail.direction === 'right' && this.activeIndex > 0) {
            this.selectTab(this.activeIndex - 1);
        }
    }
}