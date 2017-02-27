import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {VSBackendModule} from '../src';
import {Demo} from './demo.component';

@NgModule({
  declarations: [Demo],
  imports: [BrowserModule, VSBackendModule],
  bootstrap: [Demo],
  providers: []
})
export class DemoModule {}