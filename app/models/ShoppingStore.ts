import {getParent, types} from 'mobx-state-tree';
import {DAOShoppingListItems, DAOShoppingLists} from '../database/models';
import {Tables} from '../database/schema';
import {withSetPropAction} from './helpers/withSetPropAction';
import {RootStore} from './RootStore';
import {
  ShoppingListItemModel,
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
        const dbResult = await self.rootStore.appDatabase
          .get<DAOShoppingLists>(Tables.shoppingLists)
          .query()
          .fetch();

        self.setProp(
          'shoppingLists',
          dbResult.map(dbr =>
            ShoppingListModel.create({id: dbr.id, name: dbr.name}),
          ),
        );
      })();
    },
    addShoppingList(name: string) {
      self.rootStore.dbWrite(async db => {
        const newList = await db
          .get<DAOShoppingLists>(Tables.shoppingLists)
          .create(shoppingList => {
            shoppingList.name = name;
          });
        self.pushShoppingList(
          ShoppingListModel.create({id: newList.id, name: newList.name}),
        );
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
          shoppingList.setProp(
            'items',
            //Pass on the DB values to the state tree
            daoShoppingListItems
              .map(i =>
                ShoppingListItemModel.create({
                  id: i.id,
                  product: i.productName,
                  checked: i.checked,
                  quantity: i.quantity,
                  unit: i.unit,
                }),
              )
              .sort((a, b) => +a.checked - +b.checked),
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
