import {getParent, types} from 'mobx-state-tree';
import {getUUID} from '../utils/misc';
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
  }))
  .actions(self => ({
    async loadProducts(shoppingListProducts: string[] | undefined) {
      //TODO: This should come from the DB
      const products: Product[] = require('../models/products.json');
      self.setProp('products', products);

      // If ShoppingListScreen pass on products already added we mark them as
      // selected products
      if (shoppingListProducts) {
        shoppingListProducts.forEach(item => {
          const shoppingListProduct = self.products.find(p => p.name === item);
          if (shoppingListProduct) {
            self.selectedProducts.push(shoppingListProduct.id);
          }
        });
      }
    },
    filteredProducts(query: string) {
      let _result: Product[] = [];
      // As soon as the user starts typing in the search bar we look for the similar item
      if (query.length > 0) {
        // We filter the products from the model on a new array
        _result = self.products.filter(result =>
          result.name.toLowerCase().includes(query.toLowerCase()),
        );
        // If it's an exact match, we pick the loaded product
        const hasExactMatch = self.products.some(item => item.name === query);
        // If not, then we create a new instance and we put it at the top/
        if (!hasExactMatch) {
          _result.unshift(ProductModel.create({id: getUUID(), name: query}));
        }
      } else {
        _result = self.products;
      }
      return _result;
    },
    selectProduct(product: Product) {
      // If we cannot find the product, it means that it's coming from the search bar
      if (self.products.find(p => p.id === product.id) === undefined) {
        //TODO: Add item to DB
        self.products.push(product);
      }
      self.selectedProducts.push(product.id);
    },
    unselectProduct(product: Product) {
      self.selectedProducts.remove(product);
    },
    clearStateTree() {
      //Clear selected product
      self.setProp('selectedProducts', []);
      //Clear Products, we don't need to keep them in the tree
      self.setProp('products', []);
    },
    addProductsToShoppingList(listId: string | undefined) {
      if (listId) {
        self.rootStore.shoppingStore.addProductsToShoppingList(
          self.selectedProducts,
          listId,
        );
      }
      this.clearStateTree();
    },
  }));
