import {Database} from '@nozbe/watermelondb';
import {DAOCategories} from '../database/models';
import {Tables} from '../database/schema';

export type Category = {
  id: string;
  color: string;
};

//#region DefaultCategoriesProvider
export interface DefaultCategoriesProvider {
  getDefaultCategories(): Promise<Category[]>;
}

export class JsonDefaultCategoriesProvider
  implements DefaultCategoriesProvider
{
  private readonly defaultCategoriesJson: Category[];
  constructor(defaultCategoriesJson: string) {
    this.defaultCategoriesJson = JSON.parse(defaultCategoriesJson);
  }

  getDefaultCategories(): Promise<Category[]> {
    return Promise.resolve(this.defaultCategoriesJson);
  }
}
//#endregion

//#region CategoryFacilitator
export interface CategoryFacilitator {
  checkAndPrePopulate(): Promise<void>;
  findOrCreate(category: Category): Promise<Category>;
}

export class CategoryFacilitatorImpl implements CategoryFacilitator {
  private readonly categoryRepository: CategoryRepository;
  private readonly defaultCategoriesProvider: DefaultCategoriesProvider;
  constructor(
    categoryRepository: CategoryRepository,
    defaultCategoriesProvider: DefaultCategoriesProvider,
  ) {
    this.categoryRepository = categoryRepository;
    this.defaultCategoriesProvider = defaultCategoriesProvider;
  }

  async checkAndPrePopulate(): Promise<void> {
    try {
      if (!(await this.categoryRepository.isDataSynced())) {
        this.categoryRepository.saveCategories(
          await this.defaultCategoriesProvider.getDefaultCategories(),
        );
      }
      return;
    } catch (error) {
      throw error;
    }
  }

  async findOrCreate(category: Category): Promise<Category> {
    try {
      return await this.categoryRepository.findOrCreate(category);
    } catch (error) {
      throw error;
    }
  }
}
//#endregion

//#region Category Repository
export interface CategoryRepository {
  fetch(): Promise<Category[]>;
  findOrCreate(category: Category): Promise<Category>;
  save(color: string): Promise<Category>;
  saveCategories(categories: Category[]): Promise<void>;
  findCategoryById(id: string): Promise<Category | undefined>;
  isDataSynced(): Promise<boolean>;
}

export class DatabaseCategoriesRepository implements CategoryRepository {
  private readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async fetch(): Promise<Category[]> {
    try {
      return await this.database
        .get<DAOCategories>(Tables.categories)
        .query()
        .fetch();
    } catch (error) {
      throw error;
    }
  }

  async findOrCreate(category: Category): Promise<Category> {
    try {
      const daoCategory = await this.findCategoryById(category.id);
      if (daoCategory) {
        return daoCategory;
      } else {
        return await this.save(category.color);
      }
    } catch (error) {
      throw error;
    }
  }

  async save(color: string): Promise<Category> {
    try {
      return await this.database.write(async () => {
        return await this.database
          .get<DAOCategories>(Tables.categories)
          .create(dao => {
            dao.color = color;
          });
      });
    } catch (error) {
      throw error;
    }
  }

  async saveCategories(categories: Category[]): Promise<void> {
    for (const category of categories) {
      try {
        this.database.write(async () => {
          return await this.database
            .get<DAOCategories>(Tables.categories)
            .create(dao => {
              dao.color = category.color;
            });
        });
      } catch (error) {
        throw error;
      }
    }
  }

  async findCategoryById(id: string): Promise<Category | undefined> {
    try {
      return await this.database.get<DAOCategories>(Tables.categories).find(id);
    } catch (error) {
      return;
    }
  }

  async isDataSynced(): Promise<boolean> {
    try {
      return (
        (await this.database.get(Tables.categories).query().fetchCount()) > 0
      );
    } catch (error) {
      throw error;
    }
  }
}
//#endregion
