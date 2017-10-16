import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

// lib
import MapboxGL from '@mapbox/react-native-mapbox-gl'

// data
import { PostalJson } from '../../data/postalJson'

// config
import { Config } from '../../config'

// utils
import { IS_ANDROID } from '../../utils'

MapboxGL.setAccessToken(Config.map.accessToken)

import postalGeoJSON from '../../data/postal_data.json';

import * as GeoJsonHelper from '../../utils/GeoJsonHelper'

export default class Map extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isFetchingAndroidPermission: IS_ANDROID,
      isAndroidPermissionGranted: false,
      geoJsonPoints: []
    }
  }

  async componentWillMount () {
    if (IS_ANDROID) {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      this.setState({
        isAndroidPermissionGranted: isGranted,
        isFetchingAndroidPermission: false,
      });
    }
    MapboxGL.setAccessToken(Config.map.accessToken);

    this.tryUpdateCurrentLocation()

    this.convertDataToGeoJson()
  }

  onDidFinishLoadingMap = () => {
    console.log('onDidFinishLoadingMap')

  }

  convertDataToGeoJson = () => {
    let geoPoint = GeoJsonHelper.convertToGeoJsonPoint([102.7578113, 16.1264536], { name: 'point1'})

    console.log('geoPoint : ', geoPoint)
  }

  tryUpdateCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      this.onUpdateCurrentLocationSuccess,
      this.onUpdateCurrentLocationFail,
      {
        enableHighAccuracy: true,
        maximumAge: 250,
        timeout:10000,
      }
    )
  }

  onUpdateCurrentLocationSuccess = () => {
    console.log('onUpdateCurrentLocationSuccess')
  }
  
  onUpdateCurrentLocationFail = () => {
      console.log('onUpdateCurrentLocationFail')
    }

  getAnnotations = () => {

  }



  render() {
    if (IS_ANDROID && !this.state.isAndroidPermissionGranted) {
      if (this.state.isFetchingAndroidPermission) {
        return null;
      }
      return (
        <View style={sheet.matchParent}>
          <Text style={styles.noPermissionsText}>
            You need to accept location permissions in order to use this example applications
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          styleURL={Config.map.styleUrl}
          onDidFinishLoadingMap={this.onDidFinishLoadingMap}
          centerCoordinate={[100.5352369, 13.7287357]}
          showUserLocation={true}
          zoomLevel={2}
        >
          <MapboxGL.ShapeSource id='postalSource' shape={postalGeoJSON}>
            <MapboxGL.CircleLayer id='postalFill' />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})