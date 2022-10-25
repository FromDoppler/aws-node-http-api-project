import { DynamoDB } from "aws-sdk";
import { createPromiseWrapper } from "../shared/utils";
import { CustomerService } from "./CustomerService";

describe(CustomerService.name, () => {
  describe("getAll", () => {
    it("Should return an empty array when there are no items in DB", async () => {
      // Arrange
      const { sut } = createTestContext();

      // Act
      const result = await sut.getAll();

      // Assert
      expect(result).toEqual([]);
    });

    it("Should return an empty array when DB returns null", async () => {
      // Arrange
      const { dbClientDouble, sut } = createTestContext();
      dbClientDouble.scan.mockImplementation(() =>
        createPromiseWrapper(() => ({
          Items: null,
          Count: null,
        }))
      );

      // Act
      const result = await sut.getAll();

      // Assert
      expect(result).toEqual([]);
    });

    it("Should map items on GetAll", async () => {
      // Arrange
      const dbItems = [
        { email: "email1", name: "name1", anotherField: "anotherField" },
        { email: "email2", name: "name2" },
      ];
      const { dbClientDouble, sut } = createTestContext();
      dbClientDouble.scan.mockImplementation(() =>
        createPromiseWrapper(() => ({
          Items: dbItems,
          Count: dbItems.length,
        }))
      );

      // Act
      const result = await sut.getAll();

      // Assert
      expect(result).toEqual([
        { email: "email1", name: "name1", lastVisit: null },
        { email: "email2", name: "name2", lastVisit: null },
      ]);
    });

    it("Should include lastVisit field", async () => {
      // Arrange
      const dbItems = [
        { email: "email1", name: "name1", lastVisit: "2022-10-24T16:42:00Z" },
        { email: "email2", name: "name2" },
      ];
      const { dbClientDouble, sut } = createTestContext();
      dbClientDouble.scan.mockImplementation(() =>
        createPromiseWrapper(() => ({
          Items: dbItems,
          Count: dbItems.length,
        }))
      );

      // Act
      const result = await sut.getAll();

      // Assert
      expect(result).toEqual([
        { email: "email1", name: "name1", lastVisit: "2022-10-24T16:42:00Z" },
        { email: "email2", name: "name2", lastVisit: null },
      ]);
    });
  });

  describe("get", () => {
    it("Should pass the right key to db", async () => {
      // Arrange
      const { dbClientDouble, TableName, sut } = createTestContext();

      // Act
      await sut.get("email1");

      // Assert
      expect(dbClientDouble.get).toHaveBeenCalledWith({
        Key: { email: "email1" },
        TableName,
      });
    });

    it("Should return a empty object when the item does not exist", async () => {
      // Arrange
      const { sut } = createTestContext();

      // Act
      const result = await sut.get("email1");

      // Assert
      expect(result).toEqual({
        email: "email1",
        lastVisit: null,
      });
    });

    it("Should return map the resulting item", async () => {
      // Arrange
      const { dbClientDouble, sut } = createTestContext();
      dbClientDouble.get.mockImplementation(() =>
        createPromiseWrapper(() => ({
          Item: { email: "email1", name: "name1" },
        }))
      );

      // Act
      const result = await sut.get("email1");

      // Assert
      expect(result).toEqual({
        email: "email1",
        name: "name1",
        lastVisit: null,
      });
    });
  });

  describe("registerVisit", () => {
    it("Should pass the right data to db", async () => {
      // Arrange
      const date = new Date("Date Mon Oct 24 2022 17:21:08 GMT-0300");
      const expectedValue = "2022-10-24T20:21:08.000Z";
      const { dbClientDouble, TableName, sut } = createTestContext();

      // Act
      await sut.registerVisit("email1", date);

      // Assert
      expect(dbClientDouble.update).toHaveBeenCalledWith({
        TableName,
        Key: { email: "email1" },
        UpdateExpression: "set lastVisit = :lastVisit",
        ExpressionAttributeValues: { ":lastVisit": expectedValue },
      });
    });
  });
});

function createTestContext() {
  const dbClientDouble = {
    put: jest.fn(() => createPromiseWrapper()),
    update: jest.fn(() => createPromiseWrapper()),
    scan: jest.fn(() => createPromiseWrapper(() => ({ Items: [], Count: 0 }))),
    get: jest.fn(() => createPromiseWrapper(() => ({ Item: undefined }))),
  };
  const customerTableName = "customerTableName";
  const sut = new CustomerService({
    customerTableName,
    dbClient: dbClientDouble as unknown as DynamoDB.DocumentClient,
  });
  return { dbClientDouble, TableName: customerTableName, sut };
}
