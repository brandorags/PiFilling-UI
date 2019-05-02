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
import { FolderPath } from '../../models/file/folder-path';

@Component({
  selector: 'app-move-file-dialog',
  templateUrl: './move-file-dialog.component.html',
  styleUrls: ['./move-file-dialog.component.scss']
})
export class MoveFileDialogComponent implements OnInit {

  folderList: Folder[] = [];
  folderPath: FolderPath = new FolderPath();

  isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.folderPath.pathArray.push(this.dialogData.path);

    this.fileService.getFoldersForPath(this.folderPath.toString()).subscribe(
      folderList => {
        this.folderList = folderList;
      },
      error => {
        console.log(error);
      }
    ).add(() => this.isLoading = false);
  }

}
