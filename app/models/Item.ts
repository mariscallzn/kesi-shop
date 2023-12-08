import {types} from 'mobx-state-tree';

export const ItemModel = types.model('Item').props({
  name: '',
});
