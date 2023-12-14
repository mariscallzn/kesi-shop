import {getParent, types} from 'mobx-state-tree';
import {withSetPropAction} from './helpers/withSetPropAction';
import {Product, ProductModel} from './Product';
import {RootStore} from './RootStore';

export const ProductsStore = types
  .model('ProductsStore')
  .props({
    products: types.array(ProductModel),
    selectedProducts: types.array(types.reference(ProductModel)),
  })
  .actions(withSetPropAction)
  .views(self => ({
    get rootStore(): RootStore {
      return getParent(self);
    },
    filteredProducts(query: string) {
      let _result: Product[] = [];
      if (query.length > 0) {
        _result = self.products.filter(result =>
          result.name.toLowerCase().includes(query.toLowerCase()),
        );
        //TODO: If _result is empty, then I have to add a new item on the list
      } else {
        _result = self.products;
      }
      return _result;
    },
  }))
  .actions(self => ({
    async loadProducts() {
      //TODO: This should come from the DB
      const products: Product[] = require('../models/products.json');
      self.setProp('products', products);
    },
    selectProduct(product: Product) {
      self.selectedProducts.push(product);
    },
    unselectProduct(product: Product) {
      self.selectedProducts.remove(product);
    },
    addProductsToShoppingList(listId: string | undefined) {
      //TODO: Somehow add it first to the DB and then reflect the result here
      if (listId) {
        self.rootStore.shoppingStore.addProductsToShoppingList(
          self.selectedProducts,
          listId,
        );
      }
      //Clear selected product
      self.setProp('selectedProducts', []);
    },
  }));
