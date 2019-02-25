/**
 * Copyright 2018-2019 Brandon Ragsdale
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FileService } from './file.service';

import { RenameFileDialogComponent } from './rename-file-dialog/rename-file-dialog.component';
import { DeleteFileDialogComponent } from './delete-file-dialog/delete-file-dialog.component';

import { Constants } from '../common/constants';
import { FileMetadata } from '../models/file/file-metadata';
import { FileRename } from '../models/file/file-rename';
import { FileDelete } from '../models/file/file-delete';
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
  filesSelectedCount = 0;

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
    private dialog: MatDialog,
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

  navigateFromFolderPath(folderIndex: number): void {
    this.folderPath.pathArray.length = folderIndex + 1;
    this.getFiles(this.folderPath.toString());
  }

  navigateFromFolderCard(folderName: string): void {
    this.folderPath.pathArray.push(folderName);
    this.getFiles(this.folderPath.toString());
  }

  selectCard(event: any, file: FileMetadata): void {
    event.stopPropagation();

    if (!event.ctrlKey && !event.metaKey) {
      this.unselectAllFiles();
    }

    let selectedCardEl = document.getElementById(`file_${file.filename}`);
    selectedCardEl.classList.add('file-card-selected');

    file.isSelected = true;

    this.filesSelectedCount++;
  }

  unselectAllFiles(): void {
    let cardEls = document.getElementsByClassName('file-card');
    for (let cardEl of cardEls as any) {
      cardEl.classList.remove('file-card-selected');
    }

    for (let f of this.files) {
      f.isSelected = false;
    }

    this.filesSelectedCount = 0;
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

  renameFile(event: any): void {
    const renameFileDialog = this.dialog.open(RenameFileDialogComponent, {
      width: '350px',
      data: { filename: '' }
    });
    renameFileDialog.afterClosed().subscribe(filename => {
      if (filename !== undefined) {
        let fileMetadata: FileMetadata = event.data;
        let fileToRename = new FileRename();
        fileToRename.oldFilename = fileMetadata.filename;
        fileToRename.newFilename = filename + fileMetadata.fileType;
        fileToRename.path = this.folderPath.toString();

        this.fileService.renameFile(fileToRename).subscribe(
          newFilename => {
            for (let file of this.files) {
              if (file.filename === fileToRename.oldFilename) {
                file.filename = newFilename;
                break;
              }
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    });
  }

  deleteFile(event: any): void {
    const deleteFileDialog = this.dialog.open(DeleteFileDialogComponent, {
      width: '350px'
    });
    deleteFileDialog.afterClosed().subscribe(deleteFileConfirmed => {
      if (deleteFileConfirmed) {
        let fileMetadata: FileMetadata = event.data;
        let fileToDelete = new FileDelete();
        fileToDelete.filename = fileMetadata.filename;
        fileToDelete.path = this.folderPath.toString();
        fileToDelete.isDirectory = fileMetadata.isDirectory;

        this.fileService.deleteFile(fileToDelete).subscribe(
          () => {
            let fileToDeleteIndex = this.files.findIndex(f => f.filename === fileToDelete.filename);
            if (fileToDeleteIndex !== -1) {
              this.files.splice(fileToDeleteIndex, 1);
              console.log(`${fileToDelete.filename} has been deleted.`);
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    });
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
            let fileMetadata = new FileMetadata(event.body.filename, event.body.fileSize,
              event.body.fileType, event.body.modifiedDate, event.body.isDirectory, false);
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
