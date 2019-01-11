import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FileService } from './file.service';

import { Constants } from '../common/constants';
import { FileMetadata } from '../models/file/file-metadata';
import { QueuedFile } from '../models/file/queued-file';
import { Folder } from '../models/file/folder';
import { FolderPath } from '../models/file/folder-path';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  files: FileMetadata[] = [];
  queuedFiles: QueuedFile[] = [];
  queuedFilesRemaining = 0;
  folderPath: FolderPath = new FolderPath();

  fileStorageBaseUrl = Constants.fileStorageBaseUrl;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar,
    private fileService: FileService
  ) {
    this.fileService.fileListEventEmitter.subscribe(fileList => {
      this.queueUpload(fileList);
    });

    this.fileService.newFolderEventEmitter.subscribe(folderName => {
      let newFolder = new Folder();
      newFolder.name = folderName;
      newFolder.path = this.folderPath.toString();

      this.createNewFolder(newFolder);
    });
  }

  ngOnInit() {
    this.folderPath.pathArray.push(localStorage.getItem(Constants.usernameLocalStorageKey));

    this.getFiles(this.folderPath.toString());
    this.initFileDrop();
  }

  navigateToFolder(folderIndex: number): void {
    this.folderPath.pathArray.length = folderIndex + 1;
    this.getFiles(this.folderPath.toString());
  }

  navigateToSubfolder(folderName: string): void {
    this.folderPath.pathArray.push(folderName);
    this.getFiles(this.folderPath.toString());
  }

  getFiles(path: string): void {
    this.fileService.getFilesForPath(path).subscribe(
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

      this.uploadFile(file.name, formData, this.folderPath.toString());
    }
  }

  private uploadFile(filename: string, formData: FormData, folderPath: string): void {
    let queuedFile = new QueuedFile(filename, 0);
    this.queuedFiles.push(queuedFile);
    this.queuedFilesRemaining++;

    this.fileService.uploadFile(formData, folderPath).subscribe(
      event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            queuedFile.uploadProgress = Math.round(100 * event.loaded / event.total);
            break;
          case HttpEventType.Response:
            let fileMetadata: FileMetadata = event.body;
            this.files.push(fileMetadata);
            this.queuedFilesRemaining--;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  private createNewFolder(newFolder: Folder) {
    this.fileService.createNewFolder(newFolder).subscribe(
      createdFolder => {
        this.snackBar.open(`${createdFolder.name} has been created.`);
        this.getFiles(this.folderPath.toString());
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
