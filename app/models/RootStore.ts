import {Instance, SnapshotOut, types} from 'mobx-state-tree';

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model('RootStoreModel').props({});

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
