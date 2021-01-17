import {FileInterface} from "../../../types/file.interface";

export interface ContactUpdateRequestInterface {
  name: string,
  img: FileInterface | null,
  removeImg: boolean
}
