/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Navigation from './src/routes';

import "./global.css";
import {View} from 'react-native';
import Spin from './src/components/Spin.tsx';

function App() {


  return (
    <View className="w-full h-full">
      <Navigation />
      <Spin />
    </View>
  );
}

export default App;
