import {Platform} from 'react-native';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {Database} from '@nozbe/watermelondb';
import schema from './schema';
import {DAOShoppingListItems, DAOShoppingLists} from './models';

const adapter = new SQLiteAdapter({
  dbName: 'KesiShopDB',
  schema: schema,
  //   migrations: migrations,
  jsi: Platform.OS === 'ios',
  onSetUpError: error => {
    console.error(error);
  },
});

const database = new Database({
  adapter: adapter,
  modelClasses: [DAOShoppingLists, DAOShoppingListItems],
});

export default database;
