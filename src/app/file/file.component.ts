import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { map } from 'rxjs/operators';

import { FileService } from './file.service';

import { FileMetadata } from '../models/file/file-metadata';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  files: FileMetadata[] = [];

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
  }

  upload(files: any): void {
    if (files.length === 0) {
      return;
    }

    let formData = new FormData();
    for (let file of files) {
      formData.append(file.name, file, file.name);
    }

    this.fileService.upload(formData).subscribe(
      response => {
        files = response;
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }

}
