import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { createProduct } from "../../../test/helpers/createProduct";
import { mapProductDynamoDBItemToProduct } from "./ProductsRepositoryDynamoDB";

describe("mapProductDynamoDBItemToProduct", () => {
  it("maps dynamodb item to product object", () => {
    const expectedProduct = createProduct();

    const item: Record<string, AttributeValue> = {
      ProductID: { S: expectedProduct.id },
      Name: { S: expectedProduct.name },
      Description: { S: expectedProduct.description },
      Price: { N: String(expectedProduct.price) },
      CreatedAt: { N: String(expectedProduct.createdAt.getTime()) },
    };

    const actualProduct = mapProductDynamoDBItemToProduct(item);

    expect(actualProduct).toEqual(expectedProduct);
  });
});
