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
import { Audio, Video } from "expo-av";

class TextToSpeech extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false
    };
  }

  getSpeech = async () => {
    const {text, name, pitch, speed} = this.props

    let request = {
      input: { text },
      voice: {
        languageCode: "en-US",
        name
      },
      audioConfig: {
        audioEncoding: "MP3",
        pitch,
        speakingRate: speed
      }
    };

    const key =
      Platform.OS === "ios" ? config.API_KEY_IOS : config.API_KEY_ANDROID;
    const address = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`;
    const audioUri = `${FileSystem.cacheDirectory}/voice.mp3`;

    try {
      this.setState({ isFetching: true });
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
    this.setState({ isFetching: false });
  };

  componentDidMount() {
    this.getSpeech();
  }

  playSound = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: this.audioUri });
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };

  render() {
    const { isFetching } = this.state;

    return (
      <View style={styles.container}>
        <Text>Time to meditate</Text>
        {isFetching && <ActivityIndicator size={32} color="#48C9B0" />}
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
