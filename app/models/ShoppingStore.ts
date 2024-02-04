import {getParent, types} from 'mobx-state-tree';
import {ShoppingListItem} from '../repositories/ShoppingRepository';
import {withSetPropAction} from './helpers/withSetPropAction';
import {RootStore} from './RootStore';
import {ShoppingListItemModel, ShoppingListModel} from './ShoppingLists';

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
    get rootStore(): RootStore {
      return getParent(self, 1);
    },
  }))
  //#region ShoppingLists' actions
  .actions(self => ({
    loadShoppingLists() {
      (async () => {
        const shoppingLists = await self.rootStore.appComponent
          .shoppingRepository()
          .syncAndFetchLists();

        self.setProp(
          'shoppingLists',
          shoppingLists.map(shoppingList =>
            ShoppingListModel.create({
              id: shoppingList.id,
              name: shoppingList.name,
              checkedItems: shoppingList.checkedItems,
              totalItems: shoppingList.totalItems,
            }),
          ),
        );
      })();
    },
    addOrUpdateShoppingList(id: string, name: string) {
      (async () => {
        await self.rootStore.appComponent.shoppingRepository().addOrUpdate({
          id: id,
          name: name,
        });
        this.loadShoppingLists();
      })();
    },
  }))
  //#endregion
  //#region ShoppingListItems' actions
  .actions(self => ({
    loadShoppingListItems(listId: string) {
      (async () => {
        const shoppingListItems = await self.rootStore.appComponent
          .shoppingRepository()
          .getShoppingListItemsByListId(listId);

        const stShoppingList = self.getListById(listId);
        if (stShoppingList) {
          const stShoppingListItems = shoppingListItems.map(shoppingListItem =>
            ShoppingListItemModel.create({
              id: shoppingListItem.id,
              product: shoppingListItem.product.name,
              product_id: shoppingListItem.product.id,
              checked: shoppingListItem.checked,
              quantity: shoppingListItem.quantity,
              unit: shoppingListItem.unit,
            }),
          );
          stShoppingList.setProp('items', stShoppingListItems);
          stShoppingList.setProp('totalItems', stShoppingListItems.length);
          stShoppingList.setProp(
            'checkedItems',
            stShoppingListItems.filter(i => i.checked === true).length,
          );
        }
      })();
    },
    addOrUpdateProductInShoppingList(
      listItem: ShoppingListItem,
      listId: string,
    ) {
      (async () => {
        await self.rootStore.appComponent
          .shoppingRepository()
          .addOrUpdateShoppingListItem(listId, listItem);
        this.loadShoppingListItems(listId);
      })();
    },
    addProductsToShoppingList(productIds: string[], listId: string) {
      (async () => {
        await self.rootStore.appComponent
          .shoppingRepository()
          .addOrRemoveProductsToShoppingList(listId, productIds);
        this.loadShoppingListItems(listId);
      })();
    },
    checkItemFromList(itemId: string, listId: string, checked: boolean) {
      (async () => {
        await self.rootStore.appComponent
          .shoppingRepository()
          .toggleShoppingListItemById(itemId, checked);
        this.loadShoppingListItems(listId);
      })();
    },
  }));
//#endregion
//#endregion
