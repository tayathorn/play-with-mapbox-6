import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import Map from '../Map'

export default class Home extends Component {

  constructor(props) {
    super(props)

    this.state = ({
      toggleBirdVisible: true,
      toggleTreeVisible: true,
      boxOnePosition: {}
    })

    // this.boxOnePosition = {}

  }

  renderCurrentLocationButton = () => {
    return (
      [<TouchableOpacity key='birdButton' style={[styles.bottomButton, styles.birdButton]} onPress={this.onPressBirdButton}>
        <Image
          style={{ width: 30, height: 30 }}
          source={require('../../images/icons/bird.png')}
          resizeMode={'contain'}
        />
      </TouchableOpacity>,
      <TouchableOpacity key='treeButton' style={[styles.bottomButton, styles.treeButton]} onPress={this.onPressTreeButton}>
        <Image
          style={{ width: 30, height: 30 }}
          source={require('../../images/icons/tree-pine.png')}
          resizeMode={'contain'}
        />
      </TouchableOpacity>]
    )
  }

  renderDetail = () => {
    let { latitude, longitude, accuracy, speed, heading } = (this.state.boxOnePosition.coords) ? this.state.boxOnePosition.coords : {}

    return(
      <View style={styles.detailContainer}>
        <View style={[styles.detailBox, styles.boxOne]}>
          <Text>GET</Text>
          <Text>lat: {latitude}</Text>
          <Text>lon: {longitude}</Text>
          <Text>acc: {accuracy}</Text>
          <Text>spd: {speed}</Text>
          <Text>head: {heading}</Text>
        </View>
      </View>
    )
  }

  getPositionBoxOne = (position) => {
    this.setState({
      boxOnePosition: position
    })
  }

  onPressBirdButton = () => {
    this.setState({
      toggleBirdVisible: !this.state.toggleBirdVisible
    })
  }

  onPressTreeButton = () => {
    this.setState({
      toggleTreeVisible: !this.state.toggleTreeVisible
    })
  }

  render() {
    return (
      <View style={styles.container}>
          <Map
            visibleBird={this.state.toggleBirdVisible}
            visibleTree={this.state.toggleTreeVisible}
            getPositionBoxOne={this.getPositionBoxOne}
          />
          { this.renderDetail() }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  bottomButton: {
    position: 'absolute',
    backgroundColor:'white', 
    borderRadius:25,
    bottom: 10,
    padding:10,
  },

  birdButton: {
    right: 10,
  },

  treeButton: {
    right: 70,
  },

  detailContainer: {
    flex:0.5,
    backgroundColor: '#E0E0E0'
  },

  detailBox: {
    flex: 1,
    margin: 5,
    padding: 5,
    borderRadius: 10,
    // opacity: 0.5
    
  },

  boxOne: {
    backgroundColor: '#607D8B',
  }
  
  // userLocationButtonContainer: {
  //   position: 'absolute',
  //   backgroundColor:'white', 
  //   borderRadius:25,
  //   bottom: 10,
  //   right: 10,
  //   padding:10,
  // },
})