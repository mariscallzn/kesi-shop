import {Instance, SnapshotOut, types} from 'mobx-state-tree';
import {ShoppingStore} from './ShoppingStore';

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model('RootStoreModel').props({
  shoppingStore: types.optional(ShoppingStore, {}),
});

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

/**
 * What do I want?
 * ShoppingLists
 * - ShoppingList[]
 * ShoppingList
 * - id
 * - name
 * - totalItems
 * - checkedItems
 * ShoppingListItem
 * - product
 * - category
 * - checked
 * - quantity
 * - unit
 *
 * Use cases for Shopping list
 * - Items I buy at Walmart
 * - Items I buy at DollarTree
 * - Items for a recipe
 * - Items for a garage project
 * - Items I will buy for a diet
 *
 *
 * Analytics
 * - how often I buy eggs
 * - In which shopping list I have added eggs
 * - top items used across shopping lists
 *
 * Discover
 * - Shopping list published by us or people for recipes for example
 * - Home gym shopping list
 */
