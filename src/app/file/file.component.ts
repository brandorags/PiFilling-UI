import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FileService } from './file.service';

import { FileMetadata } from '../models/file/file-metadata';
import { QueuedFile } from '../models/file/queued-file';
import { Constants } from '../common/constants';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  files: FileMetadata[] = [];
  queuedFiles: QueuedFile[] = [];
  queuedFilesRemaining = 0;

  fileStorageBaseUrl = Constants.fileStorageBaseUrl;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private fileService: FileService
  ) {
    this.fileService.fileListEventEmitter.subscribe(fileList => {
      this.queueUpload(fileList);
    });
  }

  ngOnInit() {
    this.getFiles();
    this.initFileDrop();
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

  clearQueuedFiles(): void {
    this.queuedFiles = [];
  }

  queueUpload(fileList: FileList): void {
    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];

      let formData = new FormData();
      formData.append(file.name, file, file.name);

      this.uploadFile(file.name, formData);
    }
  }

  private uploadFile(filename: string, formData: FormData): void {
    let queuedFile = new QueuedFile(filename, 0);
    this.queuedFiles.push(queuedFile);
    this.queuedFilesRemaining++;

    this.fileService.upload(formData).subscribe(
      event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            queuedFile.uploadProgress = Math.round(100 * event.loaded / event.total);
            break;
          case HttpEventType.Response:
            let fileMetadata: FileMetadata = event.body[0];
            this.files.push(fileMetadata);
            this.queuedFilesRemaining--;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  private initFileDrop(): void {
    let dropArea = document.getElementsByClassName('file-card-container')[0];

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, showActiveFileDrop, false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, hideActiveFileDrop, false);
    });

    function preventDefaults(event: any): void {
      event.preventDefault();
      event.stopPropagation();
    }

    function showActiveFileDrop(): void {
      dropArea.classList.add('file-drop-active');
    }

    function hideActiveFileDrop(): void {
      dropArea.classList.remove('file-drop-active');
    }
  }

}
