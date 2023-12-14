import {types} from 'mobx-state-tree';
import {getUUID} from '../utils/misc';
import {withSetPropAction} from './helpers/withSetPropAction';
import {Product} from './Product';
import {ShoppingListModel} from './ShoppingLists';

export const ShoppingStore = types
  .model('ShoppingStore')
  .props({
    shoppingLists: types.array(ShoppingListModel),
  })
  .actions(withSetPropAction)
  .views(self => ({
    getListById(listId: string) {
      return self.shoppingLists.find(
        shoppingList => shoppingList.id === listId,
      );
    },
  }))
  .actions(self => ({
    addShoppingList(name: string) {
      //TODO: Somehow add it first to the DB and then reflect the result here
      self.shoppingLists.push({id: getUUID(), name: name});
    },
    addProductsToShoppingList(products: Product[], listId: string) {
      if (listId) {
        const shoppingList = self.getListById(listId);
        if (shoppingList) {
          products.forEach(product =>
            shoppingList.items.push({
              id: getUUID(),
              product: product.id,
              checked: false,
            }),
          );
        }
      }
    },
  }));
