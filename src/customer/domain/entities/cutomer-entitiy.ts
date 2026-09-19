import { AggregateRoot } from '../../../shared/domain/aggregate-root';
import { CustomerEmail } from '../value-object/cutomer-email.vo';
import { CustomerId } from '../value-object/cutomer-id.vo';

interface CustomerProps {
  id: CustomerId;
  email: CustomerEmail;
  firstName: string;
  lastName: string;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer extends AggregateRoot {
  private _id: CustomerId;
  private _email: CustomerEmail;
  private _firstName: string;
  private _lastName: string;
  private _isActive: boolean;
  private _phone: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: CustomerProps) {
    super();
    this._id = props.id;
    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._isActive = props.isActive;
    this._phone = props.phone;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static register(
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
  ): Customer {
    const customerId = new CustomerId();
    const now = new Date();

    const customer = new Customer({
      id: customerId,
      email: CustomerEmail.create(email),
      firstName,
      lastName,
      phone,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return customer;
  }

  static reconstitute(props: CustomerProps): Customer {
    return new Customer(props);
  }

  getFullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get id(): CustomerId {
    return this._id;
  }

  get email(): CustomerEmail {
    return this._email;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get phone(): string | null {
    return this._phone;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
