export interface User {
  id: string;
  email: string;
  userType?: string;
  name?: string;
  iataCode?: string;
  accountingCode?: string;
  registrationCompleted?: boolean;
  title?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}