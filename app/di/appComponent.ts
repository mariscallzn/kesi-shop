import {Database} from '@nozbe/watermelondb';
import database from '../database/database';
import {
  DatabaseProductRepository,
  DefaultProductsProvider,
  JsonDefaultProductsProvider,
  ProductFacilitator,
  ProductFacilitatorImpl,
  ProductRepository,
} from '../repositories/ProductRepository';
import {
  DatabaseShoppingRepository,
  ShoppingRepository,
} from '../repositories/ShoppingRepository';

export interface AppComponent {
  productRepository(): ProductRepository;
  shoppingRepository(): ShoppingRepository;
}

class AppModule {
  private readonly database: Database;
  private readonly defaultProductsJson: string;

  constructor(_database: Database, defaultProductsJson: string) {
    this.database = _database;
    this.defaultProductsJson = defaultProductsJson;
  }

  private providesDatabase(): Database {
    return this.database;
  }

  private providesDefaultProductsJson(): string {
    return this.defaultProductsJson;
  }

  private providesProductRepository(_database: Database): ProductRepository {
    return new DatabaseProductRepository(_database);
  }

  private providesDefaultProductsProvider(
    json: string,
  ): DefaultProductsProvider {
    return new JsonDefaultProductsProvider(json);
  }

  private providesProductFacilitator(
    productRepository: ProductRepository,
    defaultProductsProvider: DefaultProductsProvider,
  ): ProductFacilitator {
    return new ProductFacilitatorImpl(
      productRepository,
      defaultProductsProvider,
    );
  }

  private providesShoppingRepository(
    _database: Database,
    productFacilitator: ProductFacilitator,
  ): ShoppingRepository {
    return new DatabaseShoppingRepository(_database, productFacilitator);
  }

  getProductRepository(): ProductRepository {
    return this.providesProductRepository(this.providesDatabase());
  }

  getShoppingRepository(): ShoppingRepository {
    return this.providesShoppingRepository(
      this.providesDatabase(),
      this.providesProductFacilitator(
        this.getProductRepository(),
        this.providesDefaultProductsProvider(
          this.providesDefaultProductsJson(),
        ),
      ),
    );
  }
}

class AppComponentProduction implements AppComponent {
  private readonly appModule: AppModule;
  constructor(appModule: AppModule) {
    this.appModule = appModule;
  }
  productRepository(): ProductRepository {
    return this.appModule.getProductRepository();
  }
  shoppingRepository(): ShoppingRepository {
    return this.appModule.getShoppingRepository();
  }
}

export const appComponent: AppComponent = new AppComponentProduction(
  new AppModule(database, JSON.stringify(require('../products.json'))),
);
