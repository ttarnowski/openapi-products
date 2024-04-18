import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { v4 } from "uuid";
import { Product } from "./Product";
import { mapProductToDynamoDBItem } from "./ProductsRepositoryDynamoDB";

describe("mapProductToDynamoDBItem", () => {
  it("maps product to product dynamodb item", () => {
    const expectedItem: Record<string, AttributeValue> = {
      ProductID: { S: v4() },
      Name: { S: `name-${v4()}` },
      Description: { S: `description-${v4()}` },
      Price: { N: String(Math.random() * 50) },
      CreatedAt: { N: String(new Date().getTime()) },
    };
    const product: Product = {
      id: expectedItem["ProductID"].S as string,
      name: expectedItem["Name"].S as string,
      description: expectedItem["Description"].S as string,
      price: Number(expectedItem["Price"].N),
      createdAt: new Date(Number(expectedItem["CreatedAt"].N)),
    };

    const actualItem = mapProductToDynamoDBItem(product);

    expect(actualItem).toEqual(expectedItem);
  });
});
