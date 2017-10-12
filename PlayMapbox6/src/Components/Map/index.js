import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import MapboxGL from '@mapbox/react-native-mapbox-gl'

import { Config } from '../../config'

MapboxGL.setAccessToken(Config.map.accessToken)

export default class Map extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          styleURL={Config.map.styleUrl}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})