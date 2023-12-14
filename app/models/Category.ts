import {types} from 'mobx-state-tree';

export const CategoryModel = types.model('CategoryModel').props({
  id: types.identifier,
  name: '',
});
