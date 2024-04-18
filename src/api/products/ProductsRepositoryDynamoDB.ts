import config from "config";
import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { v4 } from "uuid";
import { ProductData } from "./ProductData";
import { Product } from "./Product";
import { ProductsRepository } from "./ProductsRepository";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const mapProductToDynamoDBItem = (product: Product): Record<string, AttributeValue> => {
  return {
    ProductID: { S: product.id },
    Name: { S: product.name },
    Description: { S: product.description },
    Price: { N: String(product.price) },
    CreatedAt: { N: product.createdAt.getTime().toString() },
  };
};

export const mapProductDynamoDBItemToProduct = (item: Record<string, AttributeValue>): Product => {
  const obj = unmarshall(item);

  return {
    id: obj["ProductID"],
    name: obj["Name"],
    description: obj["Description"],
    price: obj["Price"],
    createdAt: new Date(obj["CreatedAt"]),
  };
};

export class ProductsRepositoryDynamoDB implements ProductsRepository {
  private client: DynamoDBClient;
  private tableName: string;

  constructor() {
    this.client = new DynamoDBClient(config.get("dynamodb"));
    this.tableName = config.get("dbTables.products.name");
  }

  async fetchAll(): Promise<Product[]> {
    const output = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );

    return (output.Items || []).map((item) => mapProductDynamoDBItemToProduct(item));
  }

  async delete(id: string): Promise<boolean> {
    const existingProduct = await this.fetchById(id);
    if (!existingProduct) {
      return false;
    }

    await this.client.send(
      new DeleteItemCommand({
        TableName: this.tableName,
        Key: {
          ProductID: { S: id },
        },
      }),
    );

    return true;
  }

  async update(id: string, data: ProductData): Promise<Product | undefined> {
    const existingProduct = await this.fetchById(id);

    if (!existingProduct) {
      return undefined;
    }

    const newProduct = {
      ...data,
      id,
      createdAt: existingProduct.createdAt,
    };

    await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: mapProductToDynamoDBItem(newProduct),
      }),
    );

    return newProduct;
  }

  async create(newProduct: ProductData): Promise<Product> {
    const product = {
      ...newProduct,
      id: v4(),
      createdAt: new Date(),
    };
    await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: mapProductToDynamoDBItem(product),
      }),
    );

    return product;
  }

  async fetchById(id: string): Promise<Product | undefined> {
    const output = await this.client.send(
      new GetItemCommand({
        TableName: this.tableName,
        Key: {
          ProductID: { S: id },
        },
      }),
    );

    if (!output.Item) {
      return undefined;
    }

    return mapProductDynamoDBItemToProduct(output.Item);
  }
}
