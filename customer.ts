import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";

export const createCustomer: APIGatewayProxyHandler = async (event, context) => {
    const body = JSON.parse(Buffer.from(event.body, 'base64').toString());
    const dynamoDb = new DynamoDB.DocumentClient();
    const putParams = {
        TableName: process.env.DYNAMODB_CUSTOMER_TABLE,
        Item: {
            primary_key: body.name,
            email: body.email
        }
    };
    await dynamoDb.put(putParams).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Go Serverless v2.0! Your function executed successfully!",
            context,
            event,
          })
    };
};

export const getCustomers: APIGatewayProxyHandler = async (event, context) => {
    const scanParams = {
        TableName: process.env.DYNAMODB_CUSTOMER_TABLE
    };
    const dynamoDb = new DynamoDB.DocumentClient();
    const result = await dynamoDb.scan(scanParams).promise();

    if (result.Count === 0) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: "Go Serverless v2.0! Your function executed successfully!",
                context,
                event,
              })
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