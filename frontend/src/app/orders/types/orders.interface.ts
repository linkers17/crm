export interface OrdersInterface {
  stage: string,
  dateEnd: string | null,
  _id: string,
  title: string,
  amount: number,
  createdById: string,
  createdByLogin: string,
  createdAt: string,
  assignedUserId: string,
  assignedUserLogin: [{login: string}]
}
