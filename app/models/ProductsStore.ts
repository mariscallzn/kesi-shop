import {flow, types} from 'mobx-state-tree';
import {withSetPropAction} from './helpers/withSetPropAction';

export const Product = types
  .model('Product')
  .props({
    id: types.identifier,
    name: '',
  })
  .actions(withSetPropAction);

export const ProductsStore = types
  .model('ProductsStore')
  .props({
    products: types.array(Product),
  })
  .actions(withSetPropAction)
  .actions(self => {
    //TODO: I have to find a way to setup types here
    function updateProducts(json) {
      json.forEach(product => {
        self.products.push(product);
      });
    }
    const loadProducts = flow(function* loadProducts() {
      //TODO: This should come from the DB
      const tmpJson = require('../models/products.json');
      updateProducts(tmpJson);
    });
    return {
      updateProducts,
      loadProducts,
    };
  });
