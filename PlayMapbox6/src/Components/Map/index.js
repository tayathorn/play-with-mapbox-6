import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform
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


// const
const _ = undefined
const INITIAL_COORD = [0, 0]
const RADIUS = 1 // unit : KM
const ZOOM_LEVEL = 14
const FREQ_LOCATION = 5000 // msec


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
      },
      userCirclePolygon: {
        "type": "FeatureCollection",
        "features": []
      },
      nearbyPoints: {
        "type": "FeatureCollection",
        "features": []
      },
      flyFirstTime: false,

    }

    this.userLocation = [0,0]
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

    // this.tryUpdateCurrentLocation()

    // this.convertDataToGeoJson()   
  }

  // DOING:
  componentDidMount() {
    console.log('componentDidMount')
    this.tryUpdateCurrentLocation()
    this.convertDataToGeoJson()
  }

  // DOING:
  onDidFinishLoadingMap = () => {
    console.log('onDidFinishLoadingMap')
    // this.flyToUserLocation()
    // this.createCircleFromCenter()
  }

  flyToUserLocation = () => {
    console.log('flyToUserLocation')
    // this._map.setCamera({
    //   centerCoordinate: this.userLocation,
    //   zoomLevel: 10,
    //   duration: 2000,
    // })

    this._map.flyTo(this.userLocation)
    if (IS_ANDROID) {
      this._map.zoomTo(ZOOM_LEVEL)
    }
  }

  // DELETE:
  // testIcon = (index) => {
  //   let icon = ''
  //   if(index < 100) {
  //     icon = 'bakery-15'
  //   } else if(index >= 100 && index <300) {
  //     icon = 'ferry-15'
  //   } else {
  //     icon = 'ice-cream-15'
  //   }

  //   return icon
  // }

  convertDataToGeoJson = () => {

    let geoPoints = PostalJson.map((postal, index) => {
      let coordinates = [postal.lng, postal.lat]
      let properties = {
        // id: postal.id,
        zip: postal.zip,
        province: postal.province,
        district: postal.district,
        // icon: this.testIcon(index)
      }

      let id = `a${postal.id}`

      let geoPoint = GeoJsonHelper.convertToGeoJsonPoint(coordinates, properties, _, id)
      return geoPoint
    })

    let geoPointsCollection = GeoJsonHelper.convertToGeoJsonFeatureCollection(geoPoints)

    console.log('geoPointsCollection : ', geoPointsCollection)

    this.setState({
      geoJsonPointsCollection: geoPointsCollection
    })

  }

  createCircleFromCenter = () => {
    let circle = GeoJsonHelper.createCirclePolygon(this.userLocation, RADIUS)
    console.log('circle : ', circle)

    let featureCollectionCircle = GeoJsonHelper.convertToGeoJsonFeatureCollection([circle])
    console.log('featureCollectionCircle : ', featureCollectionCircle)

    this.setState({
      userCirclePolygon: featureCollectionCircle
    }, () => {
      this.findNearbyPlaces()
    })
  }

  findNearbyPlaces = () => {
    let points = this.state.geoJsonPointsCollection
    let within = this.state.userCirclePolygon

    let nearbyPoints = GeoJsonHelper.findWithin(points, within)

    this.setState({
      nearbyPoints
    }, () => {
      console.log('this.state.nearbyPoints : ', this.state.nearbyPoints)
    })

  }

  tryUpdateCurrentLocation = () => {
    
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('position : ', position)
          let { latitude, longitude } = position.coords
          this.userLocation = [longitude, latitude]
          this.createCircleFromCenter()
          if(!this.state.flyFirstTime) {
            this.flyToUserLocation()
            this.setState({
              flyFirstTime: true
            })
          }
          console.log('userLocation : ', this.userLocation)
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
    }, FREQ_LOCATION)

    
  }

  onPressMap = (res) => {
    console.log('onPressMap : ', res)

    const { screenPointX, screenPointY } = res.properties;

    let query = this._map.queryRenderedFeaturesAtPoint([
      screenPointX,
      screenPointY
    ], null, ['tree'])
    console.log('query : ', query)
  }

  renderPointLocations = () => {
    let symbolLayer = MapboxGL.StyleSheet.create({
      tree: {
        iconImage: tree,
        // iconImage: '{icon}',
        iconSize: Platform.select({
          ios: 0.1,
          android: 0.3
        }),
        visibility: (this.props.visibleTree) ? 'visible' : 'none'
      }
    })

    // let filterByID = this.getFilterNearbyPointsID()//["in", "$id", this.getNearbyPointsID()]
    // console.log('filterByID : ', filterByID)


    return (
      <MapboxGL.ShapeSource id='postalSource2' shape={this.state.geoJsonPointsCollection}>
        <MapboxGL.SymbolLayer id='tree' style={symbolLayer.tree}
        //filter={["in", "$id", "a000", "a001", "a002", "a003", "a33"]} 
        //filter={filterByID} 
        />
      </MapboxGL.ShapeSource>
    )
  }

  getFilterNearbyPointsID = () => {
    let pointsID = GeoJsonHelper.getIdFeatureEach(this.state.nearbyPoints)

    console.log('pointsID : ', pointsID)

    // let test = ""

    // let pointsString = pointsID.map((id) => {
    //   // return test.concat(`"${id}" ,`)
    //   // return `"${id}" ,`
    //   return id
    // })

    // console.log('pointsString : ', pointsString)
    // console.log('spread pointsString : ', ...pointsString)

    // pointsString = JSON.parse(pointsString);

    // let filter = ["in", "$id", ...pointsString]

    return ["in", "$id", ...pointsID]
  }

  renderUserCircleRadius = () => {
    let circleRadiusLayerIndex = Platform.select({
      ios: null,
      android: 9  // under userLocation   mmg: 160 , mystyle: 9
    })

    return (
      <MapboxGL.ShapeSource id='userRadius' shape={this.state.userCirclePolygon}>
        <MapboxGL.FillLayer id='circleRadius' style={layerStyle.userCircleFill} layerIndex={circleRadiusLayerIndex} />
      </MapboxGL.ShapeSource>
    )
  }

  renderNearbyPoints = () => {
    let symbolLayer = MapboxGL.StyleSheet.create({
      nearby: {
        iconImage: bird,
        iconSize: Platform.select({
          ios: 0.3,
          android: 0.7
        }),
      }
    })

    // DOING:
    if (this.state.nearbyPoints.features.length > 0) {
      return (
        <MapboxGL.ShapeSource id='nearbyPoints' shape={this.state.nearbyPoints}>
          <MapboxGL.SymbolLayer id='nearbyLayer' style={symbolLayer.nearby} />
        </MapboxGL.ShapeSource>
      )
    }
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

    // let symbolLayer = MapboxGL.StyleSheet.create({
    //   bird: {
    //     textField: '{title}',
    //     iconImage: bird,
    //     textAnchor: 'top',
    //     textOffset: [0, 1.5],
    //     visibility: (this.props.visibleBird) ? 'visible' : 'none'
    //   }
    // })

    let initialZoomLevel = Platform.select({
      ios: ZOOM_LEVEL,
      android: 10
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
          zoomLevel={initialZoomLevel}
          onPress={this.onPressMap}
          logoEnabled={false}
          attributionEnabled={false}
          onFlyToComplete={() => console.log('onFlyToComplete')}
        //onRegionWillChange={()=>console.log('onRegionWillChange')}
        //onRegionIsChanging={()=>console.log('onRegionIsChanging')}
        //onRegionDidChange={()=>console.log('onRegionDidChange')}
        >
          {/* <MapboxGL.ShapeSource id='postalSource1' shape={postalGeoJSON}>
            <MapboxGL.SymbolLayer id='bird' style={symbolLayer.bird} />
          </MapboxGL.ShapeSource> */}

          {this.renderPointLocations()}

          {this.renderUserCircleRadius()}

          {this.renderNearbyPoints()}

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

  userCircleFill: {
    fillColor: '#607D8B',
    fillOpacity: 0.5
  }

})