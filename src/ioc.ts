import { Container, decorate, injectable } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { Controller } from "tsoa";
import { ArticlesRepository } from "./api/articles/ArticlesRepository";
import { ArticlesRepositoryInMemory } from "./api/articles/ArticlesRepositoryInMemory";
import { ProductsRepository } from "./api/products/ProductsRepository";
import { ProductsRepositoryDynamoDB } from "./api/products/ProductsRepositoryDynamoDB";

const iocContainer = new Container();

decorate(injectable(), Controller);

iocContainer.load(buildProviderModule());

const inMemoryArticleRepository = new ArticlesRepositoryInMemory();
iocContainer.bind<ArticlesRepository>("ArticlesRepository").toDynamicValue(() => inMemoryArticleRepository);
iocContainer.bind<ProductsRepository>("ProductsRepository").toConstantValue(new ProductsRepositoryDynamoDB());

export { iocContainer };
