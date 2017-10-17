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

const _ = undefined

const INITIAL_COORD = [0, 0]


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
    console.log('onDidFinishLoadingMap')
    let coords = [100.5311166, 13.7270703]
    this._map.flyTo(coords, 12000)
    this._map.zoomTo(10)
  }

  convertDataToGeoJson = () => {

    let geoPoints = PostalJson.map((postal) => {
      let coordinates = [postal.lng, postal.lat]
      let properties = {
        zip: postal.zip,
        province: postal.province,
        district: postal.district
      }

      let geoPoint = GeoJsonHelper.convertToGeoJsonPoint(coordinates, properties, _, postal.id)
      return geoPoint
    })

    let geoPointsCollection = GeoJsonHelper.convertToGeoJsonFeatureCollection(geoPoints)

    this.setState({
      geoJsonPointsCollection: geoPointsCollection
    })

  }

  tryUpdateCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('position : ', position)
      },
      (error) => {
        console.log('err : ', error)
      },
      // {
      //   enableHighAccuracy: true,
      //   timeout: 20000,
      //   maximumAge: 1000
      // }
    )
  }

  onPressMap = (res) => {
    console.log('onPressMap : ', res)

    const { screenPointX, screenPointY } = res.properties;

    let query = this._map.queryRenderedFeaturesAtPoint([
      screenPointX,
      screenPointY
    ], null, ['bird', 'tree'])
    console.log('query : ', query)
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
      tree: {
        iconImage: tree,
        iconSize: 0.3,
        visibility: (this.props.visibleTree) ? 'visible' : 'none'
      },

      bird: {
        textField: '{title}',
        iconImage: bird,
        textAnchor: 'top',
        textOffset: [0, 1.5],
        visibility: (this.props.visibleBird) ? 'visible' : 'none'
      }
    })

    return (
      <View style={styles.container}>
        <MapboxGL.MapView
          ref={(ref) => this._map = ref}
          style={{ flex: 1 }}
          styleURL={Config.map.styleUrl}
          onDidFinishLoadingMap={this.onDidFinishLoadingMap}
          centerCoordinate={INITIAL_COORD}
          showUserLocation={true}
          userTrackingMode={MapboxGL.UserTrackingModes.Follow}
          zoomLevel={2}
          onPress={this.onPressMap}
          logoEnabled={false}
          attributionEnabled={false}
        //onRegionWillChange={()=>console.log('onRegionWillChange')}
        //onRegionIsChanging={()=>console.log('onRegionIsChanging')}
        //onRegionDidChange={()=>console.log('onRegionDidChange')}
        >
          <MapboxGL.ShapeSource id='postalSource1' shape={postalGeoJSON}>
            <MapboxGL.SymbolLayer id='bird' style={symbolLayer.bird} />
          </MapboxGL.ShapeSource>

          <MapboxGL.ShapeSource id='postalSource2' shape={this.state.geoJsonPointsCollection}>
            <MapboxGL.SymbolLayer id='tree' style={symbolLayer.tree} />
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
    textOffset: [0, 1.5],
  },

  poiSymbolLayer2: {
    iconImage: tree,
    iconSize: 0.3,
    visibility: 'visible'
  },

})