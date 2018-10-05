import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Constants } from '../common/constants';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  upload(formData: FormData): Observable<any> {
    const uploadRequest = new HttpRequest('POST', Constants.apiBaseUrl + 'api/file/upload', formData, {
      withCredentials: true,
      reportProgress: true
    });

    return this.http.request<any>(uploadRequest);
  }

}
