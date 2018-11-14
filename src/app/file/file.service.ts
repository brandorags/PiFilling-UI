import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Constants } from '../common/constants';
import { FileMetadata } from '../models/file/file-metadata';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  fileListEventEmitter: EventEmitter<FileList> = new EventEmitter();

  constructor(private http: HttpClient) { }

  getFilesForPath(path: string): Observable<FileMetadata[]> {
    const params = new HttpParams()
      .set('path', path);

    return this.http.get<FileMetadata[]>(Constants.apiBaseUrl + 'api/file', { params: params, withCredentials: true });
  }

  upload(formData: FormData): Observable<any> {
    const uploadRequest = new HttpRequest('POST', Constants.apiBaseUrl + 'api/file/upload', formData, {
      withCredentials: true,
      reportProgress: true
    });

    return this.http.request<any>(uploadRequest);
  }

}
