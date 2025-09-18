export interface ServiceDTO {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceInput {
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
}
