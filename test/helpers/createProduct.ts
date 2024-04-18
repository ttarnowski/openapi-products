import { v4 } from "uuid";
import { Product } from "../../src/api/products/Product";

export const createProduct = (product: Partial<Product> = {}): Product => ({
  id: v4(),
  name: `product-name-${v4()}`,
  description: `product-description-${v4()}`,
  price: Math.random() * 50,
  createdAt: new Date(),
  ...product,
});
