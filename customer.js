const AWS = require('aws-sdk');

module.exports.createCustomer = async (event) => {
    const body = JSON.parse(Buffer.from(event.body, 'base64').toString());
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const putParams = {
        TableName: process.env.DYNAMODB_CUSTOMER_TABLE,
        Item: {
            primary_key: body.name,
            email: body.email
        }
    };
    await dynamoDb.put(putParams).promise();

    return {
        statusCode: 201
    };
};

module.exports.getCustomers = async (event) => {
    const scanParams = {
        TableName: process.env.DYNAMODB_CUSTOMER_TABLE
    };
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const result = await dynamoDb.scan(scanParams).promise();

    if (result.Count === 0) {
        return {
            statusCode: 404
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            total: result.Count,
            items: result.Items.map(customer => ({
                name: customer.primary_key,
                email: customer.email
            }))
        })
    };
};