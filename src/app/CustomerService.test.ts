import { CustomerService } from "./CustomerService";
import { DbClient } from "./DbClient";

describe(CustomerService.name, () => {
  describe("getAll", () => {
    it("Should return an empty array when there are no items in DB", async () => {
      // Arrange
      const dbClientDouble: DbClient = {
        put: async () => {
          /* do nothing */
        },
        scan: async () => ({ Items: [], Count: 0 }),
        get: async () => {
          return null;
        },
      };
      const sut = new CustomerService(dbClientDouble);

      // Act
      const result = await sut.getAll();

      // Assert
      expect(result).toEqual([]);
    });

    it("Should return an empty array when DB return null", async () => {
      // Arrange
      const dbClientDouble: DbClient = {
        put: async () => {
          /* do nothing */
        },
        scan: async () => ({ Items: null, Count: null }),
        get: async () => {
          return null;
        },
      };
      const sut = new CustomerService(dbClientDouble);

      // Act
      const result = await sut.getAll();

      // Assert
      expect(result).toEqual([]);
    });
  });
});
