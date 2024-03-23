import {Database, Q} from '@nozbe/watermelondb';
import {DAOProducts} from '../database/models';
import {Columns, Tables} from '../database/schema';

export type Product = {
  id: string;
  name: string;
};

//#region DefaultProductsProvider
export interface DefaultProductsProvider {
  getDefaultProducts(): Promise<Product[]>;
}

export class JsonDefaultProductsProvider implements DefaultProductsProvider {
  private readonly defaultProductsJson: Product[];
  constructor(defaultProductsJson: string) {
    this.defaultProductsJson = JSON.parse(defaultProductsJson);
  }
  getDefaultProducts(): Promise<Product[]> {
    return Promise.resolve(this.defaultProductsJson);
  }
}
// TODO: Future implementation
// export class APIDefaultProductsProvider implements DefaultProductsProvider {}
//#endregion

//#region ProductFacilitator
export interface ProductFacilitator {
  checkAndPrePopulate(): Promise<void>;
  findOrCreate(product: Product): Promise<Product>;
}

export class ProductFacilitatorImpl implements ProductFacilitator {
  private readonly productRepository: ProductRepository;
  private readonly defaultProductsProvider: DefaultProductsProvider;
  constructor(
    productRepository: ProductRepository,
    defaultProductsProvider: DefaultProductsProvider,
  ) {
    this.productRepository = productRepository;
    this.defaultProductsProvider = defaultProductsProvider;
  }

  async checkAndPrePopulate(): Promise<void> {
    try {
      if (!(await this.productRepository.isDataSynced())) {
        this.productRepository.saveProducts(
          await this.defaultProductsProvider.getDefaultProducts(),
        );
      }
      return;
    } catch (error) {
      throw error;
    }
  }

  async findOrCreate(product: Product): Promise<Product> {
    try {
      return await this.productRepository.findOrCreate(product);
    } catch (error) {
      throw error;
    }
  }
}
//#endregion

//#region ProductRepository
export interface ProductRepository {
  findOrCreate(product: Product): Promise<Product>;
  findByNameOrGetAll(name?: string): Promise<Product[]>;
  save(name: string): Promise<Product>;
  saveProducts(products: Product[]): void;
  findProductById(id: string): Promise<Product | undefined>;
  isDataSynced(): Promise<Boolean>;
}

export class DatabaseProductRepository implements ProductRepository {
  private readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async findOrCreate(product: Product): Promise<Product> {
    try {
      const daoProduct = await this.findProductById(product.id);
      if (daoProduct) {
        return daoProduct;
      } else {
        return await this.save(product.name);
      }
    } catch (error) {
      throw error;
    }
  }

  async save(name: string): Promise<Product> {
    try {
      return await this.database.write(async () => {
        return await this.database
          .get<DAOProducts>(Tables.products)
          .create(dao => {
            dao.name = name;
          });
      });
    } catch (error) {
      throw error;
    }
  }

  async saveProducts(products: Product[]) {
    for (const product of products) {
      try {
        this.database.write(async () => {
          return await this.database
            .get<DAOProducts>(Tables.products)
            .create(dao => {
              dao.name = product.name;
            });
        });
      } catch (error) {
        throw error;
      }
    }
  }

  async findProductById(id: string): Promise<DAOProducts | undefined> {
    try {
      const daoProduct = await this.database
        .get<DAOProducts>(Tables.products)
        .find(id);
      return daoProduct;
    } catch (error) {
      return;
    }
  }

  async isDataSynced(): Promise<Boolean> {
    try {
      return (
        (await this.database.get(Tables.products).query().fetchCount()) > 0
      );
    } catch (error) {
      throw error;
    }
  }

  async findByNameOrGetAll(name?: string): Promise<Product[]> {
    try {
      let result: Product[] = [];
      if (name) {
        const exactMatch = await this.database
          .get<DAOProducts>(Tables.products)
          .query(Q.where(Columns.products.name, Q.eq(name)))
          .fetch();

        if (exactMatch.length > 0) {
          return exactMatch;
        }

        result = await this.database
          .get<DAOProducts>(Tables.products)
          .query(
            Q.where(
              Columns.products.name,
              Q.like(`${Q.sanitizeLikeString(name)}%`),
            ),
          )
          .fetch();

        result.unshift({id: 'n/a', name: name});
      } else {
        result = await this.database
          .get<DAOProducts>(Tables.products)
          .query()
          .fetch();
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}
//#endregion
