import { DeleteCustomerHandler } from "./delete-user/delete-customer.handler";
import { RegisterCustomerHandler } from "./register-user/register-user.handler";

export const CommandHandler = [
    RegisterCustomerHandler,
    DeleteCustomerHandler
]