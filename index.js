/**
 * @format
 */

import {AppRegistry} from 'react-native';

// Local Imports
import {name as appName} from './app.json';
import App from './src/index';

const RNRoot = () => <App />;

AppRegistry.registerComponent(appName, () => RNRoot);
