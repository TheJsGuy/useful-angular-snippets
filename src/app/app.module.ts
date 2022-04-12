import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SliderTabsModule } from './modules/slider-tabs/slider-tabs.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SliderTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
