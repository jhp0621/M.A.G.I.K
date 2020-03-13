import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";

class Speech extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }

  render() {

    return (
      <View style={styles.container}>
        <Text>Speech</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: "#E5989B",
    fontWeight: "bold",
    fontSize: 20
  },
  startButton: {
    backgroundColor: "#48C9B0",
    paddingVertical: 20,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20
  },
  affirmations: {
    backgroundColor: "white",
    paddingVertical: 20,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ede3f2',
    padding: 100
 },
});

export default Speech;
