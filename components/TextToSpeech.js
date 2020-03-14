import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import config from "../config.json";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

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

    let requestForm = {
      input: { text: text },
      voice: this.state.voice,
      audioConfig: { audioEncoding: "MP3" }
    };

    const formData = new FormData();
    formData.append("textFile", {
      input: text,
      type: "audio/x-wav",
      // could be anything
      name: "text2speech"
    });

    const request = {
      //this is hardcoded for now
      input: { text: "hello" },
      voice: { languageCode: "en-US", ssmlGender: "FEMALE" },
      audioConfig: { audioEncoding: "MP3" }
    };

    const key =
      Platform.OS === "ios" ? config.API_KEY_IOS : config.API_KEY_ANDROID;
    const address = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`;
    const path = `${FileSystem.documentDirectory}/voice.mp3`;

    try {
      const response = await fetch(`${address}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(request),
        method: "POST"
      });
      const result = await response.json();
      console.log("result: ", result);
      // await createFile(path, result.audioContent)
    } catch (err) {
      console.warn(err);
    }
  };

  componentDidMount() {
    this.getSpeech();
  }

  createFile = async (path, data) => {
    try {
      return await RNFS.writeFile(path, data, "base64");
    } catch (err) {
      console.warn(err);
    }
  };

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
    alignItems: "center",
    backgroundColor: "#ede3f2",
    padding: 100
  }
});

export default TextToSpeech;
