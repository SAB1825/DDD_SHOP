import { Customer } from '../../domain/entities/cutomer-entitiy';

export class CustomerResponseDto {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  static fromDomain(customer: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();
    dto.id = customer.id.getValue();
    dto.fullName = customer.getFullName();
    dto.email = customer.email.getValue();
    dto.phone = customer.phone;
    dto.isActive = customer.isActive;
    dto.createdAt = customer.createdAt.toISOString();
    dto.updatedAt = customer.updatedAt.toISOString();

    return dto;
  }
}
