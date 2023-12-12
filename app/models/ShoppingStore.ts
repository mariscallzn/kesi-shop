import {types} from 'mobx-state-tree';
import {getUUID} from '../utils/misc';
import {withSetPropAction} from './helpers/withSetPropAction';
import {ShoppingList} from './ShoppingLists';

export const ShoppingStore = types
  .model('ShoppingStore')
  .props({shoppingLists: types.array(ShoppingList)})
  .actions(withSetPropAction)
  .actions(self => {
    return {
      addShoppingList(name: string) {
        //TODO: Somehow add it first to the DB and then reflect the result here
        self.shoppingLists.push({id: getUUID(), name: name});
      },
      getListNameById(listId: string) {
        return self.shoppingLists.find(
          shoppingList => shoppingList.id === listId,
        );
      },
    };
  });
