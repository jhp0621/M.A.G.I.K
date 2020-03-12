import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';


const styles = StyleSheet.create({
  blue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 20,
  }
});

class Greeting extends Component {
  render() {
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={styles.blue}>Hello {this.props.name}!</Text>
      </View>
    );
  }
}

export default Greeting
