import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { map } from 'rxjs/operators';

import { FileService } from './file.service';

import { FileMetadata } from '../models/file/file-metadata';
import { QueuedFile } from '../models/file/queued-file';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  progress: number;
  message: string;
  files: FileMetadata[] = [];
  queuedFiles: QueuedFile[] = [];

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private fileService: FileService
  ) { }

  ngOnInit() {
    this.getFiles();
  }

  getFiles(): void {
    this.fileService.getFilesForPath('brando').subscribe(
      files => {
        this.files = files;
      },
      error => {
        console.log(error);
      }
    );
  }

  queueUpload(files: any): void {
    for (let file of files) {
      let formData = new FormData();
      formData.append(file.name, file, file.name);
      this.uploadFile(file.name, formData);
    }
  }

  private uploadFile(filename: string, formData: FormData): void {
    let queuedFile = new QueuedFile(filename, 0);
    this.queuedFiles.push(queuedFile);

    this.fileService.upload(formData).subscribe(
      event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            queuedFile.uploadProgress = Math.round(100 * event.loaded / event.total);
            break;
          case HttpEventType.Response:
            let fileMetadata: FileMetadata = event.body[0];
            this.files.push(fileMetadata);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
