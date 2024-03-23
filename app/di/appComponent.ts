import {Database} from '@nozbe/watermelondb';
import database from '../database/database';
import {
  CategoryFacilitator,
  CategoryFacilitatorImpl,
  CategoryRepository,
  DatabaseCategoriesRepository,
  DefaultCategoriesProvider,
  JsonDefaultCategoriesProvider,
} from '../repositories/CategoryRepository';
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
  categoryRepository(): CategoryRepository;
}

class AppModule {
  private readonly database: Database;
  private readonly defaultProductsJson: string;
  private readonly defaultCategoriesJson: string;

  constructor(
    _database: Database,
    defaultProductsJson: string,
    defaultCategoriesJson: string,
  ) {
    this.database = _database;
    this.defaultProductsJson = defaultProductsJson;
    this.defaultCategoriesJson = defaultCategoriesJson;
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

  private providesDefaultCategoriesJson(): string {
    return this.defaultCategoriesJson;
  }

  private providesCategoryRepository(_database: Database): CategoryRepository {
    return new DatabaseCategoriesRepository(_database);
  }

  private providesDefaultCategoriesProvider(
    json: string,
  ): DefaultCategoriesProvider {
    return new JsonDefaultCategoriesProvider(json);
  }

  private providesCategoryFacilitator(
    categoryRepository: CategoryRepository,
    defaultCategoriesProvider: DefaultCategoriesProvider,
  ): CategoryFacilitator {
    return new CategoryFacilitatorImpl(
      categoryRepository,
      defaultCategoriesProvider,
    );
  }

  private providesShoppingRepository(
    _database: Database,
    productFacilitator: ProductFacilitator,
    categoryFacilitator: CategoryFacilitator,
  ): ShoppingRepository {
    return new DatabaseShoppingRepository(
      _database,
      productFacilitator,
      categoryFacilitator,
    );
  }

  getCategoryRepository(): CategoryRepository {
    return this.providesCategoryRepository(this.providesDatabase());
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
      this.providesCategoryFacilitator(
        this.getCategoryRepository(),
        this.providesDefaultCategoriesProvider(
          this.providesDefaultCategoriesJson(),
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
  categoryRepository(): CategoryRepository {
    return this.appModule.getCategoryRepository();
  }
}

export const appComponent: AppComponent = new AppComponentProduction(
  new AppModule(
    database,
    JSON.stringify(require('../products.json')),
    JSON.stringify(require('../categories.json')),
  ),
);
