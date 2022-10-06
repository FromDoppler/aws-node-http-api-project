import { DynamoDbClient } from 'src/db/DynamoDbClient';
import { CustomerService } from "./app/CustomerService";

export const createCustomerService = () => {
    const dbClient = new DynamoDbClient(process.env.DYNAMODB_CUSTOMER_TABLE);
    const customerService = new CustomerService(dbClient);
    return customerService;
};
