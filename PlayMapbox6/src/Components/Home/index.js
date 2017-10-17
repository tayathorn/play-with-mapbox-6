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
    })

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
          />
          { this.renderCurrentLocationButton() }
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