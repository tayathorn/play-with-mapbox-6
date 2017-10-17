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
import postalGeoJSON from '../../data/postal_data.json';

// config
import { Config } from '../../config'

// utils
import { IS_ANDROID } from '../../utils'
import * as GeoJsonHelper from '../../utils/GeoJsonHelper'

// image
import deer from '../../images/icons/deer.png'
import bird from '../../images/icons/bird.png'
import tree from '../../images/icons/tree-pine.png'


MapboxGL.setAccessToken(Config.map.accessToken)

export default class Map extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isFetchingAndroidPermission: IS_ANDROID,
      isAndroidPermissionGranted: false,
      geoJsonPointsCollection: {
        "type": "FeatureCollection",
        "features": []
      }
    }
  }

  async componentWillMount() {
    if (IS_ANDROID) {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      this.setState({
        isAndroidPermissionGranted: isGranted,
        isFetchingAndroidPermission: false,
      });
    }
    MapboxGL.setAccessToken(Config.map.accessToken);

    this.tryUpdateCurrentLocation()

    this.convertDataToGeoJson()   // DOING:
  }

  onDidFinishLoadingMap = () => {
  }

  convertDataToGeoJson = () => {
    // let geoPoint = GeoJsonHelper.convertToGeoJsonPoint([102.7578113, 16.1264536], { name: 'point1'})

    // console.log('geoPoint : ', geoPoint)


    let geoPoints = PostalJson.map((postal) => {
      let geoPoint = GeoJsonHelper.convertToGeoJsonPoint([postal.lng, postal.lat], { id: postal.id, zip: postal.zip, province: postal.province, district: postal.district })
      return geoPoint
    })

    let geoPointsCollection = GeoJsonHelper.convertToGeoJsonFeatureCollection(geoPoints)

    this.setState({
      geoJsonPointsCollection: geoPointsCollection
    })

    // console.log('geoPointsCollection : ', geoPointsCollection)
  }

  tryUpdateCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('position : ', position)
      },
      (error) => {
        console.log('err : ', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    )
  }

  animate = () => {

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

    let symbolLayer = MapboxGL.StyleSheet.create({
      poiSymbolLayer2: {
        iconImage: tree,
        iconSize: 0.3,
        visibility: (this.props.visibleTree) ? 'visible' : 'none'
      }
    })

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
          <MapboxGL.ShapeSource id='postalSource1' shape={postalGeoJSON}>
            <MapboxGL.SymbolLayer id='bird' style={layerStyle.poiSymbolLayer} />
          </MapboxGL.ShapeSource>

          <MapboxGL.ShapeSource id='postalSource2' shape={this.state.geoJsonPointsCollection}>
            <MapboxGL.SymbolLayer id='tree' style={symbolLayer.poiSymbolLayer2} />
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

const layerStyle = MapboxGL.StyleSheet.create({
  poiCircleLayer: {
    circleColor: '#f44336',
    circleStrokeWidth: 10,
    circleStrokeColor: '#795548',
    circleStrokeOpacity: 0.5
  },

  poiSymbolLayer: {
    textField: '{title}',
    iconImage: bird,
    textAnchor: 'top',
    textOffset: [0,1.5],
  },
  
  poiSymbolLayer2: {
    iconImage: tree,
    iconSize: 0.3,
    visibility: 'visible'
  },

})