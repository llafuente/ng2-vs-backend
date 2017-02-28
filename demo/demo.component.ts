import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {BackendService} from './backendservice';
import {BackendListener} from '../src/backendlistener';

@Component({
  selector: 'demo-app',
  template: `.
  <div>
    <h1>Backend definitions</h1>
    <pre>{{definitions | json}}</pre>
  </div>

  <h1>Results</h1>
  <pre>{{resultsText}}</pre>

  `
})
export class Demo extends OnInit {
  definitions: any[] = [];
  results: any[] = [];
  resultsText: string = 'loading';

  constructor(
    public backendService: BackendService,
    public http: Http
  ) {
    super();
  }

  ngOnInit(): void {
    this.backendService.listeners.forEach((l: BackendListener) => {
      this.definitions.push(l.method + '::' + l.uri);

      this.http[l.method.toLowerCase()](l.uri)
      .subscribe((response) => {
        this.results.push(l.method + '::' + l.uri);
        this.results.push(response.text());
      });
    });

    this.resultsText = this.results.join('\n\n');
  }
}
