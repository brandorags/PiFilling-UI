import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class DownloadHelper {

  saveFile(response: HttpResponse<any>): string {
    let blob = new Blob([response.body]);
    let contentDispositionHeader = response.headers.get('Content-Disposition');
    let headerRegex = /filename=([^;]+)/ig.exec(contentDispositionHeader);
    let filename = (headerRegex.length > 1) ? headerRegex[1].trim() : 'file';

    saveAs(blob, filename);

    return filename;
  }

}
