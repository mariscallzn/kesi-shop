import {getParent, types} from 'mobx-state-tree';
import {DAOShoppingListItems, DAOShoppingLists} from '../database/models';
import {Tables} from '../database/schema';
import {withSetPropAction} from './helpers/withSetPropAction';
import {RootStore} from './RootStore';
import {
  ShoppingListItemSnapshotIn,
  ShoppingListModel,
  ShoppingListSnapshotIn,
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
    get rootStore(): RootStore {
      return getParent(self, 1);
    },
  }))
  //Tree operations, these are going to be exposed but rarely used by the components
  .actions(self => ({
    pushShoppingList(shoppingList: ShoppingListSnapshotIn) {
      self.shoppingLists.push(shoppingList);
    },
  }))
  //#region Database operations
  //#region ShoppingLists' actions
  .actions(self => ({
    loadShoppingLists() {
      (async () => {
        const shoppingLists: ShoppingListSnapshotIn[] = [];
        const dbResult = await self.rootStore.appDatabase
          .get<DAOShoppingLists>(Tables.shoppingLists)
          .query()
          .fetch();

        dbResult.forEach(async (result, index) => {
          const items = await result.shoppingListItems.fetch();
          shoppingLists.push(
            ShoppingListModel.create({
              id: result.id,
              name: result.name,
              checkedItems: items.filter(f => f.checked === true).length,
              totalItems: items.length,
            }),
          );
          //TODO: I kind of feel I need to review this
          if (index === dbResult.length - 1) {
            self.setProp('shoppingLists', shoppingLists);
          }
        });
      })();
    },
    addOrUpdateShoppingList(shoppingList: ShoppingListSnapshotIn) {
      self.rootStore.appDatabase
        .get<DAOShoppingLists>(Tables.shoppingLists)
        .find(shoppingList.id)
        .then(async value => {
          await value.updateShoppingList({
            id: 'ignore',
            name: value.name,
          });
          this.loadShoppingLists();
        })
        .catch(_ => {
          self.rootStore.dbWrite(async db => {
            await db
              .get<DAOShoppingLists>(Tables.shoppingLists)
              .create(_shoppingList => {
                _shoppingList.name = shoppingList.name;
              });
            this.loadShoppingLists();
          });
        });
    },
  }))
  //#endregion
  //#region ShoppingListItems' actions
  .actions(self => ({
    loadShoppingListItems(listId: string) {
      (async () => {
        //Fetch data from DB
        const daoShoppingListItems = await (
          await self.rootStore.appDatabase
            .get<DAOShoppingLists>(Tables.shoppingLists)
            .find(listId)
        ).shoppingListItems.fetch();

        //Create a reference to the state tree
        const shoppingList = self.getListById(listId);
        if (shoppingList) {
          const items = daoShoppingListItems
            .map(i => i.convertToTreeModel())
            .sort((a, b) => +(a.checked ?? false) - +(b.checked ?? false));

          shoppingList.setProp('items', items);
          shoppingList.setProp('totalItems', items.length);
          shoppingList.setProp(
            'checkedItems',
            items.filter(i => i.checked === true).length,
          );
        }
      })();
    },
    addOrUpdateProductInShoppingList(
      listItem: ShoppingListItemSnapshotIn,
      listId: string,
    ) {
      (async () => {
        self.rootStore.appDatabase
          .get<DAOShoppingListItems>(Tables.shoppingListItems)
          .find(listItem.id)
          //If it exists then we update
          .then(async item => {
            await item.updateShoppingListItem(listItem);
            this.loadShoppingListItems(listId);
          })
          //If doesn't exist, we create
          .catch(async _ => {
            await (
              await self.rootStore.appDatabase
                .get<DAOShoppingLists>(Tables.shoppingLists)
                .find(listId)
            ).addShoppingListItem(listItem);
            this.loadShoppingListItems(listId);
          });
      })();
    },

    addProductsToShoppingList(products: string[], listId: string) {
      (async () => {
        const daoShoppingList = await self.rootStore.appDatabase
          .get<DAOShoppingLists>(Tables.shoppingLists)
          .find(listId);

        const daoShoppingListItems =
          await daoShoppingList.shoppingListItems.fetch();

        const newItems = products.filter(
          e2 => !daoShoppingListItems.some(e1 => e1.productName === e2),
        );

        const removedItems = daoShoppingListItems.filter(
          e1 => !products.some(e2 => e2 === e1.productName),
        );

        newItems.forEach(newItem => {
          daoShoppingList.addShoppingListItem({
            id: 'ignore',
            product: newItem,
            checked: false,
            quantity: 0,
            unit: '',
          });
        });

        self.rootStore.dbWrite(_ => {
          removedItems.forEach(removedItem => removedItem.destroyPermanently());
          this.loadShoppingListItems(listId);
        });
      })();
    },
    checkItemFromList(itemId: string, listId: string, checked: boolean) {
      (async () => {
        await (
          await (
            await self.rootStore.appDatabase
              .get<DAOShoppingLists>(Tables.shoppingLists)
              .find(listId)
          ).shoppingListItems.fetch()
        )
          .find(i => i.id === itemId)
          ?.toggleItem(checked);

        this.loadShoppingListItems(listId);
      })();
    },
  }));
//#endregion
//#endregion
