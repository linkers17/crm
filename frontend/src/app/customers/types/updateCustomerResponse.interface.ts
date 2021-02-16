export interface UpdateCustomerResponseInterface {
  phones: string[],
  doNotCall: boolean,
  documentIds: string[],
  orderIds: string[],
  taskIds: string[],
  noteIds: string[],
  _id: string,
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
  contacts: [{
    _id: string,
    value: string,
    contactId: string
  }]
  createdAt: string,
  updatedAt: string,
  __v: number
}
