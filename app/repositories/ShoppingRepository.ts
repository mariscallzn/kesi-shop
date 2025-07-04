import {Database, Q} from '@nozbe/watermelondb';
import {asc} from '@nozbe/watermelondb/QueryDescription';
import {DAOShoppingListItems, DAOShoppingLists} from '../database/models';
import {Columns, Tables} from '../database/schema';
import {Category, CategoryFacilitator} from './CategoryRepository';
import {Product, ProductFacilitator} from './ProductRepository';

type ShoppingList = {
  id: string;
  name: string;
  checkedItems?: number;
  totalItems?: number;
  items?: ShoppingListItem[];
};

export type ShoppingListItem = {
  id: string;
  product: Product;
  category?: Category;
  quantity: number;
  unit: string;
  checked: boolean;
};

export interface ShoppingRepository {
  syncAndFetchLists(): Promise<ShoppingList[]>;
  addOrUpdate(shoppingList: ShoppingList): Promise<ShoppingList>;
  getShoppingListItemsByListId(id: string): Promise<ShoppingListItem[]>;
  addOrUpdateShoppingListItem(
    listId: string,
    shoppingListItem: ShoppingListItem,
  ): Promise<ShoppingListItem>;
  addOrRemoveProductsToShoppingList(
    shoppingListId: string,
    productIds: string[],
  ): Promise<void>;
  toggleShoppingListItemById(id: string, value: boolean): Promise<void>;
}

export class DatabaseShoppingRepository implements ShoppingRepository {
  private readonly database: Database;
  private readonly productFacilitator: ProductFacilitator;
  private readonly categoryFacilitator: CategoryFacilitator;

  constructor(
    database: Database,
    productFacilitator: ProductFacilitator,
    categoryFacilitator: CategoryFacilitator,
  ) {
    this.database = database;
    this.productFacilitator = productFacilitator;
    this.categoryFacilitator = categoryFacilitator;
  }

  async syncAndFetchLists(): Promise<ShoppingList[]> {
    try {
      await this.productFacilitator.checkAndPrePopulate();
      await this.categoryFacilitator.checkAndPrePopulate();

      const shoppingLists: ShoppingList[] = [];
      const daoShoppingLists = await this.database
        .get<DAOShoppingLists>(Tables.shoppingLists)
        .query()
        .fetch();

      for (const daoShoppingList of daoShoppingLists) {
        const items = await daoShoppingList.shoppingListItems.fetch();
        shoppingLists.push({
          id: daoShoppingList.id,
          name: daoShoppingList.name,
          checkedItems: items.filter(f => f.checked === true).length,
          totalItems: items.length,
          items: [], //Items will be lazy-initialized whenever the user requires
        });
      }

      return shoppingLists;
    } catch (error) {
      throw error;
    }
  }

  async addOrUpdate(shoppingList: ShoppingList): Promise<ShoppingList> {
    try {
      let _shoppingList: ShoppingList;
      //database.find rejects the promise if it's not found, which force us
      //to have this nested try-catch
      try {
        const daoShoppingList = await this.database
          .get<DAOShoppingLists>(Tables.shoppingLists)
          .find(shoppingList.id);
        const daoUpdatedShoppingList = await daoShoppingList.updateShoppingList(
          shoppingList.name,
        );
        _shoppingList = {
          ...shoppingList,
          id: daoUpdatedShoppingList.id,
          name: daoUpdatedShoppingList.name,
        };
      } catch (error) {
        const daoNewShoppingList = await this.database.write(async () => {
          return await this.database
            .get<DAOShoppingLists>(Tables.shoppingLists)
            .create(newShoppingList => {
              newShoppingList.name = shoppingList.name;
            });
        });
        _shoppingList = {
          id: daoNewShoppingList.id,
          name: daoNewShoppingList.name,
          checkedItems: 0,
          totalItems: 0,
          items: [],
        };
      }
      return _shoppingList;
    } catch (error) {
      throw error;
    }
  }

  async getShoppingListItemsByListId(id: string): Promise<ShoppingListItem[]> {
    try {
      const daoShoppingList = await this.database
        .get<DAOShoppingLists>(Tables.shoppingLists)
        .find(id);

      const daoShoppingListItems =
        await daoShoppingList.shoppingListItems.extend(
          Q.sortBy(Columns.shoppingListItems.checked, asc),
        );

      const shoppingListItems: ShoppingListItem[] = [];
      for (const daoShoppingListItem of daoShoppingListItems) {
        const daoProduct = await daoShoppingListItem.product.fetch();
        const daoCategory = await daoShoppingListItem.category.fetch();
        shoppingListItems.push({
          id: daoShoppingListItem.id,
          product: daoProduct,
          category: daoCategory,
          checked: daoShoppingListItem.checked,
          quantity: daoShoppingListItem.quantity,
          unit: daoShoppingListItem.unit,
        });
      }

      const checkItems: ShoppingListItem[] = [];
      const undefinedCategoryItems: ShoppingListItem[] = [];
      const categorizedItems: ShoppingListItem[] = [];

      shoppingListItems.forEach(item => {
        if (item.checked) {
          checkItems.push(item);
        } else if (!item.category?.color || item.category?.color === '') {
          undefinedCategoryItems.push(item);
        } else {
          categorizedItems.push(item);
        }
      });

      return categorizedItems
        .sort((a, b) => a.category!!.color.localeCompare(b.category!!.color))
        .concat(undefinedCategoryItems, checkItems);
    } catch (error) {
      throw error;
    }
  }

  async addOrUpdateShoppingListItem(
    listId: string,
    shoppingListItem: ShoppingListItem,
  ): Promise<ShoppingListItem> {
    try {
      const daoProduct = await this.productFacilitator.findOrCreate(
        shoppingListItem.product,
      );

      let daoCategory: Category | null = null;
      if (shoppingListItem.category) {
        daoCategory = await this.categoryFacilitator.findOrCreate(
          shoppingListItem.category,
        );
      }

      let updatedShoppingList: DAOShoppingListItems;
      try {
        const daoShoppingListItem = await this.database
          .get<DAOShoppingListItems>(Tables.shoppingListItems)
          .find(shoppingListItem.id);
        updatedShoppingList = await daoShoppingListItem.updateShoppingListItem(
          shoppingListItem.checked,
          shoppingListItem.quantity,
          shoppingListItem.unit,
          daoProduct.id,
          daoCategory?.id,
        );
      } catch (error) {
        updatedShoppingList = await this.database.write(async () => {
          return await this.database
            .get<DAOShoppingListItems>(Tables.shoppingListItems)
            .create(dao => {
              dao.checked = shoppingListItem.checked;
              dao.quantity = shoppingListItem.quantity;
              dao.unit = shoppingListItem.unit;
              dao.product.id = daoProduct.id;
              dao.shoppingList.id = listId;
              dao.category.id = daoCategory?.id;
            });
        });
      }
      return {
        id: updatedShoppingList.id,
        checked: updatedShoppingList.checked,
        product: {id: daoProduct.id, name: daoProduct.name},
        category: {
          id: daoCategory?.id ?? 'n/a',
          color: daoCategory?.color ?? 'n/a',
        },
        quantity: updatedShoppingList.quantity,
        unit: updatedShoppingList.unit,
      };
    } catch (error) {
      throw error;
    }
  }

  async addOrRemoveProductsToShoppingList(
    shoppingListId: string,
    productIds: string[],
  ): Promise<void> {
    try {
      const daoShoppingList = await this.database
        .get<DAOShoppingLists>(Tables.shoppingLists)
        .find(shoppingListId);

      const daoRemovedItems = await daoShoppingList.shoppingListItems
        .extend(
          Q.where(Columns.shoppingListItems.productId, Q.notIn(productIds)),
        )
        .fetch();
      for (const daoRemovedItem of daoRemovedItems) {
        daoRemovedItem.delete();
      }

      const daoShoppingListItems =
        await daoShoppingList.shoppingListItems.fetch();

      const currentProducts: Product[] = [];
      for (const daoShoppingListItem of daoShoppingListItems) {
        currentProducts.push(await daoShoppingListItem.product.fetch());
      }

      const addedProductIds = productIds.filter(
        productId =>
          !currentProducts.some(
            _currentProduct => _currentProduct.id === productId,
          ),
      );

      await this.database.write(async () => {
        for (const addedProductId of addedProductIds) {
          await this.database
            .get<DAOShoppingListItems>(Tables.shoppingListItems)
            .create(_daoShoppingListItem => {
              _daoShoppingListItem.shoppingList.id = shoppingListId;
              _daoShoppingListItem.product.id = addedProductId;
              _daoShoppingListItem.quantity = 0;
              _daoShoppingListItem.unit = '';
              _daoShoppingListItem.checked = false;
            });
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async toggleShoppingListItemById(id: string, value: boolean): Promise<void> {
    try {
      const daoShoppingListItem = await this.database
        .get<DAOShoppingListItems>(Tables.shoppingListItems)
        .find(id);
      await daoShoppingListItem.toggleItem(value);
    } catch (error) {
      throw error;
    }
  }
}
