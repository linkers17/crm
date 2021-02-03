export interface CustomersInterface {
  _id: string,
  surname: string,
  name: string,
  patronym: string,
  email: string,
  birthday: string,
  assignedUserId: string,
  assignedUserLogin: [{login: string}]
}
