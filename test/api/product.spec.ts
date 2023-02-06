import { v4 } from "uuid";
import { request } from "../helpers/app";
import { clearProductsTable, createProductsTableIfDoesNotExist, getProductsRepository } from "../helpers/productsTable";
import { createProduct } from "../helpers/createProduct";
import { getAuthToken, testUnauthorized } from "../helpers/auth";
import { ProductData } from "../../src/api/products/ProductData";

describe("Product", () => {
  const endpoint = "/product";

  beforeAll(async () => {
    await createProductsTableIfDoesNotExist();
    await clearProductsTable();
  });

  describe("DELETE /product/{id}", () => {
    testUnauthorized(`${endpoint}/${v4()}`, "delete");

    it("responds with 204 status code and deletes the product if the product has been deleted successfully", async () => {
      const newProduct: ProductData = createProduct({ id: undefined, createdAt: undefined });
      const existingProduct = await getProductsRepository().create(newProduct);

      const response = await request
        .delete(`${endpoint}/${existingProduct.id}`)
        .set("Authorization", getAuthToken(v4()));
      const product = await getProductsRepository().fetchById(existingProduct.id);

      expect(response.statusCode).toEqual(204);
      expect(product).toBeUndefined();
    });

    it("responds with 404 status code and not found error message if product with given id does not exist", async () => {
      const response = await request.delete(`${endpoint}/${v4()}`).set("Authorization", getAuthToken(v4()));

      expect(response.statusCode).toEqual(404);
      expect(response.body.type).toEqual("PRODUCT_NOT_FOUND");
    });
  });

  describe("GET /product/{id}", () => {
    testUnauthorized(`${endpoint}/${v4()}`, "get");

    it("responds with 200 status code and product data if product with given id exists", async () => {
      const newProduct: ProductData = createProduct({ id: undefined, createdAt: undefined });
      const expectedProduct = await getProductsRepository().create(newProduct);
      const expectedResponseBody = {
        product: { ...expectedProduct, createdAt: expectedProduct.createdAt.toISOString() },
      };

      const response = await request.get(`${endpoint}/${expectedProduct.id}`).set("Authorization", getAuthToken(v4()));

      expect(response.body).toEqual(expectedResponseBody);
      expect(response.statusCode).toEqual(200);
    });

    it("responds with 404 status code and not found message if the product with given id does not exist", async () => {
      const response = await request.get(`${endpoint}/${v4()}`).set("Authorization", getAuthToken(v4()));

      expect(response.body.type).toEqual("PRODUCT_NOT_FOUND");
      expect(response.statusCode).toEqual(404);
    });
  });

  describe("PUT /product/{id}", () => {
    testUnauthorized(`${endpoint}/${v4()}`, "put", {
      product: createProduct({ id: undefined, createdAt: undefined }),
    });

    it("responds with 200 status code and product data if product with given id exists and request body is valid", async () => {
      const oldProduct = createProduct();
      const newProduct = createProduct({ id: undefined, createdAt: undefined });
      const requestBody = {
        product: newProduct,
      };
      const expectedProduct = await getProductsRepository().create(oldProduct);
      const expectedResponseBody = {
        product: {
          ...newProduct,
          id: expectedProduct.id,
          createdAt: expectedProduct.createdAt.toISOString(),
        },
      };

      const response = await request
        .put(`${endpoint}/${expectedProduct.id}`)
        .set("Authorization", getAuthToken(v4()))
        .send(requestBody);

      expect(response.body).toEqual(expectedResponseBody);
      expect(response.statusCode).toEqual(200);
    });

    it("responds with 404 status code and not found error message if product with given id does not exist", async () => {
      const response = await request
        .put(`${endpoint}/${v4()}`)
        .set("Authorization", getAuthToken(v4()))
        .send({
          product: createProduct({ id: undefined, createdAt: undefined }),
        });

      expect(response.body.type).toEqual("PRODUCT_NOT_FOUND");
      expect(response.statusCode).toEqual(404);
    });
  });

  describe("POST /product", () => {
    testUnauthorized(endpoint, "post", {
      product: createProduct({ id: undefined, createdAt: undefined }),
    });

    it("responds with 422 status code and validation error if provided product price is negative number", async () => {
      const invalidPrice = -1000;
      const expectedResponseBody = {
        details: {
          "reqBody.product.price": {
            message: "price has to be equal or greater than 0",
            value: invalidPrice,
          },
        },
        message: "validation failed",
      };

      const response = await request
        .post(endpoint)
        .set("Authorization", getAuthToken(v4()))
        .send({
          product: createProduct({
            id: undefined,
            createdAt: undefined,
            price: invalidPrice,
          }),
        });

      expect(response.statusCode).toEqual(422);
      expect(response.body).toEqual(expectedResponseBody);
    });

    it("responds with 201 status code and newly created product data if product has been created successfully", async () => {
      const requestBody = {
        product: createProduct({ id: undefined, createdAt: undefined }),
      };
      const expectedResponseBody = {
        product: {
          ...requestBody.product,
          id: expect.anything(),
          createdAt: expect.anything(),
        },
      };

      const response = await request.post(endpoint).set("Authorization", getAuthToken(v4())).send(requestBody);
      const responseBodyProduct = response.body.product;
      const actualProduct = await getProductsRepository().fetchById(response.body.product.id);

      expect(response.body).toEqual(expectedResponseBody);
      expect(typeof responseBodyProduct.id).toEqual("string");
      expect(new Date().getTime() - new Date(responseBodyProduct.createdAt).getTime()).toBeLessThan(5000);
      expect(response.statusCode).toEqual(201);
      expect(actualProduct).toEqual({
        ...responseBodyProduct,
        createdAt: new Date(responseBodyProduct.createdAt),
      });
    });

    it("responds with 422 status code and validation error if product is empty", async () => {
      const response = await request.post(endpoint).set("Authorization", getAuthToken(v4())).send({
        product: {},
      });

      expect(response.statusCode).toEqual(422);
      expect(response.body).toEqual({
        details: {
          "reqBody.product.description": {
            message: "'description' is required",
          },
          "reqBody.product.name": {
            message: "'name' is required",
          },
          "reqBody.product.price": {
            message: "'price' is required",
          },
        },
        message: "validation failed",
      });
    });
  });
});
