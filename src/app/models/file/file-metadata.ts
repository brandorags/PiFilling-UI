export class FileMetadata {
  filename: string;
  fileSize: number;
  fileType: string;
  modifiedDate: string;
  isDirectory: boolean;

  constructor(filename: string, fileSize: number, fileType: string,
    modifiedDate: string, isDirectory: boolean) {
      this.filename = filename;
      this.fileSize = fileSize;
      this.fileType = fileType;
      this.modifiedDate = modifiedDate;
      this.isDirectory = isDirectory;
    }

  isImageFile(): boolean {
    let imageFileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.tif', '.tiff'];
    return imageFileExtensions.includes(this.fileType.toLowerCase());
  }
}
