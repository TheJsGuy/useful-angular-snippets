import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SliderComponent } from "./components/slider-tabs/slider-tabs.component";



@NgModule({
    declarations: [SliderComponent],
    exports: [SliderComponent],
    providers: [],
    imports: [CommonModule]
})
export class SliderTabsModule { }