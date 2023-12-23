/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import database from './app/database/database';

//Called to do the initial set up
database;

AppRegistry.registerComponent(appName, () => App);
