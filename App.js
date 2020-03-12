import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Greeting from './components/Greeting'

let pic = {uri: 'https://noma.org/wp-content/uploads/2018/12/mindfulness.jpg'}

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mindfulness app</Text>
      <Greeting name="yogi" />
      <Image source={pic} style={{width: 400, height: 500}}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
  }
});
