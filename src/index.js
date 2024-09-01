import {View} from 'react-native';
import React from 'react';
import AppNavigator from './navigation';
import {styles} from './themes';

export default function index() {
  return (
    <View style={styles.flex}>
      <AppNavigator />
    </View>
  );
}
