import {getParent, types} from 'mobx-state-tree';
import {CategoryModel, CategorySnapshotOut} from './Category';
import {withSetPropAction} from './helpers/withSetPropAction';
import {RootStore} from './RootStore';
export const CategoryStore = types
  .model('CategoryStore')
  .props({categories: types.array(CategoryModel)})
  .actions(withSetPropAction)
  .views(self => ({
    get rootStore(): RootStore {
      return getParent(self);
    },
  }))
  .actions(self => ({
    fetchCategories() {
      (async () => {
        const categories = await self.rootStore.appComponent
          .categoryRepository()
          .fetch();
        self.setProp(
          'categories',
          categories.map<CategorySnapshotOut>(dao => ({
            id: dao.id,
            color: dao.color,
          })),
        );
      })();
    },
  }));
