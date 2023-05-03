export type FileData = {
  name: string;
  url: string;
  type: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
    ratio: number;
    orientation: 'landscape' | 'portrait';
  }
}
