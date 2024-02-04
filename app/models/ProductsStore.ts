import {getParent, types} from 'mobx-state-tree';
import {Product} from '../repositories/ProductRepository';
import {withSetPropAction} from './helpers/withSetPropAction';
import {ProductModel} from './Product';
import {RootStore} from './RootStore';

export const ProductsStore = types
  .model('ProductsStore')
  .props({
    products: types.array(ProductModel),
    selectedProductIds: types.array(types.string),
  })
  .actions(withSetPropAction)
  .views(self => ({
    get rootStore(): RootStore {
      return getParent(self);
    },
  }))
  //#region state tree updates
  .actions(self => ({
    toggleProduct(id: string) {
      const index = self.products.findIndex(e => e.id === id);
      if (index !== -1) {
        self.products[index] = {
          ...self.products[index],
          selected: !self.products[index].selected,
        };
      }
    },
    addSelectedProductId(id: string) {
      self.selectedProductIds.push(id);
      this.toggleProduct(id);
    },
    removedSelectedProductId(id: string) {
      self.selectedProductIds.remove(id);
      this.toggleProduct(id);
    },
    clearStateTree() {
      //Clear Products, we don't need to keep them in the tree
      self.setProp('products', []);
      //Clear selected products ids
      self.setProp('selectedProductIds', []);
    },
  }))
  //#endregion
  //#region DB operations
  .actions(self => ({
    fetchProducts(listId?: string, query?: string) {
      (async () => {
        try {
          const products = await self.rootStore.appComponent
            .productRepository()
            .findByNameOrGetAll(query);

          if (listId) {
            const selectedProducts = (
              await self.rootStore.appComponent
                .shoppingRepository()
                .getShoppingListItemsByListId(listId)
            ).map(shoppingListItem => shoppingListItem.product);
            self.setProp(
              'selectedProductIds',
              selectedProducts.map(sp => sp.id),
            );
          }

          self.setProp(
            'products',
            products.map(product =>
              ProductModel.create({
                id: product.id,
                name: product.name,
                selected: self.selectedProductIds.some(id => id === product.id),
              }),
            ),
          );
        } catch (error) {
          console.error(error);
        }
      })();
    },
    selectProduct(product: Product) {
      (async () => {
        const _product = await self.rootStore.appComponent
          .productRepository()
          .findOrCreate(product);
        self.addSelectedProductId(_product.id);
        this.fetchProducts();
      })();
    },
    unselectProduct(product: Product) {
      self.removedSelectedProductId(product.id);
    },
    addProductsToShoppingList(listId: string) {
      self.rootStore.shoppingStore.addProductsToShoppingList(
        [...self.selectedProductIds],
        listId,
      );
    },
  }));
//#endregion
