import { DomainException } from '../../../shared/domain/exception/domain.exception';

export class CustomerEmail {
  private static readonly MAX_LENGTH = 255;
  private static readonly PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private readonly value: string) {}

  static create(raw: string) {
    if (typeof raw !== 'string')
      throw new DomainException('Invalid email type');

    const normalized = raw.trim().toLowerCase();

    if (!normalized) throw new DomainException('Email is required');
    if (normalized.length > this.MAX_LENGTH)
      throw new DomainException('Email is too long');
    if (!this.PATTERN.test(normalized))
      throw new DomainException('Invalid email format');

    return new CustomerEmail(normalized);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: CustomerEmail) {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
