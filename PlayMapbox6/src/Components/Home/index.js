import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Mapbox, { MapView } from '@mapbox/react-native-mapbox-gl'

export default class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
          <Text>Hi</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})