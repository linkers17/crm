export interface GetCustomerInterface {
  _id: string,
  phones: string[],
  doNotCall: boolean,
  surname: string,
  name: string,
  patronym: string,
  birthday: string,
  addressPostalCode: string,
  addressCity: string,
  addressStreet: string,
  addressHome: string,
  addressRoom: string,
  email: string,
  site: string,
  description: string,
  assignedUserId: string,
  createdById: string,
  createdByLogin: string,
  createdAt: string,
  documents: string[],
  assignedUserLogin: [{login: string}],
  contactsList: [{
    _id: string,
    name: string,
    img: string,
    value: string
  }]
}
