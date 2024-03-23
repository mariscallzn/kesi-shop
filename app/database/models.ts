import {associations, Model, Query, Relation} from '@nozbe/watermelondb';
import {
  children,
  date,
  field,
  immutableRelation,
  relation,
  text,
  writer,
} from '@nozbe/watermelondb/decorators';
import {Columns, Tables} from './schema';

//Docs: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#definite-assignment-assertions

//#region DAOShoppingLists
const ShoppingListsColumns = Columns.shoppingLists;
export class DAOShoppingLists extends Model {
  static table = Tables.shoppingLists;
  static associations = associations([
    Tables.shoppingListItems,
    {type: 'has_many', foreignKey: Columns.shoppingListItems.shoppingListId},
  ]);

  @text(ShoppingListsColumns.name)
  name!: string;
  @date(ShoppingListsColumns.createdAt) createdAt!: Date;
  @date(ShoppingListsColumns.updatedAt) updatedAt!: Date;

  @children(Tables.shoppingListItems)
  shoppingListItems!: Query<DAOShoppingListItems>;

  @writer async updateShoppingList(name: string): Promise<DAOShoppingLists> {
    return await this.update(_shoppingList => {
      _shoppingList.name = name;
    });
  }
}
//#endregion

//#region DAOShoppingListItems
const ShoppingListItemsColumns = Columns.shoppingListItems;
export class DAOShoppingListItems extends Model {
  static table = Tables.shoppingListItems;
  static associations = associations([
    Tables.shoppingLists,
    {type: 'belongs_to', key: Columns.shoppingListItems.shoppingListId},
  ]);

  @relation(Tables.products, ShoppingListItemsColumns.productId)
  product!: Relation<DAOProducts>;

  @relation(Tables.categories, ShoppingListItemsColumns.categoryId)
  category!: Relation<DAOCategories>;

  @text(ShoppingListItemsColumns.shoppingListId)
  shoppingListId!: string;
  @field(ShoppingListItemsColumns.quantity) quantity!: number;
  @text(ShoppingListItemsColumns.unit) unit!: string;
  @field(ShoppingListItemsColumns.checked) checked!: boolean;
  @date(ShoppingListItemsColumns.createdAt) createdAt!: Date;
  @date(ShoppingListItemsColumns.updatedAt) updatedAt!: Date;

  @immutableRelation(
    Tables.shoppingLists,
    ShoppingListItemsColumns.shoppingListId,
  )
  shoppingList!: Relation<DAOShoppingLists>;

  @writer async updateShoppingListItem(
    checked: boolean,
    quantity: number,
    unit: string,
    productId: string,
    categoriesId?: string,
  ): Promise<DAOShoppingListItems> {
    return await this.update(item => {
      item.product.id = productId;
      item.checked = checked;
      item.quantity = quantity;
      item.unit = unit;
      item.category.id = categoriesId;
    });
  }

  @writer async toggleItem(checked: boolean): Promise<DAOShoppingListItems> {
    return await this.update(item => {
      item.checked = checked;
    });
  }

  @writer async delete(): Promise<void> {
    return await this.destroyPermanently();
  }
}
//#endregion

//#region DAOProducts
const ProductsColumn = Columns.products;
export class DAOProducts extends Model {
  static table = Tables.products;
  @text(ProductsColumn.name)
  name!: string;
  @date(ProductsColumn.createdAt) createdAt!: Date;
  @date(ProductsColumn.updatedAt) updatedAt!: Date;
}
//#endregion

//#region DAO Category
const CategoriesColumn = Columns.categories;
export class DAOCategories extends Model {
  static table = Tables.categories;
  @text(CategoriesColumn.color)
  color!: string;
  @date(CategoriesColumn.createdAt) createdAt!: Date;
  @date(CategoriesColumn.updatedAt) updatedAt!: Date;
}
//#endregion
