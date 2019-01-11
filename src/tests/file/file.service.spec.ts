import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FileService } from '../../app/file/file.service';

import { Constants } from '../../app/common/constants';
import { Folder } from 'src/app/models/file/folder';

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

  it('should get the files from the path query parameter', inject([FileService], (service: FileService) => {
    let path = 'testPath';

    service.getFilesForPath(path).subscribe();

    let mockRequest = mockHttp.expectOne(Constants.apiBaseUrl + `api/file/file-metadata?path=${path}`);

    expect(mockRequest.request.method).toEqual('GET');
    expect(mockRequest.request.withCredentials).toBeTruthy();
    expect(mockRequest.request.responseType).toEqual('json');
  }));

  it('should upload the file', inject([FileService], (service: FileService) => {
    let file = new FormData();
    let folderPath = 'test/path';

    service.uploadFile(file, folderPath).subscribe();

    let mockRequest = mockHttp.expectOne(Constants.apiBaseUrl + 'api/file/upload-file');

    expect(mockRequest.request.method).toEqual('POST');
    expect(mockRequest.request.withCredentials).toBeTruthy();
    expect(mockRequest.request.reportProgress).toBeTruthy();
    expect(mockRequest.request.responseType).toEqual('json');
  }));

  it('should create a new folder', inject([FileService], (service: FileService) => {
    let folder = new Folder();
    folder.name = 'testFolder';
    folder.path = '/test/path/to/testFolder';

    service.createNewFolder(folder).subscribe();

    let mockRequest = mockHttp.expectOne(Constants.apiBaseUrl + 'api/file/new-directory');

    expect(mockRequest.request.method).toEqual('POST');
    expect(mockRequest.request.withCredentials).toBeTruthy();
    expect(mockRequest.request.responseType).toEqual('json');
  }));
});
