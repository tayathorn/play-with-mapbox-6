/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Home from './src/Components/Home'

// const DURATION = 120000  // 2 min

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

export default class App extends Component {

  // makeTimer = () => {
  //   var start = Date.now();
  //   for (var i = 0; i < 1000; i++) {
  //     setTimeout(this.onFire, DURATION);
  //   }
  //   // console.log('Timers made in', Date.now() - start, 'msecs');
  // }

  // onFire = () => {
  //   var now = Date.now();
    
  //   console.log('Timers :: Fireeee !!! : ', now)
  // }

  componentDidMount() {
    // this.makeTimer()
  }

  render() {
    return (
      <View style={styles.container}>
        <Home/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
