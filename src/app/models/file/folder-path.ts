export class FolderPath {
  pathArray: string[];

  constructor() {
    this.pathArray = [];
  }

  toString(): string {
    return this.pathArray.join('/');
  }
}
