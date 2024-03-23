import {SnapshotOut, types} from 'mobx-state-tree';
import {withSetPropAction} from './helpers/withSetPropAction';

export const CategoryModel = types
  .model('Category')
  .props({
    id: types.identifier,
    color: types.string,
  })
  .actions(withSetPropAction);

export interface CategorySnapshotOut
  extends SnapshotOut<typeof CategoryModel> {}
