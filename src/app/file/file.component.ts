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


import { Component, OnInit, HostListener } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FileService } from './file.service';

import { RenameFileDialogComponent } from './rename-file-dialog/rename-file-dialog.component';
import { DeleteFileDialogComponent } from './delete-file-dialog/delete-file-dialog.component';
import { MoveFileDialogComponent } from './move-file-dialog/move-file-dialog.component';

import { Constants } from '../common/constants';
import { FileMetadata } from '../models/file/file-metadata';
import { FileRename } from '../models/file/file-rename';
import { FileDelete } from '../models/file/file-delete';
import { FileMove } from '../models/file/file-move';
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
  loadingFiles = false;
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

    this.fileService.partialFilenameSearchEmitter.subscribe(partialFilename => {
      console.log(partialFilename);
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

  onCardClick(event: any, file: FileMetadata, isRightClick: boolean): void {
    event.stopPropagation();

    if (event.shiftKey) {
      this.multiSelectCards(file);
    } else if (event.ctrlKey || event.metaKey) {
      this.singleSelectCard(file, isRightClick);
    } else {
      this.unselectAllCards();
      this.singleSelectCard(file, isRightClick);
    }
  }

  singleSelectCard(file: FileMetadata, isRightClick: boolean): void {
    let selectedCardEl = document.getElementById(`file_${file.filename}`);

    let fileCardSelectedCssClass = 'file-card-selected';
    let isCardAlreadySelected = selectedCardEl.classList.contains(fileCardSelectedCssClass);

    if (isCardAlreadySelected) {
      if (isRightClick) {
        return;
      }

      selectedCardEl.classList.remove(fileCardSelectedCssClass);
      file.isSelected = false;
      this.filesSelectedCount--;

      selectedCardEl.blur();
    } else {
      selectedCardEl.classList.add(fileCardSelectedCssClass);
      file.isSelected = true;
      this.filesSelectedCount++;
    }
  }

  multiSelectCards(file: FileMetadata): void {
    let selectedCardIndices = [];
    for (let i = 0; i < this.files.length; i++) {
      let f = this.files[i];
      if (f.isSelected) {
        selectedCardIndices.push(i);
      }
    }

    let selectedCardIndex = this.files.findIndex(f => f.filename === file.filename);
    let firstCardToSelectIndex: number;
    let lastCardToSelectIndex: number;
    if (selectedCardIndex < selectedCardIndices[0]) {
      firstCardToSelectIndex = selectedCardIndex;
      lastCardToSelectIndex = selectedCardIndices[0];
    } else {
      firstCardToSelectIndex = selectedCardIndices[0];
      lastCardToSelectIndex = selectedCardIndex;
    }

    for (let i = 0; i < this.files.length; i++) {
      let f = this.files[i];
      let cardEl = document.getElementById(`file_${f.filename}`);
      let fileCardSelectedCssClass = 'file-card-selected';

      if (i >= firstCardToSelectIndex && i <= lastCardToSelectIndex) {
        cardEl.classList.add(fileCardSelectedCssClass);
        f.isSelected = true;
        this.filesSelectedCount++;
      } else {
        cardEl.classList.remove(fileCardSelectedCssClass);
        f.isSelected = false;
        this.filesSelectedCount--;
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  selectAllCards(event: KeyboardEvent): void {
    // select all cards when the user presses ctrl+a or cmd+a
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 65) {
      let cardEls = document.getElementsByClassName('file-card');
      for (let cardEl of cardEls as any) {
        cardEl.classList.add('file-card-selected');
      }

      for (let f of this.files) {
        f.isSelected = true;
      }

      this.filesSelectedCount = this.files.length;
    }
  }

  unselectAllCards(): void {
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
    this.loadingFiles = true;
    this.files = [];

    this.fileService.getFilesForPath(path).subscribe(
      files => {
        this.files = files;
      },
      error => {
        console.log(error);
      }
    ).add(() => this.loadingFiles = false);
  }

  clearQueuedFiles(): void {
    this.queuedFiles = [];
  }

  queueUpload(event: any): void {
    let items = event.dataTransfer.items;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (item.kind !== 'file') {
        continue;
      }

      let entry = item.webkitGetAsEntry();
      if (entry.isFile) {
        this.prepareFileForUpload(entry);
      } else if (entry.isDirectory) {
        this.prepareDirectoryForUpload(entry);
      }
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

  moveFiles(): void {
    const moveFileDialog = this.dialog.open(MoveFileDialogComponent, {
      width: '350px',
      maxWidth: '350px',
      data: {
        files: this.files,
        path: this.folderPath.toString()
      }
    });

    moveFileDialog.afterClosed().subscribe(destinationFolder => {
      if (!destinationFolder) {
        return;
      }

      let destinationPath = `${destinationFolder.path}/${destinationFolder.name}`;
      let filesToMove = [];
      for (let f of this.files) {
        if (f.isSelected) {
          let fileToMove = new FileMove();
          fileToMove.filename = f.filename;
          fileToMove.sourcePath = `${this.folderPath.toString()}/${f.filename}`;
          fileToMove.destinationPath = destinationPath;

          filesToMove.push(fileToMove);
        }
      }

      this.fileService.moveFiles(filesToMove).subscribe(
        () => {
          for (let movedFile of filesToMove) {
            let movedFileIndex = this.files.findIndex(f => f.filename === movedFile.filename);
            if (movedFileIndex !== -1) {
              this.files.splice(movedFileIndex, 1);
            }
          }
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  deleteFiles(): void {
    const deleteFileDialog = this.dialog.open(DeleteFileDialogComponent, {
      width: '350px'
    });
    deleteFileDialog.afterClosed().subscribe(deleteFileConfirmed => {
      if (deleteFileConfirmed) {
        let filesToDelete = [];
        for (let f of this.files) {
          if (f.isSelected) {
            let fileToDelete = new FileDelete();
            fileToDelete.filename = f.filename;
            fileToDelete.path = this.folderPath.toString();
            fileToDelete.isDirectory = f.isDirectory;

            filesToDelete.push(fileToDelete);
          }
        }

        this.fileService.deleteFiles(filesToDelete).subscribe(
          () => {
            for (let deletedFile of filesToDelete) {
              let deletedFileIndex = this.files.findIndex(f => f.filename === deletedFile.filename);
              if (deletedFileIndex !== -1) {
                this.files.splice(deletedFileIndex, 1);
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

  private prepareFileForUpload(fileEntry: any): void {
    let filePath = this.folderPath.toString() + fileEntry.fullPath;
    let filePathWithFilenameRemoved = filePath.slice(0, filePath.lastIndexOf('/'));

    let fileEntryPromise = new Promise((resolve, reject) => {
      fileEntry.file(
        (file: File) => {
          resolve(file);
        },
        (error: any) => {
          reject(error);
        }
      );
    });

    fileEntryPromise.then((file: File) => {
      let formData = new FormData();
      formData.append(file.name, file, file.name);

      this.uploadFile(file.name, formData, filePathWithFilenameRemoved);
    });
  }

  private prepareDirectoryForUpload(directoryEntry: any): void {
    let directoryPath = this.folderPath.toString() + directoryEntry.fullPath;
    let directoryPathWithLastFolderRemoved = directoryPath.slice(0, directoryPath.lastIndexOf('/'));
    let directoryName = directoryEntry.name;

    let folder = new Folder();
    folder.name = directoryName;
    folder.path = directoryPathWithLastFolderRemoved;

    this.fileService.createNewFolder(folder).subscribe(
      createdFolder => {
        let folderMetadata = new FileMetadata(createdFolder.name, 0, null, null, true, false);

        // only add to the files list if the folder is in the current path
        if (directoryPathWithLastFolderRemoved === this.folderPath.toString()) {
          this.files.push(folderMetadata);
        }
      },
      error => {
        console.log(error);
      }
    )
    .add(() => {
      let directoryReader = directoryEntry.createReader();
      let directoryReaderPromise = new Promise((resolve, reject) => {
        directoryReader.readEntries(
          (entries: any) => {
            resolve(entries);
          },
          (error: any) => {
            reject(error);
          }
        );
      });

      directoryReaderPromise.then((entries: any) => {
        for (let entry of entries) {
          if (entry.isFile) {
            this.prepareFileForUpload(entry);
          } else if (entry.isDirectory) {
            this.prepareDirectoryForUpload(entry);
          }
        }
      });
    });
  }

  private uploadFile(filename: string, formData: FormData, folderPath: string): void {
    let isFileInCurrentFolderPath = (folderPath === this.folderPath.toString());

    let queuedFile = new QueuedFile(isFileInCurrentFolderPath ? filename : `${folderPath}/${filename}`, 0);
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
            this.queuedFilesRemaining--;

            if (isFileInCurrentFolderPath) {
              this.files.push(fileMetadata);
            }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  private createNewFolder(newFolder: Folder): void {
    this.fileService.createNewFolder(newFolder).subscribe(
      createdFolder => {
        this.snackBar.open(`${createdFolder.name} has been created.`);

        let folderMetadata = new FileMetadata(createdFolder.name, 0, null, null, true, false);
        this.files.push(folderMetadata);
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
