export class RegisterCustomerCommand {
  constructor(
    public readonly email: string,
    public readonly fistName: string,
    public readonly lastName: string,
    public readonly phone: string,
  ) {}
}
