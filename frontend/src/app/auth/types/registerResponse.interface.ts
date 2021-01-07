export interface RegisterResponseInterface {
  role: string,
  status: boolean,
  phones: string[],
  _id: string,
  login: string,
  password: string,
  surname: string,
  name: string,
  patronym: string,
  birthday: string,
  userImg: string,
  address: string,
  email: string,
  contacts: [
    {
      value: string,
      _id: string,
      contactId: string
    }
  ],
  createdAt: string,
  updatedAt: string,
  __v: number
}
