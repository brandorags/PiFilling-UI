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


import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { FileService } from '../file.service';

import { Folder } from '../../models/file/folder';

@Component({
  selector: 'app-move-file-dialog',
  templateUrl: './move-file-dialog.component.html',
  styleUrls: ['./move-file-dialog.component.scss']
})
export class MoveFileDialogComponent implements OnInit {

  folderList: Folder[] = [];
  currentFolder: Folder = new Folder();
  selectedFolder: Folder = new Folder();

  isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.getFoldersForPath(this.dialogData.path);
  }

  navigateOneFolderUp(): void {
    let splitPath = this.currentFolder.path.split('/');

    // don't try to navigate to the top-level folder
    if (splitPath.length === 1) {
      return;
    }

    let pathWithLastFolderRemoved = splitPath.splice(0, splitPath.length - 1).join('/');
    this.getFoldersForPath(pathWithLastFolderRemoved);
  }

  navigateOneFolderDown(): void {
    if (this.selectedFolder.name === undefined &&
      this.selectedFolder.path === undefined) {
      return;
    }

    this.getFoldersForPath(`${this.selectedFolder.path}/${this.selectedFolder.name}`);
  }

  private getFoldersForPath(path: string): void {
    this.fileService.getFoldersForPath(path).subscribe(
      folderList => {
        this.folderList = folderList;

        let splitPath = path.split('/');
        this.currentFolder.name = splitPath[splitPath.length - 1];
        this.currentFolder.path = path;
      },
      error => {
        console.log(error);
      }
    ).add(() => this.isLoading = false);
  }

}
