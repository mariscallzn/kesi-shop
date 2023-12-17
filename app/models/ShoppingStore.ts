import {types} from 'mobx-state-tree';
import {getUUID} from '../utils/misc';
import {withSetPropAction} from './helpers/withSetPropAction';
import {Product} from './Product';
import {
  ShoppingListItem,
  ShoppingListItemModel,
  ShoppingListModel,
} from './ShoppingLists';

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
          // We create a new array that will remove items or add new ones but keeping those that
          // existed already
          const updatedList: ShoppingListItem[] = [];

          // Loop products to update the shopping list with the new items if there are any
          // or automatically remove those that are not coming from products
          products.forEach(product => {
            const existingProduct = shoppingList.items.find(
              s => s.product === product.name,
            );
            // Keep existing products
            if (existingProduct !== undefined) {
              updatedList.push(existingProduct);
            } else {
              // Create a new instance from the incoming product
              //TODO: add to DB
              updatedList.push(
                ShoppingListItemModel.create({
                  id: getUUID(),
                  product: product.name,
                  checked: false,
                }),
              );
            }
          });
          // Override array with the updated list
          shoppingList.setProp('items', updatedList);
        }
      }
    },
  }));
