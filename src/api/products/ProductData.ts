import { Product } from "./Product";

export interface ProductData extends Omit<Product, "id" | "createdAt"> {}
