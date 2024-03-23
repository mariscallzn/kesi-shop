import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree';
import {withSetPropAction} from './helpers/withSetPropAction';

//TODO: Review identifiers
// https://mobx-state-tree.js.org/concepts/references#references
// https://mobx-state-tree.js.org/concepts/references#identifiers

export const ShoppingListItemModel = types
  .model('ShoppingListItemModel')
  .props({
    id: types.identifier,
    product: types.string,
    product_id: '',
    categoryColor: '',
    category_id: '',
    quantity: 0,
    unit: '',
    checked: false,
  })
  .actions(withSetPropAction);

export interface ShoppingListItem
  extends Instance<typeof ShoppingListItemModel> {}
export interface ShoppingListItemSnapshotOut
  extends SnapshotOut<typeof ShoppingListItemModel> {}
export interface ShoppingListItemSnapshotIn
  extends SnapshotIn<typeof ShoppingListItemModel> {}

export const ShoppingListModel = types
  .model('ShoppingListModel')
  .props({
    id: types.identifier,
    name: types.string,
    items: types.array(ShoppingListItemModel),
    totalItems: 0,
    checkedItems: 0,
  })
  .actions(withSetPropAction);

export interface ShoppingList extends Instance<typeof ShoppingListModel> {}
export interface ShoppingListSnapshotOut
  extends SnapshotOut<typeof ShoppingListModel> {}
export interface ShoppingListSnapshotIn
  extends SnapshotIn<typeof ShoppingListModel> {}
