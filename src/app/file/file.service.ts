import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Constants } from '../common/constants';
import { FileMetadata } from '../models/file/file-metadata';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  upload(formData: FormData): Observable<FileMetadata[]> {
    return this.http.post<FileMetadata[]>(Constants.apiBaseUrl + 'api/file/upload', formData, Constants.httpOptionsAuth);
  }

}
