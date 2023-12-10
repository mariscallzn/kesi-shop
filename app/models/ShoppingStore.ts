import {types} from 'mobx-state-tree';
import {getUUID} from '../utils/misc';
import {withSetPropAction} from './helpers/withSetPropAction';
import {ShoppingLists} from './ShoppingLists';

export const ShoppingStore = types
  .model('ShoppingStore')
  .props({isLoading: true, shoppingLists: types.array(ShoppingLists)})
  .actions(withSetPropAction)
  .actions(self => {
    return {
      addShoppingList(name: string) {
        //TODO: Somehow add it first to the DB and then reflect the result here
        self.shoppingLists.push({id: getUUID(), name: name});
      },
    };
  });
