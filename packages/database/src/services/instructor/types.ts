export interface NewInstructorPayload {
  email: string;
  firstName: string;
  lastName: string;
}

export interface EditInstructorPayload {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  addressId?: string;
}
