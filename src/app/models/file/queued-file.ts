export class QueuedFile {
  filename: string;
  uploadProgress: number;

  constructor(filename: string, uploadProgress: number) {
    this.filename = filename;
    this.uploadProgress = uploadProgress;
  }
}
