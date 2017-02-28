import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule, Http, BaseRequestOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpModule],
  exports: [],
  providers: [
    // API: backend mock
    BaseRequestOptions,
    MockBackend,
    {
      provide: Http,
      deps: [MockBackend, BaseRequestOptions],
      useFactory: (backend, options) => { return new Http(backend, options); }
    },
  ]
})
export class VSBackendModule {}
