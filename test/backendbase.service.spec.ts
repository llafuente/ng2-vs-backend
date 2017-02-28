import {
  inject, ComponentFixture, TestBed, async
} from '@angular/core/testing';
import {expect} from 'chai';
import {BackendBaseService, VSBackendModule, ParsedRequest} from '../src';
import {Injectable} from '@angular/core';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {
  HttpModule,
  Http,
  BaseRequestOptions,
  Response,
  ResponseOptions,
  Headers,
  XHRBackend,
  RequestOptions,
  URLSearchParams
} from '@angular/http';

@Injectable()
export class BackendService extends BackendBaseService {
  public countries: any[] = [
    {id: 0, label: 'Spain'},
    {id: 1, label: 'France'},
    {id: 2, label: 'Italy'},
    {id: 3, label: 'Germany'},
  ];

  constructor(
    public backend: MockBackend,
    public options: BaseRequestOptions,
    public realBackend: XHRBackend
  ) {
    super(backend, options, realBackend);
  }

  init(): void {
    super.init();

    this.addValue('GET', '/api/v1/countries', this.countries);
  }
}



describe('backend base extension service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VSBackendModule],
      providers: [
        BackendService
      ]
    });
  });

  it('Well defined listeners', inject([BackendService], (backendService: BackendService) => {
    // manually call
    backendService.init();

    expect(backendService.listeners).instanceof(Array);
    expect(backendService.listeners).has.length(1);

    expect(backendService.listeners[0].value).instanceof(Array);
    expect(backendService.listeners[0].value).has.length(4);
    expect(backendService.listeners[0].uri).to.equal('/api/v1/countries');
    expect(backendService.listeners[0].method).to.equal('GET');
  }));

  it('get countries', inject([Http, BackendService], (http: Http, backendService: BackendService) => {
    backendService.init();

    http.get('/api/v1/countries')
    .subscribe((response: Response) => {
      let json: any = response.json();
      expect(json).instanceof(Array);
      expect(json).has.length(4);
    }, (e) => {
      expect(false).to.equal(true, '/api/v1/countries Errored');
    });
  }));

  it('modify a country and get the modification', inject([Http, BackendService], (http: Http, backendService: BackendService) => {
    backendService.init();
    backendService.countries[0].label = 'España!';

    http.get('/api/v1/countries')
    .subscribe((response: Response) => {
      let json: any = response.json();
      expect(json).instanceof(Array);
      expect(json).has.length(4);
      expect(json[0].label).to.equal('España!');
    }, (e) => {
      expect(false).to.equal(true, '/api/v1/countries (2nd) Errored');
    });
  }));

  it('fail 404', async(inject([Http, BackendService], (http: Http, backendService: BackendService) => {
    backendService.init();

    http.get('/bad-request')
    .subscribe((response: Response) => {
      expect(false).to.equal(true, 'Ok subscriber called?');
    }, (e) => {
      console.log('e.status', e.status);
      expect(e.status).to.equal(404);
    });
  })));

  it('listener', async(inject([Http, BackendService], (http: Http, backendService: BackendService) => {
    backendService.init();
    backendService.addListener('POST', /\/api\/v1\/country\/(.*)/, (p: ParsedRequest, matches: string[]) => {
      let id: number = parseInt(matches[1], 10);
      expect(id).to.equal(1);

      return new ResponseOptions({
        status: 204
      });
    });

    http.post('/api/v1/country/1', {
      label: 'La France'
    })
    .subscribe((response: Response) => {
      console.log(response);
      expect(response.status).to.equal(204);
      expect(response.headers).to.not.equal(null);
      expect(response.url).to.equal('/api/v1/country/1');
    }, (e) => {
      expect(false).to.equal(true, 'Err subscriber called?');
    });
  })));

});
