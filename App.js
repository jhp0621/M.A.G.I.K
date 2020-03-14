import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import Greeting from "./components/Greeting";
import SpeechToText from './components/SpeechToText'

let pic = {
  uri: "https://noma.org/wp-content/uploads/2018/12/mindfulness.jpg"
};

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      renderRecord: false
    }
  }

  render() {
    return (
      !this.state.renderRecord ?
      <View style={styles.container}>
        <Text style={styles.title}>Mindfulness app</Text>
        <Greeting name="yogi" />
        <Image source={pic} style={{ width: 400, height: 500 }} />
        <Button title="View audio" onPress={() => this.setState({renderRecord: true})}/>
      </View>
      : <SpeechToText />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontWeight: "bold",
    fontSize: 30
  }
});

export default App;
