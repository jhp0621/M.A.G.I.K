import React from "react";
import { StyleSheet, Text, View, Image, Button,TouchableOpacity } from "react-native";
import Greeting from "./components/Greeting";
import SpeechToText from "./components/SpeechToText";

let pic = {
  uri:
    "https://www.powerthoughtsmeditationclub.com/wp-content/uploads/2015/10/bigstock-Affirmations-98518817-1024x1024.jpg"
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      renderRecord: false
    };
  }

  render() {
    return !this.state.renderRecord ? (
      <View style={styles.container}>
        <Text style={styles.title}>𝕞.𝕒.𝕘.𝕚.𝕜</Text>
        <Image source={pic} style={{ width: 400, height: 500 }} />
        <Text style={styles.paragraph}>
          🅼𝚒𝚗𝚍𝚏𝚞𝚕𝚎𝚜𝚜, 🅰𝚏𝚏𝚒𝚛𝚖𝚊𝚝𝚒𝚘𝚗𝚜 𝚊𝚙𝚙 𝚝𝚑𝚊𝚝 𝚑𝚎𝚕𝚙𝚜 𝚢𝚘𝚞 𝚙𝚛𝚊𝚌𝚝𝚒𝚌𝚎 🅶𝚛𝚊𝚝𝚒𝚝𝚞𝚍𝚎, 𝚏𝚎𝚎𝚕
          🅸𝚗𝚜𝚙𝚒𝚛𝚎𝚍, 𝚊𝚗𝚍 𝚋𝚎 🅺𝚒𝚗𝚍 𝚝𝚘 𝚢𝚘𝚞𝚛𝚜𝚎𝚕𝚏
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.setState({ renderRecord: true })}
        >
          <Text>Click here</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <SpeechToText />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D8E2DC",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontWeight: "bold",
    fontSize: 35,
    marginBottom: 10,
    marginTop: 10
  },
  paragraph: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 15,
    marginBottom: 10
  },
  button: {
    marginTop:10,
    paddingTop:12,
    paddingBottom:12,
    marginLeft:30,
    marginRight:30,
    backgroundColor:'#FFCAD4',
    borderRadius:14,
    borderWidth: 1,
    borderColor: '#F4ACB7',
  }
});

export default App;
