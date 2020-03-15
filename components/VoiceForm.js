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
        <Text style={styles.title}>Choose voice for meditation</Text>
        <Text style={styles.mini}>(Scroll to view more options)</Text>
        <Text style={styles.field}>Voice</Text>
        <Picker itemStyle={styles.pickItem}
          selectedValue={name}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({name: itemValue})
          }>
          <Picker.Item label="𝚏𝚎𝚖𝚊𝚕𝚎𝟷" value="en-US-Wavenet-C" />
          <Picker.Item label="𝚏𝚎𝚖𝚊𝚕𝚎𝟸" value="en-US-Wavenet-F" />
          <Picker.Item label="𝚖𝚊𝚕𝚎𝟷" value="en-US-Wavenet-B" />
          <Picker.Item label="𝚖𝚊𝚕𝚎𝟸" value="en-US-Wavenet-D" />
        </Picker>
        <Text style={styles.field}>Pitch</Text>
        <Picker itemStyle={styles.pickItem}
          selectedValue={pitch}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({pitch: itemValue})
          }>
          <Picker.Item label="𝚕𝚘𝚠" value="-4" />
          <Picker.Item label="𝚖𝚎𝚍𝚒𝚞𝚖" value="-2" />
          <Picker.Item label="𝚑𝚒𝚐𝚑" value="0" />
        </Picker>
        <Text style={styles.field}>Speed</Text>
        <Picker itemStyle={styles.pickItem}
          selectedValue={speed}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({speed: itemValue})
          }>
          <Picker.Item label="𝚜𝚕𝚘𝚠" value="0.8" />
          <Picker.Item label="𝚗𝚘𝚛𝚖𝚊𝚕" value="0.9" />
          <Picker.Item label="𝚏𝚊𝚜𝚝" value="1.0" />
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
    backgroundColor: "#943942",
  },
  title: {
    alignSelf: "center",
    marginBottom: 100,
    color: "#E5989B",
    fontWeight: "500",
    fontSize: 20,
    textAlign: 'center',
  },
  mini: {
    alignSelf: "center",
    paddingBottom: 15,
  },
  field: {
    fontSize: 17,
    fontWeight: '300',
    color: '#73A2D0',
    marginLeft: 8,
    marginTop: 35,
  },
  pickItem: {
    height: 70,
    fontSize: 20,
    color: "#1D1D1D",
  },
  submitButton: {
    backgroundColor: "pink",
    paddingVertical: 10,
    width: "50%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 70,
    marginLeft: "25%",
    marginBottom: 10
  }
});
