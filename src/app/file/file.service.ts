import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Constants } from '../common/constants';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  upload(formData: FormData): Observable<any> {
    return this.http.post<any>(Constants.apiBaseUrl + 'api/file', formData, Constants.httpOptionsAuth);
  }

}
