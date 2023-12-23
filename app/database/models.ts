import {associations, Model, Q} from '@nozbe/watermelondb';
import {
  date,
  field,
  immutableRelation,
  lazy,
  text,
  writer,
} from '@nozbe/watermelondb/decorators';
import {ShoppingListItemSnapshotIn} from '../models/ShoppingLists';
import {Columns, Tables} from './schema';

//Docs: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#definite-assignment-assertions

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

  @lazy
  shoppingListItems = this.collections
    .get<DAOShoppingListItems>(Tables.shoppingListItems)
    .query(Q.where(Columns.shoppingListItems.shoppingListId, this.id));

  @writer async addShoppingListItem(
    shoppingListItem: ShoppingListItemSnapshotIn,
  ): Promise<DAOShoppingListItems> {
    return await this.collections
      .get<DAOShoppingListItems>(Tables.shoppingListItems)
      .create(item => {
        //@ts-ignore
        item.shoppingList.set(this);
        item.productName = shoppingListItem.product;
        item.checked = shoppingListItem.checked ?? false;
        item.quantity = shoppingListItem.quantity ?? 0;
        item.unit = shoppingListItem.unit ?? '';
      });
  }
}

const ShoppingListItemsColumns = Columns.shoppingListItems;
export class DAOShoppingListItems extends Model {
  static table = Tables.shoppingListItems;
  static associations = associations([
    Tables.shoppingLists,
    {type: 'belongs_to', key: Columns.shoppingListItems.shoppingListId},
  ]);

  @text(ShoppingListItemsColumns.shoppingListId) shoppingListId!: string;
  @text(ShoppingListItemsColumns.productName) productName!: string;
  @field(ShoppingListItemsColumns.quantity) quantity!: number;
  @text(ShoppingListItemsColumns.unit) unit!: string;
  @field(ShoppingListItemsColumns.checked) checked!: boolean;
  @date(ShoppingListItemsColumns.createdAt) createdAt!: Date;
  @date(ShoppingListItemsColumns.updatedAt) updatedAt!: Date;

  @immutableRelation(
    Tables.shoppingLists,
    ShoppingListItemsColumns.shoppingListId,
  )
  shoppingList!: DAOShoppingLists;

  @writer async updateShoppingListItem(
    shoppingListItem: ShoppingListItemSnapshotIn,
  ): Promise<DAOShoppingListItems> {
    return await this.update(item => {
      item.productName = shoppingListItem.product;
      item.checked = shoppingListItem.checked ?? false;
      item.quantity = shoppingListItem.quantity ?? 0;
      item.unit = shoppingListItem.unit ?? '';
    });
  }

  @writer async toggleItem(checked: boolean): Promise<DAOShoppingListItems> {
    return await this.update(item => {
      item.checked = checked;
    });
  }
}
