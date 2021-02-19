import {ServicesListInterface} from "./servicesList.interface";

export interface UpdateOrderRequestInterface {
  title: string,
  stage: string,
  servicesList: ServicesListInterface[],
  assignedUserId: string,
  documentIds: string[],
  customerId: string,
  companyId: string,
  description: string
}
