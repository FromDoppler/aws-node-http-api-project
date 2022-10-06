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
