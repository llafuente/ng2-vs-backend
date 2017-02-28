import {BackendBaseService} from '../src';
import {Injectable} from '@angular/core';
import {MockBackend} from '@angular/http/testing';
import {
  BaseRequestOptions,
  ResponseOptions,
  Headers,
  XHRBackend,
  RequestOptions,
} from '@angular/http';

@Injectable()
export class BackendService extends BackendBaseService {
  constructor(
    public backend: MockBackend,
    public options: BaseRequestOptions,
    public realBackend: XHRBackend
  ) {
    super(backend, options, realBackend);
  }

  init(): void {
    super.init();

    let countries: any = [
      {id: 0, label: 'Spain'},
      {id: 1, label: 'France'},
      {id: 2, label: 'Italy'},
      {id: 3, label: 'Germany'},
    ];

    this.addValue('GET', '/api/v1/countries', countries);
  }
}
