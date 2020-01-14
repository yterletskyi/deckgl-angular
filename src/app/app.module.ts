import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { GoogleMapsModule } from '@angular/google-maps'

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
