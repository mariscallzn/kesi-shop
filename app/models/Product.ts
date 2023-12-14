import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree';
import {withSetPropAction} from './helpers/withSetPropAction';

export const ProductModel = types
  .model('Product')
  .props({
    id: types.identifier,
    name: types.string,
    quantity: 0,
    unit: '',
    selected: false,
  })
  .actions(withSetPropAction);

export interface Product extends Instance<typeof ProductModel> {}
export interface ProductSnapshotOut extends SnapshotOut<typeof ProductModel> {}
export interface ProductSnapshotIn extends SnapshotIn<typeof ProductModel> {}
