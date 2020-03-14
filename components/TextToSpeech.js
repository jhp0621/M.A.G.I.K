import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import config from "../config.json";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import base64 from "react-native-base64";
import Base64 from "Base64";
import { Buffer } from "buffer";
import * as Speech from "expo-speech";
import { Asset } from "expo-asset";

class TextToSpeech extends React.Component {
  constructor() {
    super();
    this.state = {
      voice: {
        languageCode: "en-US",
        name: "en-US-Standard-B",
        ssmlGender: "FEMALE"
      },
      audioFile: ""
    };
  }

  getSpeech = async () => {
    const { text } = this.props;

    let request = {
      input: { text: text },
      voice: this.state.voice,
      audioConfig: { audioEncoding: "MP3" }
    };

    const key =
      Platform.OS === "ios" ? config.API_KEY_IOS : config.API_KEY_ANDROID;
    const address = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`;
    const audioUri = `${FileSystem.cacheDirectory}/voice.mp3`;

    try {
      const response = await fetch(`${address}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(request),
        method: "POST"
      });
      const { audioContent } = await response.json();

      await FileSystem.writeAsStringAsync(audioUri, audioContent, {
        encoding: FileSystem.EncodingType.Base64
      });
      this.audioUri = audioUri;

    } catch (err) {
      console.warn(err);
    }
  };

  componentDidMount() {
    this.getSpeech();
  }

  playSound = async () => {
    // Speech.speak(this.props.text, {
    //   language: "en",
    //   pitch: 2,
    //   rate: 0
    // });
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({uri: this.audioUri});
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Speech</Text>
        <TouchableOpacity style={styles.playButton} onPress={this.playSound}>
          <Text>Play affirmations</Text>
        </TouchableOpacity>
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
  playButton: {
    backgroundColor: "pink",
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
    alignItems: "center",
    backgroundColor: "#ede3f2",
    padding: 100
  }
});

export default TextToSpeech;
