import { ProductData } from "./ProductData";
import { Product } from "./Product";

export interface ProductsRepository {
  create(newProduct: ProductData): Promise<Product>;
  update(id: string, product: ProductData): Promise<Product | undefined>;
  fetchById(id: string): Promise<Product | undefined>;
  delete(id: string): Promise<boolean>;
  fetchAll(): Promise<Product[]>;
}
