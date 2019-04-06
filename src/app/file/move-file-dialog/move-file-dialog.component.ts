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

@Component({
  selector: 'app-move-file-dialog',
  templateUrl: './move-file-dialog.component.html',
  styleUrls: ['./move-file-dialog.component.scss']
})
export class MoveFileDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
