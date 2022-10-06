import { Customer } from './Customer';
import { DbClient } from './DbClient';

export class CustomerService {
    constructor(private _dbClient: DbClient) {
    }

    create = async ({name, email}: Customer) => {
        await this._dbClient.put({
            primary_key: name,
            email: email
        });
    }

    getAll: () => Promise<Customer[]> = async () => {
        const result = await this._dbClient.scan();
        return result.Items.map(customer => ({
            name: customer.primary_key,
            email: customer.email
        }));
    }
}