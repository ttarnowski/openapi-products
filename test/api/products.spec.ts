import { v4 } from "uuid";
import { request } from "../helpers/app";
import { createProduct } from "../helpers/createProduct";
import { getAuthToken, testUnauthorized } from "../helpers/auth";
import { iocContainer } from "../../src/ioc";
import { ProductsController } from "../../src/api/products/ProductsController";
import { ProductsRepository } from "../../src/api/products/ProductsRepository";

describe("Products", () => {
  const endpoint = "/products";

  describe("GET /products", () => {
    beforeAll(async () => {
      iocContainer.snapshot();
      iocContainer.rebind(ProductsController).toSelf();
    });

    afterAll(async () => {
      iocContainer.restore();
    });

    testUnauthorized(endpoint, "get");

    it("responds with 200 status code and the list of all of the products", async () => {
      const products = [createProduct(), createProduct()];
      const expectedProducts = products.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
      }));
      const productsRepositoryStub: jest.Mocked<ProductsRepository> = {
        fetchAll: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        fetchById: jest.fn(),
        update: jest.fn(),
      };
      iocContainer.rebind<ProductsRepository>("ProductsRepository").toConstantValue(productsRepositoryStub);
      productsRepositoryStub.fetchAll.mockResolvedValue(products);

      const response = await request.get(endpoint).set("Authorization", getAuthToken(v4()));

      expect(response.body.products.length).toEqual(expectedProducts.length);
      expect(response.body.products).toEqual(expectedProducts);
      expect(response.statusCode).toEqual(200);
    });
  });
});
