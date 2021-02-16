export interface UpdateCustomerRequestInterface {
  surname: string,
  name: string,
  patronym: string,
  birthday: string,
  addressPostalCode: string,
  addressCity: string,
  addressStreet: string,
  addressHome: string,
  addressRoom: string,
  phones: string[],
  email: string,
  site: string,
  description: string,
  doNotCall: boolean,
  assignedUserId: string,
  documentIds: string[],
  contacts: string[]
}
