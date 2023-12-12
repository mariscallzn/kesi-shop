import {types} from 'mobx-state-tree';
import {withSetPropAction} from './helpers/withSetPropAction';

//TODO: Review identifiers
// https://mobx-state-tree.js.org/concepts/references#references
// https://mobx-state-tree.js.org/concepts/references#identifiers

export const Product = types
  .model('Product')
  .props({
    id: types.identifier,
    name: '',
  })
  .actions(withSetPropAction);

export const Category = types.model('Category').props({
  id: types.identifier,
  name: '',
});

export const ShoppingListItem = types.model('ShoppingListItem').props({
  id: types.identifier,
  product: types.reference(Product),
  category: types.reference(Category),
  checked: false,
  quantity: '',
  unit: '',
});

export const ShoppingList = types.model('ShoppingList').props({
  id: types.identifier,
  name: types.string,
  items: types.array(ShoppingListItem),
  totalItems: 0,
  checkedItems: 0,
});
