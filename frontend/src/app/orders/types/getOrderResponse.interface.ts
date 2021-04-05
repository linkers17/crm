export interface GetOrderResponseInterface {
  _id: string,
  stage: string;
  updatedById: string | null,
  dateEnd: string | null,
  title: string,
  servicesList: [{
    _id: string,
    title: string,
    quantity: string,
    amount: number
  }],
  assignedUserId: string,
  description: string,
  amount: number,
  createdById: string,
  createdByLogin: string,
  createdAt: string,
  updatedAt: string,
  documents: [{
    _id: string,
    name: string
  }],
  assignedUserLogin: [{ login: string }],
  customerInfo: [] | [{
    surname: string,
    name: string,
    patronym: string
  }],
  companyInfo: [] | [{
    title: string
  }],
  tasks: [{

  }],
  notes: [{

  }]

}
// TODO - дополнить интерфейс
