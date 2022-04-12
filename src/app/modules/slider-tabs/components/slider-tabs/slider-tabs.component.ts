import { Component } from "@angular/core";


@Component({
    selector: 'thejsguy-slider-tabs',
    templateUrl: './slider-tabs.component.html',
    styleUrls: ['./slider-tabs.component.scss']
})
export class SliderComponent {
    tabs = ['Tab 1', 'Tab 2', 'Tab3'];
    activeIndex = 0;

    selectTab(index: number): void {
        this.activeIndex = index;
    }
}