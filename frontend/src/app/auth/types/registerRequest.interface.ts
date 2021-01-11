import {FileInterface} from "../../shared/types/file.interface";

export interface RegisterRequestInterface {
  address: string,
  birthday: string,
  email: string,
  login: string,
  name: string,
  password: string,
  patronym: string,
  phones: string[],
  surname: string,
  userImg: null | FileInterface,
  contacts: string[]
}
