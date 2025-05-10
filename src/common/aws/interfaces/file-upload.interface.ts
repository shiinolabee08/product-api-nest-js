export interface FileUpload {
  attachment: string;

  originalName: string;

  mime?: string;

  size?: number;

  filename?: string;

  ext?: string;

  path?: string;
}

export interface FileInfo {
  filename: string;

  directory: string;

  mime: string;

  autoGenerateName?: boolean,
}
