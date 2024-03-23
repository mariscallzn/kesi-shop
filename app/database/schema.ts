import {
  appSchema,
  columnName,
  tableName,
  tableSchema,
} from '@nozbe/watermelondb';
import {
  DAOCategories,
  DAOProducts,
  DAOShoppingListItems,
  DAOShoppingLists,
} from './models';

export const Tables = {
  shoppingLists: tableName<DAOShoppingLists>('shopping_lists'),
  shoppingListItems: tableName<DAOShoppingListItems>('shopping_list_items'),
  products: tableName<DAOProducts>('products'),
  categories: tableName<DAOCategories>('categories'),
};

export const Columns = {
  shoppingLists: {
    name: columnName('name'),
    createdAt: columnName('created_at'),
    updatedAt: columnName('updated_at'),
  },
  shoppingListItems: {
    shoppingListId: columnName('shopping_list_id'),
    productId: columnName('product_id'),
    categoryId: columnName('category_id'),
    quantity: columnName('quantity'),
    unit: columnName('unit'),
    checked: columnName('checked'),
    createdAt: columnName('created_at'),
    updatedAt: columnName('updated_at'),
  },
  products: {
    name: columnName('name'),
    createdAt: columnName('created_at'),
    updatedAt: columnName('updated_at'),
  },
  categories: {
    color: columnName('color'),
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
        {name: Columns.shoppingListItems.productId, type: 'string'},
        {name: Columns.shoppingListItems.categoryId, type: 'string'},
        {name: Columns.shoppingListItems.quantity, type: 'number'},
        {name: Columns.shoppingListItems.unit, type: 'string'},
        {name: Columns.shoppingListItems.checked, type: 'boolean'},
        {name: Columns.shoppingListItems.createdAt, type: 'number'},
        {name: Columns.shoppingListItems.updatedAt, type: 'number'},
      ],
    }),
    tableSchema({
      name: Tables.products,
      columns: [
        {name: Columns.products.name, type: 'string'},
        {name: Columns.products.createdAt, type: 'number'},
        {name: Columns.products.updatedAt, type: 'number'},
      ],
    }),
    tableSchema({
      name: Tables.categories,
      columns: [
        {name: Columns.categories.color, type: 'string'},
        {name: Columns.categories.createdAt, type: 'number'},
        {name: Columns.categories.updatedAt, type: 'number'},
      ],
    }),
  ],
});
