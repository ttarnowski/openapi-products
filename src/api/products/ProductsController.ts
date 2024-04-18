import { inject } from "inversify";
import { Controller, Get, Route, Security } from "tsoa";
import { provideSingleton } from "../../util/provideSingleton";
import securities from "../auth/securities";
import { Product } from "./Product";
import { ProductsRepository } from "./ProductsRepository";

export type ProductsResponseBody = {
  products: Product[];
};

@Route("products")
@provideSingleton(ProductsController)
export class ProductsController extends Controller {
  constructor(@inject("ProductsRepository") private productsRepository: ProductsRepository) {
    super();
  }

  @Get()
  @Security(securities.USER_AUTH)
  public async listProducts(): Promise<ProductsResponseBody> {
    const products = await this.productsRepository.fetchAll();

    return {
      products,
    };
  }
}
