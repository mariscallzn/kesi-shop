import {
  appSchema,
  columnName,
  tableName,
  tableSchema,
} from '@nozbe/watermelondb';
import {DAOShoppingListItems, DAOShoppingLists} from './models';

export const Tables = {
  shoppingLists: tableName<DAOShoppingLists>('shopping_lists'),
  shoppingListItems: tableName<DAOShoppingListItems>('shopping_list_items'),
};

export const Columns = {
  shoppingLists: {
    name: columnName('name'),
    createdAt: columnName('created_at'),
    updatedAt: columnName('updated_at'),
  },
  shoppingListItems: {
    shoppingListId: columnName('shopping_list_id'),
    productName: columnName('product_name'),
    quantity: columnName('quantity'),
    unit: columnName('unit'),
    checked: columnName('checked'),
    createdAt: columnName('created_at'),
    updatedAt: columnName('updated_at'),
  },
};

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: Tables.shoppingLists,
      columns: [
        {name: Columns.shoppingLists.name, type: 'string'},
        {name: Columns.shoppingLists.createdAt, type: 'number'},
        {name: Columns.shoppingLists.updatedAt, type: 'number'},
      ],
    }),
    tableSchema({
      name: Tables.shoppingListItems,
      columns: [
        {
          name: Columns.shoppingListItems.shoppingListId,
          type: 'string',
          isIndexed: true,
        },
        {name: Columns.shoppingListItems.productName, type: 'string'},
        {name: Columns.shoppingListItems.quantity, type: 'number'},
        {name: Columns.shoppingListItems.unit, type: 'string'},
        {name: Columns.shoppingListItems.checked, type: 'boolean'},
        {name: Columns.shoppingListItems.createdAt, type: 'number'},
        {name: Columns.shoppingListItems.updatedAt, type: 'number'},
      ],
    }),
  ],
});
