export type ApplicationStatus = "APPLY" | "REJECT" | "APPROVE" | "REAPPLY";

export interface StoreApplication {
  registrationId: string;
  accountid: string;
  name: string;
  ceoName: string;
  address: string;
  landline: string;
  license: string;
  image: string;
  status: ApplicationStatus;
  reason: string;
  createdAt: string;
  updatedAt: string;
}
