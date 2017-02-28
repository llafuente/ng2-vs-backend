import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BackendService} from './backendservice';
import {Demo} from './demo.component';
import {VSBackendModule} from '../src';
import {HttpModule, Http, BaseRequestOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

@NgModule({
  declarations: [Demo],
  imports: [BrowserModule, VSBackendModule],
  bootstrap: [Demo],
  providers: [
    BackendService,
  ]
})
export class DemoModule {
  constructor(backendService: BackendService) {
    backendService.init();
  }
}
