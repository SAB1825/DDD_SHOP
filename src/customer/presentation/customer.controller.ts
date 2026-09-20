import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterCustomerDto } from './dtos/register-cutomer.dto';
import { RegisterCustomerCommand } from '../application/use-cases/register-user/register-user.command';
import { CustomerResponseDto } from './dtos/register-customer-reponse.dto';
import { GetCustomerQuery } from '../application/queries/get-customer.query';
import { Customer } from '../domain/entities/cutomer-entitiy';
import { ListCustomerQuery } from '../application/queries/list-customer.query';
import { DeleteCustomerCommand } from '../application/use-cases/delete-user/delete-customer.command';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async register(@Body() dto: RegisterCustomerDto): Promise<void> {
    await this.commandBus.execute<RegisterCustomerCommand, void>(
      new RegisterCustomerCommand(
        dto.email,
        dto.firstName,
        dto.lastName,
        dto.phone,
      ),
    );
  }

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CustomerResponseDto> {
    const customer = await this.queryBus.execute<GetCustomerQuery, Customer>(
      new GetCustomerQuery(id),
    );

    return CustomerResponseDto.fromDomain(customer);
  }

  @Get()
  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.queryBus.execute<
      ListCustomerQuery,
      Customer[]
    >(new ListCustomerQuery());

    return customers.map((customer) =>
      CustomerResponseDto.fromDomain(customer),
    );
  }

  @Delete(':id')
  async deleteCustomer(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.commandBus.execute<DeleteCustomerCommand, void>(
      new DeleteCustomerCommand(id),
    );
  }
}
