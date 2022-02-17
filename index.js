/**
 * @format
 */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);

// import {AppRegistry} from 'react-native';  

// import App from './App';  
// import {name as appName} from './app.json';  
  
// AppRegistry.registerComponent(appName, () => App);  

import {AppRegistry} from 'react-native';
import App from './App';
import React from 'react';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux'; 
import {name as appName} from './app.json';
import store from './src/redux/Index';
const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

AppRegistry.registerComponent(appName, () => Root);