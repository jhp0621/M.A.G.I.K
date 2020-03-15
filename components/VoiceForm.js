import React, { Component } from "react";
import {
  Alert,
  Button,
  View,
  StyleSheet,
  Picker,
  Text,
  TouchableOpacity
} from "react-native";
import { Formik } from "formik";
import TextToSpeech from "./TextToSpeech";

export default class VoiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      voice: "en-US-Wavenet-C",
      pitch: "-4",
      speed: "0.8",
      getSpeech: false
    };
  }

  render() {
    const { name, pitch, speed, getSpeech} = this.state;
    const {text} = this.props

    return (
      !getSpeech ?
      <View style={styles.container}>
        <Text style={styles.title}>Choose your voice for meditation</Text>
        <Text style={styles.mini}>(Scroll to view more options)</Text>
        <Text style={styles.paragraph}>Voice</Text>
        <Picker itemStyle={styles.pickItem}
          selectedValue={name}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({name: itemValue})
          }>
          <Picker.Item label="female 1" value="en-US-Wavenet-C" />
          <Picker.Item label="female 2" value="en-US-Wavenet-F" />
          <Picker.Item label="male 1" value="en-US-Wavenet-B" />
          <Picker.Item label="male 2" value="en-US-Wavenet-D" />
        </Picker>
        <Text style={styles.paragraph}>Pitch</Text>
        <Picker itemStyle={styles.pickItem}
          selectedValue={pitch}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({pitch: itemValue})
          }>
          <Picker.Item label="low" value="-4" />
          <Picker.Item label="medium" value="-2" />
          <Picker.Item label="high" value="0" />
        </Picker>
        <Text style={styles.paragraph}>Speed</Text>
        <Picker itemStyle={styles.pickItem}
          selectedValue={speed}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({speed: itemValue})
          }>
          <Picker.Item label="slow" value="0.8" />
          <Picker.Item label="normal" value="0.9" />
          <Picker.Item label="fast" value="1.0" />
        </Picker>

        <TouchableOpacity style={styles.submitButton} onPress={()=> this.setState({getSpeech: true})}>
          <Text>Get Speech</Text>
        </TouchableOpacity>
    </View>
    :
    <TextToSpeech text={text} name={name} pitch={pitch} speed={speed} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "brown",
  },
  title: {
    alignSelf: "center",
    marginBottom: 100,
    color: "#E5989B",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: 'center',
  },
  mini: {
    alignSelf: "center",
  },
  paragraph: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#34495e',
    marginLeft: 8,
  },
  pickItem: {
    height: 70,
    fontSize: 20,
  },
  submitButton: {
    backgroundColor: "pink",
    paddingVertical: 10,
    width: "50%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    marginLeft: "25%",
    marginBottom: 10
  }
});
