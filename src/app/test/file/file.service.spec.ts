import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FileService } from '../../file/file.service';

import { Constants } from '../../common/constants';

describe('FileService', () => {
  let mockHttp: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileService]
    });

    mockHttp = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', inject([FileService], (service: FileService) => {
    expect(service).toBeTruthy();
  }));

  it('should upload the file', inject([FileService], (service: FileService) => {
    let file = new FormData();

    service.upload(file).subscribe();

    let mockRequest = mockHttp.expectOne(Constants.apiBaseUrl + 'api/file/upload');

    expect(mockRequest.request.method).toEqual('POST');
    expect(mockRequest.request.withCredentials).toBeTruthy();
    expect(mockRequest.request.reportProgress).toBeTruthy();
    expect(mockRequest.request.responseType).toEqual('json');
  }));
});
