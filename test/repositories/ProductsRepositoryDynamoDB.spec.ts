import { AttributeValue, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import config from "config";
import { v4 } from "uuid";
import { ProductData } from "../../src/api/products/ProductData";
import { Product } from "../../src/api/products/Product";
import {
  mapProductDynamoDBItemToProduct,
  mapProductToDynamoDBItem,
  ProductsRepositoryDynamoDB,
} from "../../src/api/products/ProductsRepositoryDynamoDB";
import { createProduct } from "../helpers/createProduct";
import { clearProductsTable, client, createProductsTableIfDoesNotExist } from "../helpers/productsTable";

const getRepository = () => new ProductsRepositoryDynamoDB();

describe("ProductsRepositoryDynamoDB", () => {
  describe("fetchAll", () => {
    beforeEach(async () => {
      await createProductsTableIfDoesNotExist();
      await clearProductsTable();
    });

    it("returns all the products from products table as an array", async () => {
      const expectedProducts = [createProduct(), createProduct()];
      await Promise.all(
        expectedProducts.map(async (product) => {
          await client.send(
            new PutItemCommand({
              TableName: config.get("dbTables.products.name"),
              Item: mapProductToDynamoDBItem(product),
            }),
          );
        }),
      );

      const actualProducts = await getRepository().fetchAll();
      expectedProducts.sort((a, b) => (a.id > b.id ? -1 : 1));
      actualProducts.sort((a, b) => (a.id > b.id ? -1 : 1));

      expect(actualProducts).toEqual(expectedProducts);
    });
  });

  describe("delete", () => {
    it("returns true if product with given id had existed and it was removed succefully", async () => {
      const existingProduct = createProduct();
      await client.send(
        new PutItemCommand({
          TableName: config.get("dbTables.products.name"),
          Item: mapProductToDynamoDBItem(existingProduct),
        }),
      );

      const actual = await getRepository().delete(existingProduct.id);
      const output = await client.send(
        new GetItemCommand({
          TableName: config.get("dbTables.products.name"),
          Key: {
            ProductID: { S: existingProduct.id },
          },
        }),
      );

      expect(actual).toBeTruthy();
      expect(output.Item).toBeUndefined();
    });

    it("returns false if product with given id does not exists in database", async () => {
      const actual = await getRepository().delete(v4());

      expect(actual).toBeFalsy();
    });
  });

  describe("update", () => {
    it("returns undefined and does not modify anything in database if given product does not exist", async () => {
      const product = createProduct();

      const actual = await getRepository().update(product.id, product);

      expect(actual).toBeUndefined();
    });

    it("modifies existing product in database and returns it if given product id matches the existing one", async () => {
      const existingProduct = createProduct();
      await client.send(
        new PutItemCommand({
          TableName: config.get("dbTables.products.name"),
          Item: mapProductToDynamoDBItem(existingProduct),
        }),
      );
      const newProductData = createProduct({
        id: undefined,
        createdAt: undefined,
      });
      const expected = {
        ...newProductData,
        id: existingProduct.id,
        createdAt: existingProduct.createdAt,
      };

      const actual = await getRepository().update(existingProduct.id, newProductData);
      const output = await client.send(
        new GetItemCommand({
          TableName: config.get("dbTables.products.name"),
          Key: {
            ProductID: { S: (actual as Product).id },
          },
        }),
      );

      expect(actual).toEqual(expected);
      expect(output.Item).not.toBeUndefined();
      const modifiedProduct = mapProductDynamoDBItemToProduct(output.Item as Record<string, AttributeValue>);
      expect(modifiedProduct).toEqual({
        ...newProductData,
        id: actual?.id,
        createdAt: existingProduct.createdAt,
      });
    });
  });

  describe("create", () => {
    it("stores a NewProduct in database and returns Product with newly generated id and actual createdAt date", async () => {
      const newProduct: ProductData = createProduct({
        id: undefined,
        createdAt: undefined,
      });
      const expectedProduct: Product = {
        ...newProduct,
        id: expect.anything(),
        createdAt: expect.anything(),
      };

      const actual = await getRepository().create(newProduct);
      const output = await client.send(
        new GetItemCommand({
          TableName: config.get("dbTables.products.name"),
          Key: {
            ProductID: { S: actual.id },
          },
        }),
      );

      expect(actual).toEqual(expectedProduct);
      expect(typeof actual.id).toBe("string");
      expect(actual.createdAt).toBeInstanceOf(Date);
      expect(new Date().getTime() - actual.createdAt.getTime()).toBeLessThan(3000);
      expect(output.Item).not.toBeUndefined();
      const storedProduct = mapProductDynamoDBItemToProduct(output.Item as Record<string, AttributeValue>);
      expect(storedProduct).toEqual({
        ...expectedProduct,
        id: actual.id,
        createdAt: actual.createdAt,
      });
    });
  });

  describe("fetchById", () => {
    it("returns undefined if product with given id does not exist", async () => {
      const id = v4();

      const actual = await getRepository().fetchById(id);

      expect(actual).toBeUndefined();
    });

    it("returns a product if product with given id exists in database", async () => {
      const expectedProduct = createProduct();
      await client.send(
        new PutItemCommand({
          TableName: config.get("dbTables.products.name"),
          Item: mapProductToDynamoDBItem(expectedProduct),
        }),
      );

      const actualProduct = await getRepository().fetchById(expectedProduct.id);

      expect(actualProduct).toEqual(expectedProduct);
    });
  });
});
