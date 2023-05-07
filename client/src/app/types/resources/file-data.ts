import { ResourceType } from "src/app/enums/resources/type";

export type FileData = {
  name: string;
  href: string;
  path: string;
  type: ResourceType;
  extension: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
    ratio: number;
    orientation: 'landscape' | 'portrait';
  }
}
